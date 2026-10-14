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

beforeEach(() => { consultar.mockReset(); mapa.mockReset(); });

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
});
