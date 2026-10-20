# Ngs Transportes Web

Aplicação web independente para apresentação institucional, serviços, rastreamento, central de ajuda, blog e carreiras da Ngs Transportes.

## Desenvolvimento

```bash
npm install
npm run dev
```

Conteúdos institucionais, FAQs, vagas, depoimentos e artigos de ajuda ficam versionados em `src/data/localData.js`. O formulário de cotação prepara uma mensagem no cliente de e-mail padrão do visitante.

## Rastreamento (fonte de dados: NGS Tracker)

O portal **não tem banco de dados nem chaves privadas**. A página de rastreio chama a Edge Function pública `rastreio-publico` do **projeto Supabase do NGS Tracker** (`supabase/functions/rastreio-publico` no repositório `ngs_tracker_sup`), que lê ao vivo os pedidos, o histórico e o rastreio da transportadora do Tracker — a única fonte de verdade. Não existe fallback para outra infraestrutura: sem a URL configurada, o portal avisa que o rastreio está indisponível.

- Consulta: **somente o código de rastreio** (sem confirmação de CPF/telefone e sem mapa). O código vai no corpo do `POST`, nunca na URL. Nº do pedido, CK e NF-e não são aceitos.
- Resposta: situação atual, destino (cidade/UF), previsão e eventos (do mais recente ao mais antigo). Nada de motorista, valores, documentos, endereço ou localização.
- O visitante pode tocar em **Atualizar**; em pedidos em rota a página reconsulta sozinha a cada 90 s com a aba visível.

### Variáveis de ambiente (Vercel)

| Variável | Obrigatória | Descrição |
|---|---|---|
| `VITE_RASTREIO_API_URL` | sim | `https://<projeto-do-tracker>.supabase.co/functions/v1/rastreio-publico` (já definida em `.env.production`, versionado: é uma URL pública) |

Nunca coloque `service_role`, tokens privados ou segredos em variáveis `VITE_*` (elas vão para o navegador). Passo a passo de implantação da function e da migration: `docs/rastreio-publico.md` no repositório do Tracker.

## Scripts

- `npm run dev`: servidor de desenvolvimento
- `npm run build`: build de produção
- `npm run lint`: validação do ESLint
- `npm run test`: testes (Vitest)
- `npm run typecheck`: verificação de tipos/configuração
