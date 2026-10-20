// Cliente da API pública de rastreio: Edge Function `rastreio-publico` do projeto Supabase do NGS Tracker
// (supabase/functions/rastreio-publico no repositório ngs_tracker_sup). O Tracker é a ÚNICA fonte dos dados:
// este portal não tem banco, não guarda chaves e não tem alternativa/fallback para outra infraestrutura.
// Consulta só pelo código de rastreio (sem 2º fator e sem mapa); o código e o token do Turnstile vão no corpo do POST, nunca na URL.
//
// Também aceita `codigos` (vários códigos) e `documento` (CPF/CNPJ): resposta { pedidos: [...], nao_encontrados?, truncado? }.
// Resposta 200: { codigo, situacao, destino, previsao_entrega, eventos: [{ texto, em }] (mais recente primeiro),
//                 em_rota, atualizado_em }

export const MENSAGEM_NAO_ENCONTRADO = "Pedido não encontrado. Confira o código de rastreio.";

export function urlDaApi(env = import.meta.env) {
  const url = String(env?.VITE_RASTREIO_API_URL ?? "").trim().replace(/\/+$/, "");
  return url || null;
}

/**
 * Consulta o rastreio. Devolve sempre um objeto com `estado`:
 *  ok | nao_encontrado | limite | verificacao | indisponivel | rede | nao_configurado
 */
export async function consultarRastreio({ codigo, codigos, documento, turnstileToken }, { base = urlDaApi(), buscar = globalThis.fetch } = {}) {
  if (!base) return { estado: "nao_configurado" };
  const consulta = documento ? { documento: String(documento).trim() }
    : Array.isArray(codigos) && codigos.length > 1 ? { codigos: codigos.map((c) => String(c).trim()) }
    : { codigo: String(Array.isArray(codigos) ? codigos[0] : codigo ?? "").trim() };
  let resposta;
  try {
    resposta = await buscar(base, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...consulta, turnstile_token: String(turnstileToken ?? "") }),
      credentials: "omit",
      cache: "no-store",
    });
  } catch {
    return { estado: "rede" };
  }
  if (resposta.status === 404) return { estado: "nao_encontrado" };
  if (resposta.status === 429) return { estado: "limite" };
  if (resposta.status === 403) return { estado: "verificacao" };
  if (!resposta.ok) return { estado: "indisponivel" };
  try {
    const json = await resposta.json();
    if (Array.isArray(json?.pedidos)) return { estado: "ok", pedidos: json.pedidos, naoEncontrados: json.nao_encontrados ?? [], truncado: json.truncado === true };
    return { estado: "ok", dados: json, pedidos: [json], naoEncontrados: [], truncado: false };
  } catch {
    return { estado: "indisponivel" };
  }
}
