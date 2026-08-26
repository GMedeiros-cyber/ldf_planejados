import type { Metadata, Viewport } from "next";
import { Archivo, Libre_Caslon_Text } from "next/font/google";
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

const caslon = Libre_Caslon_Text({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--ff-caslon",
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
    <html lang="pt-BR" className={`${archivo.variable} ${caslon.variable}`}>
      <body data-fin={acabamentoInicial}>
        {children}
        <Reveal />
      </body>
    </html>
  );
}
