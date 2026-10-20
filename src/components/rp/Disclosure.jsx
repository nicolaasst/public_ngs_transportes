import { useId, useState } from "react";
import { Icon } from "./Icon";

/** Lista de perguntas/cláusulas expansíveis (um item aberto por vez), no estilo de card do App Delivery. */
export function Disclosure({ itens, inicial = 0, className = "" }) {
  const base = useId();
  const [aberto, setAberto] = useState(inicial);
  return (
    <div className={`space-y-3 ${className}`}>
      {itens.map((item, i) => {
        const ativo = aberto === i;
        return (
          <div key={item.titulo} className="card overflow-hidden">
            <h3>
              <button type="button" id={`${base}-b${i}`} aria-expanded={ativo} aria-controls={`${base}-p${i}`} onClick={() => setAberto(ativo ? null : i)} className="rp-tap flex min-h-[56px] w-full items-center justify-between gap-4 px-5 py-3 text-left text-label-lg">
                <span>{item.titulo}</span>
                <Icon name="expand_more" size={24} className={`shrink-0 transition-transform ${ativo ? "rotate-180" : ""}`} />
              </button>
            </h3>
            <div id={`${base}-p${i}`} role="region" aria-labelledby={`${base}-b${i}`} hidden={!ativo} className="px-5 pb-5 text-body-md text-muted-foreground">{item.conteudo}</div>
          </div>
        );
      })}
    </div>
  );
}

export default Disclosure;
