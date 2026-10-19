import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

const consultar = vi.fn();
vi.mock("@/lib/rastreio", async (original) => ({ ...(await original()), consultarRastreio: (...a) => consultar(...a) }));
vi.mock("@/components/layout/Header", () => ({ default: () => <header /> }));
vi.mock("@/components/layout/Footer", () => ({ default: () => <footer /> }));
// o Leaflet não roda no jsdom: o mock só registra o que o mapa recebe (centro + raio, nada mais)
const mapa = vi.fn();
vi.mock("@/components/tracking/MapaAproximado", () => ({ default: (props) => { mapa(props); return <div data-testid="mapa" />; } }));

import Tracking from "@/pages/Tracking";

const dados = (extra = {}) => ({
  codigo: "NX***34", situacao: "Em rota de entrega", encerrado: false, destino: "São Paulo/SP", previsao_entrega: "Hoje", em_rota: true,
  eventos: [{ em: "2026-10-14T10:00:00Z", texto: "Saiu para entrega" }], posicao: null, ...extra,
});

async function preencher(user) {
  await user.type(screen.getByLabelText("Código do pedido"), "NX-1234");
  await user.type(screen.getByLabelText("Confirmação"), "4455");
  await user.click(screen.getByRole("button", { name: /rastrear/i }));
}
const abrir = (state) => render(<MemoryRouter initialEntries={[{ pathname: "/rastreamento", state }]}><Tracking /></MemoryRouter>);

beforeEach(() => { consultar.mockReset(); mapa.mockReset(); mapa.mockImplementation(() => {}); });

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
    expect(consultar).toHaveBeenCalledWith({ codigo: "NX-1234", fator: "4455" });
  });

  it.each([
    ["nao_encontrado", /Pedido não encontrado/],
    ["limite", /Muitas consultas/],
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

  it("em rota: o mapa recebe só centro e raio, com a legenda de aproximação; nenhuma coordenada vira texto", async () => {
    consultar.mockResolvedValue({ estado: "ok", dados: dados({ posicao: { oculto: false, centro: { lat: -23.55123, lng: -46.63456 }, raio_m: 1000 } }) });
    const user = userEvent.setup();
    const { container } = abrir();
    await preencher(user);
    expect(await screen.findByTestId("mapa")).toBeInTheDocument();
    expect(mapa).toHaveBeenCalledWith({ centro: { lat: -23.55123, lng: -46.63456 }, raioM: 1000 });
    expect(container.textContent).not.toMatch(/-23\.5|-46\.6/);
  });

  it("oculto perto do destino: texto no lugar do mapa", async () => {
    consultar.mockResolvedValue({ estado: "ok", dados: dados({ posicao: { oculto: true } }) });
    const user = userEvent.setup();
    abrir();
    await preencher(user);
    expect(await screen.findByText(/Em rota próximo ao destino\/origem/)).toBeInTheDocument();
    expect(screen.queryByTestId("mapa")).toBeNull();
  });

  it("fora de rota nunca mostra mapa", async () => {
    consultar.mockResolvedValue({ estado: "ok", dados: dados({ em_rota: false, posicao: { oculto: false, centro: { lat: 1, lng: 2 }, raio_m: 1000 } }) });
    const user = userEvent.setup();
    abrir();
    await preencher(user);
    await screen.findByText("Em rota de entrega");
    expect(screen.queryByTestId("mapa")) .toBeNull();
  });

  it("vindo da home (state de rota) consulta sozinho, sem pôr o fator na URL", async () => {
    consultar.mockResolvedValue({ estado: "ok", dados: dados({ em_rota: false }) });
    abrir({ codigo: "NX-1234", fator: "12345678000199" });
    await waitFor(() => expect(consultar).toHaveBeenCalledWith({ codigo: "NX-1234", fator: "12345678000199" }));
    expect(window.location.href).not.toContain("12345678000199");
  });

  it("a página pede noindex e os campos têm rótulo", () => {
    abrir();
    expect(document.head.querySelector('meta[name="robots"]')?.getAttribute("content")).toContain("noindex");
    expect(screen.getByLabelText("Código do pedido")).toBeRequired();
    expect(screen.getByLabelText("Confirmação")).toBeRequired();
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

  it("'Atualizar' reconsulta com o código e a confirmação usados e troca o resultado, sem tela de carregando", async () => {
    consultar.mockResolvedValueOnce({ estado: "ok", dados: dados({ em_rota: false, situacao: "Saiu para entrega" }) });
    consultar.mockResolvedValueOnce({ estado: "ok", dados: dados({ em_rota: false, situacao: "Entregue em 17/10/2026" }) });
    const user = userEvent.setup();
    abrir();
    await preencher(user);
    await screen.findByText("Saiu para entrega", { selector: "p" });
    await user.clear(screen.getByLabelText("Código do pedido")); // o que o visitante digitar depois não vale para "Atualizar"
    await user.click(screen.getByRole("button", { name: /^atualizar$/i }));
    expect(await screen.findByText("Entregue em 17/10/2026")).toBeInTheDocument();
    expect(consultar).toHaveBeenLastCalledWith({ codigo: "NX-1234", fator: "4455" });
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

describe("falha do mapa", () => {
  it("se o mapa quebrar, o resultado do rastreio continua na tela", async () => {
    mapa.mockImplementation(() => { throw new Error("leaflet falhou"); });
    consultar.mockResolvedValue({ estado: "ok", dados: dados({ posicao: { centro: { lat: -23.55, lng: -46.63 }, raio_m: 900 } }) });
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const user = userEvent.setup();
    abrir();
    await preencher(user);
    expect(await screen.findByText(/Não foi possível carregar o mapa/)).toBeInTheDocument();
    expect(screen.getByText("Em rota de entrega")).toBeInTheDocument();
    spy.mockRestore();
  });
});
