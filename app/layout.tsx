import type { Metadata, Viewport } from "next";
import { Archivo, Instrument_Serif, Tinos } from "next/font/google";
import { siteUrl } from "@/lib/dados";
import Reveal from "@/components/Reveal";
import "./globals.css";

/* Fontes auto-hospedadas pelo Next: sem requisição a terceiro, sem layout shift,
   e sem o <link> para o Google Fonts que o próprio sistema de referência proíbe
   em produção. O eixo wdth é necessário — o CSS usa font-variation-settings. */

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--ff-archivo",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--ff-serif",
});

/* Tinos é metricamente idêntica à Times New Roman e vem auto-hospedada:
   nada de depender da fonte do sistema. */
const tinos = Tinos({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--ff-tinos",
});

/* METADATA DA RAIZ. Cada rota declara o title e a description dela; o que mora
   aqui é o que vale para todas.

   ══ POR QUE O metadataBase NÃO PODE FALTAR ══

   Sem ele, o Next emite as URLs de imagem do Open Graph como caminho relativo
   — e WhatsApp, Facebook e Google não resolvem caminho relativo: eles buscam a
   foto num servidor que não é o nosso, não acham, e o link vai sem imagem
   nenhuma. Um link de WhatsApp sem foto é o formato em que este site mais
   circula.

   O endereço vem do lib/dados.ts, junto do resto dos dados da empresa. */
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "LDF Planejados — Móveis planejados de fábrica em Guarulhos",
  description:
    "Fábrica própria de móveis planejados em Guarulhos. Projeto 3D antes do orçamento, garantia de 5 anos e produção em até 45 dias úteis.",
  /* O Next resolve a canônica de cada rota a partir desta raiz. Sem ela, a
     mesma página em www e sem www conta como duas para o buscador. */
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "LDF Planejados",
    url: "/",
    title: "LDF Planejados — Móveis planejados de fábrica em Guarulhos",
    description:
      "Fábrica própria em Guarulhos. Projeto 3D antes do orçamento, garantia de 5 anos e produção em até 45 dias úteis.",
    /* 1200×630 é a medida que WhatsApp e Facebook recortam sem cortar nada.
       JPEG, e não WebP: o WebP passa no navegador, mas os leitores de link
       ainda tratam mal — e este é o formato em que o site mais circula. */
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Cozinha planejada da LDF" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "LDF Planejados — Móveis planejados de fábrica em Guarulhos",
    description:
      "Fábrica própria em Guarulhos. Projeto 3D antes do orçamento, garantia de 5 anos e produção em até 45 dias úteis.",
    images: ["/og.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${archivo.variable} ${serif.variable} ${tinos.variable}`}>
      {/* O `data-fin` saiu do <body> junto com a `.mat` e o <Amostrario />:
          nenhuma regra do CSS lia mais o atributo. O porquê está na seção 4 do
          globals.css. */}
      <body>
        {children}
        <Reveal />
      </body>
    </html>
  );
}
