# POR-M1 — CI, dependências e CSP mais estreita

| Campo | Conteúdo |
|---|---|
| Mission ID | POR-M1 |
| Pista | A (repositório próprio) |
| Pré-requisitos | Auditoria inicial na `main` |
| Módulo | Infra / segurança do front |
| Contexto | Auditoria POR-02/03/05. `npm audit --omit=dev`: 6 (1 crítica `jspdf ^2.5.2`, 1 alta `source-map-js`, moderadas `dompurify`, `react-router`, `postcss-selector-parser`). Sem `.github/`. Hoje: 78 testes, lint e build verdes. CSP em `vercel.json` com `connect-src https://*.supabase.co` e `img-src 'self' data: blob: https:`. O PDF do comprovante sai de `src/lib/comprovante.js` (`jspdf`, import dinâmico). |
| Objetivo | Nada entra na `main` sem testes, lint, build e audit verdes; sem vulnerabilidade alta/crítica; CSP só com os hosts usados. |
| Escopo | 1. `.github/workflows/ci.yml`: `pull_request` + `push` na `main`; `npm ci` → `npm test` → `npm run lint` → `npm run build` → `npm audit --omit=dev --audit-level=high`. Concorrência por PR. 2. `jspdf` 2 → 4 e demais correções sem quebra. **Prova**: PDF do comprovante antes/depois comparado como imagem (use dados fictícios do teste), capturas em `docs/estado/relatorios/POR-M1/`. 3. CSP: `connect-src` só com `https://zarbeiiatrqqabaiqnab.supabase.co` e `https://challenges.cloudflare.com`; `img-src` só `'self' data: blob:` + os hosts de foto que a função `rastreio-publico` permite (veja `ngs_tracker_sup/supabase/functions/rastreio-publico/index.ts`, comentário da linha 38, e o campo `inline` do comprovante: se as fotos chegam como `data:`, `https:` genérico sai). Teste no `vite preview` com o cabeçalho e registre no relatório que o Turnstile e as fotos continuam carregando. 4. Relatório `docs/estado/relatorios/POR-M1.md`. |
| Fora do escopo | Mudanças de tela e textos (POR-M2). Função `rastreio-publico` (Tracker). |
| Decisões já tomadas (não pergunte) | Audit `--audit-level=high` bloqueia. Busca por CPF fica como está (DEC-POR-001). |
| Padrões a seguir | `ngs_tracker_sup/.github/workflows/ci.yml` (job `test`); MIS-003 do Tracker (troca do jspdf). Commits `ci: ...`, `chore(deps): ...`, `fix(seguranca): ...`. |
| Segredos | Nenhum. |
| Custo novo | Minutos do GitHub Actions. |
| Áreas autorizadas (glob) | `.github/workflows/**`, `package.json`, `package-lock.json`, `vercel.json`, `src/lib/comprovante.js`, `src/lib/comprovante.test.js`, `docs/estado/relatorios/POR-M1.md`, `docs/estado/relatorios/POR-M1/**`. Fora disso: pare e peça. |
| Banco | Nenhum. |
| Testes | `npm test`, `lint`, `build` verdes · audit sem alta/crítica · PDF sem diferença visível. |
| Checklist | [ ] CI · [ ] dependências · [ ] prova do PDF · [ ] CSP estreita testada · [ ] relatório no mesmo push · [ ] avisar se não puder abrir PR |
| Entrega | Branch + relatório no mesmo push; o Orquestrador abre o PR `[POR-M1]` se a sessão não puder. Resposta ao dono em até 5 linhas. |

Comando para o Executor:

> Do Orquestrador: você é o Executor. No repositório nicolaasst/public_ngs_transportes, branch `main`, leia `CLAUDE.md` e execute `docs/engenharia/esteira/missoes/POR-M1.md`. Áreas autorizadas apenas; fora delas, pare e peça. Nada em produção.
