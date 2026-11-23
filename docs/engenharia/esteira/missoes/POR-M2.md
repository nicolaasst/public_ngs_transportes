# POR-M2 — Usabilidade no celular, acessibilidade e visual

| Campo | Conteúdo |
|---|---|
| Mission ID | POR-M2 |
| Pista | A (repositório próprio) |
| Pré-requisitos | POR-M1 integrada (`bd28a49`) |
| Módulo | Front (todas as páginas; foco em `/rastreamento`) |
| Contexto | O cliente final consulta quase sempre pelo celular, vindo de um link de WhatsApp/SMS. Rotas: `/`, `/servicos`, `/rastreamento`, `/sobre`, `/carreiras`, `/contato`, `/ajuda` (+ categoria/artigo), `/termos`, `/privacidade`, `/blog`, 404. Rastreio: `src/pages/Tracking.jsx`, `src/components/tracking/*` (abas código/CPF-CNPJ, vários códigos, lista colapsada, linha do tempo, comprovante em modal, PDF). Design system próprio em `src/components/rp/*` (modo claro, amarelo `#FFD80F`). Regra da casa: sem travessão nos textos (`semTravessao`). |
| Objetivo | O rastreio funciona bem com uma mão, em tela pequena e conexão lenta; nenhuma página tem problema grave de acessibilidade; visual consistente entre páginas. |
| Escopo | 1. **Levantamento com evidência:** capturas de todas as rotas em 360, 390, 768 e 1280 px (Playwright, `vite preview`, API do rastreio **mockada** com dados fictícios: em trânsito, entregue com 2 fotos, não encontrado, limite 429, erro de rede, vários códigos com 1 não encontrado, CPF com 20+ pedidos truncado). Salve em `docs/estado/relatorios/POR-M2/antes/`. 2. **Auditoria automática:** axe-core em cada rota e em cada estado do rastreio; Lighthouse mobile (performance, acessibilidade, boas práticas, SEO) de `/` e `/rastreamento`. Números antes/depois no relatório. 3. **Correções** (lista no relatório, cada uma com a captura antes/depois): alvos de toque ≥ 44 px; campo de código com `inputmode`/`autocapitalize`/`autocomplete` certos e teclado adequado; código vindo do link (`?codigo=`) já preenchido, se o fluxo atual permitir; mensagens de erro claras e com ação (tentar de novo, conferir o código); foco visível e ordem de tabulação; contraste AA (atenção ao amarelo sobre branco); `aria-live` no resultado; modal do comprovante fechável por Esc/fora e com foco preso; imagens com `alt`, `width/height` e `loading="lazy"`; nada de rolagem horizontal em 360 px; títulos (`<title>`) e descrição por página. 4. Sem mudar regra de negócio, textos jurídicos (termos/privacidade) nem a API. 5. Testes (vitest + Testing Library) para os estados do rastreio que mudarem. 6. Capturas depois em `docs/estado/relatorios/POR-M2/depois/` e lado a lado das 6 mais importantes. |
| Fora do escopo | Nova identidade visual, novas páginas, CMS/blog real, mudança na função `rastreio-publico`, CSP (POR-M1). |
| Decisões já tomadas (não pergunte) | Modo claro só. Sem travessão. Busca por CPF fica (DEC-POR-001). Nenhuma biblioteca nova de UI; axe/Playwright/Lighthouse só como `devDependencies` ou fora do repositório. |
| Padrões a seguir | Componentes `src/components/rp/*`; testes existentes `src/pages/Tracking.test.jsx`. Commits `fix(a11y): ...`, `fix(ux): ...`, `test: ...`. |
| Segredos | Nenhum. Não consultar rastreio real. |
| Custo novo | Nenhum. |
| Áreas autorizadas (glob) | `src/**`, `index.html`, `public/manifest.json`, `package.json`/`package-lock.json` (só devDependencies), `docs/estado/relatorios/POR-M2.md`, `docs/estado/relatorios/POR-M2/**`. Fora disso (inclusive `vercel.json` e `.github/`): pare e peça. |
| Banco | Nenhum. |
| Testes | `npm test`, `lint`, `build` verdes; axe sem violação `serious`/`critical`; Lighthouse acessibilidade mobile ≥ 95 em `/rastreamento`. |
| Checklist | [ ] capturas antes · [ ] axe + Lighthouse antes · [ ] correções · [ ] testes · [ ] capturas depois e lado a lado · [ ] números depois · [ ] relatório no mesmo push |
| Entrega | Branch + relatório no mesmo push; o Orquestrador abre o PR `[POR-M2]` e **olha as capturas** antes do merge. Resposta ao dono em até 5 linhas. |

Comando para o Executor:

> Do Orquestrador: você é o Executor. No repositório nicolaasst/public_ngs_transportes, branch `main`, leia `CLAUDE.md` e execute `docs/engenharia/esteira/missoes/POR-M2.md`. Áreas autorizadas apenas; fora delas, pare e peça. Nada em produção.
