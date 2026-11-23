import { BRAND } from "@/lib/brandAssets";

// Marca NGS — mesmo componente do App Delivery. `mark` = monograma quadrado (cabeçalho); `full` = logotipo completo.
export function Logo({ variant = "full", size = 40, className = "" }) {
  if (variant === "mark") {
    return (
      <span className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-xl ${className}`} style={{ width: size, height: size }}>
        <img src={BRAND.icone} alt="" aria-hidden="true" width={size} height={size} className="h-full w-full object-cover" draggable={false} />
      </span>
    );
  }
  return <img src={BRAND.logoCompleto} alt="NGS Transportes" width={size} height={size} className={className} style={{ height: size, width: "auto" }} draggable={false} />;
}

export default Logo;
