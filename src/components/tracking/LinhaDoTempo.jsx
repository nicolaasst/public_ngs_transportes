import { Icon } from "@/components/rp/Icon";
import { classificarEvento } from "@/lib/linhaDoTempo";

const ICONES = {
  entregue: "inventory_2", saida: "local_shipping", transito: "route", registrado: "receipt_long", separacao: "deployed_code", coleta: "package_2",
  falha: "warning", devolucao: "undo", cancelado: "cancel", retirada: "hourglass_top", analise: "report", evento: "radio_button_checked",
};

// tom do evento → par de status do design system (mesmas pílulas do App Delivery)
const TONS = {
  sucesso: { pilula: "status-green", anel: "bg-[hsl(var(--status-green-fg))]" },
  andamento: { pilula: "status-blue", anel: "bg-[hsl(var(--status-blue-fg))]" },
  alerta: { pilula: "status-amber", anel: "bg-[hsl(var(--status-amber-fg))]" },
  erro: { pilula: "status-red", anel: "bg-[hsl(var(--status-red-fg))]" },
  neutro: { pilula: "status-gray", anel: "bg-[hsl(var(--status-gray-fg))]" },
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
    <ol className="mt-6" aria-label="Histórico de movimentações">
      {eventos.map((e, i) => {
        const { tipo, tom } = classificarEvento(e.texto);
        const cor = TONS[tom];
        const atual = i === 0;
        const ultimo = i === eventos.length - 1;
        return (
          <li key={`${e.em}-${i}`} className="relative flex gap-4 pb-6 last:pb-0" aria-current={atual ? "step" : undefined} data-testid={atual ? "evento-atual" : "evento"}>
            {!ultimo && <span className="absolute left-5 top-11 bottom-0 w-0.5 bg-border" aria-hidden="true" />}
            <span className="relative h-10 w-10 shrink-0">
              {atual && <span className={`absolute inset-0 rounded-full ${cor.anel} opacity-40 animate-ping motion-reduce:animate-none`} aria-hidden="true" />}
              <span className={`relative flex h-10 w-10 items-center justify-center rounded-full ${cor.pilula} ${atual ? "animate-pulse motion-reduce:animate-none" : ""}`}>
                <Icon name={ICONES[tipo] || ICONES.evento} size={20} filled={atual} />
              </span>
            </span>
            <div className="min-w-0 pt-1.5">
              <p className={atual ? "text-label-lg" : "text-body-md text-foreground"}>{e.texto}{atual && <span className="sr-only"> (status mais recente)</span>}</p>
              <p className="mt-0.5 text-code-sm text-muted-foreground">{hora(e.em)}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
