// Estado vazio com mascote (mesmo componente do App Delivery). Props: illustration (url), title, subtitle, action.
export function EmptyState({ illustration, title, subtitle, action, className = "" }) {
  return (
    <div className={`flex flex-col items-center gap-4 rounded-2xl border border-border bg-card px-6 py-12 text-center ${className}`}>
      {illustration && <img src={illustration} alt="" aria-hidden="true" className="h-40 w-40 object-contain" />}
      <h2 className="text-headline-md text-foreground">{title}</h2>
      {subtitle && <p className="max-w-sm text-body-md text-muted-foreground">{subtitle}</p>}
      {action}
    </div>
  );
}

export default EmptyState;
