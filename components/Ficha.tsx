import { ficha } from "@/lib/dados";

export default function Ficha() {
  return (
    <section className="section wrap" aria-labelledby="t-ficha">
      <div className="section__head rise">
        <h2 className="h2" id="t-ficha">
          O que está escrito no contrato.
        </h2>
      </div>
      <div className="ficha rise">
        {ficha.map((f) => (
          <div key={f.chave} className="ficha__cell">
            <span className="label ficha__k">{f.chave}</span>
            <span className="ficha__v num">
              {f.valor} <span className="ficha__u">{f.unidade}</span>
            </span>
            <span className="ficha__d">{f.detalhe}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
