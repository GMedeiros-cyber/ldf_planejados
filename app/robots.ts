import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/dados";

/* /robots.txt, gerado no build.

   TUDO LIBERADO, e é decisão: são cinco rotas públicas, nenhuma área logada,
   nenhum parâmetro de busca que multiplique endereço. Não há o que esconder do
   buscador, e um `Disallow` errado aqui é a forma mais silenciosa de tirar um
   site do ar — ele continua abrindo para quem tem o link e some do Google.

   A LINHA QUE IMPORTA É A DO SITEMAP: é ela que entrega as cinco rotas de uma
   vez, em vez de o buscador ter de descobri-las clicando. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
