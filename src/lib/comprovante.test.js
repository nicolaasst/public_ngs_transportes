import { describe, expect, it, vi } from "vitest";
import { abrirComprovante, compartilharRastreio, esc, htmlComprovante, nomeArquivo, temComprovante, urlDeCompartilhamento, urlSegura } from "@/lib/comprovante";

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
