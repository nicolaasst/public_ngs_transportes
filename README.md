# Ngs Transportes Web

Aplicação web independente para apresentação institucional, serviços, rastreamento, central de ajuda, blog e carreiras da Ngs Transportes.

## Desenvolvimento

Instale as dependências e inicie o servidor Vite:

```bash
npm install
npm run dev
```

A aplicação não depende de plataforma de backend, SDK proprietário ou variáveis de ambiente obrigatórias. Conteúdos institucionais, FAQs, vagas, depoimentos e artigos de ajuda ficam versionados em `src/data/localData.js`. O formulário de cotação prepara uma mensagem no cliente de e-mail padrão do visitante.

## Scripts

- `npm run dev`: servidor de desenvolvimento
- `npm run build`: build de produção
- `npm run lint`: validação do ESLint
- `npm run typecheck`: verificação de tipos/configuração
