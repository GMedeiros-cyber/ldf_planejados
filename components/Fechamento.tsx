import Link from "next/link";
import Logo from "./Logo";
import FundoMadeira from "./FundoMadeira";

/* Faixa de fechamento: três elementos centrados — logo, frase, botão. A lede
   e os dois botões antigos saíram de propósito: o fim da página faz um pedido
   só, não três.

   A madeira é DAQUI, e só daqui. Ela já foi contínua por trás da Fábrica
   também, e por isso não havia divisa entre as duas seções — dividiam a mesma
   superfície. Agora a Fábrica é escura como o resto da página e a troca de
   material faz a divisão sozinha: nenhuma régua, nenhuma linha.

   O desenho do fundo mora no FundoMadeira, uma camada absoluta dentro desta
   seção — mesmo arranjo do FundoAuralis na História e no Processo.

   O id="contato" continua AQUI. Ele é o alvo de todas as âncoras "#contato"
   do site, e a rota /contato ainda não existe — mover o id agora quebraria a
   navegação e o rodapé. Quando app/contato/page.tsx nascer, o id sai daqui e
   essas âncoras viram "/contato".

   A lista de quem apontava para cá encolheu: o bloco comercial e a página da
   cozinha, que também citavam este id, não existem mais. */

export default function Fechamento() {
  return (
    <section className="fechamento" id="contato" aria-labelledby="t-cta">
      <FundoMadeira />

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
