import { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";

/** Casca de todas as páginas: cabeçalho, conteúdo e rodapé. `titulo` ajusta o <title> da aba. */
export default function PageShell({ titulo, children }) {
  useEffect(() => { if (titulo) document.title = `${titulo} | NGS Transportes`; }, [titulo]);
  return (
    <div className="app-shell flex flex-col">
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-primary focus:px-5 focus:py-3 focus:text-label-lg focus:text-primary-foreground">Ir para o conteúdo</a>
      <Header />
      <main id="conteudo" className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
