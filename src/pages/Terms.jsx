import PageShell from "@/components/layout/PageShell";
import PageHero from "@/components/layout/PageHero";
import Section from "@/components/rp/Section";
import { Disclosure } from "@/components/rp/Disclosure";

const clauses = [{ title: "Objeto e âmbito de aplicação", content: "Este instrumento estabelece as condições gerais para prestação de serviços logísticos terrestres pela Ngs Transportes, incluindo transporte, armazenagem, cross-docking e distribuição urbana." }, { title: "Obrigações do embarcador", content: "O embarcador deve fornecer documentação fiscal completa, válida e compatível com cada remessa, além de acondicionar a carga adequadamente." }, { title: "Coleta e janelas operacionais", content: "As coletas acontecem dentro das janelas previamente acordadas e respeitam os prazos de corte definidos para cada região e modalidade." }, { title: "Prazos e tentativas de entrega", content: "Os prazos são definidos conforme origem, destino e modalidade. Em caso de ausência, a equipe orienta os próximos passos da entrega." }, { title: "Comprovação de entrega", content: "A entrega pode ser comprovada por assinatura, registro digital e evidências operacionais, conforme o serviço contratado." }, { title: "Seguros e sinistros", content: "As cargas seguem as condições de cobertura e gerenciamento de risco apresentadas na proposta comercial e na contratação." }, { title: "Armazenagem e devoluções", content: "A armazenagem temporária e os fluxos de logística reversa seguem os prazos e valores informados para cada operação." }, { title: "Tarifas e faturamento", content: "O faturamento segue a periodicidade acordada na proposta comercial, considerando modalidade, trecho e características da carga." }, { title: "Foro e resolução de conflitos", content: "As partes buscarão solução administrativa e de boa-fé para eventuais divergências, observando a legislação aplicável." }];

export default function Terms() {
  return (
    <PageShell titulo="Termos">
      <PageHero eyebrow="Termos" titulo="Condições gerais de contratação e transporte" texto="Documento de referência para as operações terrestres da NGS Transportes." />
      <Section>
        <div className="max-w-3xl">
          <Disclosure itens={clauses.map((c, i) => ({ titulo: `${String(i + 1).padStart(2, "0")} · ${c.title}`, conteudo: c.content }))} />
        </div>
      </Section>
    </PageShell>
  );
}
