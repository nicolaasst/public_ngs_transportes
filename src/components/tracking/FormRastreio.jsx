import { useId } from "react";
import TurnstileWidget from "@/components/tracking/TurnstileWidget";
import { siteKeyTurnstile } from "@/lib/turnstile";
import { MAX_CODIGOS, mascararDocumento } from "@/lib/documento";
import { Field } from "@/components/rp/Field";
import { Button } from "@/components/rp/Button";
import { Icon } from "@/components/rp/Icon";

const ABAS = [
  { id: "codigo", rotulo: "Código de rastreio", icone: "qr_code_2" },
  { id: "documento", rotulo: "CPF ou CNPJ", icone: "badge" },
];

/**
 * Formulário compartilhado (página de rastreio e Hero) + verificação anti-robô.
 * Com `abas`, alterna entre rastrear por código (um ou vários) e por CPF/CNPJ; sem `abas`, só por código.
 */
export default function FormRastreio({ codigo, onCodigo, onEnviar, turnstileRef, carregando = false, abas = false, modo = "codigo", onModo, documento = "", onDocumento, erroDocumento = "" }) {
  const idCodigo = useId();
  const idAbas = useId();
  const siteKey = siteKeyTurnstile();
  const porDocumento = abas && modo === "documento";
  return (
    <form onSubmit={(e) => { e.preventDefault(); onEnviar(); }} className="space-y-4 text-left">
      {abas && (
        <div role="tablist" aria-label="Como deseja rastrear" className="grid grid-cols-2 gap-1 rounded-full bg-muted p-1">
          {ABAS.map((a) => (
            <button key={a.id} type="button" role="tab" id={`${idAbas}-${a.id}`} aria-selected={modo === a.id} aria-controls={`${idAbas}-painel`} onClick={() => onModo?.(a.id)}
              className={`rp-tap flex min-h-[44px] items-center justify-center gap-1.5 rounded-full px-3 text-label-lg transition ${modo === a.id ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"}`}>
              <Icon name={a.icone} size={18} />{a.rotulo}
            </button>
          ))}
        </div>
      )}
      <div id={`${idAbas}-painel`} role={abas ? "tabpanel" : undefined} aria-labelledby={abas ? `${idAbas}-${modo}` : undefined}>
        {porDocumento ? (
          <Field label="CPF ou CNPJ" icon="badge" mono required inputMode="numeric" autoComplete="off" value={documento} onChange={(e) => onDocumento?.(mascararDocumento(e.target.value))} placeholder="000.000.000-00" error={erroDocumento} hint={erroDocumento ? undefined : "Mostra todos os pedidos ligados ao documento."} />
        ) : (
          <Field id={idCodigo} label="Código de rastreio" icon="qr_code_2" mono required autoComplete="off" autoCapitalize="characters" spellCheck={false} value={codigo} onChange={(e) => onCodigo(e.target.value)} placeholder="Ex.: NGSBA123456789BR" hint={abas ? `Para vários pedidos, separe os códigos por vírgula ou espaço (até ${MAX_CODIGOS}).` : undefined} />
        )}
      </div>
      {siteKey ? <TurnstileWidget ref={turnstileRef} siteKey={siteKey} /> : <p role="alert" className="text-body-sm text-destructive">Verificação de segurança não configurada neste ambiente.</p>}
      <Button type="submit" disabled={!siteKey} loading={carregando} className="w-full">
        {!carregando && <Icon name="search" size={20} />}{carregando ? "Consultando…" : "Rastrear"}
      </Button>
    </form>
  );
}
