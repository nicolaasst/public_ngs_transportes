import { Link } from "react-router-dom";
import { Icon } from "@/components/rp/Icon";

/** Faixa de título das páginas internas (navy, mesmo tratamento das telas "vitrine" do App Delivery). */
export default function PageHero({ eyebrow, titulo, texto, voltar, children }) {
  return (
    <section className="bg-navy text-[hsl(240_9%_94%)]">
      <div className="page-container py-12 md:py-16">
        {voltar && (
          <Link to={voltar.to} className="rp-tap mb-5 inline-flex min-h-[44px] items-center gap-1 text-label-lg text-brand-yellow">
            <Icon name="arrow_back" size={20} />{voltar.rotulo}
          </Link>
        )}
        {eyebrow && <p className="eyebrow !text-brand-yellow">{eyebrow}</p>}
        <h1 className="text-display-lg mt-2 max-w-3xl">{titulo}</h1>
        {texto && <p className="mt-4 max-w-2xl text-body-lg text-[hsl(240_3%_75%)]">{texto}</p>}
        {children}
      </div>
    </section>
  );
}
