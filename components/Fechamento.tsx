import Link from "next/link";
import Logo from "./Logo";
import FundoMadeira from "./FundoMadeira";

/* Faixa de fechamento: três elementos centrados — logo, frase, botão. A lede
   e os dois botões antigos saíram de propósito: o fim da página faz um pedido
   só, não três.

   A MADEIRA FRIA é daqui, e só daqui. Ela já foi contínua por trás da Fábrica
   também, e por isso não havia divisa entre as duas seções — dividiam a mesma
   superfície. Agora a Fábrica é escura como o resto da página e a troca de
   material faz a divisão sozinha: nenhuma régua, nenhuma linha.

   "Só daqui" vale para ESTE arquivo de textura, e não para o material. Existe
   uma segunda madeira no site, mais quente, na `.chamada` de /contato — a
   escolha entre as duas é medida, e a conta está na seção 15 da folha. As duas
   dividem o mesmo <FundoMadeira />; o que as separa são duas variáveis CSS.

   O desenho do fundo mora no FundoMadeira, uma camada absoluta dentro desta
   seção — mesmo arranjo do FundoAuralis na História e no Processo.

   ══ ESTE BLOCO FECHA DUAS ROTAS: A HOME E /ambientes ══

   Foi só da home por duas rodadas, enquanto /ambientes fechava com o
   <ChamadaMadeira />. O cliente viu aquilo no ar e preferiu este — a volta é
   decisão dele, não conserto de defeito. O registro completo da reversão está
   no topo de app/ambientes/page.tsx.

   O <ChamadaMadeira /> NÃO foi apagado, e não é substituído por este
   componente: ele é a capa de /contato. Os dois são blocos de madeira e
   dividem a mesma camada de fundo, mas este traz o id="contato" e um <Link>
   para /contato, e aquele traz o botão de revelação. Fundir os dois é decisão
   a tomar quando o formulário existir e o id sair daqui — não antes.

   ══ O id="contato" EXISTE EM DUAS PÁGINAS, E ISSO NÃO QUEBRA NADA ══

   Ele vem junto com este componente, então está na home e em /ambientes.
   Repetir um id no MESMO documento seria erro; em documentos diferentes não é
   — cada rota é um documento, e em nenhuma delas há dois.

   As três âncoras continuam válidas porque todas têm BARRA: "/#contato" em
   Nav 22 (item do menu), Nav 157 (botão-cápsula) e Footer 7. Elas apontam para
   a raiz, e não para a rota em que quem clica está — o alvo é sempre o bloco
   da home. O id de /ambientes é um segundo alvo que ninguém endereça.

   O que tornaria isso nocivo seria uma âncora "#contato" SEM barra: essa
   resolveria dentro da página atual, e o destino passaria a depender da rota.
   Não existe nenhuma assim, e não deve existir enquanto o id morar em dois
   lugares.

   ══ A MIGRAÇÃO DAS ÂNCORAS SEGUE ADIADA ══

   Ela não foi esquecida, e o gatilho dela NÃO é a existência da rota /contato
   — a rota já existe, em app/contato/page.tsx. O gatilho é o FORMULÁRIO.

   O motivo: /contato ainda é mockup, e o botão dela é um <button disabled>,
   porque não há para onde mandar ninguém. Apontar as três âncoras para lá
   agora mandaria a conversão do site inteiro desembocar num controle inerte —
   pior que o estado atual, em que ela chega a este bloco, que ao menos oferece
   um caminho.

   Quando o formulário existir: o id sai daqui, as três âncoras viram
   "/contato", e o BotaoRevelar daquela rota recebe a prop `href`.

   O <Link> para "/contato" logo abaixo continua sendo um dos caminhos até
   aquela rota, e continua não sendo 404 — agora a partir de duas páginas.

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
