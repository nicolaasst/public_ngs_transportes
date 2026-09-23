import React from "react";
import { cn } from "@/lib/utils";
export default function SectionHeading({ eyebrow, title, subtitle, center = false, className, dark = false }) {
  return (
    <div className={cn(center ? "text-center max-w-2xl mx-auto" : "", className)}>
      {eyebrow && (
        <span className={cn(
          "inline-block text-xs font-bold uppercase tracking-widest mb-2 font-ibmmono",
          dark ? "text-brand-coral" : "text-brand-coral"
        )}>
          {eyebrow}
        </span>
      )}
      <h2 className={cn(
        "text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight",
        dark ? "text-white" : "text-brand-onyx"
      )} dangerouslySetInnerHTML={{ __html: title }} />
      {subtitle && (
        <p className={cn("text-sm mt-3", dark ? "text-white/70" : "text-brand-text-secondary")}>
          {subtitle}
        </p>
      )}
    </div>
  );
}