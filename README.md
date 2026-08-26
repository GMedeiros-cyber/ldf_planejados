# LDF Planejados

Site da **LDF Planejados** — fábrica de móveis planejados em Guarulhos/SP.

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19 · TypeScript |
| Estilo | CSS puro com custom properties — sem framework de utilitários |
| Fontes | Archivo e Libre Caslon Text, auto-hospedadas via `next/font` |

Rotas são pré-renderizadas estaticamente. Não há banco, API nem build server —
o resultado roda em qualquer hospedagem estática ou VPS.

## Rodar

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # produção
```

Requer Node.js 24+.

## Estrutura

```
app/
  layout.tsx              fontes, metadata, <body data-fin>
  page.tsx                home
  globals.css             o sistema de design inteiro
  ambientes/cozinha/      página de ambiente
components/               uma seção por arquivo
lib/dados.ts              dados do cliente e conteúdo — fonte única
```

**Para editar conteúdo, comece por [`lib/dados.ts`](lib/dados.ts).** Contato,
acabamentos, ambientes, as onze etapas e a ficha técnica estão todos ali.

## O sistema de design

Chama-se **O Amostrário**: a amostra de acabamento é o material da página, não um
filtro. O visitante veste a peça antes de falar com alguém.

- O `<body>` carrega `data-fin` com o acabamento selecionado
- A elevação da cozinha é **desenhada em CSS**, não fotografada — e é assim de
  propósito, porque ainda não há fotos dos ambientes executados
- `#DF0100` tem três usos e nenhum a mais: tinta de instrumento, etiqueta de
  amostra viva e preenchimento da ação primária

Restrição medida: `#DF0100` sobre o fundo `#131211` dá **3,69:1** — serve só para
display grande, nunca para texto corrido ou rótulo pequeno.

## Verificação de design

```bash
npm run detect
```

Roda os detectores determinísticos do Impeccable.
