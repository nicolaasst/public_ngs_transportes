export const testimonials = [
  {
    id: "testimonial-1",
    quote: "A operação ganhou previsibilidade e o nosso time passou a acompanhar cada etapa da entrega em um único fluxo.",
    client_name: "Mariana Costa",
    client_role: "Head de Operações, Varejo Sul",
    rating: 5,
  },
  {
    id: "testimonial-2",
    quote: "A combinação de cobertura nacional e atendimento próximo fez diferença para a expansão da nossa malha.",
    client_name: "Rafael Mendes",
    client_role: "Diretor de Supply Chain, Nova Casa",
    rating: 5,
  },
  {
    id: "testimonial-3",
    quote: "Reduzimos retrabalho na expedição e passamos a tomar decisões com dados operacionais confiáveis.",
    client_name: "Camila Nogueira",
    client_role: "Gerente de Logística, Grupo Horizonte",
    rating: 5,
  },
];

export const faqs = [
  { id: "faq-1", question: "Quais regiões a Ngs Transportes atende?", answer: "Atendemos operações em todo o território nacional, com soluções de carga fracionada, lotação e last mile." },
  { id: "faq-2", question: "É possível acompanhar a entrega em tempo real?", answer: "Sim. A operação conta com rastreamento por evento, atualizações de status e comprovação digital de entrega." },
  { id: "faq-3", question: "Como solicito uma cotação?", answer: "Preencha o formulário de cotação ou fale com nosso time comercial pelo e-mail comercial@ngstransportes.com.br." },
  { id: "faq-4", question: "Vocês trabalham com cargas especiais?", answer: "Analisamos requisitos de acondicionamento, seguro, janela de entrega e restrições de rota para cada operação." },
];

export const jobs = [
  { id: "job-1", title: "Analista de Operações Logísticas", department: "Operações", location: "São Paulo, SP", type: "Híbrido", level: "Pleno" },
  { id: "job-2", title: "Especialista de Atendimento ao Cliente", department: "Customer Success", location: "São Paulo, SP", type: "Híbrido", level: "Pleno" },
  { id: "job-3", title: "Desenvolvedor Front-end", department: "Tecnologia", location: "Remoto", type: "Remoto", level: "Sênior" },
];

export const posts = [
  {
    id: "post-1",
    featured: true,
    category: "Gestão",
    date: "23/09/2026",
    read_time: "5 min de leitura",
    title: "Como construir uma operação logística mais previsível",
    excerpt: "Indicadores, processos e comunicação são os pilares para transformar complexidade operacional em decisões mais rápidas.",
    author: "Ngs Transportes",
  },
  {
    id: "post-2",
    category: "Tecnologia",
    date: "18/09/2026",
    read_time: "4 min de leitura",
    title: "Rastreamento por eventos: do embarque à entrega",
    excerpt: "Entenda como eventos operacionais ajudam embarcadores a agir antes que um desvio vire um problema.",
    author: "Ngs Transportes",
  },
  {
    id: "post-3",
    category: "Fiscal",
    date: "11/09/2026",
    read_time: "6 min de leitura",
    title: "CT-e e MDF-e: um guia para a rotina do embarcador",
    excerpt: "Uma visão prática sobre os documentos fiscais mais presentes no transporte rodoviário de cargas.",
    author: "Ngs Transportes",
  },
];

export const helpArticles = [
  { id: "article-1", category: "primeiros-passos-coletas", slug: "agendamento-de-coleta", title: "Como agendar uma coleta", read_time: "4 min de leitura", excerpt: "Veja as informações necessárias para programar uma coleta com agilidade.", content: "Para solicitar uma coleta, informe origem, destino, janela desejada, tipo de carga e dados de contato.\n\nNossa equipe confirma a disponibilidade da rota, orienta sobre a documentação e compartilha o próximo passo da operação." },
  { id: "article-2", category: "fiscal-regulatorio", slug: "documentos-do-transporte", title: "Documentos essenciais do transporte", read_time: "6 min de leitura", excerpt: "Conheça os principais documentos que acompanham a carga.", content: "A operação pode envolver NF-e, CT-e, MDF-e e DACTE, conforme o perfil da carga e da viagem.\n\nMantenha os dados do embarque consistentes entre os documentos para reduzir paradas e retrabalho." },
  { id: "article-3", category: "rastreamento-telemetria", slug: "acompanhar-entrega", title: "Como acompanhar uma entrega", read_time: "3 min de leitura", excerpt: "Entenda os principais status e eventos de uma entrega.", content: "O acompanhamento começa com a coleta e segue por etapas como em trânsito, chegada à base, em rota de entrega e entregue.\n\nEm caso de exceção, o time operacional registra o evento e informa a ação recomendada." },
  { id: "article-4", category: "integracao-de-apis-webhooks", slug: "integracao-operacional", title: "Boas práticas para integrações", read_time: "5 min de leitura", excerpt: "Princípios para integrar dados logísticos com segurança e consistência.", content: "Defina identificadores únicos, valide campos obrigatórios e trate reprocessamentos de forma idempotente.\n\nAntes de colocar uma integração em produção, teste cenários de sucesso, atraso, cancelamento e reentrega." },
];

export const getArticlesByCategory = (category) => helpArticles.filter((article) => article.category === category);
export const getArticle = (category, slug) => helpArticles.find((article) => article.category === category && article.slug === slug);
