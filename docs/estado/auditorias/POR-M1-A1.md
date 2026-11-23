# POR-M1 — Auditoria A1 — APROVADO

PR #18, cabeça `101194c`, squash `bd28a49`. CI `test` verde; produção Vercel OK.
- jspdf 4.2.1; PDF do comprovante 0 px de diferença. Restam 2 moderadas (react-router; correção exige v7).
- CSP: `connect-src` só o projeto Supabase + Turnstile; `img-src` só R2 exato e `apponlog.com.br` (mesma lista de `ngs_tracker_sup/supabase/functions/_shared/imagensPublicas.ts`).
- Verificado em produção pelo dono (16:27): consulta, comprovante com fotos e PDF OK; escape `RASTREIO_PUBLICO_ACAO_OPCIONAL` removido em seguida (POR-04 encerrado).
