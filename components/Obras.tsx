import { obras } from "@/lib/dados";

/* Carrossel de obras, full-bleed. A pista corre sozinha em loop por
   animação de transform — nada de requestAnimationFrame nem scrollLeft.
   A lista é renderizada duas vezes: com duas cópias, o -50% dos keyframes
   cai exatamente no início da segunda e a emenda fica invisível.
   Ver a seção 8b em globals.css. */

type Obra = (typeof obras)[number];

function Cartao({ obra, copia }: { obra: Obra; copia?: boolean }) {
  return (
    /* A segunda cópia existe só para fechar o loop: fica fora da árvore de
       acessibilidade para o leitor de tela não anunciar tudo duas vezes. */
    <li className="obra" aria-hidden={copia || undefined}>
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

export default function Obras() {
  return (
    <section className="section obras" id="obras" aria-labelledby="t-obras">
      <div className="wrap section__head rise">
        <h2 className="h2" id="t-obras">
          Trabalho que fala por nós.
        </h2>
      </div>

      <div className="obras__trilho" role="region" aria-label="Obras entregues" tabIndex={0}>
        <ul className="obras__pista">
          {obras.map((obra) => (
            <Cartao key={obra.nome} obra={obra} />
          ))}
          {obras.map((obra) => (
            <Cartao key={`${obra.nome}-2`} obra={obra} copia />
          ))}
        </ul>
      </div>
    </section>
  );
}
