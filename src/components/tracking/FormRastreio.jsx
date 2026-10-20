import { useId } from "react";
import TurnstileWidget from "@/components/tracking/TurnstileWidget";
import { siteKeyTurnstile } from "@/lib/turnstile";
import { Field } from "@/components/rp/Field";
import { Button } from "@/components/rp/Button";
import { Icon } from "@/components/rp/Icon";

// Formulário compartilhado (página de rastreio e Hero): código de rastreio + verificação anti-robô.
export default function FormRastreio({ codigo, onCodigo, onEnviar, turnstileRef, carregando = false }) {
  const idCodigo = useId();
  const siteKey = siteKeyTurnstile();
  return (
    <form onSubmit={(e) => { e.preventDefault(); onEnviar(); }} className="space-y-4 text-left">
      <Field id={idCodigo} label="Código de rastreio" icon="qr_code_2" mono required autoComplete="off" autoCapitalize="characters" spellCheck={false} value={codigo} onChange={(e) => onCodigo(e.target.value)} placeholder="Ex.: NGSBA123456789BR" />
      {siteKey ? <TurnstileWidget ref={turnstileRef} siteKey={siteKey} /> : <p role="alert" className="text-body-sm text-destructive">Verificação de segurança não configurada neste ambiente.</p>}
      <Button type="submit" disabled={!siteKey} loading={carregando} className="w-full">
        {!carregando && <Icon name="search" size={20} />}{carregando ? "Consultando…" : "Rastrear"}
      </Button>
    </form>
  );
}
