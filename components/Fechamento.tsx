import Link from "next/link";
import Logo from "./Logo";

/* Faixa de fechamento: três elementos centrados — logo, frase, botão. A lede
   e os dois botões antigos saíram de propósito: o fim da página faz um pedido
   só, não três.

   A madeira e o véu NÃO moram mais aqui. Quem os desenha é o FaixaMadeira,
   que envolve esta seção e a Fábrica: as duas dividem UMA madeira contínua,
   sem divisa entre elas. Um fundo próprio aqui seria madeira sobre madeira, e
   o encontro das duas texturas apareceria como um degrau na altura em que uma
   seção acaba e a outra começa. Esta seção é transparente e herda o de trás.

   O id="contato" continua AQUI. Ele é o alvo de todas as âncoras "#contato"
   do site, e a rota /contato ainda não existe — mover o id agora quebraria a
   navegação, o rodapé, o comercial, a página de cozinha e os sete ambientes
   de lib/dados.ts. Quando app/contato/page.tsx nascer, o id sai daqui e
   essas âncoras viram "/contato". */

export default function Fechamento() {
  return (
    <section className="fechamento" id="contato" aria-labelledby="t-cta">
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
