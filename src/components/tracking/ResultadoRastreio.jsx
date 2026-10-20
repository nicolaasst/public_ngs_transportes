import { useState } from "react";
import { Camera, CheckCircle, RefreshCw, Share2 } from "lucide-react";
import ComprovanteModal from "@/components/tracking/ComprovanteModal";
import { compartilharRastreio, temComprovante } from "@/lib/comprovante";

const hora = (iso) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
};

const icone = "inline-flex items-center justify-center w-9 h-9 rounded-full border border-brand-border text-brand-onyx hover:bg-brand-surface-alt focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-coral";

export default function ResultadoRastreio({ dados, onAtualizar, atualizando = false }) {
  const eventos = Array.isArray(dados.eventos) ? dados.eventos : [];
  const [aviso, setAviso] = useState("");
  const [comprovanteAberto, setComprovanteAberto] = useState(false);
  const entregue = temComprovante(dados);

  const compartilhar = async () => {
    const r = await compartilharRastreio(dados);
    setAviso({ copiado: "Link do rastreio copiado.", falhou: "Não foi possível compartilhar. Copie o endereço da página.", compartilhado: "", cancelado: "" }[r]);
  };
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
        <div className="ml-auto flex items-center gap-2 shrink-0">
          {entregue && (
            <button type="button" onClick={() => setComprovanteAberto(true)} className={icone} aria-label="Abrir comprovante de entrega" title="Comprovante de entrega">
              <Camera className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
          <button type="button" onClick={compartilhar} className={icone} aria-label="Compartilhar rastreio" title="Compartilhar rastreio">
            <Share2 className="w-4 h-4" aria-hidden="true" />
          </button>
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

      {aviso && <p role="status" className="mt-3 text-xs text-brand-text-secondary">{aviso}</p>}
      {entregue && <ComprovanteModal dados={dados} aberto={comprovanteAberto} onFechar={() => setComprovanteAberto(false)} />}

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
