import React from "react";
import { Package, Building2, Building, Navigation } from "lucide-react";
import { Image } from "@/components/ui/image";
const stats = [
  { icon: Package, value: "+850k", label: "Pacotes Entregues / Mês" },
  { icon: Building2, value: "+1.200", label: "Cidades Atendidas" },
  { icon: Building, value: "+35", label: "Centros de Distribuição" },
  { icon: Navigation, value: "4.892", label: "Entregas em Rota Hoje", active: true },
];
export default function AboutSection() {
  return (
    <section className="py-20 bg-white" id="about">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          <div className="lg:col-span-6">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-brand-text-secondary mb-2">Sobre Nós</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-brand-onyx tracking-tight">
              SEU PARCEIRO ESTRATÉGICO EM<br />
              <span className="text-brand-coral">LOGÍSTICA TERRESTRE</span>
            </h2>
          </div>
          <div className="lg:col-span-6 lg:pt-6">
            <p className="text-brand-text-secondary text-sm md:text-base leading-relaxed">
              Potencializamos operações de e-commerce e varejo através de centros de distribuição estratégicos, cross-docking ágil, rotas fracionadas e frotas dedicadas. Garantimos previsibilidade, custo competitivo e tecnologia de ponta para entregas de ponta a ponta em todo o Brasil.
            </p>
          </div>
        </div>
        <div className="rounded-card bg-brand-surface-alt border border-brand-border p-8 md:p-14 relative overflow-hidden">
          <div className="flex justify-center -mt-14 mb-2">
            <div className="flex flex-col items-center">
              <div className="w-1 h-12 bg-neutral-400" />
              <div className="w-6 h-6 border-2 border-neutral-600 rounded-full flex items-center justify-center -mt-1 bg-white">
                <div className="w-2 h-2 bg-brand-coral rounded-full" />
              </div>
              <div className="flex gap-16 -mt-1">
                <div className="w-0.5 h-10 bg-neutral-400 rotate-12 origin-top" />
                <div className="w-0.5 h-10 bg-neutral-400 -rotate-12 origin-top" />
              </div>
            </div>
          </div>
          <div className="max-w-2xl mx-auto transform hover:-translate-y-1 transition-transform duration-300">
            <div className="relative rounded-lg overflow-hidden shadow-2xl bg-brand-surface-alt">
              <Image
                src="/assets/ngs-container-parachutes.png"
                alt="Contêiner NGS Transportes sendo içado por paraquedas"
                className="w-full h-auto object-contain"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent px-6 py-4">
                <div className="font-ibmmono text-xs md:text-sm tracking-wider uppercase text-white font-bold">
                  MALHA TERRESTRE NACIONAL · FROTA DEDICADA & URBANA
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mt-14 pt-10 border-t border-brand-border">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className={`flex flex-col items-center text-center ${stat.active ? "bg-white p-4 rounded-xl border border-brand-border shadow-sm" : ""}`}
              >
                <div className="w-12 h-12 rounded-full bg-brand-coral/10 text-brand-coral flex items-center justify-center text-lg mb-3">
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className={`text-3xl md:text-4xl font-extrabold text-brand-onyx font-sora ${stat.active ? "font-ibmmono font-bold tracking-tight" : ""}`}>
                  {stat.value}
                </div>
                <p className="text-xs text-brand-text-secondary uppercase tracking-wider font-semibold mt-1">{stat.label}</p>
                {stat.active && (
                  <div className="flex items-center gap-1.5 text-brand-coral text-xs font-bold mb-1 mt-2">
                    <span className="w-2 h-2 rounded-full bg-brand-coral animate-ping" />
                    ROTERIZAÇÃO ATIVA
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
