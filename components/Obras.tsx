import type { CSSProperties } from "react";

import { obras } from "@/lib/dados";

/* Carrossel de obras, full-bleed. A pista corre sozinha em loop por
   animação de transform — nada de requestAnimationFrame nem scrollLeft, e
   nada de pausa: ela não para com o ponteiro em cima.

   A lista é renderizada em DUAS METADES idênticas, cada uma um contêiner
   flex de largura fixa. É isso que mantém o -50% dos keyframes honesto
   mesmo com um card aberto: o crescimento acontece dentro de uma metade,
   os vizinhos daquela metade encolhem na mesma medida e a largura dela não
   muda. Com um flex só, a metade que contivesse o card aberto ficaria mais
   larga que a outra e a emenda saltaria.
   Ver a seção 8b em globals.css. */

type Obra = (typeof obras)[number];

function Cartao({ obra, copia }: { obra: Obra; copia?: boolean }) {
  return (
    <li className="obra">
      <figure className="obra__figura">
        <span className="obra__quadro">
          <img
            src={obra.img}
            alt={copia ? "" : obra.alt}
            loading="lazy"
            decoding="async"
          />
        </span>
        {/* Sigla e nome dividem a mesma célula da grade: trocam por
            opacidade, sem salto de layout. Os dois ficam no DOM. */}
        <figcaption className="obra__rotulo">
          <span className="obra__sigla">{obra.sigla}</span>
          <span className="obra__nome">{obra.nome}</span>
        </figcaption>
      </figure>
    </li>
  );
}

/* A segunda metade existe só para fechar o loop: sai da árvore de
   acessibilidade para o leitor de tela não anunciar tudo duas vezes. */
function Metade({ copia }: { copia?: boolean }) {
  return (
    <ul className="obras__metade" aria-hidden={copia || undefined}>
      {obras.map((obra) => (
        <Cartao key={obra.nome} obra={obra} copia={copia} />
      ))}
    </ul>
  );
}

export default function Obras() {
  /* O CSS precisa saber quantas obras existem para calcular a largura de
     cada metade. Sai daqui para não virar um número repetido na folha. */
  const medida = { "--obras-n": obras.length } as CSSProperties;

  return (
    <section
      className="section obras"
      id="obras"
      aria-labelledby="t-obras"
      style={medida}
    >
      <div className="wrap section__head rise">
        <h2 className="h2" id="t-obras">
          Trabalho que fala por nós.
        </h2>
        <p className="lede">
          Projeto, corte, montagem e entrega: tudo sai da nossa fábrica em
          Guarulhos, sem intermediário no caminho.
        </p>
      </div>

      <div className="obras__trilho" role="region" aria-label="Obras entregues" tabIndex={0}>
        <div className="obras__pista">
          <Metade />
          <Metade copia />
        </div>
      </div>
    </section>
  );
}
