import { forwardRef, useId } from "react";
import { Icon } from "./Icon";

/** Campo do App Delivery (rótulo em label-sm, 52px, borda input, foco em amarelo). `as="textarea"|"select"` reaproveita o mesmo visual. */
export const Field = forwardRef(function Field({ label, icon, error, hint, mono = false, as = "input", className = "", id, children, ...props }, ref) {
  const autoId = useId();
  const inputId = id || autoId;
  const Tag = as;
  const base = `flex-1 w-full bg-transparent outline-none placeholder:text-stone ${mono ? "text-code-md tabular-nums" : "text-body-md"}`;
  return (
    <div className={className}>
      {label && <label htmlFor={inputId} className="mb-1.5 block text-label-sm text-muted-foreground">{label}</label>}
      <div className={`flex ${as === "textarea" ? "items-start py-3" : "items-center"} min-h-[52px] gap-2 rounded-2xl border bg-card px-3 ${error ? "border-destructive" : "border-input"} focus-within:ring-2 focus-within:ring-primary-container`}>
        {icon && <Icon name={icon} size={20} className="text-muted-foreground" />}
        <Tag ref={ref} id={inputId} aria-invalid={error ? "true" : undefined} aria-describedby={error || hint ? `${inputId}-msg` : undefined} className={`${base} ${as === "select" ? "py-3" : ""} ${as === "textarea" ? "min-h-[110px] resize-y" : ""}`} {...props}>{children}</Tag>
      </div>
      {error ? <p id={`${inputId}-msg`} className="mt-1 text-body-sm text-destructive">{error}</p> : hint ? <p id={`${inputId}-msg`} className="mt-1 text-body-sm text-muted-foreground">{hint}</p> : null}
    </div>
  );
});

export default Field;
