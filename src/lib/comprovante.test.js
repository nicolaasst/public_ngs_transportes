import { describe, expect, it, vi } from "vitest";

const pdfFalso = { addImage: vi.fn(), addPage: vi.fn(), text: vi.fn(), save: vi.fn(), setFont: vi.fn(), setFontSize: vi.fn(), splitTextToSize: (t) => [String(t)] };
vi.mock("jspdf", () => ({ jsPDF: function () { return pdfFalso; } }));
import { abrirComprovante, baixarComprovante, compartilharRastreio, esc, htmlComprovante, nomeArquivo, temComprovante, urlDeCompartilhamento, urlSegura } from "@/lib/comprovante";

const dados = {
  codigo: "NGSSP123456789BR", situacao: "Entregue em 17/10/2026", destino: "São Paulo/SP",
  comprovante: { entregue_em: "2026-10-17T15:00:00Z", recebido_por: "Maria S.", arquivos: ["https://r2.exemplo/f1.jpg", "javascript:alert(1)", "http://x.exemplo/a.png"] },
  eventos: [{ texto: "Entregue", em: "2026-10-17T15:00:00Z" }, { texto: "<script>alert(1)</script>", em: "2026-10-16T10:00:00Z" }],
};

describe("htmlComprovante", () => {
  it("mostra código, destino, recebedor abreviado e data", () => {
    const h = htmlComprovante(dados);
    expect(h).toContain("NGSSP123456789BR");
    expect(h).toContain("São Paulo/SP");
    expect(h).toContain("Maria S.");
    expect(h).toContain("17/10/2026");
  });
  it("só inclui imagens https e escapa tudo que veio da API (sem XSS)", () => {
    const h = htmlComprovante(dados);
    expect(h).toContain('src="https://r2.exemplo/f1.jpg"');
    expect(h).not.toContain("javascript:");
    expect(h).not.toContain("http://x.exemplo");
    expect(h).not.toContain("<script>alert(1)</script>");
    expect(h).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
  });
  it("sem recebedor informado não inventa nome", () => {
    expect(htmlComprovante({ ...dados, comprovante: { entregue_em: null, recebido_por: null, arquivos: [] } })).toContain("Não informado");
  });
});

describe("helpers", () => {
  it("esc e urlSegura", () => {
    expect(esc(`<a href="x">&'`)).toBe("&lt;a href=&quot;x&quot;&gt;&amp;&#39;");
    expect(urlSegura("https://a.exemplo/x")).toBe("https://a.exemplo/x");
    expect(urlSegura("data:text/html,x")).toBeNull();
    expect(urlSegura("lixo")).toBeNull();
  });
  it("temComprovante só quando a API mandou o bloco", () => {
    expect(temComprovante(dados)).toBe(true);
    expect(temComprovante({ ...dados, comprovante: null })).toBe(false);
  });
  it("nome de arquivo seguro", () => {
    expect(nomeArquivo({ codigo: "NGS/../x y" })).toBe("comprovante-entrega-NGS..xy");
  });
});

describe("abrirComprovante", () => {
  it("abre numa nova aba e isola o opener; false se o pop-up foi bloqueado", () => {
    const janela = { opener: {} };
    const abrir = vi.fn().mockReturnValue(janela);
    expect(abrirComprovante(dados, { abrir, criarUrl: () => "blob:x" })).toBe(true);
    expect(abrir).toHaveBeenCalledWith("blob:x", "_blank");
    expect(janela.opener).toBeNull();
    expect(abrirComprovante(dados, { abrir: () => null, criarUrl: () => "blob:x" })).toBe(false);
  });
});

describe("compartilharRastreio", () => {
  it("monta o link com o código e usa a Web Share API quando existe", async () => {
    const share = vi.fn().mockResolvedValue();
    expect(await compartilharRastreio(dados, { nav: { share }, origem: "https://portal.exemplo" })).toBe("compartilhado");
    expect(share.mock.calls[0][0].url).toBe("https://portal.exemplo/rastreamento?codigo=NGSSP123456789BR");
    expect(urlDeCompartilhamento("A B", "https://p")).toBe("https://p/rastreamento?codigo=A%20B");
  });
  it("sem Web Share copia o link", async () => {
    const writeText = vi.fn().mockResolvedValue();
    expect(await compartilharRastreio(dados, { nav: { clipboard: { writeText } }, origem: "https://p" })).toBe("copiado");
    expect(writeText).toHaveBeenCalledWith("https://p/rastreamento?codigo=NGSSP123456789BR");
  });
  it("cancelar o compartilhamento não copia nada; falha geral devolve 'falhou'", async () => {
    const abort = Object.assign(new Error("x"), { name: "AbortError" });
    expect(await compartilharRastreio(dados, { nav: { share: vi.fn().mockRejectedValue(abort), clipboard: { writeText: vi.fn() } }, origem: "https://p" })).toBe("cancelado");
    expect(await compartilharRastreio(dados, { nav: {}, origem: "https://p" })).toBe("falhou");
  });
});

describe("baixarComprovante (PDF)", () => {
  const um = (arquivos) => ({ ...dados, comprovante: { ...dados.comprovante, arquivos } });
  it("incorpora a imagem no PDF (não só o link)", async () => {
    Object.values(pdfFalso).forEach((f) => f.mockClear?.());
    await baixarComprovante(um(["https://r2.exemplo/f1.jpg"]), { carregar: async () => ({ dataUrl: "data:image/jpeg;base64,AAAA", w: 800, h: 600 }) });
    expect(pdfFalso.addImage).toHaveBeenCalledTimes(1);
    expect(pdfFalso.addImage.mock.calls[0][0]).toBe("data:image/jpeg;base64,AAAA");
    expect(pdfFalso.addImage.mock.calls[0][1]).toBe("JPEG");
    expect(pdfFalso.save).toHaveBeenCalledWith("comprovante-entrega-NGSSP123456789BR.pdf");
    const textos = pdfFalso.text.mock.calls.map((c) => c[0]).join(" ");
    expect(textos).not.toContain("https://r2.exemplo/f1.jpg"); // nada de link no lugar da foto
  });
  it("se a foto não carrega (sem CORS/offline), o PDF traz o link como alternativa e ainda baixa", async () => {
    Object.values(pdfFalso).forEach((f) => f.mockClear?.());
    await baixarComprovante(um(["https://r2.exemplo/f1.jpg"]), { carregar: async () => null });
    expect(pdfFalso.addImage).not.toHaveBeenCalled();
    expect(pdfFalso.text.mock.calls.map((c) => c[0]).join(" ")).toContain("https://r2.exemplo/f1.jpg");
    expect(pdfFalso.save).toHaveBeenCalled();
  });
  it("ignora URLs que não são https e limita a 4 fotos", async () => {
    Object.values(pdfFalso).forEach((f) => f.mockClear?.());
    const carregar = vi.fn(async () => ({ dataUrl: "data:image/jpeg;base64,AAAA", w: 100, h: 100 }));
    await baixarComprovante(um(["http://x/a.jpg", "javascript:1", ...Array.from({ length: 6 }, (_, i) => `https://r2.exemplo/${i}.jpg`)]), { carregar });
    expect(carregar).toHaveBeenCalledTimes(4);
  });
});
