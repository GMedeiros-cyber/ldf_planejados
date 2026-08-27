import FundoAuralis from "./FundoAuralis";
import { historia } from "@/lib/dados";

/* História: duas colunas acima de 992px, uma abaixo. O fundo é o
   FundoAuralis; o véu dele garante o contraste do texto. */

export default function Historia() {
  return (
    <section className="section historia" id="historia" aria-labelledby="t-hist">
      <FundoAuralis />

      <div className="wrap historia__grade rise">
        <div className="historia__texto">
          <h2 className="historia__titulo" id="t-hist">
            {historia.titulo[0]}
            <br />
            {historia.titulo[1]}
          </h2>

          {historia.paragrafos.map((p) => (
            <p className="historia__p" key={p}>
              {p}
            </p>
          ))}

          {/* A segunda linha só existe quando houver cargo: sem ele, repetiria
              o nome. Nome completo e cargo estão como TODO em lib/dados.ts. */}
          <div className="historia__assinatura">
            <span className="historia__firma">{historia.assinatura.nome}</span>
            {historia.assinatura.cargo ? (
              <span className="historia__cargo">
                {historia.assinatura.nome} · {historia.assinatura.cargo}
              </span>
            ) : null}
          </div>
        </div>

        <div className="historia__figura">
          <img src={historia.img} alt={historia.alt} loading="lazy" decoding="async" />
        </div>
      </div>
    </section>
  );
}
