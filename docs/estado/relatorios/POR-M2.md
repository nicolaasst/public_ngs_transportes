# Relatório POR-M2: usabilidade no celular, acessibilidade e visual

**Status: COMPLETO** (veja "Limites" no fim). Nada em produção; API do rastreio e Turnstile **mockados**, dados fictícios, nenhum rastreio real consultado.

## Método
`vite build` com API/Turnstile fictícios + `vite preview`; Playwright (Chromium) com a API interceptada. Estados do rastreio: vazio, link `?codigo=`, em trânsito, entregue com 2 fotos (modal aberto), não encontrado, limite 429, erro de rede, vários códigos com 1 não encontrado, CPF com 20 pedidos truncado. Todas as 13 rotas (inclui categoria e artigo de ajuda inexistentes e 404) e os 9 estados em 360, 390, 768 e 1280 px. Scripts ficaram fora do repositório. axe-core entra como `devDependency`; Lighthouse 13 rodou fora do repositório.

- Ficam no repositório só `POR-M2/lado-a-lado/` (6 imagens, 390 px, antes à esquerda) e `POR-M2/lighthouse-resumo.txt`. **As capturas completas (todas as rotas e estados, 4 larguras, antes e depois, 182 imagens, 43 MB) e os JSON do axe ficaram fora do repositório por tamanho**; os números do axe e do Lighthouse estão na tabela abaixo.

## Números
| Medida | Antes | Depois |
|---|---|---|
| axe (WCAG 2.2 A/AA + boas práticas), todas as rotas e estados, 390 px | 0 serious/critical; 3 achados menores/moderados (logo com alt redundante em 21 telas; sem `<h1>` em 2 páginas de erro; ordem de títulos em /termos) | **0 violações** |
| Lighthouse mobile `/rastreamento` (perf/acess./boas práticas/SEO) | 100 / 100 / 96 / 66 | 100 / 100 / 96 / 63 |
| Lighthouse mobile `/` | 73 / 100 / 96 / 100 (LCP 11,3 s, TBT 180 ms) | 75 / 100 / 96 / 100 (LCP 10,1 s, TBT 70 ms) |
| Rolagem horizontal em 360 px | 2 px na home | 0 |
| Alvos de toque < 44 px de altura (links/botões) | cabeçalho (logo), rodapé (40 px), botões `sm` (40 px), fechar do modal (16 px) | nenhum (resta o link "Blog" do rodapé com 31 px de largura e 44 de altura) |

Lighthouse acessibilidade em `/rastreamento` já era 100 (meta ≥ 95 atendida antes e depois). SEO do rastreio fica baixo por escolha: a página tem `noindex` (resultado fora dos buscadores), e `is-crawlable` é o único item reprovado; a variação 66→63 é só o peso dos itens. Os erros de console do Lighthouse não aparecem na lista (0).

## Correções (as principais têm captura antes/depois em `lado-a-lado/`)
1. **Erros com ação** (`Tracking.jsx`): falha de rede, indisponível e verificação ganham "Tentar novamente"; "Código/Nenhum pedido encontrado" ganha "Conferir o código" (foca o campo). Limite 429 só pede para aguardar, sem repetir. Ver `lado-a-lado/rastreamento-erro-rede…` e `…-nao-encontrado…`.
2. **Resultado à vista no celular:** após consultar, a tela rola até o resultado (respeita `prefers-reduced-motion`). Nas capturas de página inteira isso aparece como o cabeçalho fixo no meio da imagem; é artefato da captura.
3. **Leitor de tela:** saiu o `aria-live` que envolvia todo o resultado; entrou um anúncio curto ("N pedido(s) encontrado(s)", "Consultando…"). Erros continuam com `role="alert"`.
4. **Campo de código:** `inputmode="text"`, `autocapitalize="characters"`, `autocorrect="off"`, `enterkeyhint="search"`, `autocomplete="off"`; campo de CPF/CNPJ com `enterkeyhint="search"`. O `?codigo=` já preenchia e consultava sozinho (mantido).
5. **Alvos de toque ≥ 44 px:** logo do cabeçalho, links do rodapé, botões `sm`, botão de fechar do modal (agora 44 px).
6. **Modal do comprovante:** Esc e clique fora fecham e o foco fica preso (Radix, verificado por teste/Esc); fotos com `alt` próprio ("Foto 1 de 2…"), `width`/`height` e `loading="lazy"`; link de ampliar com nome acessível por foto.
7. **Títulos:** páginas de erro (404, categoria e artigo inexistentes) agora têm `<h1>`; `/termos` não pula mais nível de título (`Disclosure` aceita `nivel`).
8. **Logo:** alt redundante removido (marca no cabeçalho é decorativa dentro do link já rotulado), com `width`/`height`.
9. **`<title>` e descrição por página:** o `<title>` já existia; a meta description agora varia por rota (`src/lib/paginas.js`, aplicada no `PageShell`).
10. **Home sem rolagem horizontal em 360 px:** `min-w-0` nos itens da grade do hero.
11. **Peso:** `icone.png` e `logo-full.png` (usados a ~40 px) de 500×500 / 251 KB para 160×160 / 37 KB cada. Contraste, foco visível e ordem de tabulação já estavam adequados (axe sem violação de contraste; anel de foco em todos os elementos testados por Tab).

## Testes
`npm test` 84 verdes (78 + 6 novos em `Tracking.test.jsx`: atributos do campo, tentar novamente, limite sem repetir, "Conferir o código" devolve o foco, anúncio de quantidade e rolagem até o resultado, alt/dimensões das fotos e Esc fecha o modal); `npm run lint` e `npm run build` verdes. Nenhuma regra de negócio, texto jurídico, API ou CSP foi alterada.

## Limites
- Dados e Turnstile simulados; não vi o widget real nem fotos reais (já testados em produção pela POR-M1).
- Lighthouse da home continua 75: o LCP (imagem do contêiner do hero, 229 KB) segue alto em rede simulada lenta. Reduzir isso exigiria recomprimir/trocar imagens do hero (mudança visual), que deixei fora. `mapa-light-390x844.png` (288 KB) também ficou como está.
- As capturas completas e os JSON do axe não estão no repositório (tamanho); só as 6 comparações lado a lado.
