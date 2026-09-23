import React from "react";
import { ArrowRight } from "lucide-react";
export default function CTABanner() {
  return (
    <section className="py-20 bg-brand-surface-alt">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="relative rounded-card overflow-hidden min-h-[380px] flex items-center justify-center text-center p-8 md:p-14 shadow-2xl">
          <img
            alt="Transporte rodoviário e galpão logístico moderno no Brasil"
            className="absolute inset-0 w-full h-full object-cover object-center"
            src="https://images.unsplash.com/photo-1494412651409-8963ce7935a7?w=1600&q=80"
          />
          <div className="absolute inset-0 bg-brand-onyx/85 backdrop-blur-[2px]" />
          <div className="relative z-10 max-w-2xl mx-auto text-white">
            <span className="inline-block text-xs uppercase tracking-widest text-brand-coral font-bold font-ibmmono mb-3">
              // Otimize a Logística do Seu Negócio
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
              Pronto Para Acelerar Suas Entregas?
            </h2>
            <p className="text-white/80 text-sm md:text-base leading-relaxed mb-8">
              Fale conosco hoje mesmo para um diagnóstico logístico gratuito, cotação expressa e desenho de rotas terrestres sob medida para o seu e-commerce.
            </p>
            <a
              href="mailto:comercial@ngstransportes.com.br"
              className="inline-flex items-center justify-center gap-2 bg-brand-coral hover:bg-brand-coral-hover text-white text-xs font-bold uppercase tracking-wider py-4 px-8 rounded-btn shadow-lg transition-transform active:scale-95"
            >
              <span>Fale com Nossos Especialistas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}