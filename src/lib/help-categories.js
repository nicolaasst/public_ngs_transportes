export const helpCategories = [
  {
    slug: "primeiros-passos-coletas",
    num: "01",
    icon: "warehouse",
    title: "Primeiros Passos & Coletas",
    desc: "Configuração de conta de embarcador, agendamento de coletas em doca e prazos de corte (cut-off).",
  },
  {
    slug: "fiscal-regulatorio",
    num: "02",
    icon: "description",
    title: "Fiscal & Regulatório",
    desc: "Emissão de CT-e, MDF-e, manifesto de carga, regras ANTT, RNTRC e tributação ICMS.",
  },
  {
    slug: "rastreamento-telemetria",
    num: "03",
    icon: "navigation",
    title: "Rastreamento & Telemetria",
    desc: "Acompanhamento em tempo real, status de pedidos, comprovação com foto/canhoto digital e alertas via WhatsApp.",
  },
  {
    slug: "faturamento-frete",
    num: "04",
    icon: "calculate",
    title: "Faturamento & Frete",
    desc: "Fechamento quinzenal de frete, cálculo de cubagem, tabela de frete corporativo e notas de débito.",
  },
  {
    slug: "seguro-sinistros",
    num: "05",
    icon: "verified_user",
    title: "Seguro & Sinistros",
    desc: "Cobertura de apólice RCTR-C e RCF-DC, procedimentos para avarias, extravios e abertura de sinistro GRIS.",
  },
  {
    slug: "integracao-de-apis-webhooks",
    num: "06",
    icon: "code",
    title: "Integração de APIs & Webhooks",
    desc: "Documentação técnica REST, autenticação OAuth2, endpoints de rastreamento e eventos síncronos.",
  },
];
export const getHelpCategory = (slug) =>
  helpCategories.find((c) => c.slug === slug);