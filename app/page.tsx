import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Obras from "@/components/Obras";
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
THESIS: A home abre por fotografia: uma capa full-bleed com a promessa
centrada por cima. Ao rolar, a capa prende no topo, a foto escurece e os
três pilares — residencial, comercial e fábrica própria — sobem por cima do
texto: a promessa vira índice sem trocar de tela. Logo abaixo, a parede de
obras entregues. É o arranjo padrão da categoria, adotado de propósito — a
LDF é desconhecida e precisa afirmar antes de explicar.

O amostrário e a elevação desenhada continuam sendo a ideia própria do
sistema, mas saíram da capa: agora vivem na página de ambiente, onde quem
já está decidindo o acabamento vai encontrá-los. A pilha de ambientes e a
linha do tempo das onze etapas seguram o meio da página.

STORY: Reconhece o nível do trabalho na capa, entende que quem fabrica
responde pelo que entrega, e pede o projeto 3D no WhatsApp.
*/

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
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
      <Zap />
    </>
  );
}
