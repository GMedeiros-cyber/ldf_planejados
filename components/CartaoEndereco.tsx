import BotaoMapa from "./BotaoMapa";
import Logo from "./Logo";
import { contato, whatsappUrl } from "@/lib/dados";

/* O cartão de endereço da coluna esquerda de /contato.

   SUBSTITUI A FAIXA "Onde nos achar", que era uma seção própria empilhada
   abaixo do formulário. O conteúdo é o mesmo — endereço, e-mail e WhatsApp,
   todos de `contato` em lib/dados.ts — e agora mora num lugar só na rota. Não
   existe mais endereço duplicado em /contato.

   ⚠ A FOTO DA FACHADA NÃO EXISTE. A CAIXA É DELA; A LOGO SÓ A OCUPA.

   TODO: entra aqui a foto da FACHADA DA FÁBRICA, em Guarulhos. Não é a mesma
   de `historia.img`, que continua sendo mockup declarado no dados.ts, e não é
   foto de ambiente — o que este quadro promete é "onde a gente fica", e uma
   cozinha entregue no lugar disso seria uma promessa trocada.

   NÃO ponha foto de banco de imagem nem de outro ambiente. Um quadro honesto é
   melhor que uma fachada que não é a nossa — a mesma régua que fez o banheiro
   sair da lista de /ambientes por não ter foto própria.

   ══ A LOGO É PLACEHOLDER DECLARADO, NÃO A SOLUÇÃO ══

   O quadro ficou vazio e ia continuar assim por meses. Até a foto chegar, quem
   ocupa é o <Logo />, e é isso e nada mais: uma marca segurando um lugar.

   A TROCA É DE UMA LINHA. Apague o <Logo /> de dentro do `.cartao__foto` e ponha
   a <Image /> no lugar; depois some com o `.cartao__marca` e com as três
   declarações de centralização do `.cartao__foto` na folha (seção 18d), que
   existem só por causa deste provisório. A caixa NÃO muda: o `aspect-ratio`
   16/10 é da foto e já está reservado, então o layout não pula e o CLS continua
   zero — antes e depois desta rodada, medido.

   Quando a foto entrar, ela precisa de `width`, `height`, `alt` e
   `loading="lazy"`.

   ══ A LOGO ENTRA COMO DECORAÇÃO, E POR ISSO NÃO TEM ALT ══

   Três linhas abaixo dela o cartão já anuncia "Fábrica e loja", o endereço, o
   e-mail e o WhatsApp da LDF. A empresa JÁ ESTÁ NOMEADA ali, em texto. Uma
   `alt="LDF Móveis Planejados"` aqui faria o leitor de tela dizer o nome duas
   vezes seguidas sem acrescentar informação nenhuma — e o desenho não é o
   conteúdo do cartão, é o papel de parede do buraco onde a foto vai.

   O <Logo /> já nasce `aria-hidden` e `focusable="false"`, então nada precisa
   ser feito aqui além de manter o `aria-hidden` do quadro, que já existia
   quando ele estava vazio.

   O CASO DO <Nav /> É OUTRO e não serve de precedente: lá a logo é o único
   conteúdo do link para a home, e o nome vem no `aria-label` do <a>, não no
   SVG. Aqui não há link nem conteúdo — há um vazio decorado.

   ⚠ SE A FOTO NUNCA CHEGAR e alguém decidir que a logo fica, esta decisão
   MUDA: aí ela deixa de ser espera e vira a imagem do cartão, e a pergunta de
   acessibilidade tem de ser refeita do zero. */

export default function CartaoEndereco() {
  return (
    <div className="cartao">
      {/* PROVISÓRIO — ver o TODO no topo. O quadro é da foto da fachada; a
          logo só o ocupa até ela chegar. `aria-hidden` no quadro porque o
          conteúdo dele é decoração: o nome da LDF é anunciado pelo texto
          logo abaixo, e repeti-lo aqui seria dizê-lo duas vezes. */}
      <div className="cartao__foto" aria-hidden="true">
        <Logo className="cartao__marca" />
      </div>

      <div className="cartao__miolo">
        <h3 className="label">Fábrica e loja</h3>

        {/* <address> é o elemento certo para o endereço de contato de quem
            publica a página. O itálico e a margem do UA saem no CSS. */}
        <address className="cartao__endereco">
          {contato.endereco.rua}
          <br />
          {contato.endereco.bairro}
          <br />
          {contato.endereco.cep}
        </address>

        <p className="cartao__horario">{contato.horario}</p>

        <ul className="cartao__canais">
          <li>
            <a className="cartao__link" href={`mailto:${contato.email}`}>
              {contato.email}
            </a>
          </li>
          <li>
            <a className="cartao__link" href={whatsappUrl} target="_blank" rel="noopener">
              {contato.whatsappExibicao}
            </a>
          </li>
        </ul>

        <BotaoMapa />
      </div>
    </div>
  );
}
