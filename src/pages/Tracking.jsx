import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MapPin, Navigation, FileText } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FormRastreio from "@/components/tracking/FormRastreio";
import ResultadoRastreio from "@/components/tracking/ResultadoRastreio";
import { consultarRastreio, MENSAGEM_NAO_ENCONTRADO } from "@/lib/rastreio";

const AVISOS = {
  nao_encontrado: MENSAGEM_NAO_ENCONTRADO,
  limite: "Muitas consultas seguidas. Aguarde alguns minutos e tente novamente.",
  verificacao: "Não foi possível validar a verificação de segurança. Tente novamente.",
  indisponivel: "O rastreio está indisponível no momento. Tente novamente em instantes.",
  rede: "Não foi possível conectar. Verifique sua internet e tente novamente.",
  nao_configurado: "O rastreio online ainda não está habilitado neste ambiente. Fale com o nosso atendimento.",
};

export default function Tracking() {
  const location = useLocation();
  // `?codigo=` vem do link de "Compartilhar rastreio"; o state vem do formulário da home (com o token do Turnstile)
  const codigoDoLink = new URLSearchParams(location.search).get("codigo")?.trim() || "";
  const inicial = location.state ?? (codigoDoLink ? { codigo: codigoDoLink } : {});
  const [codigo, setCodigo] = useState(inicial.codigo ?? "");
  const [consulta, setConsulta] = useState(/** @type {{ estado: string, dados?: any }} */ ({ estado: "ocioso" }));
  const jaConsultou = useRef(false);
  const turnstileRef = useRef(null);
  // última consulta feita (para "Atualizar" e para a atualização automática, sem reler o que o visitante digitou depois)
  const ultima = useRef(/** @type {{ codigo: string } | null} */ (null));
  const [atualizando, setAtualizando] = useState(false);

  // página de resultado fora dos buscadores
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  // Cada consulta usa um token NOVO do Turnstile (o servidor recusa reaproveitado); `tokenPronto` é o que veio da home.
  const consultarComToken = async (c, tokenPronto) => {
    let turnstileToken = tokenPronto;
    if (!turnstileToken) {
      try { turnstileToken = await turnstileRef.current.obterToken(); } catch { return { estado: "verificacao" }; }
    }
    const r = await consultarRastreio({ codigo: c, turnstileToken });
    // token vindo da home já usado/expirado (ex.: voltar no histórico): tenta uma vez com um token novo
    if (r.estado === "verificacao" && tokenPronto) return consultarComToken(c, undefined);
    return r;
  };

  const enviar = async (c = codigo, tokenPronto) => {
    ultima.current = { codigo: c };
    setConsulta({ estado: "carregando" });
    setConsulta(await consultarComToken(c, tokenPronto));
  };

  // Atualiza o resultado já exibido sem piscar a tela; se a nova consulta falhar, mantém o último resultado bom.
  const atualizar = async () => {
    if (!ultima.current || atualizando) return;
    setAtualizando(true);
    const nova = await consultarComToken(ultima.current.codigo);
    setAtualizando(false);
    if (nova.estado === "ok" || nova.estado === "nao_encontrado") setConsulta(nova);
  };

  // Pedido em rota: reconsulta sozinho a cada 90 s enquanto a aba estiver visível.
  const emRota = consulta.estado === "ok" && consulta.dados?.em_rota === true;
  const atualizarRef = useRef(atualizar);
  atualizarRef.current = atualizar;
  useEffect(() => {
    if (!emRota) return undefined;
    const id = setInterval(() => { if (document.visibilityState === "visible") atualizarRef.current(); }, 90_000);
    return () => clearInterval(id);
  }, [emRota]);

  // vindo do formulário da home (o código chega por state de rota, nunca pela URL)
  useEffect(() => {
    if (jaConsultou.current || !inicial.codigo) return;
    jaConsultou.current = true;
    enviar(inicial.codigo, inicial.turnstileToken);
  }, []);

  const aviso = AVISOS[consulta.estado];
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-20">
        <section className="py-20 bg-brand-onyx text-white">
          <div className="max-w-[900px] mx-auto px-6">
            <div className="text-center">
              <span className="font-ibmmono text-xs text-brand-coral uppercase font-semibold">// Visibilidade operacional</span>
              <h1 className="text-3xl md:text-5xl font-extrabold mt-2">Rastreie sua remessa</h1>
              <p className="text-white/60 mt-4">Informe o código de rastreio da sua remessa.</p>
            </div>
            <div className="mt-8 max-w-xl mx-auto bg-white text-brand-onyx rounded-card p-5">
              <FormRastreio codigo={codigo} onCodigo={setCodigo} turnstileRef={turnstileRef} onEnviar={() => enviar()} carregando={consulta.estado === "carregando"} />
            </div>
            <div className="max-w-xl mx-auto" aria-live="polite">
              {aviso && <p role="alert" className="mt-6 p-4 bg-white/10 border border-white/10 rounded-card text-sm">{aviso}</p>}
              {consulta.estado === "ok" && <ResultadoRastreio dados={consulta.dados} onAtualizar={atualizar} atualizando={atualizando} />}
            </div>
          </div>
        </section>
        <section className="py-16">
          <div className="max-w-[1100px] mx-auto px-6">
            <h2 className="text-2xl md:text-3xl font-extrabold text-brand-onyx text-center mb-10">Acompanhe cada etapa da sua operação</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[{ icon: Navigation, title: "Atualizações de rota", desc: "Informações claras para acompanhar o deslocamento da carga." }, { icon: FileText, title: "Documentação digital", desc: "Dados operacionais organizados para reduzir retrabalho." }, { icon: MapPin, title: "Cobertura nacional", desc: "Suporte para rotas urbanas, regionais e interestaduais." }].map((item) => (
                <div key={item.title} className="p-6 rounded-card bg-brand-surface-alt border border-brand-border">
                  <item.icon className="w-7 h-7 text-brand-coral mb-4" aria-hidden="true" />
                  <h3 className="font-bold text-brand-onyx">{item.title}</h3>
                  <p className="text-sm text-brand-text-secondary mt-2">{item.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-brand-text-secondary mt-10">Precisa de ajuda? <Link to="/contato" className="text-brand-coral font-semibold">Fale com a nossa equipe.</Link></p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
