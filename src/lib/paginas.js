// Descrição (meta description) por página: aparece nos buscadores e ao compartilhar o link.
export const DESCRICAO_PADRAO = "NGS Transportes: logística terrestre, entregas last mile, fulfillment e transporte rodoviário, com rastreamento por evento.";

const POR_ROTA = {
  "/": DESCRICAO_PADRAO,
  "/servicos": "Conheça os serviços da NGS Transportes: entregas last mile, cross-docking, fulfillment e transporte rodoviário.",
  "/rastreamento": "Rastreie sua encomenda da NGS Transportes pelo código de rastreio ou pelo CPF/CNPJ e veja cada etapa da entrega.",
  "/sobre": "Quem é a NGS Transportes: operação de logística terrestre que aproxima o seu negócio dos seus clientes.",
  "/carreiras": "Vagas abertas na NGS Transportes. Veja as oportunidades em operações, atendimento e tecnologia.",
  "/contato": "Fale com a NGS Transportes e peça uma cotação informando origem, destino e tipo de carga.",
  "/ajuda": "Central de ajuda da NGS Transportes: coletas, fiscal, rastreamento, faturamento e perguntas frequentes.",
  "/termos": "Condições gerais de contratação e transporte da NGS Transportes.",
  "/privacidade": "Como a NGS Transportes trata e protege os dados pessoais, conforme a LGPD.",
  "/blog": "Artigos da NGS Transportes sobre logística, entregas e operação.",
};

/** Descrição da página: a informada pela própria página, senão a da rota, senão a padrão. */
export function descricaoDaPagina(pathname, explicita) {
  if (explicita) return explicita;
  const caminho = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  if (POR_ROTA[caminho]) return POR_ROTA[caminho];
  if (caminho.startsWith("/ajuda/")) return POR_ROTA["/ajuda"];
  return DESCRICAO_PADRAO;
}
