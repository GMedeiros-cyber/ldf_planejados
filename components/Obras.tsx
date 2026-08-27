import { obras } from "@/lib/dados";

/* Carrossel de obras, full-bleed. A rolagem é do próprio navegador:
   overflow-x com scroll-snap. Sem biblioteca, sem drag por JS — o toque
   já arrasta de graça. Ver a seção 8b em globals.css. */

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
            <li className="obra" key={obra.nome}>
              <figure className="obra__figura">
                <span className="obra__quadro">
                  <img src={obra.img} alt={obra.alt} loading="lazy" decoding="async" />
                </span>
                {/* Sigla e nome dividem a mesma célula da grade: trocam por
                    opacidade, sem salto de layout. Os dois ficam no DOM. */}
                <figcaption className="obra__rotulo">
                  <span className="obra__sigla">{obra.sigla}</span>
                  <span className="obra__nome">{obra.nome}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
