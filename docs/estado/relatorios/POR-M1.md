# Relatório POR-M1 — CI, dependências e CSP

**Status: COMPLETO** (teste do Turnstile e das fotos em produção fica com o dono, após o merge). Nada em produção.

## Feito
1. **CI** — `.github/workflows/ci.yml`: `pull_request` + `push` na `main`; `npm ci` → `npm test` → `npm run lint` → `npm run build` → `npm audit --omit=dev --audit-level=high`; concorrência por PR (cancela execução anterior). Ainda não rodou no GitHub (só roda no primeiro PR).
2. **Dependências** — `jspdf ^2.5.2` → `^4.2.1` e `npm audit fix` (sem `--force`). `npm audit --omit=dev`: 6 → 2 (moderadas, ambas `react-router`/`react-router-dom`; a correção exige a v7, quebra de versão; fora do gate `high`). `--audit-level=high` sai com código 0. Os 78 testes, o lint e o build passam.
3. **Prova do PDF** — mesmo script, dados fictícios, foto fictícia, data fixa. Renderizado a 80 dpi: **0 pixels de diferença** (`compare -metric AE`).
   - `POR-M1/comprovante-antes-jspdf-2.5.2.png` / `comprovante-depois-jspdf-4.2.1.png` (e os `.pdf`).
   - Limite: a foto entrou por `carregar` simulado (o `<img>` real não roda em Node); o que se compara é o PDF gerado pelo jsPDF, que é o que mudou.
4. **CSP, `connect-src`** — `https://*.supabase.co` → `https://zarbeiiatrqqabaiqnab.supabase.co` (host de `VITE_RASTREIO_API_URL` em `.env.production`) + `https://challenges.cloudflare.com`. `vite preview` com o cabeçalho de `vercel.json` serve a página `/rastreamento` sem violação de CSP no console.

5. **CSP, `img-src`** (indicada pelo Orquestrador, a partir de `_shared/imagensPublicas.ts` do Tracker, que não pude ler): `'self' data: blob: https://pub-3a7866538b4d4558a3d95dffe3101bfe.r2.dev https://apponlog.com.br https://*.apponlog.com.br`. O `https:` genérico saiu. As fotos chegam como `data:` (campo `inline`) e, sem ele, pela URL desses hosts. `connect-src` e o restante da CSP não mudaram.

## Não verificado aqui
- **Turnstile e fotos carregando:** o proxy do sandbox bloqueia `challenges.cloudflare.com` e não consultei rastreio real. O dono testa em produção após o merge.
- Os hosts da `img-src` vieram da instrução do Orquestrador; não conferi o `imagensPublicas.ts`.
