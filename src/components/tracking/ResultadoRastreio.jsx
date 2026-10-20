import { useState } from "react";
import { CheckCircle, Download, ExternalLink, RefreshCw, Share2 } from "lucide-react";
import { abrirComprovante, baixarComprovante, compartilharRastreio, temComprovante } from "@/lib/comprovante";

const hora = (iso) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
};

export default function ResultadoRastreio({ dados, onAtualizar, atualizando = false }) {
  const eventos = Array.isArray(dados.eventos) ? dados.eventos : [];
  const [aviso, setAviso] = useState("");
  const [baixando, setBaixando] = useState(false);
  const entregue = temComprovante(dados);

  const compartilhar = async () => {
    const r = await compartilharRastreio(dados);
    setAviso({ copiado: "Link do rastreio copiado.", falhou: "Não foi possível compartilhar. Copie o endereço da página.", compartilhado: "", cancelado: "" }[r]);
  };
  const abrir = () => setAviso(abrirComprovante(dados) ? "" : "O navegador bloqueou a nova aba. Permita pop-ups para abrir o comprovante.");
  const baixar = async () => {
    setBaixando(true);
    try { await baixarComprovante(dados); setAviso(""); } catch { setAviso("Não foi possível gerar o PDF agora. Use “Abrir comprovante” e imprima."); } finally { setBaixando(false); }
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

      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Ações do rastreio">
        {entregue && (
          <>
            <button type="button" onClick={abrir} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-btn border border-brand-border text-xs font-semibold hover:bg-brand-surface-alt">
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />Abrir comprovante de entrega
            </button>
            <button type="button" onClick={baixar} disabled={baixando} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-btn border border-brand-border text-xs font-semibold hover:bg-brand-surface-alt disabled:opacity-60">
              <Download className="w-3.5 h-3.5" aria-hidden="true" />{baixando ? "Gerando…" : "Baixar comprovante"}
            </button>
          </>
        )}
        <button type="button" onClick={compartilhar} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-btn border border-brand-border text-xs font-semibold hover:bg-brand-surface-alt">
          <Share2 className="w-3.5 h-3.5" aria-hidden="true" />Compartilhar rastreio
        </button>
      </div>
      {aviso && <p role="status" className="mt-2 text-xs text-brand-text-secondary">{aviso}</p>}

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
