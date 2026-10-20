import { Link } from "react-router-dom";
import Section from "@/components/rp/Section";
import { Icon } from "@/components/rp/Icon";
import { MASCOTES } from "@/lib/brandAssets";

const servicos = [
  { icone: "local_shipping", titulo: "Entregas last mile", texto: "Distribuição urbana com roteirização das paradas e comprovante digital de entrega.", img: MASCOTES.roundedWaving, alt: "Mascote NGS acenando", cta: "Ver como funciona" },
  { icone: "swap_horiz", titulo: "Cross-docking e triagem", texto: "Recebimento, triagem e expedição para acelerar o tempo até a entrega final.", img: MASCOTES.squareCambalhota, alt: "Mascote NGS dando uma cambalhota", cta: "Conhecer o fluxo" },
  { icone: "warehouse", titulo: "Fulfillment e armazenagem", texto: "Armazenagem, separação e expedição de pedidos para operações de e-commerce.", img: MASCOTES.circleThinking, alt: "Mascote NGS pensando", cta: "Pedir uma análise" },
  { icone: "route", titulo: "Transporte rodoviário", texto: "Cargas fracionadas e lotação conforme a rota e o tipo de carga.", img: MASCOTES.trianglePointing, alt: "Mascote NGS apontando", cta: "Pedir cotação de frete" },
];

export default function ServicesGrid() {
  return (
    <Section id="servicos" tom="muted" eyebrow="Serviços" titulo="Soluções para cada etapa da sua operação">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {servicos.map((s) => (
          <li key={s.titulo} className="card flex flex-col overflow-hidden">
            <div className="flex h-44 items-center justify-center bg-accent"><img src={s.img} alt={s.alt} loading="lazy" className="h-36 w-36 object-contain" /></div>
            <div className="flex flex-1 flex-col p-5">
              <Icon name={s.icone} size={28} className="text-primary-deep" />
              <h3 className="text-headline-sm mt-3">{s.titulo}</h3>
              <p className="mt-2 flex-1 text-body-md text-muted-foreground">{s.texto}</p>
              <Link to={s.cta === "Ver como funciona" || s.cta === "Conhecer o fluxo" ? "/servicos" : "/contato"} className="rp-tap mt-4 inline-flex min-h-[44px] items-center gap-1 text-label-lg text-primary-deep underline underline-offset-4">{s.cta}<Icon name="arrow_forward" size={18} /></Link>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
