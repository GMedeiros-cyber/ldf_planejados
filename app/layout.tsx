import type { Metadata, Viewport } from "next";
import { Archivo, Instrument_Serif, Tinos } from "next/font/google";
import { acabamentoInicial } from "@/lib/dados";
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

export const metadata: Metadata = {
  title: "LDF Planejados — Móveis planejados de fábrica em Guarulhos",
  description:
    "Fábrica própria de móveis planejados em Guarulhos. Projeto 3D antes do orçamento, garantia de 5 anos e produção em até 45 dias úteis.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${archivo.variable} ${serif.variable} ${tinos.variable}`}>
      <body data-fin={acabamentoInicial}>
        {children}
        <Reveal />
      </body>
    </html>
  );
}
