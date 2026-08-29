import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Numeros from "@/components/Numeros";
import Historia from "@/components/Historia";
import Obras from "@/components/Obras";
import Ambientes from "@/components/Ambientes";
import Fabrica from "@/components/Fabrica";
import Processo from "@/components/Processo";
import Ficha from "@/components/Ficha";
import Comercial from "@/components/Comercial";
import Prova from "@/components/Prova";
import Fechamento from "@/components/Fechamento";
import Footer from "@/components/Footer";

/*
THESIS: A home abre por fotografia. Três capas full-bleed se cruzam por
opacidade, cada uma com a sua frase no canto inferior esquerdo, e nada mais:
sem botão, sem rótulo, sem chamada. É o arranjo padrão da categoria, adotado
de propósito — a LDF é desconhecida e precisa afirmar antes de explicar.

O amostrário e a elevação desenhada continuam sendo a ideia própria do
sistema, mas não moram na capa: vivem na página de ambiente, onde quem já
está decidindo o acabamento vai encontrá-los. A parede de obras, a pilha de
ambientes e a linha do tempo das onze etapas seguram o meio da página.

As fotos da capa são MOCKUP de terceiros, marcadas em lib/dados.ts. Não vão
ao ar: entram as da LDF antes do deploy.

STORY: Reconhece o nível do trabalho na capa, entende que quem fabrica
responde pelo que entrega, e pede o projeto 3D no WhatsApp.
*/

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Numeros />
        <Historia />
        <Obras />
        <Fabrica />
        <Ambientes />
        <Processo />
        <Ficha />
        <Comercial />
        <Prova />
        <Fechamento />
      </main>
      <Footer />
    </>
  );
}
