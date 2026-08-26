import Link from "next/link";
import { ambientes } from "@/lib/dados";
import { SetaDiagonal } from "./Icones";

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

      <div className="ambientes rise">
        {ambientes.map((a) => (
          <Link key={a.nome} className="amb" href={a.href} data-fin={a.fin}>
            <span className="amb__plate" aria-hidden="true">
              <span className="mat" />
              <span className="mat" />
              <span className="mat" />
            </span>
            <SetaDiagonal className="amb__go" />
            <span className="amb__name">{a.nome}</span>
            <span className="amb__meta">{a.meta}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
