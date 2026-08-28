import Link from "next/link";
import Logo from "./Logo";

/* Faixa de fechamento: madeira full-bleed, véu preto e três elementos
   centrados — logo, frase, botão. A lede e os dois botões antigos saíram de
   propósito: o fim da página faz um pedido só, não três.

   O id="contato" continua AQUI. Ele é o alvo de todas as âncoras "#contato"
   do site, e a rota /contato ainda não existe — mover o id agora quebraria a
   navegação, o rodapé, o comercial, a página de cozinha e os sete ambientes
   de lib/dados.ts. Quando app/contato/page.tsx nascer, o id sai daqui e
   essas âncoras viram "/contato". */

const larguras = [1000, 1600, 2400] as const;

const srcSet = larguras.map((w) => `/madeira-cta-${w}.webp ${w}w`).join(", ");

export default function Fechamento() {
  return (
    <section className="fechamento" id="contato" aria-labelledby="t-cta">
      <img
        className="fechamento__madeira"
        src="/madeira-cta-1600.webp"
        srcSet={srcSet}
        sizes="100vw"
        width={2400}
        height={923}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
      />
      <div className="fechamento__veu" />

      <div className="fechamento__conteudo wrap">
        <Logo className="fechamento__marca" />

        <h2 className="fechamento__frase" id="t-cta">
          Manda a planta.
          <br />A gente desenha.
        </h2>

        {/* TODO: criar app/contato/page.tsx — página de contato com formulário. */}
        <Link className="btn btn--contorno" href="/contato">
          Falar com a LDF
        </Link>
      </div>
    </section>
  );
}
