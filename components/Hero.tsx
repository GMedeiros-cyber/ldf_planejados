import Link from "next/link";
import Elevacao from "./Elevacao";
import Amostrario from "./Amostrario";
import { Seta } from "./Icones";

/* Palco full-bleed: a elevação ocupa a largura inteira como fundo e o texto
   se sobrepõe à esquerda. Sob o palco, o amostrário. */

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="t-hero">
      <div className="hero__stage">
        <Elevacao label="Elevação desenhada de uma cozinha planejada, com armários superiores, bancada e gaveteiro no acabamento selecionado." />

        <div className="hero__overlay">
          <h1 className="display" id="t-hero">
            Escolha o acabamento.
            <br />O resto <span className="swap">a gente fabrica</span>.
          </h1>
          <p className="lede">
            Móveis planejados feitos na nossa fábrica em Guarulhos, sem revenda no meio do caminho.
            O projeto 3D vem antes do orçamento, para você aprovar o móvel e não um número.
          </p>
          <div className="hero__actions">
            <Link className="btn" href="#contato">
              Quero meu projeto 3D
              <Seta />
            </Link>
            <Link className="btn btn--ghost" href="#processo">
              Ver como funciona
            </Link>
          </div>
          <div className="hero__note">
            <p>
              <strong>Toque um acabamento</strong> para vestir a peça. Na loja, o mesmo leque fica
              na sua mão, e o puxador você escolhe pessoalmente.
            </p>
          </div>
        </div>
      </div>

      <Amostrario />
    </section>
  );
}
