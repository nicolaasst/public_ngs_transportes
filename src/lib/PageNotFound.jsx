import { useLocation } from "react-router-dom";
import PageShell from "@/components/layout/PageShell";
import Section from "@/components/rp/Section";
import { EmptyState } from "@/components/rp/EmptyState";
import { Button } from "@/components/rp/Button";
import { MASCOTES } from "@/lib/brandAssets";

export default function PageNotFound() {
  const { pathname } = useLocation();
  return (
    <PageShell titulo="Página não encontrada">
      <Section>
        <EmptyState
          illustration={MASCOTES.circleThinking}
          title="Página não encontrada"
          subtitle={`O endereço "${pathname}" não existe neste site.`}
          action={<div className="flex flex-wrap justify-center gap-3"><Button to="/">Voltar ao início</Button><Button to="/rastreamento" variant="outline">Rastrear encomenda</Button></div>}
        />
      </Section>
    </PageShell>
  );
}
