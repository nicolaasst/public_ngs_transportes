import { Link, useParams } from "react-router-dom";
import PageShell from "@/components/layout/PageShell";
import PageHero from "@/components/layout/PageHero";
import Section from "@/components/rp/Section";
import { Icon } from "@/components/rp/Icon";
import { EmptyState } from "@/components/rp/EmptyState";
import { Button } from "@/components/rp/Button";
import { getHelpCategory } from "@/lib/help-categories";
import { getArticle, getArticlesByCategory } from "@/data/localData";
import { MASCOTES } from "@/lib/brandAssets";

export default function HelpArticle() {
  const { categoria, artigo } = useParams();
  const category = getHelpCategory(categoria);
  const article = getArticle(categoria, artigo);
  const related = getArticlesByCategory(categoria).filter((item) => item.slug !== artigo);
  if (!category || !article) {
    return (
      <PageShell titulo="Artigo não encontrado">
        <Section><EmptyState illustration={MASCOTES.circleThinking} title="Artigo não encontrado" subtitle="Esse artigo não existe ou foi movido." action={<Button to={category ? `/ajuda/${categoria}` : "/ajuda"}>Voltar</Button>} /></Section>
      </PageShell>
    );
  }
  return (
    <PageShell titulo={article.title}>
      <PageHero voltar={{ to: `/ajuda/${categoria}`, rotulo: category.title }} eyebrow={category.title} titulo={article.title}>
        <p className="mt-4 inline-flex items-center gap-1.5 text-body-md text-muted-foreground"><Icon name="schedule" size={18} />{article.read_time}</p>
      </PageHero>
      <Section>
        <article className="max-w-[720px] space-y-4 text-body-lg text-muted-foreground">
          {article.content.split("\n\n").map((p) => <p key={p}>{p}</p>)}
        </article>
        {related.length > 0 && (
          <div className="mt-12 max-w-[720px] border-t border-border pt-8">
            <h2 className="eyebrow">Artigos relacionados</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {related.map((item) => (
                <li key={item.id}><Link to={`/ajuda/${categoria}/${item.slug}`} className="card rp-tap flex min-h-[64px] items-center justify-between gap-3 p-4 text-label-lg">{item.title}<Icon name="chevron_right" size={22} className="shrink-0 text-primary-deep" /></Link></li>
              ))}
            </ul>
          </div>
        )}
      </Section>
    </PageShell>
  );
}
