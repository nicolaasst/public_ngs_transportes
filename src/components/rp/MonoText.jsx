/** Códigos (rastreio, NF, nº de pedido) em Space Mono, como no App Delivery. */
export function MonoText({ children, size = "md", className = "" }) {
  return <span className={`text-code-${size} tabular-nums break-all ${className}`}>{children}</span>;
}

export default MonoText;
