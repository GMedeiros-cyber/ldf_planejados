/* O menu do site. UMA lista, lida pela barra do topo e pelo rodapé.

   ══ POR QUE ISTO NÃO MORA NO lib/dados.ts ══

   Moraria, e chegou a morar: é dado do site, e o dados.ts é a fonte única.
   Saiu de lá por um motivo medido, não por gosto.

   O <Nav /> é `"use client"`. Um componente de cliente que importa do dados.ts
   arrasta o MÓDULO INTEIRO para o grafo do navegador — os textos dos quatro
   ambientes, as onze etapas, os quatro estágios, as oito obras, as cinco
   marcas, a ficha técnica. Com o import lá, o conteúdo do dados.ts aparecia em
   TRÊS chunks de cliente; sem ele, em um só (o do formulário de /contato, que
   é cliente e precisa mesmo das opções dos campos).

   E a barra do topo está em todas as rotas. Ou seja: o catálogo inteiro do site
   passaria a ser baixado por quem abre a política de privacidade.

   Um arquivo de três linhas resolve. O dados.ts continua sendo a fonte única do
   que é conteúdo; o menu é NAVEGAÇÃO, e navegação é a única coisa que os dois
   lados — servidor e cliente — precisam saber.

   ⚠ NÃO reexporte isto do dados.ts. Duas portas para a mesma lista devolvem
   exatamente o problema que este arquivo existe para evitar: alguém importaria
   `menu` da porta grande sem perceber, e o catálogo voltaria ao cliente.

   ══ O QUE ESTA LISTA GARANTE ══

   Antes, o <Nav /> tinha a lista dele e o <Footer /> tinha `institucional`, com
   âncoras para seções da home (/#fabrica, /#processo). As duas divergiram na
   primeira vez que a barra mudou, e a divergência não aparecia: os dois lugares
   continuavam funcionando, dizendo coisas diferentes. Agora um item que entre
   ou saia aparece nos dois no mesmo instante. */

export const menu = [
  { href: "/", texto: "Home" },
  { href: "/ambientes", texto: "Ambientes" },
  { href: "/contato", texto: "Contato" },
] as const;
