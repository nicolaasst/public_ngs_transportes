import { CheckCircle, RefreshCw } from "lucide-react";

const hora = (iso) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
};

export default function ResultadoRastreio({ dados, onAtualizar, atualizando = false }) {
  const eventos = Array.isArray(dados.eventos) ? dados.eventos : [];
  return (
    <section aria-label="Resultado do rastreio" className="mt-6 p-5 bg-white text-brand-onyx rounded-card text-left">
      <div className="flex items-start gap-3">
        <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" aria-hidden="true" />
        <div>
          <p className="text-sm font-bold">{dados.situacao}</p>
          <p className="text-xs text-brand-text-secondary mt-1">
            Pedido <span className="font-ibmmono">{dados.codigo}</span> · destino {dados.destino}
            {dados.previsao_entrega ? ` · previsão: ${dados.previsao_entrega}` : ""}
          </p>
        </div>
      </div>

      {eventos.length === 0 ? (
        <p className="mt-5 text-sm text-brand-text-secondary">Ainda não há movimentações registradas para este pedido.</p>
      ) : (
        <ol className="mt-5 space-y-3 border-l-2 border-brand-border pl-4" aria-label="Histórico de movimentações">
          {eventos.map((e, i) => (
            <li key={`${e.em}-${i}`} className="text-sm">
              <span className="font-semibold">{e.texto}</span>
              <span className="block text-xs text-brand-text-secondary">{hora(e.em)}</span>
            </li>
          ))}
        </ol>
      )}

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-brand-border pt-3 text-xs text-brand-text-secondary">
        <span>{hora(dados.atualizado_em) ? `Consultado em ${hora(dados.atualizado_em)}` : ""}</span>
        {onAtualizar && (
          <button type="button" onClick={onAtualizar} disabled={atualizando} className="inline-flex items-center gap-1 font-semibold text-brand-coral disabled:opacity-60">
            <RefreshCw className={`w-3.5 h-3.5 ${atualizando ? "animate-spin" : ""}`} aria-hidden="true" />{atualizando ? "Atualizando…" : "Atualizar"}
          </button>
        )}
      </div>
    </section>
  );
}
