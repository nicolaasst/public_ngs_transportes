import { Link } from "react-router-dom";

const variants = {
  primary: "bg-primary text-primary-foreground active:bg-primary-pressed shadow-cta",
  onyx: "bg-onyx text-white active:bg-onyx-pressed",
  outline: "border-2 border-ink text-foreground bg-transparent focus:border-primary focus:ring-2 focus:ring-primary/30 dark:border-border",
  ghost: "bg-accent text-accent-foreground",
  danger: "bg-destructive text-white active:bg-destructive-pressed",
};
const sizes = { md: "min-h-[52px] px-6", sm: "min-h-[40px] px-4 text-label-md" };

/** Botão do App Delivery: pílula, ≥ 52px de altura, CTA com sombra. Renderiza <Link> quando recebe `to` e <a> quando recebe `href`. */
export function Button({ variant = "primary", size = "md", loading = false, disabled, className = "", children, to, href, ...props }) {
  const classe = `rp-tap inline-flex items-center justify-center gap-2 rounded-full text-label-lg active:scale-[0.98] transition disabled:opacity-50 ${sizes[size]} ${variants[variant] || variants.primary} ${className}`;
  if (to) return <Link to={to} className={classe} {...props}>{children}</Link>;
  if (href) return <a href={href} className={classe} {...props}>{children}</a>;
  return (
    <button disabled={disabled || loading} aria-disabled={disabled || loading} className={classe} {...props}>
      {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-current/40 border-t-current" />}
      {children}
    </button>
  );
}

export default Button;
