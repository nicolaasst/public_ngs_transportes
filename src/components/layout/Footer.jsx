import { Link } from "react-router-dom";
import { Logo } from "@/components/rp/Logo";
import { Icon } from "@/components/rp/Icon";

const colunas = [
  { titulo: "Serviços", links: [["Entregas last mile", "/servicos"], ["Rastreamento", "/rastreamento"], ["Solicitar cotação", "/contato"]] },
  { titulo: "Empresa", links: [["Quem somos", "/sobre"], ["Carreiras", "/carreiras"], ["Blog", "/blog"]] },
  { titulo: "Ajuda e legal", links: [["Central de ajuda", "/ajuda"], ["Privacidade", "/privacidade"], ["Termos", "/termos"]] },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card text-foreground">
      <div className="page-container py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-center gap-3">
              <Logo variant="mark" size={44} />
              <span className="text-headline-sm">NGS Transportes</span>
            </div>
            <p className="mt-4 max-w-xs text-body-md text-muted-foreground">Logística terrestre, entregas last mile e distribuição rodoviária.</p>
            <a href="mailto:comercial@ngstransportes.com.br" className="rp-tap mt-5 inline-flex min-h-[44px] items-center gap-2 text-label-lg text-primary-deep">
              <Icon name="mail" size={20} />comercial@ngstransportes.com.br
            </a>
          </div>
          {colunas.map((c) => (
            <nav key={c.titulo} aria-label={c.titulo}>
              <h2 className="text-label-sm uppercase text-muted-foreground">{c.titulo}</h2>
              <ul className="mt-3 space-y-1">
                {c.links.map(([rotulo, to]) => (
                  <li key={rotulo}><Link to={to} className="rp-tap inline-flex min-h-[40px] items-center text-body-md hover:text-primary-deep">{rotulo}</Link></li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <p className="mt-12 border-t border-border pt-6 text-body-sm text-muted-foreground">© {new Date().getFullYear()} NGS Transportes. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
