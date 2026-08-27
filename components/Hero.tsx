import Link from "next/link";
import { Seta } from "./Icones";

/* Capa da home: fotografia full-bleed, vinheta por cima e o texto centrado.
   Camadas empilhadas em absolute dentro de um container relative — fundo,
   vinheta, conteúdo. A entrada é em cascata, por animation-delay, sem
   IntersectionObserver: a capa já está visível no carregamento. */

/* TODO: substituir por foto real da LDF — ambiente executado ou a fábrica em Guarulhos. */
const FUNDO = "https://images.unsplash.com/photo-1729086046027-09979ade13fd?q=80&w=2000&auto=format&fit=crop";

export default function Hero() {
  return (
    <section className="hero hero--capa" aria-labelledby="t-hero">
      <div className="hero__fundo">
        <img
          src={FUNDO}
          alt="Sala de estar com marcenaria planejada, painel e iluminação embutida."
          fetchPriority="high"
          loading="eager"
          decoding="async"
        />
      </div>

      <div className="hero__vinheta" aria-hidden="true" />

      <div className="hero__conteudo">
        <span className="hero__selo cascata">Fábrica própria · Guarulhos</span>

        <h1 className="display cascata" id="t-hero">
          Escolha o acabamento.
          <br />O resto a gente fabrica.
        </h1>

        <p className="lede cascata">
          Móveis planejados feitos na nossa fábrica em Guarulhos, sem revenda no meio do caminho. O
          projeto 3D vem antes do orçamento, para você aprovar o móvel e não um número.
        </p>

        <div className="hero__actions cascata">
          <Link className="btn" href="#contato">
            Quero meu projeto 3D
            <Seta />
          </Link>
          <Link className="btn btn--ghost" href="#processo">
            Ver como funciona
          </Link>
        </div>
      </div>
    </section>
  );
}
