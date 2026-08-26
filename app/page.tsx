import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Ambientes from "@/components/Ambientes";
import Fabrica from "@/components/Fabrica";
import Processo from "@/components/Processo";
import Ficha from "@/components/Ficha";
import Comercial from "@/components/Comercial";
import Prova from "@/components/Prova";
import Fechamento from "@/components/Fechamento";
import Footer from "@/components/Footer";
import Zap from "@/components/Zap";

/*
THESIS: A amostra de acabamento é o material da página, não um filtro. O visitante
veste a peça antes de falar com alguém. Recusa o arranjo padrão da categoria —
foto de luxo, frase fina por cima, botão de orçamento — porque uma revenda monta
o mesmo.

STORY: Entende que o acabamento é escolha dele, acredita que quem fabrica responde
pelo que entrega, e pede o projeto 3D no WhatsApp.
*/

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Ambientes />
        <Fabrica />
        <Processo />
        <Ficha />
        <Comercial />
        <Prova />
        <Fechamento />
      </main>
      <Footer />
      <Zap />
    </>
  );
}
