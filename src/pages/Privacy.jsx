import { useState } from "react";
import PageShell from "@/components/layout/PageShell";
import PageHero from "@/components/layout/PageHero";
import Section from "@/components/rp/Section";
import { Card } from "@/components/rp/Card";
import { Icon } from "@/components/rp/Icon";
import { Field } from "@/components/rp/Field";
import { Button } from "@/components/rp/Button";

const pillars = [{ icon: "check_circle", title: "Não comercialização", desc: "Dados não são vendidos ou alugados para publicidade." }, { icon: "lock", title: "Proteção técnica", desc: "Aplicamos controles de acesso e boas práticas de segurança." }, { icon: "target", title: "Finalidade", desc: "Tratamos dados para executar serviços e cumprir obrigações." }, { icon: "shield", title: "Conformidade", desc: "Processos orientados pela LGPD e pela legislação aplicável." }];
const categories = [{ icon: "apartment", title: "Embarcadores", items: ["Razão social e CNPJ", "Dados de contrato", "Contatos corporativos"] }, { icon: "person", title: "Destinatários", items: ["Nome e endereço", "Telefone para notificações", "Comprovante de recebimento"] }, { icon: "local_shipping", title: "Motoristas e frotas", items: ["Dados profissionais", "Informações do veículo", "Registros operacionais"] }, { icon: "navigation", title: "Geolocalização", items: ["Posição durante a rota", "Paradas operacionais", "Dados de roteirização"] }];

export default function Privacy() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const submit = (event) => {
    event.preventDefault();
    window.location.href = `mailto:dpo@ngstransportes.com.br?subject=${encodeURIComponent("Solicitação LGPD")}&body=${encodeURIComponent(`Solicitante: ${email}`)}`;
    setSent(true);
  };
  return (
    <PageShell titulo="Privacidade">
      <PageHero eyebrow="LGPD" titulo="Política de privacidade" texto="Como a NGS Transportes coleta, utiliza, protege e compartilha as informações necessárias para as suas operações logísticas." />
      <Section tom="muted" eyebrow="Princípios" titulo="Como tratamos os dados">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p) => (
            <Card key={p.title}>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground"><Icon name={p.icon} size={26} /></span>
              <h3 className="text-headline-sm mt-4">{p.title}</h3>
              <p className="mt-2 text-body-md text-muted-foreground">{p.desc}</p>
            </Card>
          ))}
        </div>
      </Section>
      <Section eyebrow="Dados" titulo="Dados que podem ser processados">
        <div className="grid gap-4 md:grid-cols-2">
          {categories.map((c) => (
            <Card key={c.title}>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground"><Icon name={c.icon} size={26} /></span>
              <h3 className="text-headline-sm mt-4">{c.title}</h3>
              <ul className="mt-3 space-y-1 text-body-md text-muted-foreground">{c.items.map((item) => <li key={item} className="flex gap-2"><Icon name="check" size={18} className="mt-0.5 shrink-0 text-primary-deep" />{item}</li>)}</ul>
            </Card>
          ))}
        </div>
      </Section>
      <Section tom="muted">
        <div className="mx-auto max-w-xl text-center">
          <Icon name="mail" size={40} className="text-primary-deep" />
          <h2 className="text-headline-md mt-2">Solicite informações sobre seus dados</h2>
          <p className="mt-2 text-body-md text-muted-foreground">Informe seu e-mail para abrir uma solicitação ao canal de privacidade.</p>
          <form onSubmit={submit} className="mt-6 space-y-3 text-left">
            <Field label="Seu e-mail" icon="alternate_email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" autoComplete="email" />
            <Button type="submit" className="w-full"><Icon name="send" size={20} />Enviar solicitação</Button>
          </form>
          {sent && <p role="status" className="mt-3 text-body-sm text-muted-foreground">Abrimos o seu aplicativo de e-mail. Se ele não abriu, escreva para dpo@ngstransportes.com.br.</p>}
        </div>
      </Section>
    </PageShell>
  );
}
