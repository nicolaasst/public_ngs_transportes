import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { ACAO_TURNSTILE, carregarTurnstile } from "@/lib/turnstile";

const TEMPO_MAX_MS = 25_000;

/**
 * Widget do Cloudflare Turnstile em modo `execute` + `interaction-only`: fica invisível e só mostra um desafio se a
 * Cloudflare considerar necessário. `ref.obterToken()` roda a verificação e devolve um token NOVO (cada consulta usa um;
 * o servidor recusa token reaproveitado).
 */
const TurnstileWidget = forwardRef(function TurnstileWidget({ siteKey }, ref) {
  const el = useRef(null);
  const widgetId = useRef(null);
  const pronto = useRef(null);
  const pendente = useRef(null);

  useEffect(() => {
    let vivo = true;
    pronto.current = carregarTurnstile().then((ts) => {
      if (!vivo || !el.current) return ts;
      widgetId.current = ts.render(el.current, {
        sitekey: siteKey,
        action: ACAO_TURNSTILE,
        execution: "execute",
        appearance: "interaction-only",
        language: "pt-br",
        callback: (token) => pendente.current?.resolve(token),
        "error-callback": () => pendente.current?.reject(new Error("turnstile_erro")),
        "timeout-callback": () => pendente.current?.reject(new Error("turnstile_timeout")),
      });
      return ts;
    });
    pronto.current.catch(() => {});
    return () => {
      vivo = false;
      try { if (widgetId.current != null) window.turnstile?.remove(widgetId.current); } catch { /* já removido */ }
      widgetId.current = null;
    };
  }, [siteKey]);

  useImperativeHandle(ref, () => ({
    obterToken() {
      return new Promise((resolve, reject) => {
        const limite = setTimeout(() => { pendente.current = null; reject(new Error("turnstile_timeout")); }, TEMPO_MAX_MS);
        const fim = (fn) => (v) => { clearTimeout(limite); pendente.current = null; fn(v); };
        pendente.current = { resolve: fim(resolve), reject: fim(reject) };
        (pronto.current ?? Promise.reject(new Error("turnstile_indisponivel"))).then((ts) => {
          ts.reset(widgetId.current);
          ts.execute(widgetId.current);
        }).catch((e) => pendente.current?.reject(e));
      });
    },
  }), []);

  return <div ref={el} className="mt-2" data-testid="turnstile" />;
});

export default TurnstileWidget;
