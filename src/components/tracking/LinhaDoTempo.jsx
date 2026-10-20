import { AlertTriangle, Boxes, CheckCircle2, CircleDot, ClipboardList, Hourglass, PackageCheck, PackageSearch, Route, Truck, Undo2, XCircle } from "lucide-react";
import { classificarEvento } from "@/lib/linhaDoTempo";

const ICONES = {
  entregue: PackageCheck, saida: Truck, transito: Route, registrado: ClipboardList, separacao: Boxes, coleta: PackageSearch,
  falha: AlertTriangle, devolucao: Undo2, cancelado: XCircle, retirada: Hourglass, analise: AlertTriangle, evento: CircleDot,
};

const TONS = {
  sucesso: { pilula: "bg-emerald-100 text-emerald-700 border-emerald-200", anel: "bg-emerald-400" },
  andamento: { pilula: "bg-amber-100 text-amber-800 border-amber-200", anel: "bg-amber-400" },
  alerta: { pilula: "bg-orange-100 text-orange-700 border-orange-200", anel: "bg-orange-400" },
  erro: { pilula: "bg-red-100 text-red-700 border-red-200", anel: "bg-red-400" },
  neutro: { pilula: "bg-brand-surface-alt text-brand-text-primary border-brand-border", anel: "bg-brand-coral" },
};

const hora = (iso) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
};

/**
 * Linha do tempo com um ÍCONE em pílula por evento (cor e ícone conforme o tipo) ligados por uma linha; o status mais
 * recente (primeiro da lista) pisca — anel pulsante + pílula pulsando — e respeita "reduzir movimento" do sistema.
 */
export default function LinhaDoTempo({ eventos }) {
  return (
    <ol className="mt-5" aria-label="Histórico de movimentações">
      {eventos.map((e, i) => {
        const { tipo, tom } = classificarEvento(e.texto);
        const Icone = ICONES[tipo] || CircleDot;
        const cor = TONS[tom];
        const atual = i === 0;
        const ultimo = i === eventos.length - 1;
        return (
          <li key={`${e.em}-${i}`} className="relative flex gap-3 pb-5 last:pb-0" aria-current={atual ? "step" : undefined} data-testid={atual ? "evento-atual" : "evento"}>
            {!ultimo && <span className="absolute left-[17px] top-9 bottom-0 w-0.5 bg-brand-border" aria-hidden="true" />}
            <span className="relative shrink-0 w-9 h-9">
              {atual && <span className={`absolute inset-0 rounded-full ${cor.anel} opacity-60 animate-ping motion-reduce:animate-none`} aria-hidden="true" />}
              <span className={`relative flex w-9 h-9 items-center justify-center rounded-full border ${cor.pilula} ${atual ? "animate-pulse motion-reduce:animate-none shadow-sm" : ""}`}>
                {tipo === "entregue" && atual ? <CheckCircle2 className="w-5 h-5" aria-hidden="true" /> : <Icone className="w-4 h-4" aria-hidden="true" />}
              </span>
            </span>
            <div className="min-w-0 pt-1">
              <p className={`text-sm leading-tight ${atual ? "font-bold" : "font-semibold"}`}>{e.texto}{atual && <span className="sr-only"> (status mais recente)</span>}</p>
              <p className="text-xs text-brand-text-secondary mt-0.5">{hora(e.em)}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
