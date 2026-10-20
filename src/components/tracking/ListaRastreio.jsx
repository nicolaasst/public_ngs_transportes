import { useState } from "react";
import ResultadoRastreio from "@/components/tracking/ResultadoRastreio";
import { Card } from "@/components/rp/Card";
import { Icon } from "@/components/rp/Icon";
import { StatusPill } from "@/components/rp/StatusPill";
import { MonoText } from "@/components/rp/MonoText";
import { codigoNgs } from "@/lib/comprovante";
import { classificarEvento } from "@/lib/linhaDoTempo";

const PILULA = { sucesso: "green", andamento: "blue", alerta: "amber", erro: "red", neutro: "gray" };
const chaveDe = (p, i) => `${codigoNgs(p) || "pedido"}-${i}`;

/** Um pedido: resultado direto; vários: cartões recolhidos que o cliente vai abrindo (ou "Abrir todos"). */
export default function ListaRastreio({ pedidos, onAtualizar, atualizando }) {
  const [abertos, setAbertos] = useState(() => new Set());
  if (pedidos.length === 1) return <ResultadoRastreio dados={pedidos[0]} onAtualizar={onAtualizar} atualizando={atualizando} />;

  const todos = abertos.size === pedidos.length;
  const alternar = (k) => setAbertos((atual) => { const n = new Set(atual); if (n.has(k)) n.delete(k); else n.add(k); return n; });
  return (
    <section aria-label="Resultados do rastreio" className="mt-6">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-headline-sm">{pedidos.length} pedidos encontrados</h2>
        <button type="button" onClick={() => setAbertos(todos ? new Set() : new Set(pedidos.map(chaveDe)))} className="rp-tap inline-flex min-h-[44px] items-center gap-1 text-label-lg text-primary-deep">
          <Icon name={todos ? "unfold_less" : "unfold_more"} size={20} />{todos ? "Fechar todos" : "Abrir todos"}
        </button>
      </div>
      <ul className="space-y-3">
        {pedidos.map((p, i) => {
          const k = chaveDe(p, i);
          const aberto = abertos.has(k);
          const tom = PILULA[classificarEvento(p.situacao).tom] || "gray";
          return (
            <li key={k}>
              <Card className="overflow-hidden !p-0 text-left">
                <button type="button" aria-expanded={aberto} aria-controls={`pedido-${i}`} onClick={() => alternar(k)} className="rp-tap flex min-h-[72px] w-full items-center gap-3 p-4 text-left md:px-5">
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2"><StatusPill status={tom}>{p.situacao}</StatusPill></span>
                    <span className="mt-2 block"><MonoText size="md">{codigoNgs(p)}</MonoText></span>
                    <span className="mt-0.5 block text-body-sm text-muted-foreground">Destino: {p.destino}{p.previsao_entrega ? ` · Previsão: ${p.previsao_entrega}` : ""}</span>
                  </span>
                  <Icon name="expand_more" size={26} className={`shrink-0 transition-transform ${aberto ? "rotate-180" : ""}`} />
                </button>
                <div id={`pedido-${i}`} hidden={!aberto}>
                  {aberto && <ResultadoRastreio embutido dados={p} onAtualizar={onAtualizar} atualizando={atualizando} />}
                </div>
              </Card>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
