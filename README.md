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

- Consulta: código do pedido (código de rastreio, nº do pedido, CK ou NF) + confirmação (CPF/CNPJ do destinatário ou 4 últimos dígitos do telefone). O fator vai no corpo do `POST`, nunca na URL.
- Resposta: situação atual, destino (cidade/UF), previsão, eventos (do mais recente ao mais antigo) e, em rota, um círculo de localização aproximada. Nada de motorista, valores, documentos ou coordenadas exatas.
- O visitante pode tocar em **Atualizar**; em pedidos em rota a página reconsulta sozinha a cada 90 s com a aba visível.

### Variáveis de ambiente (Vercel)

| Variável | Obrigatória | Descrição |
|---|---|---|
| `VITE_RASTREIO_API_URL` | sim | `https://<projeto-do-tracker>.supabase.co/functions/v1/rastreio-publico` |
| `VITE_MAPBOX_PUBLIC_TOKEN` | não | token **público** (`pk.…`) do Mapbox; sem ele o mapa usa o OpenStreetMap |

Nunca coloque `service_role`, tokens privados ou segredos em variáveis `VITE_*` (elas vão para o navegador). Passo a passo de implantação da function e da migration: `docs/rastreio-publico.md` no repositório do Tracker.

## Scripts

- `npm run dev`: servidor de desenvolvimento
- `npm run build`: build de produção
- `npm run lint`: validação do ESLint
- `npm run test`: testes (Vitest)
- `npm run typecheck`: verificação de tipos/configuração
