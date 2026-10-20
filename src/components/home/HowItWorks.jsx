import Section from "@/components/rp/Section";
import { Card } from "@/components/rp/Card";
import { Icon } from "@/components/rp/Icon";
import { TELAS_APP } from "@/lib/brandAssets";

const passos = [
  { icone: "qr_code_2", titulo: "Informe o código", texto: "Digite o código de rastreio recebido da NGS ou da loja. Ele é a única informação necessária." },
  { icone: "route", titulo: "Acompanhe cada etapa", texto: "A linha do tempo mostra as movimentações do pedido, da separação até a saída para entrega." },
  { icone: "photo_camera", titulo: "Veja o comprovante", texto: "Na entrega concluída, o comprovante fica disponível para abrir, baixar e compartilhar." },
];

export default function HowItWorks() {
  return (
    <Section eyebrow="Rastreamento" titulo="Do despacho à entrega, em três passos" texto="O motorista registra cada parada no aplicativo NGS Delivery, e o portal mostra o resultado para você.">
      <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
        <ol className="space-y-4">
          {passos.map((p, i) => (
            <li key={p.titulo}>
              <Card className="flex gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground"><Icon name={p.icone} size={26} /></span>
                <div>
                  <p className="text-code-sm text-muted-foreground">0{i + 1}</p>
                  <h3 className="text-headline-sm">{p.titulo}</h3>
                  <p className="mt-1 text-body-md text-muted-foreground">{p.texto}</p>
                </div>
              </Card>
            </li>
          ))}
        </ol>
        <figure className="mx-auto flex max-w-[380px] items-end justify-center gap-3" aria-label="Telas do aplicativo NGS Delivery">
          <img src={TELAS_APP.parada} alt="Tela de parada do aplicativo NGS Delivery, com endereço, contato e pedido" loading="lazy" width="390" height="844" className="w-[56%] rounded-3xl border border-border shadow-lg" />
          <img src={TELAS_APP.concluida} alt="Tela de entrega concluída do aplicativo NGS Delivery" loading="lazy" className="mb-8 w-[44%] rounded-3xl border border-border shadow-lg" />
        </figure>
      </div>
    </Section>
  );
}
