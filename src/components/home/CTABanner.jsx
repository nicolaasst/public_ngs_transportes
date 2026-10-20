import { Button } from "@/components/rp/Button";
import { Icon } from "@/components/rp/Icon";
import { BRAND } from "@/lib/brandAssets";

export default function CTABanner() {
  return (
    <section className="section-y">
      <div className="page-container">
        <div className="grid items-center gap-8 overflow-hidden rounded-3xl bg-primary p-8 text-primary-foreground md:grid-cols-[1.2fr_1fr] md:p-12">
          <div>
            <h2 className="text-headline-lg">Vamos conversar sobre a sua operação?</h2>
            <p className="mt-3 text-body-lg text-primary-foreground/80">Conte a rota, o tipo de carga e o volume. A equipe comercial retorna por e-mail.</p>
            <Button to="/contato" className="mt-6"><Icon name="request_quote" size={20} />Solicitar cotação</Button>
          </div>
          <img src={BRAND.container} alt="" aria-hidden="true" loading="lazy" className="w-full max-w-sm justify-self-center" />
        </div>
      </div>
    </section>
  );
}
