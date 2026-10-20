import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { ACAO_TURNSTILE, carregarTurnstile } from "@/lib/turnstile";

const TEMPO_MAX_MS = 30_000;

/**
 * Widget do Cloudflare Turnstile VISÍVEL ("Confirme que você é humano"). Ele se resolve sozinho ao carregar e guarda o
 * token; `ref.obterToken()` entrega o token pronto (ou espera o widget terminar) e já prepara outro, porque o servidor
 * recusa token reaproveitado — cada consulta usa um token novo.
 */
const TurnstileWidget = forwardRef(function TurnstileWidget({ siteKey }, ref) {
  const el = useRef(null);
  const widgetId = useRef(null);
  const pronto = useRef(null);
  const token = useRef(null);
  const esperando = useRef([]);

  const resolverEsperas = (fn) => { const lista = esperando.current; esperando.current = []; lista.forEach(fn); };

  useEffect(() => {
    let vivo = true;
    pronto.current = carregarTurnstile().then((ts) => {
      if (!vivo || !el.current) return ts;
      widgetId.current = ts.render(el.current, {
        sitekey: siteKey,
        action: ACAO_TURNSTILE,
        appearance: "always",
        theme: "light",
        language: "pt-br",
        callback: (t) => { token.current = t; resolverEsperas((w) => w.resolve(t)); },
        "expired-callback": () => { token.current = null; try { window.turnstile?.reset(widgetId.current); } catch { /* removido */ } },
        "error-callback": () => { token.current = null; resolverEsperas((w) => w.reject(new Error("turnstile_erro"))); },
        "timeout-callback": () => { token.current = null; try { window.turnstile?.reset(widgetId.current); } catch { /* removido */ } },
      });
      return ts;
    });
    pronto.current.catch(() => {});
    return () => {
      vivo = false;
      try { if (widgetId.current != null) window.turnstile?.remove(widgetId.current); } catch { /* já removido */ }
      widgetId.current = null;
      token.current = null;
    };
  }, [siteKey]);

  useImperativeHandle(ref, () => ({
    obterToken() {
      return new Promise((resolve, reject) => {
        const usar = (t) => {
          token.current = null;
          // o token vale uma única consulta: já pede outro ao widget para a próxima
          try { window.turnstile?.reset(widgetId.current); } catch { /* removido */ }
          resolve(t);
        };
        if (token.current) return usar(token.current);
        const limite = setTimeout(() => {
          esperando.current = esperando.current.filter((w) => w !== espera);
          reject(new Error("turnstile_timeout"));
        }, TEMPO_MAX_MS);
        const espera = { resolve: (t) => { clearTimeout(limite); usar(t); }, reject: (e) => { clearTimeout(limite); reject(e); } };
        esperando.current.push(espera);
        (pronto.current ?? Promise.reject(new Error("turnstile_indisponivel"))).catch((e) => espera.reject(e));
      });
    },
  }), []);

  return <div ref={el} className="mt-1 min-h-[65px]" data-testid="turnstile" />;
});

export default TurnstileWidget;
