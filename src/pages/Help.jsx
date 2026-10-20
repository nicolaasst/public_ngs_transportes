import { Link } from "react-router-dom";
import PageShell from "@/components/layout/PageShell";
import PageHero from "@/components/layout/PageHero";
import Section from "@/components/rp/Section";
import { Card } from "@/components/rp/Card";
import { Icon } from "@/components/rp/Icon";
import { Button } from "@/components/rp/Button";
import { helpCategories } from "@/lib/help-categories";
import { getArticlesByCategory } from "@/data/localData";

export default function Help() {
  return (
    <PageShell titulo="Central de ajuda">
      <PageHero eyebrow="Central de ajuda" titulo="Encontre respostas para sua operação" texto="Orientações práticas sobre coleta, transporte, rastreamento, faturamento e integrações." />
      <Section>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {helpCategories.map((c) => {
            const total = getArticlesByCategory(c.slug).length;
            return (
              <li key={c.slug}>
                <Link to={`/ajuda/${c.slug}`} className="card rp-tap group flex h-full flex-col p-5 transition-colors hover:border-primary">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground"><Icon name={c.icon} size={26} /></span>
                  <p className="mt-4 text-code-sm text-muted-foreground">{c.num}</p>
                  <h2 className="text-headline-sm">{c.title}</h2>
                  <p className="mt-2 flex-1 text-body-md text-muted-foreground">{c.desc}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-label-lg text-primary-deep">{total > 0 ? `${total} ${total === 1 ? "artigo" : "artigos"}` : "Em breve"}<Icon name="arrow_forward" size={18} className="transition-transform group-hover:translate-x-1" /></span>
                </Link>
              </li>
            );
          })}
        </ul>
        <Card className="mt-10 text-center">
          <Icon name="support_agent" size={40} className="text-primary-deep" />
          <h2 className="text-headline-md mt-2">Ainda precisa de ajuda?</h2>
          <p className="mt-2 text-body-md text-muted-foreground">Fale com a nossa equipe.</p>
          <Button to="/contato" className="mt-4">Falar com a equipe</Button>
        </Card>
      </Section>
    </PageShell>
  );
}
