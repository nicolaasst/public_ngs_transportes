import { useId } from "react";
import { Search } from "lucide-react";

// Formulário compartilhado (página de rastreio e Hero): código de rastreio.
export default function FormRastreio({ codigo, onCodigo, onEnviar, carregando = false, compacto = false }) {
  const idCodigo = useId();
  const campo = compacto
    ? "min-w-0 w-full px-3 py-3 bg-brand-surface-alt border border-brand-border rounded-lg text-xs text-brand-onyx"
    : "w-full h-11 px-3 bg-white border border-brand-border rounded-btn text-sm text-brand-onyx";
  return (
    <form onSubmit={(e) => { e.preventDefault(); onEnviar(); }} className="space-y-3 text-left">
      <div>
        <label htmlFor={idCodigo} className={compacto ? "text-[11px] font-semibold text-brand-onyx" : "text-xs font-semibold"}>Código de rastreio</label>
        <input id={idCodigo} required autoComplete="off" value={codigo} onChange={(e) => onCodigo(e.target.value)} placeholder="Ex.: AA123456789BR" className={`${campo} font-ibmmono mt-1`} />
      </div>
      <button type="submit" disabled={carregando} className="h-11 px-6 rounded-btn bg-brand-coral text-white text-sm font-semibold inline-flex items-center gap-2 disabled:opacity-60">
        <Search className="w-4 h-4" aria-hidden="true" />{carregando ? "Consultando…" : "Rastrear"}
      </button>
    </form>
  );
}
