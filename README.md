# LDF Planejados

Site da **LDF Planejados** — fábrica de móveis planejados em Guarulhos/SP.

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19 · TypeScript |
| Estilo | CSS à mão em `app/globals.css`, com custom properties e nomes em português |
| Animação | GSAP, num componente só (`components/ui/text-block-animation.tsx`) |
| Fontes | Archivo, Instrument Serif e Tinos, auto-hospedadas via `next/font` |

As cinco rotas são pré-renderizadas estaticamente e não há banco nem API. O que
o site **não** dispensa é um runtime Node: o formulário de `/contato` é uma
Server Action, e é ela que faz o envio funcionar sem JavaScript no navegador.
Hospedagem estática pura deixaria esse visitante sem saída.

> O Tailwind aparece nas dependências e é importado na primeira linha do
> `globals.css`, mas **nenhuma classe utilitária é usada** no projeto — ele
> entra só pelo reset. Se um dia sair, o reset precisa ser reposto à mão.

## Rodar

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # produção
npm run tipos        # tsc --noEmit
```

Requer Node.js 24+.

## Estrutura

```
app/
  layout.tsx                    fontes e metadata
  page.tsx                      home
  globals.css                   o sistema de design inteiro
  ambientes/                    os quatro ambientes e o bloco comercial
  contato/                      formulário (page + Server Action + validação)
  politica-de-privacidade/
components/                     uma seção por arquivo
lib/dados.ts                    conteúdo do cliente — fonte única
lib/avaliacoes.ts               as avaliações do Google, literais
lib/menu.ts                     a navegação, separada de propósito (leia o topo)
public/                         fotos, vídeo e texturas
scripts/hero-imagens.mjs        gera as variantes WebP da capa
```

**Para editar conteúdo, comece por [`lib/dados.ts`](lib/dados.ts).** Contato,
ambientes, as onze etapas, os números e as obras estão todos ali.

## O sistema de design

CSS à mão, em seções numeradas dentro de um arquivo só. As decisões estão
escritas nos comentários do próprio `globals.css` — inclusive as remoções, com
o motivo de cada uma.

- A capa são três slides de foto que se cruzam por opacidade, sem biblioteca
- `#DF0100` tem usos contados: tinta de instrumento e preenchimento da ação
  primária
- Restrição medida: `#DF0100` sobre o fundo `#131211` dá **3,69:1** — serve só
  para display grande, nunca para texto corrido ou rótulo pequeno
- Tudo que se move respeita `prefers-reduced-motion`, e o site inteiro tem um
  estado declarado para `@media (scripting: none)`

## Onde os pedidos do formulário caem

No **WhatsApp da LDF**, pelos dois caminhos: com JavaScript o componente abre o
`wa.me`; sem JavaScript a Server Action valida, roda o antispam e redireciona
para o mesmo endereço.

`LEAD_WEBHOOK_URL` existe para o dia em que houver um webhook, e **deve ficar
vazia até lá** — inclusive na Vercel. O `.env.example` explica o arranjo
inteiro.
