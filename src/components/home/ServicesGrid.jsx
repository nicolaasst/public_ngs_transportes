import React from "react";
import { ArrowRight } from "lucide-react";
const services = [
  {
    num: "01 // Entrega Expressa",
    title: "Entregas Last Mile",
    desc: "Modalidades Same-Day e Next-Day para e-commerces com roteirização inteligente e comprovante digital de entrega.",
    cta: "Ver Prazos & Regiões",
    img: "https://images.unsplash.com/photo-1616401784885-1631e6d2b1f6?w=800&q=80",
  },
  {
    num: "02 // Despacho Ágil",
    title: "Cross-Docking & Triagem",
    desc: "Recebimento, triagem automatizada e expedição imediata sem estocagem ociosa, acelerando o tempo de entrega final.",
    cta: "Conhecer Fluxo Operacional",
    img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80",
  },
  {
    num: "03 // E-Commerce WMS",
    title: "Fulfillment & Armazenagem",
    desc: "Armazenamento estratégico, controle de estoque WMS em tempo real, picking & packing e etiquetagem rápida.",
    cta: "Explorar Centros de Distribuição",
    img: "https://images.unsplash.com/photo-1553413168-87e8d506e5f4?w=800&q=80",
  },
  {
    num: "04 // Linhas Rodoviárias",
    title: "Transporte Rodoviário",
    desc: "Linhas troncais rodoviárias, cargas fracionadas (LTL) e carga lotação dedicada (FTL) com gestão de risco e escolta.",
    cta: "Calcular Frete Rodoviário",
    img: "https://images.unsplash.com/photo-1580655653885-1a4f6a8c5c5f?w=800&q=80",
  },
];
export default function ServicesGrid() {
  return (
    <section className="py-20 bg-brand-surface-alt/70" id="services">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-brand-coral mb-2">Serviços Terrestres</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-brand-onyx tracking-tight">
            Soluções Completas do Galpão à Porta do Cliente
          </h2>
          <p className="text-brand-text-secondary text-sm mt-3">
            Estrutura robusta focada em velocidade de entrega, redução de prazos operacionais e máxima segurança rodoviária e urbana.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <div key={service.title} className="group relative h-96 rounded-card overflow-hidden shadow-card-soft cursor-pointer">
              <img
                alt={service.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                src={service.img}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-onyx via-brand-onyx/40 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-6 flex flex-col justify-end">
                <span className="text-xs uppercase font-ibmmono tracking-wider text-brand-coral font-bold mb-1">{service.num}</span>
                <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                <p className="text-xs text-white/80 line-clamp-2 leading-relaxed">{service.desc}</p>
                <div className="mt-4 flex items-center text-xs font-semibold text-white group-hover:text-brand-coral transition-colors gap-2">
                  <span>{service.cta}</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}