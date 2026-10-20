import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import PageShell from "@/components/layout/PageShell";
import PageHero from "@/components/layout/PageHero";
import FormRastreio from "@/components/tracking/FormRastreio";
import ResultadoRastreio from "@/components/tracking/ResultadoRastreio";
import { consultarRastreio, MENSAGEM_NAO_ENCONTRADO } from "@/lib/rastreio";
import { Card } from "@/components/rp/Card";
import { Icon } from "@/components/rp/Icon";
import { StatusPill } from "@/components/rp/StatusPill";
import { EmptyState } from "@/components/rp/EmptyState";
import { MASCOTES } from "@/lib/brandAssets";

const AVISOS = {
  limite: "Muitas consultas seguidas. Aguarde alguns minutos e tente novamente.",
  verificacao: "Não foi possível validar a verificação de segurança. Tente novamente.",
  indisponivel: "O rastreio está indisponível no momento. Tente novamente em instantes.",
  rede: "Não foi possível conectar. Verifique sua internet e tente novamente.",
  nao_configurado: "O rastreio online ainda não está habilitado neste ambiente. Fale com o nosso atendimento.",
};

const ETAPAS = [
  { status: "gray", rotulo: "Registrado", texto: "O pedido foi recebido e cadastrado pela NGS." },
  { status: "blue", rotulo: "Em movimento", texto: "Separação, coleta, trânsito ou saída para entrega." },
  { status: "amber", rotulo: "Atenção", texto: "Tentativa sem sucesso, retirada pendente ou devolução. O motivo aparece na linha do tempo." },
  { status: "green", rotulo: "Entregue", texto: "Entrega concluída. Quando há comprovação, o ícone da câmera abre o comprovante." },
  { status: "red", rotulo: "Cancelado", texto: "O pedido foi cancelado pela origem." },
];

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
    <PageShell titulo="Rastreamento">
      <PageHero eyebrow="Rastreamento" titulo="Rastreie sua encomenda" texto="Informe o código de rastreio recebido da NGS ou da loja que enviou o seu pedido." />
      <section className="section-y !pt-8 md:!pt-10">
        <div className="page-container max-w-[640px]">
          <Card className="!p-5 md:!p-6">
            <FormRastreio codigo={codigo} onCodigo={setCodigo} turnstileRef={turnstileRef} onEnviar={() => enviar()} carregando={consulta.estado === "carregando"} />
            <p className="mt-4 flex gap-2 text-body-sm text-muted-foreground">
              <Icon name="info" size={18} className="shrink-0" />
              <span>A consulta é feita somente pelo <strong className="text-foreground">código de rastreio</strong>. Número do pedido, NF-e e CPF/CNPJ não são aceitos.</span>
            </p>
          </Card>

          <div aria-live="polite">
            {consulta.estado === "nao_encontrado" && (
              <div role="alert" className="mt-6"><EmptyState illustration={MASCOTES.circleThinking} title="Código não encontrado" subtitle={MENSAGEM_NAO_ENCONTRADO} /></div>
            )}
            {aviso && (
              <p role="alert" className="mt-6 flex items-start gap-3 rounded-2xl bg-error-container p-4 text-body-md text-error-on-container">
                <Icon name="report_problem" size={22} className="shrink-0" />{aviso}
              </p>
            )}
            {consulta.estado === "ok" && <ResultadoRastreio dados={consulta.dados} onAtualizar={atualizar} atualizando={atualizando} />}
          </div>

          <section aria-labelledby="entenda" className="mt-12">
            <h2 id="entenda" className="text-headline-md">Entenda os status</h2>
            <ul className="mt-4 space-y-3">
              {ETAPAS.map((e) => (
                <li key={e.rotulo} className="card flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:gap-4">
                  <StatusPill status={e.status} className="self-start whitespace-nowrap sm:w-40 sm:justify-center">{e.rotulo}</StatusPill>
                  <p className="text-body-md text-muted-foreground">{e.texto}</p>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-center text-body-md text-muted-foreground">Não encontrou o seu pedido? <Link to="/contato" className="text-label-lg text-primary-deep underline underline-offset-4">Fale com a nossa equipe</Link>.</p>
          </section>
        </div>
      </section>
    </PageShell>
  );
}
