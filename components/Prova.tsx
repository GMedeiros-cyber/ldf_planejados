import { slotsProva } from "@/lib/dados";

/* Fora do ar até haver obras fotografadas e clientes dispostos a assinar o
   depoimento. Nada aqui pode ser inventado — ver o comentário original. */

/* Prova social: slots honestos.
   Nada aqui pode ser inventado. Ver PRODUCT.md, Evidence on Hand. */

export default function Prova() {
  return (
    <section className="section wrap" aria-labelledby="t-prova">
      <div className="section__head rise">
        <h2 className="h2" id="t-prova">
          Esta parte é do cliente, não nossa.
        </h2>
        <p className="lede">
          Marcas de porte nacional preenchem este espaço com prêmio e assinatura de arquiteto. A LDF
          preenche com obra entregue e cliente que fala o nome dela. É isso que entra aqui assim que
          chegar.
        </p>
      </div>
      <div className="aguardando rise">
        {slotsProva.map((s) => (
          <div key={s.o} className="slot">
            <span className="slot__tag">A inserir</span>
            <span className="slot__what">{s.o}</span>
            <span className="slot__why">{s.porque}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
