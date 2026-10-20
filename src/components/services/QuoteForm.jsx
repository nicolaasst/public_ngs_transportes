import { useState } from "react";
import { Field } from "@/components/rp/Field";
import { Button } from "@/components/rp/Button";
import { Card } from "@/components/rp/Card";
import { Icon } from "@/components/rp/Icon";
import { MASCOTES } from "@/lib/brandAssets";

const initialForm = { origin: "", destination: "", cargo_type: "", contact_name: "", contact_email: "", contact_phone: "", message: "" };

export default function QuoteForm() {
  const [formData, setFormData] = useState(initialForm);
  const [status, setStatus] = useState("idle");
  const handleChange = (event) => setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  const handleSubmit = (event) => {
    event.preventDefault();
    const subject = encodeURIComponent(`Nova cotação: ${formData.origin} → ${formData.destination}`);
    const body = encodeURIComponent(`Nome: ${formData.contact_name}\nE-mail: ${formData.contact_email}\nTelefone: ${formData.contact_phone || "-"}\nOrigem: ${formData.origin}\nDestino: ${formData.destination}\nCarga: ${formData.cargo_type}\nMensagem: ${formData.message || "-"}`);
    window.location.href = `mailto:comercial@ngstransportes.com.br?subject=${subject}&body=${body}`;
    setStatus("sent");
  };
  if (status === "sent") {
    return (
      <Card className="flex flex-col items-center gap-3 !p-8 text-center text-card-foreground" role="status">
        <img src={MASCOTES.roundedWaving} alt="" aria-hidden="true" className="h-28 w-28 object-contain" />
        <h3 className="text-headline-md">Solicitação preparada</h3>
        <p className="text-body-md text-muted-foreground">Seu aplicativo de e-mail foi aberto para concluir o envio. Se ele não abriu, escreva para comercial@ngstransportes.com.br.</p>
        <Button variant="outline" size="sm" onClick={() => { setFormData(initialForm); setStatus("idle"); }}>Enviar outra solicitação</Button>
      </Card>
    );
  }
  return (
    <Card as="form" onSubmit={handleSubmit} className="space-y-4 !p-5 text-card-foreground md:!p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Origem (cidade/UF) *" icon="trip_origin" name="origin" value={formData.origin} onChange={handleChange} required />
        <Field label="Destino (cidade/UF) *" icon="location_on" name="destination" value={formData.destination} onChange={handleChange} required />
      </div>
      <Field as="select" label="Tipo de carga *" icon="inventory_2" name="cargo_type" value={formData.cargo_type} onChange={handleChange} required>
        <option value="">Selecione…</option>
        <option>Carga fracionada (LTL)</option>
        <option>Carga lotação (FTL)</option>
        <option>Last mile</option>
        <option>Outra</option>
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nome *" icon="person" name="contact_name" value={formData.contact_name} onChange={handleChange} required autoComplete="name" />
        <Field label="E-mail *" icon="mail" name="contact_email" type="email" value={formData.contact_email} onChange={handleChange} required autoComplete="email" />
      </div>
      <Field label="Telefone (opcional)" icon="call" name="contact_phone" type="tel" value={formData.contact_phone} onChange={handleChange} autoComplete="tel" />
      <Field as="textarea" label="Mensagem (opcional)" name="message" value={formData.message} onChange={handleChange} />
      <Button type="submit" className="w-full"><Icon name="send" size={20} />Solicitar cotação</Button>
      <p className="text-body-sm text-muted-foreground">Ao enviar, abrimos o seu aplicativo de e-mail com a solicitação pronta para envio à equipe comercial.</p>
    </Card>
  );
}
