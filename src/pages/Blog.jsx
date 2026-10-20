import { useMemo, useState } from "react";
import PageShell from "@/components/layout/PageShell";
import PageHero from "@/components/layout/PageHero";
import Section from "@/components/rp/Section";
import { Card } from "@/components/rp/Card";
import { Icon } from "@/components/rp/Icon";
import { Field } from "@/components/rp/Field";
import { StatusPill } from "@/components/rp/StatusPill";
import { EmptyState } from "@/components/rp/EmptyState";
import { posts } from "@/data/localData";
import { MASCOTES } from "@/lib/brandAssets";

export default function Blog() {
  const [category, setCategory] = useState("Todos");
  const [search, setSearch] = useState("");
  const categories = ["Todos", ...new Set(posts.map((p) => p.category))];
  const filtered = useMemo(
    () => posts.filter((p) => (category === "Todos" || p.category === category) && p.title.toLowerCase().includes(search.trim().toLowerCase())),
    [category, search],
  );
  return (
    <PageShell titulo="Blog">
      <PageHero eyebrow="Blog" titulo="Conteúdo para decisões logísticas melhores" />
      <Section>
        <div className="mb-8 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <Field label="Buscar artigos" icon="search" type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Digite um assunto" />
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoria">
            {categories.map((c) => (
              <button key={c} type="button" aria-pressed={category === c} onClick={() => setCategory(c)} className={`rp-tap min-h-[44px] rounded-full px-4 text-label-lg ${category === c ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>{c}</button>
            ))}
          </div>
        </div>
        {filtered.length === 0 ? (
          <EmptyState illustration={MASCOTES.circleThinking} title="Nenhum artigo encontrado" subtitle="Tente outro assunto ou limpe os filtros." />
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {filtered.map((p) => (
              <li key={p.id}>
                <Card as="article" className="flex h-full flex-col">
                  <div className="flex items-center gap-2"><StatusPill status={p.featured ? "blue" : "gray"} dot={false}>{p.category}</StatusPill><span className="text-body-sm text-muted-foreground">{p.date}</span></div>
                  <h2 className="text-headline-sm mt-3">{p.title}</h2>
                  <p className="mt-2 flex-1 text-body-md text-muted-foreground">{p.excerpt}</p>
                  <p className="mt-4 inline-flex items-center gap-1 text-body-sm text-muted-foreground"><Icon name="schedule" size={16} />{p.read_time}</p>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </PageShell>
  );
}
