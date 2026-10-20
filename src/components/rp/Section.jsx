/** Seção de página: cabeçalho (eyebrow + título + texto) e conteúdo. `tom="muted"` alterna o fundo como nas telas do App Delivery. */
export function Section({ eyebrow, titulo, texto, tom, id, className = "", children }) {
  return (
    <section id={id} className={`section-y ${tom === "muted" ? "bg-muted/60" : ""} ${className}`}>
      <div className="page-container">
        {(eyebrow || titulo) && (
          <header className="mb-8 max-w-2xl md:mb-10">
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            {titulo && <h2 className="text-headline-lg mt-2">{titulo}</h2>}
            {texto && <p className="mt-3 text-body-lg text-muted-foreground">{texto}</p>}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}

export default Section;
