import Link from "next/link";
import Elevacao from "./Elevacao";
import { Seta } from "./Icones";

const tipos = ["Escolas", "Clínicas", "Escritórios", "Lojas"];

export default function Comercial() {
  return (
    <section className="section comercial" id="comercial" aria-labelledby="t-com">
      <div className="wrap comercial__grid">
        <div className="rise">
          <h2 className="h2" id="t-com">
            Escola, clínica, escritório e loja.
          </h2>
          <p className="lede lede--espacada">
            Ambiente comercial tem outra conta: uso intenso, muitos ciclos de abertura por dia, e
            uma obra que não pode parar esperando móvel.
          </p>
          <p className="paragrafo-secundario">
            Atendemos esse público desde sempre e fabricamos sob medida para ele: recepções,
            armários de sala de aula, bancadas de atendimento, gabinetes técnicos. Fale com a gente
            com a planta em mãos.
          </p>

          <div className="tipos">
            {tipos.map((t) => (
              <span key={t} className="tipo">
                {t}
              </span>
            ))}
          </div>

          <div className="hero__actions hero__actions--afastada">
            {/* "/#contato" e nao "#contato": o id vive no Fechamento da home,
                e esta seção agora é renderizada em /ambientes. */}
            <Link className="btn" href="/#contato">
              Falar sobre um projeto comercial
              <Seta />
            </Link>
          </div>
        </div>

        <Elevacao
          variante="comercial"
          className="rise elev--comercial"
          label="Elevação desenhada de um armário de ambiente comercial."
        />
      </div>
    </section>
  );
}
