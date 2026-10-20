import PageShell from "@/components/layout/PageShell";
import PageHero from "@/components/layout/PageHero";
import Section from "@/components/rp/Section";
import { Card } from "@/components/rp/Card";
import { Icon } from "@/components/rp/Icon";
import { Button } from "@/components/rp/Button";
import { BRAND, TELAS_APP } from "@/lib/brandAssets";

const valores = [
  { icone: "visibility", titulo: "Visibilidade", texto: "Transparência em cada etapa do transporte." },
  { icone: "shield", titulo: "Cuidado com a carga", texto: "Atenção ao manuseio e ao registro de cada entrega." },
  { icone: "schedule", titulo: "Pontualidade", texto: "Prazos acompanhados de perto pela operação." },
  { icone: "eco", titulo: "Melhoria contínua", texto: "Processos e rotas revistos para gastar menos tempo e combustível." },
];

export default function About() {
  return (
    <PageShell titulo="Quem somos">
      <PageHero eyebrow="NGS Transportes" titulo="Logística que conecta negócios e pessoas" texto="Operação de transporte terrestre, distribuição urbana e soluções logísticas para empresas que precisam de previsibilidade e cuidado.">
        <Button to="/contato" className="mt-6">Fale conosco</Button>
      </PageHero>
      <Section eyebrow="Nossa marca" titulo="Sua carga em todo o Brasil">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <img src={BRAND.container} alt="Contêiner NGS Transportes sendo içado, cercado por caixas com paraquedas" loading="lazy" className="w-full" />
          <div className="space-y-4 text-body-lg text-muted-foreground">
            <p>A NGS Transportes atua com entregas last mile, cross-docking, fulfillment e transporte rodoviário.</p>
            <p>Os motoristas usam o aplicativo NGS Delivery para registrar cada parada, e o portal de rastreamento mostra ao cliente o andamento e o comprovante de entrega.</p>
          </div>
        </div>
      </Section>
      <Section tom="muted" eyebrow="Tecnologia própria" titulo="Do aplicativo do motorista ao portal do cliente">
        <div className="grid items-center gap-8 md:grid-cols-[auto_1fr]">
          <img src={TELAS_APP.mapa} alt="Mapa de rota do aplicativo NGS Delivery" loading="lazy" className="mx-auto w-[220px] rounded-3xl border border-border shadow-lg" />
          <p className="max-w-xl text-body-lg text-muted-foreground">O aplicativo organiza as paradas do dia, orienta o trajeto e registra a entrega com foto e dados do recebedor. Essas informações alimentam a linha do tempo exibida no rastreamento.</p>
        </div>
      </Section>
      <Section eyebrow="Valores" titulo="O que orienta o nosso trabalho">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {valores.map((v) => (
            <Card key={v.titulo}>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground"><Icon name={v.icone} size={26} /></span>
              <h3 className="text-headline-sm mt-4">{v.titulo}</h3>
              <p className="mt-2 text-body-md text-muted-foreground">{v.texto}</p>
            </Card>
          ))}
        </div>
      </Section>
    </PageShell>
  );
}
