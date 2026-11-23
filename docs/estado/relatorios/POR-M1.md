# Relatório POR-M1 — CI, dependências e CSP

**Status: PARCIAL.** Itens 1 e 2 prontos; item 3 (CSP) só em parte; falta `img-src`. Nada em produção.

## Feito
1. **CI** — `.github/workflows/ci.yml`: `pull_request` + `push` na `main`; `npm ci` → `npm test` → `npm run lint` → `npm run build` → `npm audit --omit=dev --audit-level=high`; concorrência por PR (cancela execução anterior). Ainda não rodou no GitHub (só roda no primeiro PR).
2. **Dependências** — `jspdf ^2.5.2` → `^4.2.1` e `npm audit fix` (sem `--force`). `npm audit --omit=dev`: 6 → 2 (moderadas, ambas `react-router`/`react-router-dom`; a correção exige a v7, quebra de versão; fora do gate `high`). `--audit-level=high` sai com código 0. Os 78 testes, o lint e o build passam.
3. **Prova do PDF** — mesmo script, dados fictícios, foto fictícia, data fixa. Renderizado a 80 dpi: **0 pixels de diferença** (`compare -metric AE`).
   - `POR-M1/comprovante-antes-jspdf-2.5.2.png` / `comprovante-depois-jspdf-4.2.1.png` (e os `.pdf`).
   - Limite: a foto entrou por `carregar` simulado (o `<img>` real não roda em Node); o que se compara é o PDF gerado pelo jsPDF, que é o que mudou.
4. **CSP, `connect-src`** — `https://*.supabase.co` → `https://zarbeiiatrqqabaiqnab.supabase.co` (host de `VITE_RASTREIO_API_URL` em `.env.production`) + `https://challenges.cloudflare.com`. `vite preview` com o cabeçalho de `vercel.json` serve a página `/rastreamento` sem violação de CSP no console.

## Não feito / não verificado
- **`img-src`: mantido `https:`.** A missão pede os hosts de foto da `rastreio-publico` (`ngs_tracker_sup`). O acesso a esse repositório foi negado nesta sessão, e não adivinhei hosts (um chute errado quebraria as fotos do comprovante em produção). `ComprovanteModal.jsx` usa `f.inline || f.url`; só dá para tirar o `https:` genérico se as fotos chegarem sempre como `data:` ou com host fixo. **Preciso do host (ou do trecho do `index.ts`, linha 38 e campo `inline`).**
- **Turnstile e fotos "continuam carregando": não confirmado.** O proxy do sandbox bloqueia `challenges.cloudflare.com` (`ERR_TUNNEL_CONNECTION_FAILED`, falha de rede, não de CSP), e não consultei rastreio real. Conferir no deploy de preview da Vercel.
