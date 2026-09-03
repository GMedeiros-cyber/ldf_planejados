import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/dados";
import { menu } from "@/lib/menu";

/* /sitemap.xml, gerado no build.

   ══ AS ROTAS VÊM DO MENU, E NÃO DE UMA SEGUNDA LISTA ══

   O lib/menu.ts já é a lista única de navegação — a barra do topo e o rodapé
   leem dele. Escrever aqui um array com as mesmas rotas criaria a divergência
   que aquele arquivo existe para evitar: uma rota nova entraria no menu, o
   sitemap continuaria com as antigas, e nada quebraria — o buscador só
   deixaria de saber da página nova, em silêncio.

   A POLÍTICA DE PRIVACIDADE ENTRA À MÃO porque não está no menu de propósito:
   ela é link de rodapé e de formulário, não item de navegação. É a única
   exceção, e é por isso que ela está escrita aqui embaixo, visível.

   `lastModified` é a hora do build. As páginas são estáticas: elas mudam
   quando o site é publicado, e não em outro momento. */
export default function sitemap(): MetadataRoute.Sitemap {
  const agora = new Date();

  const rotas = menu.map((item) => ({
    url: `${siteUrl}${item.href === "/" ? "" : item.href}`,
    lastModified: agora,
    /* A home é a porta de entrada; as outras duas valem o mesmo entre si. */
    priority: item.href === "/" ? 1 : 0.8,
  }));

  return [
    ...rotas,
    { url: `${siteUrl}/politica-de-privacidade`, lastModified: agora, priority: 0.3 },
  ];
}
