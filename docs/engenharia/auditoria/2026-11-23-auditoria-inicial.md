# Auditoria inicial — site público NGS Transportes (rastreio)

Data: 23/11/2026 · Autor: Orquestrador (sessão da esteira do NGS Tracker) · Commit auditado: `c267528`

Escopo: segurança do front, dependências, testes, CI, integração com a função `rastreio-publico` do Tracker.
Usabilidade no celular e visual ficam para a missão POR-M2 (precisa de capturas de tela em vários tamanhos).

## Evidências coletadas

| Verificação | Resultado |
|---|---|
| `npm ci` + `vitest run` | 7 arquivos, **78 testes verdes** |
| `npm run lint` | verde |
| `npm run build` | verde (1,4 s) |
| `npm audit --omit=dev` | **6 vulnerabilidades: 1 crítica, 1 alta, 4 moderadas** (jspdf 2.x, dompurify, react-router, source-map-js, postcss-selector-parser) |
| CI no GitHub | **não existe** (`.github/` ausente) |
| Cabeçalhos (`vercel.json`) | HSTS, nosniff, X-Frame-Options DENY, Referrer-Policy, Permissions-Policy, CSP com `frame-ancestors 'none'`, `object-src 'none'`. Bom. |
| Turnstile | O site manda `action: "rastreio"` (`src/lib/turnstile.js`). O token vai no corpo do POST, nunca na URL. `credentials: "omit"`. |
| Dados no navegador | Sem banco, sem chave guardada. Só a URL da função e a site key pública do Turnstile. |
| HTML perigoso | Nenhum `dangerouslySetInnerHTML`/`innerHTML`/`eval` em `src/` |

## Achados

| ID | Severidade | Achado | Encaminhamento |
|---|---|---|---|
| POR-01 | **P1 (decisão do dono)** | A consulta por **CPF/CNPJ** devolve até 20 pedidos com o **comprovante** (nome de quem recebeu e fotos da entrega). CPF circula vazado em massa: quem tem o CPF de alguém vê as entregas e as fotos dessa pessoa. Por código de rastreio o risco é bem menor (o código só chega a quem recebeu o aviso). | Mudança na função `rastreio-publico` (repositório do Tracker). Opções: (a) no modo CPF/CNPJ, devolver só status/cidade/previsão, **sem comprovante**; (b) exigir código + CPF; (c) tirar o modo CPF. Recomendação: (a). |
| POR-02 | P1 | `npm audit`: 1 crítica (jspdf 2.x), 1 alta. O Tracker já migrou para jspdf 4 (MIS-003). | POR-M1 |
| POR-03 | P2 | Sem CI: testes, lint, build e audit não rodam no PR; o merge na `main` publica direto. | POR-M1 |
| POR-04 | P2 | O site já manda a ação `rastreio`. O escape `RASTREIO_PUBLICO_ACAO_OPCIONAL=true` do Tracker pode sair depois do teste em produção. | Ação do dono (1 comando) |
| POR-05 | P3 | CSP larga: `connect-src https://*.supabase.co` (qualquer projeto Supabase) e `img-src https:` (qualquer host). | POR-M1: fixar o host do projeto e o host público do R2 |
| POR-06 | P3 | Domínio: `robots.txt`/`sitemap.xml` apontam para `portal.onlogsantanadeparnaiba.com.br`; contato usa `ngstransportes.com.br`. Confirmar o domínio oficial. | Pergunta ao dono |
| POR-07 | — | Usabilidade no celular e visual ainda não auditados. | POR-M2 |

## Missões propostas

| Missão | Pista | Conteúdo |
|---|---|---|
| POR-M1 | A | CI (vitest, lint, build, audit bloqueante); dependências (jspdf 4 e demais); CSP mais estreita |
| POR-M2 | B | Usabilidade e visual: capturas 360/390/768/1280 px das telas de rastreio, comprovante e páginas institucionais; correções de toque, contraste, foco e textos |
| TRK (no Tracker) | — | POR-01, depois da decisão do dono |
