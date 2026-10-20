import { useState } from "react";
import { Icon } from "@/components/rp/Icon";
import { Button } from "@/components/rp/Button";
import { MonoText } from "@/components/rp/MonoText";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { baixarComprovante, codigoNgs, codigoSecundario, compartilharRastreio, fotosDoComprovante } from "@/lib/comprovante";

const fmt = (iso) => {
  const d = iso ? new Date(iso) : null;
  return d && !Number.isNaN(d.getTime()) ? d.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short", timeZone: "America/Sao_Paulo" }) : "—";
};

/** Modal do comprovante de entrega: informações + comprovação + Baixar / Compartilhar / Imprimir. */
export default function ComprovanteModal({ dados, aberto, onFechar }) {
  const c = dados?.comprovante || {};
  const fotos = fotosDoComprovante(c);
  const [aviso, setAviso] = useState("");
  const [baixando, setBaixando] = useState(false);

  const baixar = async () => {
    setBaixando(true);
    try { await baixarComprovante(dados); setAviso(""); } catch { setAviso("Não foi possível gerar o PDF agora. Tente novamente em instantes."); } finally { setBaixando(false); }
  };
  const compartilhar = async () => {
    const r = await compartilharRastreio(dados);
    setAviso({ copiado: "Link do rastreio copiado.", falhou: "Não foi possível compartilhar. Copie o endereço da página.", compartilhado: "", cancelado: "" }[r]);
  };

  return (
    <Dialog open={aberto} onOpenChange={(v) => { if (!v) { setAviso(""); onFechar(); } }}>
      <DialogContent className="bg-card text-card-foreground rounded-2xl border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-headline-md">Comprovante de entrega</DialogTitle>
          <DialogDescription asChild><p className="text-body-md text-muted-foreground">Pedido <MonoText size="sm">{codigoNgs(dados)}</MonoText>{codigoSecundario(dados) && <MonoText size="sm" className="ml-2 !font-normal opacity-70">{codigoSecundario(dados)}</MonoText>}</p></DialogDescription>
        </DialogHeader>

        <dl className="grid grid-cols-[110px_1fr] gap-x-3 gap-y-3 rounded-2xl bg-muted p-4 text-body-md">
          <dt className="text-muted-foreground">Situação</dt><dd className="text-label-lg">{dados?.situacao || "Entregue"}</dd>
          <dt className="text-muted-foreground">Entregue em</dt><dd className="text-label-lg">{fmt(c.entregue_em)}</dd>
          <dt className="text-muted-foreground">Recebido por</dt><dd className="text-label-lg">{c.recebido_por || "Não informado"}</dd>
          <dt className="text-muted-foreground">Destino</dt><dd className="text-label-lg">{dados?.destino || "—"}</dd>
        </dl>

        {fotos.length > 0 ? (
          <div>
            <p className="text-label-sm uppercase text-muted-foreground mb-2">Comprovação</p>
            <div className="flex flex-wrap gap-2">
              {fotos.map((f) => (
                <a key={f.url} href={f.url} target="_blank" rel="noopener noreferrer" aria-label="Abrir comprovação em tamanho maior">
                  <img src={f.inline || f.url} alt="Comprovação da entrega" referrerPolicy="no-referrer" loading="lazy" className="max-h-40 max-w-[180px] rounded-2xl border border-border object-cover" />
                </a>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-body-sm text-muted-foreground">Nenhuma foto de comprovação foi registrada para esta entrega.</p>
        )}

        <div className="flex flex-wrap gap-2 pt-1">
          <Button onClick={baixar} loading={baixando} disabled={baixando} size="sm">
            {!baixando && <Icon name="download" size={18} />}{baixando ? "Gerando…" : "Baixar comprovante"}
          </Button>
          <Button variant="outline" onClick={compartilhar} size="sm">
            <Icon name="share" size={18} />Compartilhar
          </Button>
        </div>
        {aviso && <p role="status" className="text-body-sm text-muted-foreground">{aviso}</p>}
      </DialogContent>
    </Dialog>
  );
}
