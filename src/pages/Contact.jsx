import PageShell from "@/components/layout/PageShell";
import PageHero from "@/components/layout/PageHero";
import Section from "@/components/rp/Section";
import { Icon } from "@/components/rp/Icon";
import QuoteForm from "@/components/services/QuoteForm";

export default function Contact() {
  return (
    <PageShell titulo="Contato">
      <PageHero eyebrow="Atendimento corporativo" titulo="Vamos conversar sobre a sua operação" texto="Conte a rota, o tipo de carga e a necessidade de entrega. A equipe prepara uma orientação inicial." />
      <Section>
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-4">
            <a href="mailto:comercial@ngstransportes.com.br" className="card rp-tap flex items-center gap-4 p-5">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground"><Icon name="mail" size={26} /></span>
              <span><span className="block text-label-sm uppercase text-muted-foreground">Comercial</span><span className="text-label-lg break-all">comercial@ngstransportes.com.br</span></span>
            </a>
            <a href="mailto:talentos@ngstransportes.com.br" className="card rp-tap flex items-center gap-4 p-5">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground"><Icon name="badge" size={26} /></span>
              <span><span className="block text-label-sm uppercase text-muted-foreground">Carreiras</span><span className="text-label-lg break-all">talentos@ngstransportes.com.br</span></span>
            </a>
            <p className="text-body-md text-muted-foreground">Para acompanhar uma encomenda, use a página de rastreamento com o código recebido.</p>
          </div>
          <QuoteForm />
        </div>
      </Section>
    </PageShell>
  );
}
