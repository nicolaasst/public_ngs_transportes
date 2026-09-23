import { Star } from "lucide-react";
import { testimonials } from "@/data/localData";

export default function Testimonials() {
  return (
    <section className="py-24 bg-brand-onyx text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14"><div><span className="text-xs font-bold uppercase tracking-widest text-brand-coral font-ibmmono">// Depoimentos de Clientes</span><h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mt-2 text-white">A Escolha Certa Para<br /><span className="text-white/90">E-commerces e Varejistas</span></h2></div><div className="flex items-center gap-3 mt-6 md:mt-0"><span className="w-3 h-3 rounded-full bg-brand-coral" /><span className="w-3 h-3 rounded-full bg-neutral-700" /><span className="w-3 h-3 rounded-full bg-neutral-700" /></div></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{testimonials.map((t) => <div key={t.id} className="bg-white text-brand-onyx rounded-card p-8 flex flex-col justify-between shadow-xl"><div><div className="flex text-amber-400 gap-1 text-sm mb-4">{Array.from({ length: t.rating }, (_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}</div><p className="text-xs md:text-sm text-brand-text-primary leading-relaxed italic">“{t.quote}”</p></div><div className="flex items-center gap-3.5 mt-8 pt-4 border-t border-brand-border"><div className="w-11 h-11 rounded-full bg-brand-coral/10 text-brand-coral flex items-center justify-center font-bold text-sm border-2 border-brand-coral">{t.client_name.charAt(0)}</div><div><div className="text-sm font-bold text-brand-onyx">{t.client_name}</div><div className="text-[11px] text-brand-text-secondary">{t.client_role}</div></div></div></div>)}</div>
      </div>
    </section>
  );
}
