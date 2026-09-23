import React from "react";
import { cn } from "@/lib/utils";
const statusConfig = {
  delivered: { bg: " rgba(34,165,94,.10)", dot: " #22A55E", text: " #157340", label: "Entregue" },
  transit: { bg: " rgba(43,111,224,.10)", dot: " #2B6FE0", text: " #1D4CA8", label: "Em Trânsito" },
  hold: { bg: " rgba(232,163,61,.12)", dot: " #E8A33D", text: " #9C6514", label: "Retido" },
  delay: { bg: " rgba(224,62,62,.10)", dot: " #E03E3E", text: " #9E2121", label: "Exceção" },
  route: { bg: " rgba(34,165,94,.10)", dot: " #22A55E", text: " #157340", label: "Em Rota de Entrega" },
};
export default function StatusChip({ status = "transit", label, className }) {
  const config = statusConfig[status] || statusConfig.transit;
  const displayLabel = label || config.label;
  return (
    <span
      className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", className)}
      style={{ backgroundColor: config.bg, color: config.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: config.dot }} />
      {displayLabel}
    </span>
  );
}