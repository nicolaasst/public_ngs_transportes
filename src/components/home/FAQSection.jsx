import Section from "@/components/rp/Section";
import { Disclosure } from "@/components/rp/Disclosure";
import { Button } from "@/components/rp/Button";
import { faqs } from "@/data/localData";

export default function FAQSection() {
  return (
    <Section id="faq" tom="muted" eyebrow="Perguntas frequentes" titulo="Dúvidas? Nós respondemos.">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <p className="text-body-lg text-muted-foreground">Ainda com dúvidas? Veja a central de ajuda ou fale com a equipe.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button to="/ajuda" variant="outline" size="sm">Central de ajuda</Button>
            <Button to="/contato" size="sm">Falar com a equipe</Button>
          </div>
        </div>
        <Disclosure itens={faqs.map((f) => ({ titulo: f.question, conteudo: f.answer }))} />
      </div>
    </Section>
  );
}
