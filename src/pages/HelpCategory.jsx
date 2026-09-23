import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, FileText } from "lucide-react";
import { getHelpCategory } from "@/lib/help-categories";
import { getArticlesByCategory } from "@/data/localData";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function HelpCategory() {
  const { categoria } = useParams(); const category = getHelpCategory(categoria); const articles = getArticlesByCategory(categoria);
  return <div className="min-h-screen bg-white"><Header /><main className="pt-20"><section className="py-14 bg-brand-onyx text-white"><div className="max-w-[1000px] mx-auto px-6 lg:px-12"><Link to="/ajuda" className="inline-flex items-center gap-1 text-xs text-white/60 hover:text-white mb-6"><ArrowLeft className="w-3.5 h-3.5" /> Central de Ajuda</Link>{category ? <><span className="block font-ibmmono text-xs text-brand-coral uppercase font-semibold">// {category.num}</span><h1 className="text-3xl md:text-4xl font-extrabold mt-2">{category.title}</h1><p className="text-white/60 mt-3 max-w-2xl">{category.desc}</p></> : <h1 className="text-3xl font-extrabold">Categoria não encontrada</h1>}</div></section>{category && <section className="py-14"><div className="max-w-[1000px] mx-auto px-6 lg:px-12"><div className="space-y-3">{articles.length ? articles.map((article) => <Link key={article.id} to={`/ajuda/${categoria}/${article.slug}`} className="p-5 rounded-card border border-brand-border hover:shadow-card-soft flex items-start justify-between gap-4 group"><div className="flex gap-4"><FileText className="w-5 h-5 text-brand-coral mt-1" /><div><h2 className="text-base font-bold text-brand-onyx group-hover:text-brand-coral">{article.title}</h2><p className="text-sm text-brand-text-secondary mt-1">{article.excerpt}</p></div></div><ArrowRight className="w-4 h-4 text-brand-coral mt-1" /></Link>) : <p className="text-sm text-brand-text-secondary">Os artigos desta categoria serão publicados em breve.</p>}</div></div></section>}</main><Footer /></div>;
}
