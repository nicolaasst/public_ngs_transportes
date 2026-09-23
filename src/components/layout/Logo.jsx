import React from "react";
import { cn } from "@/lib/utils";
export default function Logo({ light = false, className }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn(
        "w-9 h-9 rounded-lg flex items-center justify-center",
        light ? "bg-white" : "bg-brand-coral"
      )}>
        <svg viewBox="0 0 24 24" className={cn("w-5 h-5", light ? "text-brand-coral" : "text-white")} fill="currentColor">
          <path d="M3 6h13l5 5v7H3V6zm0 2v8h13V8H3zm15 .4V12h3.6L18 8.4z" />
          <circle cx="7" cy="17" r="1.5" />
          <circle cx="17" cy="17" r="1.5" />
        </svg>
      </div>
      <div className="flex flex-col leading-none">
        <span className={cn(
          "font-sora font-extrabold text-lg tracking-tight",
          light ? "text-white" : "text-brand-onyx"
        )}>
          Ngs<span className={light ? "text-neutral-900" : "text-brand-coral"}> Transportes</span>
        </span>
        <span className={cn(
          "font-ibmmono text-[9px] uppercase tracking-wider",
          light ? "text-neutral-400" : "text-brand-text-secondary"
        )}>
          Logística Terrestre
        </span>
      </div>
    </div>
  );
}