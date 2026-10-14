// Cliente da API pública de rastreio (Edge Function `rastreio-publico` do NGS Conect).
// O 2º fator (CNPJ/CPF ou 4 últimos dígitos do telefone) vai SEMPRE no corpo do POST, nunca na URL nem no histórico.

export const MENSAGEM_NAO_ENCONTRADO = "Pedido não encontrado. Confira o código e o dado de confirmação.";

export function urlDaApi(env = import.meta.env) {
  const url = String(env?.VITE_RASTREIO_API_URL ?? "").trim().replace(/\/+$/, "");
  return url || null;
}

/**
 * Consulta o rastreio. Devolve sempre um objeto com `estado`:
 *  ok | nao_encontrado | limite | indisponivel | rede | nao_configurado
 */
export async function consultarRastreio({ codigo, fator }, { base = urlDaApi(), buscar = globalThis.fetch } = {}) {
  if (!base) return { estado: "nao_configurado" };
  let resposta;
  try {
    resposta = await buscar(base, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ codigo: String(codigo ?? "").trim(), fator: String(fator ?? "").trim() }),
      credentials: "omit",
      cache: "no-store",
    });
  } catch {
    return { estado: "rede" };
  }
  if (resposta.status === 404) return { estado: "nao_encontrado" };
  if (resposta.status === 429) return { estado: "limite" };
  if (!resposta.ok) return { estado: "indisponivel" };
  try {
    return { estado: "ok", dados: await resposta.json() };
  } catch {
    return { estado: "indisponivel" };
  }
}

/** Camada de mapa: Mapbox quando há token público; senão (ou se o tile falhar) OpenStreetMap. */
export function escolherTiles(token) {
  const osm = {
    nome: "osm",
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    atribuicao: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  };
  const t = String(token ?? "").trim();
  if (!t) return { principal: osm, reserva: null };
  return {
    principal: {
      nome: "mapbox",
      url: `https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/256/{z}/{x}/{y}@2x?access_token=${encodeURIComponent(t)}`,
      atribuicao: '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    },
    reserva: osm,
  };
}
