import React from "react";
import { MapPin, Satellite, Headphones, ShieldCheck, ArrowRight } from "lucide-react";
const features = [
  { icon: MapPin, title: "Cobertura Nacional", desc: "Presença sólida nas principais capitais e polos industriais do país, com malha rodoviária otimizada para reduzir prazos e custos operacionais.", cta: "Saiba Mais", link: "#services" },
  { icon: Satellite, title: "Telemetria Veicular", desc: "Monitoramento via GPS ponto a ponto em rotas metropolitanas e interestaduais, com webhooks e integrações com o ERP/e-commerce da sua empresa.", cta: "Saiba Mais", link: "#tracking" },
  { icon: Headphones, title: "Equipe Especializada", desc: "Torre de controle dedicada e especialistas em supply chain terrestre prestando atendimento resolutivo e suporte ao motorista 24 horas por dia.", cta: "Saiba Mais", link: "#faq" },
  { icon: ShieldCheck, title: "Segurança & GRIS", desc: "Seguro integral de carga (RCTR-C e RCF-DC), rigoroso gerenciamento de risco, rotas seguras e procedimentos homologados para prevenção de perdas.", cta: "Saiba Mais", link: "#about" },
];
export default function WhyUsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-coral font-ibmmono">// Por Que Escolher a Ngs Transportes</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-brand-onyx tracking-tight mt-2 max-w-3xl">
            Especialistas em Oferecer <span className="text-brand-text-secondary font-medium">Pontualidade e Eficiência Operacional</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          <div className="lg:col-span-5 rounded-card overflow-hidden shadow-card-soft min-h-[420px] relative">
            <img
              alt="Frota logística rodoviária de entrega rápida"
              className="w-full h-full object-cover object-center"
              src="https://images.unsplash.com/photo-1601584119197-04ecc0da31d7?w=800&q=80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="text-[10px] font-ibmmono tracking-wider uppercase bg-brand-coral px-2.5 py-1 rounded font-bold">SLA Garantido</span>
              <h3 className="text-lg font-bold mt-2">99,4% de pontualidade nas entregas urbanas e rodoviárias.</h3>
            </div>
          </div>
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="p-6 rounded-card border border-brand-border bg-brand-surface hover:shadow-card-soft transition-all group">
                <div className="w-12 h-12 rounded-xl bg-orange-50 text-brand-coral flex items-center justify-center text-xl mb-4 group-hover:bg-brand-coral group-hover:text-white transition-colors">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-brand-onyx mb-2">{feature.title}</h3>
                <p className="text-xs text-brand-text-secondary leading-relaxed mb-4">{feature.desc}</p>
                <a href={feature.link} className="inline-flex items-center text-xs font-bold text-brand-coral hover:text-brand-coral-hover gap-1.5">
                  <span>{feature.cta}</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}