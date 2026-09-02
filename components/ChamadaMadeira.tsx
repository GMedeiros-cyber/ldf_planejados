import FundoMadeira from "./FundoMadeira";
import Logo from "./Logo";
import BotaoRevelar from "./BotaoRevelar";

/* Chamada sobre madeira: logo, frase serifada, botão de revelação e — quando
   há o que dizer — uma linha de aviso embaixo dele.

   NASCEU DENTRO DE app/contato/page.tsx e saiu de lá inteiro. Não foi copiado:
   /contato passou a consumir este arquivo no mesmo commit em que /ambientes
   passou a consumi-lo. Duas cópias do mesmo bloco divergem — esta base já
   pagou por isso mais de uma vez, e a mais cara foi o AmbienteBloco, que foi
   dois componentes irmãos de marcação idêntica até a razão da divisão sumir.

   Componente de SERVIDOR. Nada aqui é cliente; o único cliente na árvore é o
   <FundoMadeira />, que já era, e é o mesmo dos outros dois consumidores da
   camada de madeira.

   ══ O NÍVEL DO TÍTULO É PROP, E NÃO PODE DEIXAR DE SER ══

   Em /contato este bloco é a manchete da rota, e o título tem de ser <h1>. Em
   /ambientes a rota já tem o seu <h1> — "Cada ambiente tem a sua régua…" — e
   um segundo <h1> quebraria a hierarquia de cabeçalhos: o leitor de tela
   passaria a anunciar dois começos de documento, e a lista de títulos deixaria
   de descrever a página. Daí `titulo`, com "h2" no padrão, que é o caso
   comum.

   Não vira `<h${n}>` calculado nem `React.createElement` com string solta: a
   união literal "h1" | "h2" é o que faz o TypeScript recusar um "h7" ou um
   "div" antes do build.

   ══ A MADEIRA ══

   Quem declara os arquivos é a folha, em `.chamada`, e não este arquivo — ver
   a seção 18 do globals.css, que traz também a medição que escolheu a textura
   quente em vez da fria da home. O <FundoMadeira /> é o mesmo componente do
   Fechamento, com o mesmo parallax; o que muda entre um e outro são duas
   variáveis CSS.

   ══ O AVISO É OPCIONAL, E A REGRA É ESTREITA ══

   Ele existe para EXPLICAR UM BOTÃO QUE NÃO CONVERTE. Em /contato o botão está
   desabilitado e a linha diz por quê. Onde o botão leva a algum lugar, ela não
   entra: seria uma ressalva pendurada numa ação que funciona.

   ══ A MARCA É OPCIONAL, E O PADRÃO É NÃO TER ══

   `marca` nasce FALSE porque o caso comum é o bloco fechando uma página que já
   tem a marca duas vezes — no painel da navegação, no topo, e no rodapé, logo
   abaixo. Uma terceira aparição no fecho é repetição, não assinatura: é o que
   acontecia em /ambientes.

   Onde o bloco é a CAPA da rota, ela volta. /contato passa `marca` porque ali
   não há nada acima do bloco além da barra, e a página precisa se apresentar.

   O padrão é o caso comum, e não o primeiro que existiu: se o padrão fosse
   `true`, toda página nova nasceria com a repetição e teria de lembrar de
   desligá-la. */

type Props = {
  frase: string;
  rotulo: string;
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

        <BotaoRevelar rotulo={rotulo} href={href} />

        {aviso ? <p className="chamada__aviso">{aviso}</p> : null}
      </div>
    </section>
  );
}
