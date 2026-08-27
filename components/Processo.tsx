import { EtapaGaleria } from "./ui/image-gallery";
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

      <EtapaGaleria itens={etapas} />
    </section>
  );
}
