import { useState } from "react";
import { ArrowRight, CheckCircle } from "lucide-react";

const initialForm = { origin: "", destination: "", cargo_type: "", contact_name: "", contact_email: "", contact_phone: "", message: "" };

export default function QuoteForm() {
  const [formData, setFormData] = useState(initialForm);
  const [status, setStatus] = useState("idle");
  const handleChange = (event) => setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  const handleSubmit = (event) => {
    event.preventDefault();
    const subject = encodeURIComponent(`Nova cotação: ${formData.origin} → ${formData.destination}`);
    const body = encodeURIComponent(`Nome: ${formData.contact_name}\nE-mail: ${formData.contact_email}\nTelefone: ${formData.contact_phone}\nOrigem: ${formData.origin}\nDestino: ${formData.destination}\nCarga: ${formData.cargo_type}\nMensagem: ${formData.message || "-"}`);
    window.location.href = `mailto:comercial@ngstransportes.com.br?subject=${subject}&body=${body}`;
    setStatus("sent");
  };
  if (status === "sent") return <div className="bg-white rounded-card p-8 text-center"><CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-3" /><h3 className="font-bold text-brand-onyx">Solicitação preparada</h3><p className="text-sm text-brand-text-secondary mt-2">Seu aplicativo de e-mail foi aberto para concluir o envio.</p><button type="button" onClick={() => { setFormData(initialForm); setStatus("idle"); }} className="text-xs font-bold text-brand-coral mt-5">Enviar outra solicitação</button></div>;
  return <form onSubmit={handleSubmit} className="bg-white rounded-card p-5 sm:p-6 space-y-3"><div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><Field label="Origem (Cidade/UF)" name="origin" value={formData.origin} onChange={handleChange} required /><Field label="Destino (Cidade/UF)" name="destination" value={formData.destination} onChange={handleChange} required /></div><div><label className="block text-[10px] font-semibold uppercase tracking-wider text-brand-text-secondary mb-1">Tipo de Carga *</label><select required name="cargo_type" value={formData.cargo_type} onChange={handleChange} className="w-full h-10 px-3 bg-brand-surface-alt border border-brand-border rounded-lg text-sm"><option value="">Selecione...</option><option>Carga Fracionada (LTL)</option><option>Carga Lotação (FTL)</option><option>Last Mile</option><option>Outra</option></select></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><Field label="Nome" name="contact_name" value={formData.contact_name} onChange={handleChange} required /><Field label="Telefone" name="contact_phone" value={formData.contact_phone} onChange={handleChange} required /></div><Field label="E-mail" name="contact_email" value={formData.contact_email} onChange={handleChange} type="email" required /><Field label="Mensagem" name="message" value={formData.message} onChange={handleChange} /><button type="submit" className="w-full h-11 bg-brand-coral hover:bg-brand-coral-hover text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2">Solicitar Cotação <ArrowRight className="w-4 h-4" /></button></form>;
}
function Field({ label, name, value, onChange, type = "text", required = false }) { return <div><label className="block text-[10px] font-semibold uppercase tracking-wider text-brand-text-secondary mb-1">{label}{required ? " *" : ""}</label><input required={required} name={name} value={value} onChange={onChange} type={type} className="w-full h-10 px-3 bg-brand-surface-alt border border-brand-border rounded-lg text-sm text-brand-onyx outline-none focus:ring-2 focus:ring-brand-coral" /></div>; }
