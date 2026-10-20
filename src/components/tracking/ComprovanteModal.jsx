import { useState } from "react";
import { Download, Printer, Share2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { abrirComprovante, baixarComprovante, compartilharRastreio, urlSegura } from "@/lib/comprovante";

const fmt = (iso) => {
  const d = iso ? new Date(iso) : null;
  return d && !Number.isNaN(d.getTime()) ? d.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short", timeZone: "America/Sao_Paulo" }) : "—";
};

const botao = "inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-btn text-xs font-semibold disabled:opacity-60";

/** Modal do comprovante de entrega: informações + comprovação + Baixar / Compartilhar / Imprimir. */
export default function ComprovanteModal({ dados, aberto, onFechar }) {
  const c = dados?.comprovante || {};
  const arquivos = (c.arquivos || []).map(urlSegura).filter(Boolean);
  const [aviso, setAviso] = useState("");
  const [baixando, setBaixando] = useState(false);

  const baixar = async () => {
    setBaixando(true);
    try { await baixarComprovante(dados); setAviso(""); } catch { setAviso("Não foi possível gerar o PDF agora. Use “Imprimir” e salve como PDF."); } finally { setBaixando(false); }
  };
  const compartilhar = async () => {
    const r = await compartilharRastreio(dados);
    setAviso({ copiado: "Link do rastreio copiado.", falhou: "Não foi possível compartilhar. Copie o endereço da página.", compartilhado: "", cancelado: "" }[r]);
  };
  const imprimir = () => setAviso(abrirComprovante(dados) ? "" : "O navegador bloqueou a nova aba. Permita pop-ups para imprimir.");

  return (
    <Dialog open={aberto} onOpenChange={(v) => { if (!v) { setAviso(""); onFechar(); } }}>
      <DialogContent className="bg-white text-brand-onyx max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Comprovante de entrega</DialogTitle>
          <DialogDescription>Pedido {dados?.codigo}</DialogDescription>
        </DialogHeader>

        <dl className="grid grid-cols-[120px_1fr] gap-x-3 gap-y-2 text-sm">
          <dt className="text-brand-text-secondary">Situação</dt><dd className="font-semibold">{dados?.situacao || "Entregue"}</dd>
          <dt className="text-brand-text-secondary">Entregue em</dt><dd className="font-semibold">{fmt(c.entregue_em)}</dd>
          <dt className="text-brand-text-secondary">Recebido por</dt><dd className="font-semibold">{c.recebido_por || "Não informado"}</dd>
          <dt className="text-brand-text-secondary">Destino</dt><dd className="font-semibold">{dados?.destino || "—"}</dd>
        </dl>

        {arquivos.length > 0 ? (
          <div>
            <p className="text-xs font-semibold mb-2">Comprovação</p>
            <div className="flex flex-wrap gap-2">
              {arquivos.map((u) => (
                <a key={u} href={u} target="_blank" rel="noopener noreferrer" aria-label="Abrir comprovação em tamanho maior">
                  <img src={u} alt="Comprovação da entrega" referrerPolicy="no-referrer" loading="lazy" className="max-h-40 max-w-[180px] rounded-lg border border-brand-border object-cover" />
                </a>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-xs text-brand-text-secondary">Nenhuma foto de comprovação foi registrada para esta entrega.</p>
        )}

        <div className="flex flex-wrap gap-2 pt-1">
          <button type="button" onClick={baixar} disabled={baixando} className={`${botao} bg-brand-coral text-white`}>
            <Download className="w-4 h-4" aria-hidden="true" />{baixando ? "Gerando…" : "Baixar comprovante"}
          </button>
          <button type="button" onClick={compartilhar} className={`${botao} border border-brand-border`}>
            <Share2 className="w-4 h-4" aria-hidden="true" />Compartilhar
          </button>
          <button type="button" onClick={imprimir} className={`${botao} border border-brand-border`}>
            <Printer className="w-4 h-4" aria-hidden="true" />Imprimir
          </button>
        </div>
        {aviso && <p role="status" className="text-xs text-brand-text-secondary">{aviso}</p>}
      </DialogContent>
    </Dialog>
  );
}
