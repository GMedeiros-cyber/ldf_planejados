import { etapas } from "@/lib/dados";

export default function Processo() {
  return (
    <section className="section wrap" id="processo" aria-labelledby="t-proc">
      <div className="section__head rise">
        <h2 className="h2" id="t-proc">
          Onze etapas, e o orçamento é a sétima.
        </h2>
        <p className="lede">
          Ninguém consegue dizer quanto custa um móvel que ainda não foi desenhado. Por isso o
          projeto vem primeiro, e por isso você vê o processo inteiro aqui, não um resumo em quatro
          passos.
        </p>
      </div>

      <ol className="etapas rise">
        {etapas.map((e) => (
          <li key={e.titulo} className={"marco" in e && e.marco ? "etapa etapa--marco" : "etapa"}>
            <span className="etapa__n" aria-hidden="true" />
            <div>
              <span className="etapa__t">{e.titulo}</span>
              <p className="etapa__d">{e.texto}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
