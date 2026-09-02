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

   O id="contato" continua AQUI, e a razão MUDOU.

   Antes ele ficava porque a rota /contato não existia. Agora ela existe —
   app/contato/page.tsx — e o id continua aqui mesmo assim: a migração está
   ADIADA, de propósito, e o gatilho dela passou a ser o FORMULÁRIO, não a
   rota.

   O motivo é que a rota de hoje é mockup: o botão dela é um <button disabled>,
   porque não há para onde mandar ninguém. Apontar as âncoras do Nav (duas) e
   do rodapé (uma) para lá agora mandaria a conversão do site inteiro
   desembocar num controle inerte — pior que o estado atual, em que ela chega
   a este bloco, que ao menos oferece um caminho.

   Quando o formulário existir: o id sai daqui, as três âncoras "/#contato"
   viram "/contato", e o BotaoRevelar da rota recebe a prop `href`.

   O que JÁ mudou: o link "/contato" logo abaixo deixou de ser 404.

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

        {/* A rota existe. TODO: o formulário — ver o bloco no topo do arquivo
            para o que a chegada dele destrava. */}
        <Link className="btn btn--contorno" href="/contato">
          Falar com a LDF
        </Link>
      </div>
    </section>
  );
}
