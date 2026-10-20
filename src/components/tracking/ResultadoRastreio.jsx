import { useState } from "react";
import LinhaDoTempo from "@/components/tracking/LinhaDoTempo";
import ComprovanteModal from "@/components/tracking/ComprovanteModal";
import { compartilharRastreio, temComprovante } from "@/lib/comprovante";
import { Icon } from "@/components/rp/Icon";
import { Card } from "@/components/rp/Card";
import { StatusPill } from "@/components/rp/StatusPill";
import { MonoText } from "@/components/rp/MonoText";
import { classificarEvento } from "@/lib/linhaDoTempo";

const hora = (iso) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
};

const PILULA = { sucesso: "green", andamento: "blue", alerta: "amber", erro: "red", neutro: "gray" };
const botaoIcone = "rp-tap flex h-11 w-11 items-center justify-center rounded-full bg-muted text-foreground";

export default function ResultadoRastreio({ dados, onAtualizar, atualizando = false }) {
  const eventos = Array.isArray(dados.eventos) ? dados.eventos : [];
  const [aviso, setAviso] = useState("");
  const [comprovanteAberto, setComprovanteAberto] = useState(false);
  const entregue = temComprovante(dados);
  const tom = PILULA[classificarEvento(dados.situacao).tom] || "gray";

  const compartilhar = async () => {
    const r = await compartilharRastreio(dados);
    setAviso({ copiado: "Link do rastreio copiado.", falhou: "Não foi possível compartilhar. Copie o endereço da página.", compartilhado: "", cancelado: "" }[r]);
  };
  return (
    <Card as="section" aria-label="Resultado do rastreio" className="mt-6 !p-5 text-left md:!p-6">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <StatusPill status={tom}>{dados.situacao}</StatusPill>
          <p className="mt-3 text-label-md text-muted-foreground">Pedido</p>
          <MonoText size="lg">{dados.codigo}</MonoText>
          <p className="mt-2 text-body-md text-muted-foreground">
            Destino: <span className="text-foreground">{dados.destino}</span>
            {dados.previsao_entrega ? <> · Previsão: <span className="text-foreground">{dados.previsao_entrega}</span></> : null}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {entregue && (
            <button type="button" onClick={() => setComprovanteAberto(true)} className={botaoIcone} aria-label="Abrir comprovante de entrega" title="Comprovante de entrega">
              <Icon name="photo_camera" size={22} />
            </button>
          )}
          <button type="button" onClick={compartilhar} className={botaoIcone} aria-label="Compartilhar rastreio" title="Compartilhar rastreio">
            <Icon name="share" size={22} />
          </button>
        </div>
      </div>

      {eventos.length === 0 ? (
        <p className="mt-6 text-body-md text-muted-foreground">Ainda não há movimentações registradas para este pedido.</p>
      ) : (
        <LinhaDoTempo eventos={eventos} />
      )}

      {aviso && <p role="status" className="mt-4 text-body-sm text-muted-foreground">{aviso}</p>}
      {entregue && <ComprovanteModal dados={dados} aberto={comprovanteAberto} onFechar={() => setComprovanteAberto(false)} />}

      <div className="mt-6 flex items-center justify-between gap-3 border-t border-border pt-4 text-body-sm text-muted-foreground">
        <span>{hora(dados.atualizado_em) ? `Consultado em ${hora(dados.atualizado_em)}` : ""}</span>
        {onAtualizar && (
          <button type="button" onClick={onAtualizar} disabled={atualizando} className="rp-tap inline-flex min-h-[44px] items-center gap-1 text-label-lg text-primary-deep disabled:opacity-60">
            <Icon name="refresh" size={18} className={atualizando ? "animate-spin" : ""} />{atualizando ? "Atualizando…" : "Atualizar"}
          </button>
        )}
      </div>
    </Card>
  );
}
