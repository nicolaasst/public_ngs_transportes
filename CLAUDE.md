# Site público NGS Transportes — instruções para as sessões

Site institucional + rastreio público. React 18 + Vite na Vercel. **Sem banco e sem chave**: o rastreio chama a Edge Function `rastreio-publico` do NGS Tracker (`nicolaasst/ngs_tracker_sup`), com anti-robô Cloudflare Turnstile (ação `rastreio`).
Leia também `AGENTS.md`.

## Como trabalhamos (esteira)
Protocolo do NGS Tracker: `nicolaasst/ngs_tracker_sup` → `docs/engenharia/esteira/01-protocolo.md`.
- Estado: `docs/estado/ESTADO.md`. Missões: `docs/engenharia/esteira/missoes/`.
- Branch `mis/<ID>` (ou `claude/...`); commits convencionais; sem force-push; relatório `docs/estado/relatorios/<ID>.md` no mesmo push do código.
- **Merge na `main` publica em produção (Vercel).**
- Proibido: segredo no chat, no código ou em log; consultar rastreio real com código ou CPF de cliente.

## Comandos
```
npm ci · npm test · npm run lint · npm run build
```
