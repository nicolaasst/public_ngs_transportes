import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Icon } from "@/components/rp/Icon";
import { Logo } from "@/components/rp/Logo";
import { Button } from "@/components/rp/Button";

export const LINKS = [
  { label: "Início", to: "/", fim: true },
  { label: "Serviços", to: "/servicos" },
  { label: "Rastreamento", to: "/rastreamento" },
  { label: "Quem somos", to: "/sobre" },
  { label: "Ajuda", to: "/ajuda" },
  { label: "Contato", to: "/contato" },
];

export default function Header() {
  const [aberto, setAberto] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setAberto(false), [pathname]);

  const item = ({ isActive }) =>
    `rp-tap rounded-full px-3.5 py-2 text-label-lg transition-colors ${isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"}`;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="page-container flex h-16 items-center justify-between gap-4 md:h-[72px]">
        <Link to="/" aria-label="NGS Transportes — página inicial" className="rp-tap flex items-center gap-3">
          <Logo variant="mark" size={40} />
          <span className="text-headline-sm leading-none">NGS <span className="font-medium text-muted-foreground">Transportes</span></span>
        </Link>
        <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => <NavLink key={l.to} to={l.to} end={l.fim} className={item}>{l.label}</NavLink>)}
        </nav>
        <div className="flex items-center gap-2">
          <Button to="/rastreamento" size="sm" className="hidden sm:inline-flex"><Icon name="travel_explore" size={18} />Rastrear</Button>
          <button type="button" onClick={() => setAberto((v) => !v)} aria-expanded={aberto} aria-controls="menu-movel" aria-label={aberto ? "Fechar menu" : "Abrir menu"} className="rp-tap flex h-11 w-11 items-center justify-center rounded-full bg-muted lg:hidden">
            <Icon name={aberto ? "close" : "menu"} size={24} />
          </button>
        </div>
      </div>
      {aberto && (
        <nav id="menu-movel" aria-label="Menu móvel" className="border-t border-border bg-background lg:hidden">
          <div className="page-container flex flex-col gap-1 py-3">
            {LINKS.map((l) => <NavLink key={l.to} to={l.to} end={l.fim} className={({ isActive }) => `rp-tap flex min-h-[48px] items-center rounded-2xl px-4 text-body-lg ${isActive ? "bg-accent text-accent-foreground" : ""}`}>{l.label}</NavLink>)}
            <Button to="/rastreamento" className="mt-2"><Icon name="travel_explore" size={20} />Rastrear encomenda</Button>
          </div>
        </nav>
      )}
    </header>
  );
}
