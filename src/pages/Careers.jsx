import { useState } from "react";
import PageShell from "@/components/layout/PageShell";
import PageHero from "@/components/layout/PageHero";
import Section from "@/components/rp/Section";
import { Card } from "@/components/rp/Card";
import { Icon } from "@/components/rp/Icon";
import { Button } from "@/components/rp/Button";
import { Field } from "@/components/rp/Field";
import { EmptyState } from "@/components/rp/EmptyState";
import { jobs } from "@/data/localData";
import { MASCOTES } from "@/lib/brandAssets";

export default function Careers() {
  const [dept, setDept] = useState("Todos");
  const departments = ["Todos", ...new Set(jobs.map((job) => job.department))];
  const filtered = jobs.filter((job) => dept === "Todos" || job.department === dept);
  return (
    <PageShell titulo="Carreiras">
      <PageHero eyebrow="Carreiras" titulo="Construa o futuro da logística com a gente" texto="Faça parte de uma equipe que combina tecnologia, cuidado e excelência operacional." />
      <Section eyebrow="Vagas" titulo="Oportunidades abertas">
        <Field as="select" label="Área" icon="filter_list" value={dept} onChange={(e) => setDept(e.target.value)} className="mb-6 max-w-xs">
          {departments.map((d) => <option key={d}>{d}</option>)}
        </Field>
        {filtered.length === 0 ? (
          <EmptyState illustration={MASCOTES.circleThinking} title="Nenhuma vaga nesta área" subtitle="Envie seu currículo para o banco de talentos." />
        ) : (
          <ul className="space-y-3">
            {filtered.map((job) => (
              <li key={job.id}>
                <Card className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground"><Icon name="work" size={24} /></span>
                    <div>
                      <h3 className="text-headline-sm">{job.title}</h3>
                      <p className="mt-1 flex flex-wrap items-center gap-x-2 text-body-sm text-muted-foreground"><span>{job.department}</span><span aria-hidden="true">·</span><span>{job.location}</span><span aria-hidden="true">·</span><span>{job.type}</span><span aria-hidden="true">·</span><span>{job.level}</span></p>
                    </div>
                  </div>
                  <Button href={`mailto:talentos@ngstransportes.com.br?subject=${encodeURIComponent(`Candidatura: ${job.title}`)}`} size="sm" aria-label={`Candidatar-se à vaga ${job.title}`}>Candidatar-se</Button>
                </Card>
              </li>
            ))}
          </ul>
        )}
        <Card className="mt-8 text-center">
          <h3 className="text-headline-md">Candidatura espontânea</h3>
          <p className="mt-2 text-body-md text-muted-foreground">Envie seu currículo para o nosso banco de talentos.</p>
          <Button href="mailto:talentos@ngstransportes.com.br?subject=Candidatura%20espont%C3%A2nea" variant="onyx" className="mt-4"><Icon name="mail" size={20} />Enviar currículo</Button>
        </Card>
      </Section>
    </PageShell>
  );
}
