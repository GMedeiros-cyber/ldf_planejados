import Link from "next/link";

import { Seta } from "./Icones";

/* Botão de revelação: em repouso, uma pílula de contorno com o rótulo
   centrado; sob o ponteiro, o rótulo desliza para fora pela direita enquanto
   entra por ali o mesmo rótulo com a seta, e um ponto cresce até preencher a
   pílula de vermelho.

   ══ O QUE VEIO DA REFERÊNCIA, E O QUE NÃO VEIO ══

   A referência era shadcn, e só a IDEIA foi aproveitada. Ficaram de fora, uma
   a uma e por motivo:

     `cn()` e as classes utilitárias — esta base escreve CSS à mão, com nomes
     semânticos em português. Não há utilitário nenhum no JSX do projeto.

     `bg-primary` / `text-primary-foreground` — tokens que não existem aqui. O
     equivalente é `--red` com `--white` por cima; ver a nota de contraste
     abaixo.

     `lucide-react` — dependência inteira importada por causa de uma seta. A
     seta é a <Seta /> de components/Icones, que a base já usa nos botões de
     ambiente.

     `w-32` — 8rem de largura fixa. "Falar com a LDF" não cabe em 8rem, e nem
     caberia a maioria dos rótulos em português. Aqui a largura vem de padding
     horizontal mais um min-width, e o botão cresce com o texto.

   ══ O RÓTULO APARECE DUAS VEZES NO DOM ══

   É o que permite o cruzamento: um sai, o outro entra. A SEGUNDA OCORRÊNCIA
   LEVA aria-hidden="true" — sem isso o leitor de tela anuncia "Falar com a LDF
   Falar com a LDF", que é um defeito da referência e não uma consequência
   inevitável do efeito. A seta mora dentro da cópia oculta, e o ícone já traz
   o próprio aria-hidden.

   ══ O REPOUSO É COMPLETO ══

   Nada de informação que só existe sob o ponteiro: em repouso o botão já diz
   tudo o que tem a dizer, e o que o hover acrescenta é a seta e a cor. Em
   celular — onde hover não existe — não falta nada. A regra do efeito está em
   @media (hover: hover) na seção 7b da folha, junto com o :focus-visible que
   produz o mesmo destaque e com o movimento reduzido, que entrega o estado
   final sem percurso.

   ══ A ASSINATURA JÁ PREVÊ O DESTINO ══

   Com `href`, sai um link de verdade. Sem `href`, sai um <button
   type="button" disabled> — o estado de /contato hoje, porque o formulário
   ainda não existe e um botão que não leva a lugar nenhum precisa dizer isso
   ao teclado e ao leitor de tela, não só ao olho.

   ══ TRÊS SAÍDAS, E QUEM DECIDE É O PRÓPRIO href ══

   externo  →  <a target="_blank" rel="noopener">, que é a convenção da base:
               o Footer e as Avaliações usam exatamente esse par. `rel` sem
               `noreferrer` também é a convenção — o alvo é a própria empresa
               (WhatsApp da LDF), e cortar o referrer não protege ninguém aqui.
               NÃO é <Link>: o next/link não pré-carrega URL de outro domínio,
               e passar por ele só acrescenta uma camada que não faz nada.

   interno  →  <Link>, com o pré-carregamento que ele traz.

   sem href →  <button disabled>.

   A distinção é por PROTOCOLO, e não por "começa com /": um href futuro como
   "mailto:" ou "tel:" também não é rota interna, e cairia no <Link> se o teste
   fosse pela barra. */

type Props = {
  rotulo: string;
  /* Ausente enquanto não há destino. Ver o bloco acima. */
  href?: string;
  className?: string;
};

export default function BotaoRevelar({ rotulo, href, className }: Props) {
  const classe = `btn-revelar${className ? ` ${className}` : ""}`;

  const miolo = (
    <>
      {/* O disco que cresce. Puramente decorativo e fora da leitura. */}
      <span className="btn-revelar__disco" aria-hidden="true" />

      <span className="btn-revelar__repouso">{rotulo}</span>

      {/* A CÓPIA. aria-hidden porque o texto já foi anunciado acima. */}
      <span className="btn-revelar__revelado" aria-hidden="true">
        {rotulo}
        <Seta />
      </span>
    </>
  );

  if (href) {
    /* Qualquer coisa com esquema (http:, https:, mailto:, tel:) ou começando
       em "//" sai da aplicação. O resto é rota nossa. */
    const externo = /^([a-z][a-z0-9+.-]*:|\/\/)/i.test(href);

    if (externo) {
      return (
        <a className={classe} href={href} target="_blank" rel="noopener">
          {miolo}
        </a>
      );
    }

    return (
      <Link className={classe} href={href}>
        {miolo}
      </Link>
    );
  }

  /* `disabled` é a verdade do estado: não há para onde ir. Ele também tira o
     botão da ordem do Tab, que é o certo — mandar o teclado parar num controle
     inerte é pior que não parar. */
  return (
    <button className={classe} type="button" disabled>
      {miolo}
    </button>
  );
}
