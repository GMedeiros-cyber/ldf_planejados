import type { Metadata, Viewport } from "next";
import { Archivo, Instrument_Serif, Tinos } from "next/font/google";
import { siteUrl } from "@/lib/dados";
import { metadataDaRota } from "@/lib/metadata";
import Reveal from "@/components/Reveal";
import Zap from "@/components/Zap";
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

/* METADATA DA RAIZ — E ELA É A DA HOME, não um molde para as outras.

   ══ POR QUE O metadataBase NÃO PODE FALTAR ══

   Sem ele, o Next emite as URLs de imagem do Open Graph como caminho relativo
   — e WhatsApp, Facebook e Google não resolvem caminho relativo: eles buscam a
   foto num servidor que não é o nosso, não acham, e o link vai sem imagem
   nenhuma. Um link de WhatsApp sem foto é o formato em que este site mais
   circula.

   O endereço vem do lib/dados.ts, junto do resto dos dados da empresa. Ele é o
   ÚNICO campo que fica só aqui: o metadataBase é herdado pelas quatro rotas, e
   nenhuma delas precisa repeti-lo.

   ══⚠══ O RESTO VEM DO metadataDaRota(), E NÃO PODE VOLTAR A SER ESCRITO AQUI ══

   O que estava neste bloco — `openGraph` e `twitter` completos, mais
   `alternates: { canonical: "/" }` — VAZAVA PARA AS OUTRAS TRÊS ROTAS. O merge
   de metadata do Next é shallow: o que a filha não declara, ela herda. E
   nenhuma das três declarava.

   O resultado era /ambientes, /contato e /politica-de-privacidade emitindo a
   home como canônica DELAS: uma instrução ao buscador para não indexar três
   das quatro rotas. Cada uma também mostrava o título e a descrição da home na
   prévia de link.

   ⚠ Se alguém puser `openGraph` ou `alternates` de volta neste objeto, o bug
   volta inteiro e continua invisível — as páginas seguem abrindo normalmente.
   O que é comum às rotas mora no lib/metadata.ts. */
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  ...metadataDaRota({
    caminho: "/",
    titulo: "LDF Planejados — Móveis planejados de fábrica em Guarulhos",
    descricao:
      "Fábrica própria de móveis planejados em Guarulhos. Projeto 3D antes do orçamento, garantia de 5 anos e produção em até 45 dias úteis.",
    /* A home é a única rota com descrição social própria, e é assim desde
       antes do helper: a versão curta cabe na prévia de link sem truncar. O
       porquê do campo está no lib/metadata.ts. */
    descricaoSocial:
      "Fábrica própria em Guarulhos. Projeto 3D antes do orçamento, garantia de 5 anos e produção em até 45 dias úteis.",
  }),
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
      {/* O <Zap /> vem DEPOIS do conteúdo de propósito: fixo no canto, ele é a
          última parada do Tab em vez da primeira. O porquê está no topo do
          componente. */}
      <body>
        {children}
        <Zap />
        <Reveal />
      </body>
    </html>
  );
}
