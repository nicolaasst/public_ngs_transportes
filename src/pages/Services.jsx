import PageShell from "@/components/layout/PageShell";
import PageHero from "@/components/layout/PageHero";
import Section from "@/components/rp/Section";
import { Card } from "@/components/rp/Card";
import { Icon } from "@/components/rp/Icon";
import { Button } from "@/components/rp/Button";
import { Disclosure } from "@/components/rp/Disclosure";
import QuoteForm from "@/components/services/QuoteForm";
import { TELAS_APP, MASCOTES } from "@/lib/brandAssets";

const vantagens = [
  { icone: "schedule", titulo: "Janelas de entrega", texto: "Agendamentos combinados com o cliente para aumentar a chance de recebimento." },
  { icone: "travel_explore", titulo: "Rastreamento por evento", texto: "Atualizações claras para o embarcador e para o destinatário." },
  { icone: "alt_route", titulo: "Roteirização", texto: "Paradas organizadas para reduzir tempo de deslocamento e dar previsibilidade." },
  { icone: "support_agent", titulo: "Gestão de ocorrências", texto: "Acompanhamento próximo quando algo foge do planejado." },
];
const etapas = [
  { icone: "package_2", titulo: "Coleta e triagem", texto: "Recebimento, conferência e preparação da carga." },
  { icone: "route", titulo: "Roteirização e despacho", texto: "Distribuição da carga e organização das paradas." },
  { icone: "photo_camera", titulo: "Entrega e comprovação", texto: "Finalização com registro e visibilidade operacional." },
];
const perguntas = [
  { titulo: "Qual o horário de corte para entregas no mesmo dia?", conteudo: "O horário depende da região e da modalidade. Nossa equipe informa a janela disponível na cotação." },
  { titulo: "Como funciona a comprovação de entrega?", conteudo: "A entrega pode ser registrada com assinatura digital, foto e dados operacionais do atendimento." },
  { titulo: "O que acontece em caso de ausência?", conteudo: "A equipe orienta o motorista e o cliente para reagendar ou concluir a entrega com segurança. A tentativa aparece na linha do tempo do rastreio." },
];

export default function Services() {
  return (
    <PageShell titulo="Serviços">
      <PageHero eyebrow="Distribuição urbana" titulo="Entregas last mile com previsibilidade" texto="Distribuição para e-commerce, indústrias e varejo, com operação próxima e comunicação transparente.">
        <Button href="#cotacao" className="mt-6"><Icon name="request_quote" size={20} />Simular uma operação</Button>
      </PageHero>
      <Section eyebrow="Diferenciais" titulo="Por que escolher a nossa operação">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {vantagens.map((v) => (
            <Card key={v.titulo}>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground"><Icon name={v.icone} size={26} /></span>
              <h3 className="text-headline-sm mt-4">{v.titulo}</h3>
              <p className="mt-2 text-body-md text-muted-foreground">{v.texto}</p>
            </Card>
          ))}
        </div>
      </Section>
      <Section tom="muted" eyebrow="Como funciona" titulo="Da coleta à comprovação">
        <div className="grid items-center gap-8 lg:grid-cols-[1.3fr_1fr]">
          <ol className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {etapas.map((e, i) => (
              <li key={e.titulo}>
                <Card className="flex h-full gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"><Icon name={e.icone} size={24} /></span>
                  <div><p className="text-code-sm text-muted-foreground">0{i + 1}</p><h3 className="text-headline-sm">{e.titulo}</h3><p className="mt-1 text-body-md text-muted-foreground">{e.texto}</p></div>
                </Card>
              </li>
            ))}
          </ol>
          <figure className="mx-auto max-w-[260px]">
            <img src={TELAS_APP.historico} alt="Tela de detalhe de entrega do aplicativo NGS Delivery" loading="lazy" className="w-full rounded-3xl border border-border shadow-lg" />
          </figure>
        </div>
      </Section>
      <Section eyebrow="Dúvidas frequentes" titulo="Sobre as entregas"><div className="max-w-3xl"><Disclosure itens={perguntas} /></div></Section>
      <section id="cotacao" className="section-y bg-navy scroll-mt-20">
        <div className="page-container grid items-center gap-8 md:grid-cols-2">
          <div className="text-[hsl(240_9%_94%)]">
            <img src={MASCOTES.trianglePointing} alt="" aria-hidden="true" className="mb-4 h-24 w-24 object-contain" />
            <h2 className="text-headline-lg">Vamos montar a melhor rota para você</h2>
            <p className="mt-3 text-body-lg text-[hsl(240_3%_75%)]">Envie os dados da operação e a equipe comercial retorna por e-mail.</p>
          </div>
          <QuoteForm />
        </div>
      </section>
    </PageShell>
  );
}
