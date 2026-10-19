import { useId } from "react";
import { Search } from "lucide-react";

// Formulário compartilhado (página de rastreio e Hero): código do pedido + 2º fator.
export default function FormRastreio({ codigo, fator, onCodigo, onFator, onEnviar, carregando = false, compacto = false }) {
  const idCodigo = useId();
  const idFator = useId();
  const campo = compacto
    ? "min-w-0 w-full px-3 py-3 bg-brand-surface-alt border border-brand-border rounded-lg text-xs text-brand-onyx"
    : "w-full h-11 px-3 bg-white border border-brand-border rounded-btn text-sm text-brand-onyx";
  return (
    <form onSubmit={(e) => { e.preventDefault(); onEnviar(); }} className="space-y-3 text-left">
      <div>
        <label htmlFor={idCodigo} className={compacto ? "text-[11px] font-semibold text-brand-onyx" : "text-xs font-semibold"}>Código do pedido</label>
        <input id={idCodigo} required autoComplete="off" value={codigo} onChange={(e) => onCodigo(e.target.value)} placeholder="Ex.: AA123456789BR ou nº do pedido" className={`${campo} font-ibmmono mt-1`} />
      </div>
      <div>
        <label htmlFor={idFator} className={compacto ? "text-[11px] font-semibold text-brand-onyx" : "text-xs font-semibold"}>Confirmação</label>
        <input id={idFator} required autoComplete="off" inputMode="numeric" value={fator} onChange={(e) => onFator(e.target.value)} placeholder="CNPJ/CPF do destinatário ou 4 últimos dígitos do telefone" aria-describedby={`${idFator}-ajuda`} className={`${campo} mt-1`} />
        <p id={`${idFator}-ajuda`} className="mt-1 text-[11px] text-brand-text-secondary">Usamos esse dado só para confirmar que a consulta é sua. Ele não fica guardado no navegador.</p>
      </div>
      <button type="submit" disabled={carregando} className="h-11 px-6 rounded-btn bg-brand-coral text-white text-sm font-semibold inline-flex items-center gap-2 disabled:opacity-60">
        <Search className="w-4 h-4" aria-hidden="true" />{carregando ? "Consultando…" : "Rastrear"}
      </button>
    </form>
  );
}
