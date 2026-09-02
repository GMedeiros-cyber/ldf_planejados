import FundoMadeira from "./FundoMadeira";
import Logo from "./Logo";
import BotaoRevelar from "./BotaoRevelar";

/* Chamada sobre madeira: logo, frase serifada, botão de revelação e — quando
   há o que dizer — uma linha de aviso embaixo dele.

   HOJE TEM UM CONSUMIDOR SÓ: /contato, de quem ele é a capa.

   Nasceu dentro de app/contato/page.tsx e saiu de lá inteiro quando /ambientes
   passou a fechar com o mesmo bloco. Depois o cliente viu aquele fecho no ar e
   preferiu o <Fechamento /> de volta, então /ambientes deixou de consumi-lo —
   e este arquivo perdeu um consumidor, não a razão de ser. A reversão está
   registrada no topo de app/ambientes/page.tsx.

   ⚠ A EXTRAÇÃO CONTINUA CERTA COM UM CONSUMIDOR SÓ, e este parágrafo existe
   para a próxima sessão não "simplificar" o bloco de volta para dentro da
   página. Ele é componente por ser um bloco com contrato próprio — cinco props
   com regras escritas —, e não por ter dois chamadores. Colar isto de volta em
   app/contato/page.tsx trocaria um arquivo legível por sessenta linhas de JSX
   no meio de uma rota, e devolveria o trabalho de extrair no dia em que o
   segundo consumidor voltasse.

   Componente de SERVIDOR. Nada aqui é cliente; o único cliente na árvore é o
   <FundoMadeira />, que já era, e é o mesmo que o <Fechamento /> usa.

   ══ O NÍVEL DO TÍTULO É PROP, E NÃO PODE DEIXAR DE SER ══

   Em /contato este bloco é a manchete da rota, e o título tem de ser <h1> —
   por isso o único consumidor de hoje passa "h1", e o padrão "h2" fica sem
   exercício.

   O PADRÃO NÃO MUDA POR ISSO. Onde o bloco fechar uma página que já tem o seu
   <h1>, um segundo <h1> quebraria a hierarquia de cabeçalhos: o leitor de tela
   anunciaria dois começos de documento, e a lista de títulos deixaria de
   descrever a página. Foi exatamente o caso enquanto ele fechava /ambientes, e
   volta a ser no próximo consumidor que não for capa. "h2" é o caso comum, e o
   padrão acompanha o caso comum — não o único chamador do momento.

   Não vira `<h${n}>` calculado nem `React.createElement` com string solta: a
   união literal "h1" | "h2" é o que faz o TypeScript recusar um "h7" ou um
   "div" antes do build.

   ══ A MADEIRA ══

   Quem declara os arquivos é a folha, em `.chamada`, e não este arquivo — ver
   a seção 15 do globals.css, que traz também a medição que escolheu a textura
   quente em vez da fria da home. O <FundoMadeira /> é o mesmo componente do
   Fechamento, com o mesmo parallax; o que muda entre um e outro são duas
   variáveis CSS.

   ══ O AVISO É OPCIONAL, E A REGRA É ESTREITA ══

   Ele existe para EXPLICAR UM BOTÃO QUE NÃO CONVERTE. Onde o botão leva a
   algum lugar, ela não entra: seria uma ressalva pendurada numa ação que
   funciona. E onde NÃO HÁ BOTÃO ela também não entra — ver abaixo.

   ══ O RÓTULO É OPCIONAL, E SEM ELE NÃO HÁ BOTÃO NEM AVISO ══

   `rotulo` era obrigatório enquanto o bloco sempre terminava numa ação. Deixou
   de ser quando /contato ganhou o formulário: o botão do herói existia para
   segurar a linha "Formulário em breve", e com o formulário logo abaixo ele
   virava um clique a mais para chegar onde a pessoa já ia.

   Sem `rotulo` o bloco é só marca, frase e madeira — uma capa, e não um
   pedido. O `aviso` cai junto por consequência, não por regra separada: ele
   existe para explicar um botão, e não há botão a explicar.

   O TypeScript garante que ninguém peça `aviso` sem `rotulo` sem perceber: a
   condição está no JSX, e passar só `aviso` renderiza nada — que é o certo, e
   é o que este parágrafo existe para explicar a quem for procurar o bug.

   ══ A MARCA É OPCIONAL, E O PADRÃO É NÃO TER ══

   ⚠ NÃO APAGUE A PROP `marca`, E NÃO TROQUE O PADRÃO. Hoje o único consumidor
   é /contato, que passa `marca` — então o padrão FALSE não tem quem o exerça,
   e uma limpeza automática ou apressada diria que a prop "sempre é true" e a
   removeria. É esperado e é temporário.

   O padrão é FALSE porque o caso comum é o bloco FECHANDO uma página que já
   tem a marca duas vezes — no painel da navegação, no topo, e no rodapé, logo
   abaixo. Uma terceira aparição no fecho é repetição, não assinatura: foi
   exatamente o que aconteceu enquanto ele fechava /ambientes, e é o que volta
   a valer no próximo consumidor que não for capa.

   Onde o bloco é a CAPA da rota, ela entra. /contato passa `marca` porque ali
   não há nada acima do bloco além da barra, e a página precisa se apresentar.

   O padrão segue o caso comum, e não o único chamador do momento: se fosse
   `true`, toda página nova nasceria com a repetição e teria de lembrar de
   desligá-la. */

type Props = {
  frase: string;
  /* Sem ele, o bloco não renderiza botão nem aviso — ver acima. */
  rotulo?: string;
  /* O logotipo acima da frase. Só onde o bloco é capa de rota — ver acima. */
  marca?: boolean;
  /* Repassado ao BotaoRevelar. Sem ele o botão sai desabilitado — ver aquele
     arquivo. */
  href?: string;
  /* A linha abaixo do botão. Sem ela, nada renderiza no lugar. */
  aviso?: string;
  titulo?: "h1" | "h2";
  idTitulo?: string;
};

export default function ChamadaMadeira({
  frase,
  rotulo,
  href,
  aviso,
  marca = false,
  titulo = "h2",
  idTitulo,
}: Props) {
  const Titulo = titulo;

  return (
    <section className="chamada" aria-labelledby={idTitulo}>
      <FundoMadeira />

      <div className="chamada__conteudo wrap">
        {marca ? <Logo className="chamada__marca" /> : null}

        {/* A família serifada está resolvida na `.chamada__frase`, com as três
            linhas de sempre — família, peso 400 e o eixo "wdth" zerado, porque
            a Instrument Serif não é variável. NÃO redeclare família aqui nem
            numa classe de rota: um segundo lugar dizendo a mesma coisa é o
            começo de dois lugares dizendo coisas diferentes. */}
        <Titulo className="chamada__frase" id={idTitulo}>
          {frase}
        </Titulo>

        {rotulo ? <BotaoRevelar rotulo={rotulo} href={href} /> : null}

        {rotulo && aviso ? <p className="chamada__aviso">{aviso}</p> : null}
      </div>
    </section>
  );
}
