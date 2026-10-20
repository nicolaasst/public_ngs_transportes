import { describe, expect, it, vi } from "vitest";
import { consultarRastreio, urlDaApi } from "@/lib/rastreio";

const resposta = (status, corpo) => ({ ok: status >= 200 && status < 300, status, json: async () => corpo });

describe("consultarRastreio", () => {
  it("sem URL da API não faz chamada e avisa", async () => {
    const buscar = vi.fn();
    expect(await consultarRastreio({ codigo: "NX-1" }, { base: null, buscar })).toEqual({ estado: "nao_configurado" });
    expect(buscar).not.toHaveBeenCalled();
  });

  it("manda o código no CORPO (POST), nunca na URL", async () => {
    const buscar = vi.fn().mockResolvedValue(resposta(200, { situacao: "x" }));
    const r = await consultarRastreio({ codigo: " NX-1234 " }, { base: "https://api.exemplo/fn", buscar });
    expect(r.estado).toBe("ok");
    const [url, init] = buscar.mock.calls[0];
    expect(url).toBe("https://api.exemplo/fn");
    expect(url).not.toContain("1234");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body)).toEqual({ codigo: "NX-1234" });
    expect(init.credentials).toBe("omit");
  });

  it.each([[404, "nao_encontrado"], [429, "limite"], [500, "indisponivel"], [503, "indisponivel"]])("HTTP %i vira %s", async (status, estado) => {
    expect((await consultarRastreio({ codigo: "NX-1" }, { base: "https://a", buscar: async () => resposta(status, {}) })).estado).toBe(estado);
  });

  it("erro de rede vira 'rede'", async () => {
    expect((await consultarRastreio({ codigo: "NX-1" }, { base: "https://a", buscar: async () => { throw new TypeError("falhou"); } })).estado).toBe("rede");
  });
});

describe("configuração", () => {
  it("lê a URL da API do ambiente e remove a barra final", () => {
    expect(urlDaApi({ VITE_RASTREIO_API_URL: "https://x.supabase.co/functions/v1/rastreio-publico/" })).toBe("https://x.supabase.co/functions/v1/rastreio-publico");
    expect(urlDaApi({})).toBeNull();
  });
});
