import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Numeros from "@/components/Numeros";
import Historia from "@/components/Historia";
import Obras from "@/components/Obras";
import Processo from "@/components/Processo";
import Marcas from "@/components/Marcas";
import Fabrica from "@/components/Fabrica";
import FaixaMadeira from "@/components/FaixaMadeira";
import Emenda from "@/components/Emenda";
import Fechamento from "@/components/Fechamento";
import Footer from "@/components/Footer";

/*
THESIS: A home abre por fotografia. Três capas full-bleed se cruzam por
opacidade, cada uma com a sua frase no canto inferior esquerdo, e nada mais:
sem botão, sem rótulo, sem chamada. É o arranjo padrão da categoria, adotado
de propósito — a LDF é desconhecida e precisa afirmar antes de explicar.

Oito blocos, nesta ordem. O Processo é campo dourado; a madeira cobre
os três últimos:

1. Hero       As três capas. Só imagem e frase.
2. Numeros    +1.200 projetos, +15 anos, 5 anos de garantia. Contam quando
              entram na tela. São os números que o cliente confirmou.
3. Historia   De Guarulhos, direto da fábrica: entre quem desenha o móvel e
              quem corta a chapa não existe ninguém.
4. Obras      A parede de trabalho entregue, em carrossel contínuo.
5. Processo   Os quatro estágios, com o orçamento no terceiro. Responde
              "como funciona" antes de "por que em vocês". Campo dourado,
              tipografia invertida: é a única seção clara da metade de baixo.
6. Marcas     Faixa de logos. PLACEHOLDER: as cinco marcas são fictícias e
              a seção não vai ao ar como está — ver lib/dados.ts.
7. Fabrica    Não tem revenda no meio: a cadeia da franquia contra a nossa.
              Vem DEPOIS do processo de propósito — é a razão estrutural de
              o processo poder ser aquele, e só faz sentido depois de a
              pessoa ter visto qual é o processo.
8. Fechamento Faixa de madeira: logo, uma frase e um botão para /contato.

O amostrário e a elevação desenhada não moram aqui: vivem em /ambientes e na
página da cozinha, onde quem já está decidindo o acabamento vai encontrá-los.
A pilha de ambientes e o bloco comercial saíram para /ambientes. A prova
social saiu do ar até haver foto de obra e depoimento assinado.

As fotos da capa e as da parede de obras são MOCKUP de terceiros, marcadas em
lib/dados.ts. Não vão ao ar: entram as da LDF antes do deploy.

STORY: Reconhece o nível do trabalho na capa, vê três números que a casa
assume, entende como o projeto anda até virar móvel, descobre por que o prazo
e a garantia são da própria LDF, e pede o projeto.
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
        <Processo />

        {/* A ÚNICA emenda da página, e agora com função: é a junta entre duas
            superfícies de verdade — o dourado do Processo acaba, a madeira
            começa. As duas anteriores marcavam divisões que não existiam
            (madeira contra madeira) e por isso liam como ornamento repetido. */}
        <Emenda x="26%" xMovel="20%" />

        {/* A madeira corre por baixo do resto, com parallax. O Processo saiu
            daqui quando ganhou campo dourado próprio. */}
        <FaixaMadeira>
          <Marcas />
          <Fabrica />
          <Fechamento />
        </FaixaMadeira>
      </main>
      <Footer />
    </>
  );
}
