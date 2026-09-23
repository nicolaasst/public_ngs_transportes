import {
  Warehouse, FileText, Navigation, Calculator, ShieldCheck, Code,
} from "lucide-react";
export const helpCategories = [
  {
    slug: "primeiros-passos-coletas",
    num: "01",
    icon: Warehouse,
    title: "Primeiros Passos & Coletas",
    count: "12 artigos",
    desc: "Configuração de conta de embarcador, agendamento de coletas em doca e prazos de corte (cut-off).",
  },
  {
    slug: "fiscal-regulatorio",
    num: "02",
    icon: FileText,
    title: "Fiscal & Regulatório",
    count: "18 artigos",
    desc: "Emissão de CT-e, MDF-e, manifesto de carga, regras ANTT, RNTRC e tributação ICMS.",
  },
  {
    slug: "rastreamento-telemetria",
    num: "03",
    icon: Navigation,
    title: "Rastreamento & Telemetria",
    count: "15 artigos",
    desc: "Acompanhamento em tempo real, status de pedidos, comprovação com foto/canhoto digital e alertas via WhatsApp.",
  },
  {
    slug: "faturamento-frete",
    num: "04",
    icon: Calculator,
    title: "Faturamento & Frete",
    count: "9 artigos",
    desc: "Fechamento quinzenal de frete, cálculo de cubagem, tabela de frete corporativo e notas de débito.",
  },
  {
    slug: "seguro-sinistros",
    num: "05",
    icon: ShieldCheck,
    title: "Seguro & Sinistros",
    count: "8 artigos",
    desc: "Cobertura de apólice RCTR-C e RCF-DC, procedimentos para avarias, extravios e abertura de sinistro GRIS.",
  },
  {
    slug: "integracao-de-apis-webhooks",
    num: "06",
    icon: Code,
    title: "Integração de APIs & Webhooks",
    count: "16 artigos",
    desc: "Documentação técnica REST, autenticação OAuth2, endpoints de rastreamento e eventos síncronos.",
  },
];
export const getHelpCategory = (slug) =>
  helpCategories.find((c) => c.slug === slug);