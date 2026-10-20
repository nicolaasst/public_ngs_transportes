import { Link } from "react-router-dom";
import Section from "@/components/rp/Section";
import { Card } from "@/components/rp/Card";
import { Icon } from "@/components/rp/Icon";

const itens = [
  { icone: "travel_explore", titulo: "Rastreamento por evento", texto: "Cada movimentação do pedido é registrada e aparece na linha do tempo, com o status mais recente em destaque.", to: "/rastreamento", cta: "Rastrear uma encomenda" },
  { icone: "verified", titulo: "Comprovação digital", texto: "A entrega é registrada pelo motorista no aplicativo e o comprovante pode ser aberto, baixado e compartilhado.", to: "/ajuda/rastreamento-telemetria", cta: "Entender a comprovação" },
  { icone: "alt_route", titulo: "Rotas organizadas", texto: "As paradas de cada motorista são roteirizadas para reduzir deslocamentos e dar mais previsibilidade.", to: "/servicos", cta: "Ver os serviços" },
  { icone: "support_agent", titulo: "Atendimento próximo", texto: "Dúvidas sobre prazos, ocorrências ou cotações são tratadas diretamente pela nossa equipe.", to: "/contato", cta: "Falar com a equipe" },
];

export default function WhyUsSection() {
  return (
    <Section eyebrow="Por que a NGS" titulo="Visibilidade e cuidado em cada entrega">
      <div className="grid gap-4 md:grid-cols-2">
        {itens.map((i) => (
          <Card key={i.titulo} className="flex flex-col">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground"><Icon name={i.icone} size={26} /></span>
            <h3 className="text-headline-sm mt-4">{i.titulo}</h3>
            <p className="mt-2 flex-1 text-body-md text-muted-foreground">{i.texto}</p>
            <Link to={i.to} className="rp-tap mt-4 inline-flex min-h-[44px] items-center gap-1 text-label-lg text-primary-deep underline underline-offset-4">{i.cta}<Icon name="arrow_forward" size={18} /></Link>
          </Card>
        ))}
      </div>
    </Section>
  );
}
