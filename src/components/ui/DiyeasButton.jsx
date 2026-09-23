import React from "react";
import { cn } from "@/lib/utils";
const variants = {
  primary: "bg-brand-coral hover:bg-brand-coral-hover text-white shadow-sm",
  dark: "bg-brand-onyx hover:bg-brand-onyx-light text-white",
  outline: "border-[1.5px] border-brand-border bg-white hover:bg-brand-surface-alt text-brand-text-primary",
  ghost: "text-brand-text-secondary hover:text-brand-text-primary",
  coralOutline: "border-[1.5px] border-brand-coral text-brand-coral hover:bg-brand-coral/10",
};
const sizes = {
  default: "h-11 px-6 text-xs",
  sm: "h-9 px-4 text-xs",
  lg: "h-12 px-8 text-sm",
  table: "h-9 px-4 text-xs",
};
export default function Button({
  children,
  variant = "primary",
  size = "default",
  className,
  icon: Icon,
  iconRight: IconRight,
  uppercase = true,
  tracking = true,
  ...props
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-btn font-bold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        uppercase && "uppercase",
        tracking && "tracking-wider",
        className
      )}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
      {IconRight && <IconRight className="w-3.5 h-3.5" />}
    </button>
  );
}