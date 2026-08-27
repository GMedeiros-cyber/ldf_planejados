import Link from "next/link";

import { SetaDiagonal } from "./Icones";
import { ambientes } from "@/lib/dados";

/* Pilha empilhada: cada card gruda no topo e é coberto pelo seguinte.
   O efeito é CSS puro (position: sticky + altura por item) — ver .pilha em
   globals.css. A <section> NÃO pode receber overflow-hidden: qualquer
   ancestral com overflow desliga o sticky sem avisar. */

export default function Ambientes() {
  return (
    <section className="section wrap" id="ambientes" aria-labelledby="t-amb">
      <div className="section__head rise">
        <h2 className="h2" id="t-amb">
          Cada ambiente tem a sua régua.
        </h2>
        <p className="lede">
          Uma cozinha se resolve por circulação e altura de bancada. Um closet, por volumetria e
          iluminação interna. São projetos diferentes, e o site trata cada um no seu próprio
          capítulo.
        </p>
      </div>

      <ul className="pilha">
        {ambientes.map((amb) => (
          <li key={amb.nome} className="pilha__item">
            <article className="pilha__card" data-fin={amb.fin}>
              <span className="pilha__plate" aria-hidden="true">
                <span className="mat" />
                <span className="mat" />
                <span className="mat" />
              </span>

              <SetaDiagonal className="pilha__go" />

              <h3>
                {amb.href.startsWith("/") ? (
                  <Link className="pilha__nome" href={amb.href}>
                    {amb.nome}
                  </Link>
                ) : (
                  <a className="pilha__nome" href={amb.href}>
                    {amb.nome}
                  </a>
                )}
              </h3>
              <p className="pilha__meta">{amb.meta}</p>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
