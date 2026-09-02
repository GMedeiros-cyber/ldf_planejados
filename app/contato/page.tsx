import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ChamadaMadeira from "@/components/ChamadaMadeira";
import { contato, whatsappUrl } from "@/lib/dados";

export const metadata: Metadata = {
  title: "Contato — LDF Planejados",
  description:
    "Fale com a fábrica: endereço em Guarulhos, e-mail e WhatsApp da LDF Planejados. Formulário de projeto em breve.",
};

/* MOCKUP. O botão desta página ainda não leva a lugar nenhum — o formulário
   vem depois, e é por isso que o <BotaoRevelar> entra sem `href` e renderiza
   um <button disabled>.

   ══ AS ÂNCORAS "/#contato" NÃO MUDARAM ══

   O Nav e o Footer continuam apontando para o id="contato" do <Fechamento />,
   na home. É deliberado, e o comentário daquele arquivo foi atualizado para
   registrar o motivo: a conversão do site inteiro não pode desembocar num
   botão inerte. A migração acontece quando o formulário existir, não quando a
   rota existir — e a rota existe a partir de agora.

   O que muda hoje é UMA coisa: o link "/contato" que o próprio <Fechamento />
   já tinha deixa de ser 404.

   ══ DOIS TEMPOS ══

   O palco de madeira, com o pedido, e uma faixa seca embaixo com os dados. A
   faixa não é enfeite nem repetição do rodapé: quem clica em "Contato" no
   menu muitas vezes quer o endereço da fábrica, não um botão. São TRÊS itens,
   e não o rodapé inteiro — endereço, e-mail e WhatsApp, todos vindos de
   `contato` em lib/dados.ts. Nada é digitado aqui.

   ══ O PALCO DE MADEIRA SAIU DAQUI, E CONTINUA FORA ══

   Ele era escrito à mão neste arquivo — <FundoMadeira />, <Logo />, a frase, o
   botão e o aviso — e virou o <ChamadaMadeira />. A extração aconteceu quando
   /ambientes passou a fechar com o mesmo bloco; aquela rota depois voltou ao
   <Fechamento />, por decisão do cliente, e ESTA PÁGINA É O ÚNICO CONSUMIDOR
   HOJE.

   A EXTRAÇÃO CONTINUA VALENDO. Ela não se justificava pelo número de
   chamadores: o bloco é componente por ser um bloco com contrato próprio —
   cinco props, cada uma com regra escrita —, e trazê-lo de volta para dentro
   desta rota devolveria sessenta linhas de JSX ao meio do arquivo em troca de
   nada. O porquê completo está no topo de components/ChamadaMadeira.tsx.

   O que esta página mostra não mudou com a extração nem com a reversão da
   outra rota — conferido com captura antes e depois, nas três larguras.

   `titulo="h1"` porque AQUI o bloco é a manchete da rota: não há outro título
   acima dele. O padrão da prop é "h2", para o dia em que ele voltar a fechar
   uma página que já tem o seu <h1>.

   `marca` pelo mesmo motivo: o bloco é a CAPA desta rota, e acima dele só
   existe a barra de navegação. O padrão da prop é NÃO ter marca — o caso de
   quem fecha uma página onde o logotipo já apareceu na nav e no rodapé.

   `aviso` entra porque o botão daqui está desabilitado e a linha diz por quê.
   Onde o botão converter, não entra.

   A madeira, a medição do véu e o porquê de a URL vir por variável estão na
   seção 15 da folha, junto do bloco. */

export default function PaginaContato() {
  return (
    <>
      <Nav />
      <main>
        {/* Sem `href`: não há para onde mandar ainda. A prop existe no
            componente e a troca é de uma linha quando o formulário nascer —
            momento em que o `aviso` também sai daqui. */}
        <ChamadaMadeira
          marca
          titulo="h1"
          idTitulo="t-contato"
          frase="Conta o que você quer fazer."
          rotulo="Falar com a LDF"
          aviso="Formulário em breve."
        />

        {/* FORA do palco de madeira, como faixa irmã. Dentro dele os dados
            competiriam com o pedido; aqui embaixo eles são o que sobra quando
            o pedido não é o que se quer. */}
        <section className="section wrap contato__dados" aria-labelledby="t-dados">
          <h2 className="label" id="t-dados">
            Onde nos achar
          </h2>

          <ul className="contato__lista">
            <li className="contato__item">
              <span className="contato__rotulo">Fábrica e loja</span>
              {/* Endereço não é link: não há mapa nesta rota, e um <a> que não
                  leva a lugar nenhum é pior que texto. */}
              <address className="contato__valor">
                {contato.endereco.rua}
                <br />
                {contato.endereco.bairro}
                <br />
                {contato.endereco.cep}
              </address>
            </li>

            <li className="contato__item">
              <span className="contato__rotulo">E-mail</span>
              <a className="contato__valor contato__link" href={`mailto:${contato.email}`}>
                {contato.email}
              </a>
            </li>

            <li className="contato__item">
              <span className="contato__rotulo">WhatsApp</span>
              <a
                className="contato__valor contato__link"
                href={whatsappUrl}
                target="_blank"
                rel="noopener"
              >
                {contato.whatsappExibicao}
              </a>
            </li>
          </ul>
        </section>
      </main>
      <Footer />
    </>
  );
}
