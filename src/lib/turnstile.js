// Cloudflare Turnstile (anti-robô) no portal. O navegador só obtém o TOKEN; quem valida é a Edge Function
// `rastreio-publico` (siteverify com o secret, que nunca chega aqui). A site key é pública por definição.

export const ACAO_TURNSTILE = "rastreio";
const SCRIPT_URL = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

export function siteKeyTurnstile(env = import.meta.env) {
  const k = String(env?.VITE_TURNSTILE_SITE_KEY ?? "").trim();
  return k || null;
}

let carregamento = null;

/** Carrega o script do Turnstile uma única vez e devolve `window.turnstile`. */
export function carregarTurnstile() {
  if (typeof window === "undefined") return Promise.reject(new Error("sem janela"));
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (!carregamento) {
    carregamento = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = SCRIPT_URL;
      s.async = true;
      s.defer = true;
      s.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error("turnstile ausente")));
      s.onerror = () => { carregamento = null; reject(new Error("falha ao carregar o Turnstile")); };
      document.head.appendChild(s);
    });
  }
  return carregamento;
}
