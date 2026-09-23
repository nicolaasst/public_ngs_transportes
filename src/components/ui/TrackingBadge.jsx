import React from "react";
import { cn } from "@/lib/utils";
export default function TrackingBadge({ children, className }) {
  return (
    <span className={cn(
      "inline-block font-ibmmono text-xs bg-brand-surface-alt border border-brand-border rounded px-2 py-0.5",
      className
    )}>
      {children}
    </span>
  );
}