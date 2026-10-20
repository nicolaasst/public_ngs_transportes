import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

const consultar = vi.fn();
vi.mock("@/lib/rastreio", async (original) => ({ ...(await original()), consultarRastreio: (...a) => consultar(...a) }));
vi.mock("@/components/layout/Header", () => ({ default: () => <header /> }));
vi.mock("@/components/layout/Footer", () => ({ default: () => <footer /> }));

vi.mock("@/components/tracking/TurnstileWidget", async () => {
  const { forwardRef, useImperativeHandle } = await import("react");
  return { default: forwardRef((_, ref) => { useImperativeHandle(ref, () => ({ obterToken: async () => `tok-${++contadorToken}` })); return <div data-testid="turnstile" />; }) };
});
let contadorToken = 0;
vi.stubEnv("VITE_TURNSTILE_SITE_KEY", "1x00000000000000000000AA");

import Tracking from "@/pages/Tracking";

const dados = (extra = {}) => ({
  codigo: "NX***34", situacao: "Em rota de entrega", encerrado: false, destino: "São Paulo/SP", previsao_entrega: "Hoje", em_rota: true,
  eventos: [{ em: "2026-10-14T10:00:00Z", texto: "Saiu para entrega" }], ...extra,
});

async function preencher(user) {
  await user.type(screen.getByLabelText("Código de rastreio"), "NX-1234");
  await user.click(screen.getByRole("button", { name: /rastrear/i }));
}
const abrir = (state) => render(<MemoryRouter initialEntries={[{ pathname: "/rastreamento", state }]}><Tracking /></MemoryRouter>);

beforeEach(() => { consultar.mockReset(); contadorToken = 0; });

describe("página de rastreio", () => {
  it("mostra carregando e depois a situação e a linha do tempo", async () => {
    let liberar;
    consultar.mockReturnValue(new Promise((r) => { liberar = r; }));
    const user = userEvent.setup();
    abrir();
    await preencher(user);
    expect(screen.getByRole("button", { name: /consultando/i })).toBeDisabled();
    liberar({ estado: "ok", dados: dados() });
    expect(await screen.findByText("Em rota de entrega")).toBeInTheDocument();
    expect(screen.getByText("Saiu para entrega")).toBeInTheDocument();
    expect(consultar).toHaveBeenCalledWith({ codigo: "NX-1234", turnstileToken: "tok-1" });
  });

  it.each([
    ["nao_encontrado", /Pedido não encontrado/],
    ["limite", /Muitas consultas/],
    ["verificacao", /verificação de segurança/],
    ["rede", /Não foi possível conectar/],
    ["indisponivel", /indisponível no momento/],
    ["nao_configurado", /ainda não está habilitado/],
  ])("estado %s mostra a mensagem certa", async (estado, texto) => {
    consultar.mockResolvedValue({ estado });
    const user = userEvent.setup();
    abrir();
    await preencher(user);
    expect(await screen.findByRole("alert")).toHaveTextContent(texto);
  });

  it("não há campo de confirmação nem mapa", async () => {
    consultar.mockResolvedValue({ estado: "ok", dados: dados() });
    const user = userEvent.setup();
    abrir();
    expect(screen.queryByLabelText("Confirmação")).toBeNull();
    await preencher(user);
    await screen.findByText("Em rota de entrega");
    expect(screen.queryByTestId("mapa")).toBeNull();
    expect(screen.queryByText(/localização aproximada/i)).toBeNull();
  });

  it("vindo da home (state de rota) consulta sozinho, sem pôr o código na URL", async () => {
    consultar.mockResolvedValue({ estado: "ok", dados: dados({ em_rota: false }) });
    abrir({ codigo: "NX-1234", turnstileToken: "tok-home" });
    await waitFor(() => expect(consultar).toHaveBeenCalledWith({ codigo: "NX-1234", turnstileToken: "tok-home" }));
    expect(window.location.href).not.toContain("NX-1234");
  });

  it("a página pede noindex e os campos têm rótulo", () => {
    abrir();
    expect(document.head.querySelector('meta[name="robots"]')?.getAttribute("content")).toContain("noindex");
    expect(screen.getByLabelText("Código de rastreio")).toBeRequired();
  });

  it("sem eventos mostra uma mensagem clara em vez de uma lista vazia", async () => {
    consultar.mockResolvedValue({ estado: "ok", dados: dados({ em_rota: false, eventos: [] }) });
    const user = userEvent.setup();
    abrir();
    await preencher(user);
    expect(await screen.findByText(/Ainda não há movimentações registradas/)).toBeInTheDocument();
  });

  it("resposta sem a lista de eventos não quebra a página", async () => {
    consultar.mockResolvedValue({ estado: "ok", dados: dados({ em_rota: false, eventos: undefined }) });
    const user = userEvent.setup();
    abrir();
    await preencher(user);
    expect(await screen.findByText(/Ainda não há movimentações registradas/)).toBeInTheDocument();
  });

  it("'Atualizar' reconsulta com o código usado e troca o resultado, sem tela de carregando", async () => {
    consultar.mockResolvedValueOnce({ estado: "ok", dados: dados({ em_rota: false, situacao: "Saiu para entrega" }) });
    consultar.mockResolvedValueOnce({ estado: "ok", dados: dados({ em_rota: false, situacao: "Entregue em 17/10/2026" }) });
    const user = userEvent.setup();
    abrir();
    await preencher(user);
    expect((await screen.findAllByText("Saiu para entrega", { selector: "p" })).length).toBeGreaterThan(0);
    await user.clear(screen.getByLabelText("Código de rastreio")); // o que o visitante digitar depois não vale para "Atualizar"
    await user.click(screen.getByRole("button", { name: /^atualizar$/i }));
    expect(await screen.findByText("Entregue em 17/10/2026")).toBeInTheDocument();
    expect(consultar).toHaveBeenLastCalledWith({ codigo: "NX-1234", turnstileToken: "tok-2" });
  });

  it("se a atualização falhar por rede, mantém o último resultado", async () => {
    consultar.mockResolvedValueOnce({ estado: "ok", dados: dados({ em_rota: false }) });
    consultar.mockResolvedValueOnce({ estado: "rede" });
    const user = userEvent.setup();
    abrir();
    await preencher(user);
    await screen.findByText("Em rota de entrega");
    await user.click(screen.getByRole("button", { name: /^atualizar$/i }));
    await waitFor(() => expect(consultar).toHaveBeenCalledTimes(2));
    expect(screen.getByText("Em rota de entrega")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).toBeNull();
  });
});

describe("anti-robô", () => {
  it("cada consulta usa um token novo do Turnstile (nunca reaproveita)", async () => {
    consultar.mockResolvedValue({ estado: "ok", dados: dados({ em_rota: false }) });
    const user = userEvent.setup();
    abrir();
    await preencher(user);
    await screen.findByText("Em rota de entrega");
    await user.click(screen.getByRole("button", { name: /^atualizar$/i }));
    await waitFor(() => expect(consultar).toHaveBeenCalledTimes(2));
    const tokens = consultar.mock.calls.map((c) => c[0].turnstileToken);
    expect(new Set(tokens).size).toBe(2);
  });
  it("token vindo da home já usado: tenta de novo com um token novo, sem mostrar erro", async () => {
    consultar.mockResolvedValueOnce({ estado: "verificacao" });
    consultar.mockResolvedValueOnce({ estado: "ok", dados: dados({ em_rota: false }) });
    abrir({ codigo: "NX-1234", turnstileToken: "tok-velho" });
    expect(await screen.findByText("Em rota de entrega")).toBeInTheDocument();
    expect(consultar.mock.calls[0][0].turnstileToken).toBe("tok-velho");
    expect(consultar.mock.calls[1][0].turnstileToken).toBe("tok-1");
  });
  it("sem site key configurada o botão fica desabilitado e avisa", async () => {
    vi.stubEnv("VITE_TURNSTILE_SITE_KEY", "");
    abrir();
    expect(screen.getByRole("button", { name: /rastrear/i })).toBeDisabled();
    expect(screen.getByRole("alert")).toHaveTextContent(/Verificação de segurança não configurada/);
    vi.stubEnv("VITE_TURNSTILE_SITE_KEY", "1x00000000000000000000AA");
  });
});

vi.mock("@/lib/comprovante", async (original) => ({
  ...(await original()),
  abrirComprovante: (...a) => abrirMock(...a), baixarComprovante: (...a) => baixarMock(...a), compartilharRastreio: (...a) => compartilharMock(...a),
}));
const abrirMock = vi.fn(); const baixarMock = vi.fn(); const compartilharMock = vi.fn();

describe("ações do rastreio", () => {
  const entregue = () => dados({ em_rota: false, situacao: "Entregue em 17/10/2026", comprovante: { entregue_em: "2026-10-17T15:00:00Z", recebido_por: "Maria S.", arquivos: ["https://r2.exemplo/f1.jpg"] } });

  it("não há mais botões fixos de comprovante/baixar/compartilhar no corpo do card", async () => {
    consultar.mockResolvedValue({ estado: "ok", dados: entregue() });
    const user = userEvent.setup();
    abrir();
    await preencher(user);
    await screen.findByText("Entregue em 17/10/2026");
    expect(screen.queryByRole("button", { name: /^baixar comprovante$/i })).toBeNull();
    expect(screen.queryByText(/Abrir comprovante de entrega$/)).toBeNull();
    expect(screen.getByRole("button", { name: "Abrir comprovante de entrega" })).toBeInTheDocument(); // só o ícone da câmera
    expect(screen.getByRole("button", { name: "Compartilhar rastreio" })).toBeInTheDocument(); // só o ícone
  });

  it("câmera abre o modal com as informações; dele se baixa, compartilha e imprime", async () => {
    abrirMock.mockReturnValue(true); baixarMock.mockResolvedValue(); compartilharMock.mockResolvedValue("copiado");
    consultar.mockResolvedValue({ estado: "ok", dados: entregue() });
    const user = userEvent.setup();
    abrir();
    await preencher(user);
    await user.click(await screen.findByRole("button", { name: "Abrir comprovante de entrega" }));
    const modal = await screen.findByRole("dialog");
    expect(modal).toHaveTextContent("Comprovante de entrega");
    expect(modal).toHaveTextContent("Maria S.");
    expect(modal.querySelector('img[src="https://r2.exemplo/f1.jpg"]')).not.toBeNull();
    await user.click(screen.getByRole("button", { name: /baixar comprovante/i }));
    await waitFor(() => expect(baixarMock).toHaveBeenCalled());
    await user.click(screen.getByRole("button", { name: /^compartilhar$/i }));
    expect(await screen.findByText(/Link do rastreio copiado/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /imprimir/i }));
    expect(abrirMock).toHaveBeenCalled();
  });

  it("pedido em andamento: sem câmera, só o ícone de compartilhar no topo do card", async () => {
    consultar.mockResolvedValue({ estado: "ok", dados: dados({ em_rota: false, comprovante: null }) });
    const user = userEvent.setup();
    abrir();
    await preencher(user);
    await screen.findByText("Em rota de entrega");
    expect(screen.getByRole("button", { name: "Compartilhar rastreio" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Abrir comprovante de entrega" })).toBeNull();
  });

  it("o ícone de compartilhar copia o link e avisa", async () => {
    compartilharMock.mockResolvedValue("copiado");
    consultar.mockResolvedValue({ estado: "ok", dados: dados({ em_rota: false, comprovante: null }) });
    const user = userEvent.setup();
    abrir();
    await preencher(user);
    await user.click(await screen.findByRole("button", { name: "Compartilhar rastreio" }));
    expect(await screen.findByText(/Link do rastreio copiado/)).toBeInTheDocument();
  });

  it("link compartilhado (?codigo=) consulta sozinho", async () => {
    consultar.mockResolvedValue({ estado: "ok", dados: dados({ em_rota: false }) });
    render(<MemoryRouter initialEntries={["/rastreamento?codigo=NX-9999"]}><Tracking /></MemoryRouter>);
    await waitFor(() => expect(consultar).toHaveBeenCalledWith({ codigo: "NX-9999", turnstileToken: "tok-1" }));
  });
});

describe("linha do tempo", () => {
  it("cada evento tem um ícone em pílula e só o mais recente é o atual (pisca)", async () => {
    consultar.mockResolvedValue({ estado: "ok", dados: dados({ em_rota: false, eventos: [
      { em: "2026-10-17T10:00:00Z", texto: "Saiu para entrega" }, { em: "2026-10-16T10:00:00Z", texto: "Em trânsito" }, { em: "2026-10-15T10:00:00Z", texto: "Pedido registrado" },
    ] }) });
    const user = userEvent.setup();
    abrir();
    await preencher(user);
    const atual = await screen.findByTestId("evento-atual");
    expect(atual).toHaveTextContent("Saiu para entrega");
    expect(atual.querySelector(".animate-ping")).not.toBeNull();
    expect(atual.querySelector(".animate-pulse")).not.toBeNull();
    expect(atual).toHaveAttribute("aria-current", "step");
    const outros = screen.getAllByTestId("evento");
    expect(outros).toHaveLength(2);
    outros.forEach((o) => { expect(o.querySelector(".animate-ping")).toBeNull(); expect(o.querySelector("svg")).not.toBeNull(); });
    // respeita "reduzir movimento"
    expect(atual.querySelector(".motion-reduce\\:animate-none")).not.toBeNull();
  });
});
