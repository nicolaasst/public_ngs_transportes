import React from "react";
import { cn } from "@/lib/utils";
export default function StatMetricBlock({ icon: Icon, value, label, className, active = false }) {
  return (
    <div className={cn("flex flex-col items-center text-center", active && "bg-white p-4 rounded-xl border border-brand-border shadow-sm", className)}>
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-brand-coral/10 text-brand-coral flex items-center justify-center text-lg mb-3">
          <Icon className="w-5 h-5" />
        </div>
      )}
      <div className={cn("text-3xl md:text-4xl font-extrabold text-brand-onyx font-sora", active && "font-ibmmono font-bold tracking-tight")}>
        {value}
      </div>
      <p className="text-xs text-brand-text-secondary uppercase tracking-wider font-semibold mt-1">{label}</p>
    </div>
  );
}