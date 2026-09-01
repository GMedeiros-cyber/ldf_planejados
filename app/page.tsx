import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Numeros from "@/components/Numeros";
import Historia from "@/components/Historia";
import Obras from "@/components/Obras";
import Processo from "@/components/Processo";
import Marcas from "@/components/Marcas";
import Fabrica from "@/components/Fabrica";
import Avaliacoes from "@/components/Avaliacoes";
import Fechamento from "@/components/Fechamento";
import Footer from "@/components/Footer";

/*
THESIS: A home abre por fotografia. Três capas full-bleed se cruzam por
opacidade, cada uma com a sua frase no canto inferior esquerdo, e nada mais:
sem botão, sem rótulo, sem chamada. É o arranjo padrão da categoria, adotado
de propósito — a LDF é desconhecida e precisa afirmar antes de explicar.

Nove blocos, nesta ordem. O shader do FundoAuralis está em três seções —
História, Processo e Fábrica — com a faixa de marcas chapada entre as duas
últimas, e a madeira só no Fechamento:

1. Hero       As três capas. Só imagem e frase.
2. Numeros    +1.200 projetos, +15 anos, 5 anos de garantia. Contam quando
              entram na tela. São os números que o cliente confirmou.
3. Historia   De Guarulhos, direto da fábrica: entre quem desenha o móvel e
              quem corta a chapa não existe ninguém.
4. Obras      A parede de trabalho entregue, em carrossel contínuo.
5. Processo   Os quatro estágios, com o orçamento no terceiro. Responde
              "como funciona" antes de "por que em vocês".
6. Marcas     Faixa de logos em carrossel, sobre o escuro chapado. É o liso
              entre os dois blocos de argumento que ela separa.
              PLACEHOLDER: as cinco marcas são fictícias E a headline afirma
              relação comercial com elas. A seção NÃO vai ao ar como está —
              ver o aviso em components/Marcas.tsx.
7. Fabrica    Não tem revenda no meio: a cadeia da franquia contra a nossa.
              Vem DEPOIS do processo de propósito — é a razão estrutural de
              o processo poder ser aquele, e só faz sentido depois de a
              pessoa ter visto qual é o processo.
8. Avaliacoes As avaliações do Google em faixa contínua. Vem DEPOIS da fábrica
              e ANTES do CTA de propósito: é o último argumento antes do
              pedido, e é o único que não somos nós falando. Nota agregada,
              total e link para o perfil junto dos trechos — sem eles a faixa
              seria uma seleção nossa de elogios.
9. Fechamento Bloco de CTA sobre madeira: logo, uma frase e um botão para /contato.

O amostrário e a elevação desenhada não moram aqui: vivem em /ambientes e na
página da cozinha, onde quem já está decidindo o acabamento vai encontrá-los.
A listagem de ambientes e o bloco comercial saíram para /ambientes. A Prova
continua fora do ar até haver foto de obra e depoimento assinado — o que
entrou foi a faixa de avaliações do Google, que é o oposto dela: texto que já
é público e que não passou por nós.

As fotos da capa e as da parede de obras são MOCKUP de terceiros, marcadas em
lib/dados.ts. Não vão ao ar: entram as da LDF antes do deploy.

STORY: Reconhece o nível do trabalho na capa, vê três números que a casa
assume, entende como o projeto anda até virar móvel, descobre por que o prazo
e a garantia são da própria LDF, lê o que 130 clientes disseram no Google, e
pede o projeto.
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

        <Marcas />

        <Fabrica />
        <Avaliacoes />
        <Fechamento />
      </main>
      <Footer />
    </>
  );
}
