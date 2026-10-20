import { createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { render, waitFor } from "@testing-library/react";
import TurnstileWidget from "@/components/tracking/TurnstileWidget";

function falsoTurnstile() {
  const t = { opcoes: null, resets: 0, removidos: 0, render: vi.fn((_el, o) => { t.opcoes = o; return "w1"; }), reset: vi.fn(() => { t.resets++; }), remove: vi.fn(() => { t.removidos++; }) };
  window.turnstile = t;
  return t;
}
afterEach(() => { delete window.turnstile; });

describe("TurnstileWidget", () => {
  it("renderiza o widget VISÍVEL com a site key e a ação do rastreio", async () => {
    const t = falsoTurnstile();
    render(<TurnstileWidget siteKey="0xKEY" />);
    await waitFor(() => expect(t.render).toHaveBeenCalled());
    expect(t.opcoes).toMatchObject({ sitekey: "0xKEY", action: "rastreio", appearance: "always", language: "pt-br" });
  });

  it("entrega o token já resolvido e pede outro (token de uso único)", async () => {
    const t = falsoTurnstile();
    const ref = createRef();
    render(<TurnstileWidget ref={ref} siteKey="k" />);
    await waitFor(() => expect(t.render).toHaveBeenCalled());
    t.opcoes.callback("tok-1");
    expect(await ref.current.obterToken()).toBe("tok-1");
    expect(t.resets).toBe(1);
  });

  it("se o token ainda não saiu, espera o widget terminar", async () => {
    const t = falsoTurnstile();
    const ref = createRef();
    render(<TurnstileWidget ref={ref} siteKey="k" />);
    await waitFor(() => expect(t.render).toHaveBeenCalled());
    const p = ref.current.obterToken();
    t.opcoes.callback("tok-2");
    expect(await p).toBe("tok-2");
  });

  it("erro do widget rejeita a espera; token expirado é descartado", async () => {
    const t = falsoTurnstile();
    const ref = createRef();
    render(<TurnstileWidget ref={ref} siteKey="k" />);
    await waitFor(() => expect(t.render).toHaveBeenCalled());
    const p = ref.current.obterToken();
    t.opcoes["error-callback"]();
    await expect(p).rejects.toThrow("turnstile_erro");
    t.opcoes.callback("velho");
    t.opcoes["expired-callback"]();
    const p2 = ref.current.obterToken();
    t.opcoes.callback("novo");
    expect(await p2).toBe("novo");
  });

  it("remove o widget ao desmontar", async () => {
    const t = falsoTurnstile();
    const { unmount } = render(<TurnstileWidget siteKey="k" />);
    await waitFor(() => expect(t.render).toHaveBeenCalled());
    unmount();
    expect(t.removidos).toBe(1);
  });
});
