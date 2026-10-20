import { Link, useParams } from "react-router-dom";
import PageShell from "@/components/layout/PageShell";
import PageHero from "@/components/layout/PageHero";
import Section from "@/components/rp/Section";
import { Icon } from "@/components/rp/Icon";
import { EmptyState } from "@/components/rp/EmptyState";
import { Button } from "@/components/rp/Button";
import { getHelpCategory } from "@/lib/help-categories";
import { getArticlesByCategory } from "@/data/localData";
import { MASCOTES } from "@/lib/brandAssets";

export default function HelpCategory() {
  const { categoria } = useParams();
  const category = getHelpCategory(categoria);
  const articles = getArticlesByCategory(categoria);
  if (!category) {
    return (
      <PageShell titulo="Categoria não encontrada">
        <Section><EmptyState illustration={MASCOTES.circleThinking} title="Categoria não encontrada" subtitle="Essa categoria não existe na central de ajuda." action={<Button to="/ajuda">Voltar à central de ajuda</Button>} /></Section>
      </PageShell>
    );
  }
  return (
    <PageShell titulo={category.title}>
      <PageHero voltar={{ to: "/ajuda", rotulo: "Central de ajuda" }} eyebrow={category.num} titulo={category.title} texto={category.desc} />
      <Section>
        {articles.length ? (
          <ul className="space-y-3">
            {articles.map((a) => (
              <li key={a.id}>
                <Link to={`/ajuda/${categoria}/${a.slug}`} className="card rp-tap group flex items-start justify-between gap-4 p-5 transition-colors hover:border-primary">
                  <span className="flex gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground"><Icon name="article" size={24} /></span>
                    <span><span className="block text-headline-sm">{a.title}</span><span className="mt-1 block text-body-md text-muted-foreground">{a.excerpt}</span></span>
                  </span>
                  <Icon name="arrow_forward" size={22} className="mt-3 shrink-0 text-primary-deep transition-transform group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState illustration={MASCOTES.circleThinking} title="Artigos em breve" subtitle="Os artigos desta categoria serão publicados em breve." action={<Button to="/contato" variant="outline">Falar com a equipe</Button>} />
        )}
      </Section>
    </PageShell>
  );
}
