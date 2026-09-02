import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ChamadaMadeira from "@/components/ChamadaMadeira";
import FormularioContato from "@/components/FormularioContato";
import { contato, whatsappUrl } from "@/lib/dados";

export const metadata: Metadata = {
  title: "Contato — LDF Planejados",
  description:
    "Fale com a fábrica: endereço em Guarulhos, e-mail e WhatsApp da LDF Planejados. Formulário de projeto em breve.",
};

/* O FORMULÁRIO CHEGOU, e com ele o mockup acabou.

   ══ TRÊS TEMPOS ══

   Herói de madeira (só a frase) → formulário → "Onde nos achar".

   O BOTÃO DO HERÓI SAIU. Ele existia para segurar a linha "Formulário em
   breve"; com o formulário logo abaixo, virava um clique a mais para chegar
   onde a pessoa já ia. Por isso o <ChamadaMadeira /> entra sem `rotulo` e sem
   `aviso` — a prop virou opcional para isto, e o bloco sem ela é capa, não
   pedido.

   O <BotaoRevelar> não ficou órfão: virou o botão de ENVIAR do formulário,
   com o novo `tipo="submit"`. É o lugar certo para ele.

   ══ AS ÂNCORAS "/#contato" AINDA NÃO MIGRARAM, E AGORA PODEM ══

   O Nav (linhas 22 e 157) e o Footer (linha 7) continuam apontando para o
   id="contato" do <Fechamento />, na home. O gatilho da migração sempre foi o
   FORMULÁRIO, e ele acabou de chegar — então a condição está satisfeita e a
   troca virou trabalho de uma próxima rodada, não mais uma espera.

   ⚠ NÃO FOI FEITA AQUI de propósito: mexer nas três âncoras muda a conversão
   do site inteiro, e isso merece a sua própria rodada e a sua própria
   verificação. O que falta está escrito em components/Fechamento.tsx.

   O link "/contato" que o <Fechamento /> já tinha continua valendo, e agora
   leva a uma página que faz alguma coisa.

   ══ A FAIXA "ONDE NOS ACHAR" FICA ══

   Ela não é enfeite nem repetição do rodapé: quem clica em "Contato" no menu
   muitas vezes quer o endereço da fábrica, não um formulário. São TRÊS itens,
   e não o rodapé inteiro — endereço, e-mail e WhatsApp, todos vindos de
   `contato` em lib/dados.ts. Nada é digitado aqui.

   Ela também é a SAÍDA quando o envio falha: a mensagem de erro do formulário
   manda chamar no WhatsApp, e o número está logo abaixo dela.

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
        {/* SEM `rotulo` e SEM `aviso`: o botão do herói saiu quando o
            formulário chegou. `marca` fica — este bloco é a capa da rota, e
            acima dele só existe a barra de navegação. */}
        <ChamadaMadeira
          marca
          titulo="h1"
          idTitulo="t-contato"
          frase="Conta o que você quer fazer."
        />

        <section className="section wrap contato__formulario" aria-labelledby="t-form">
          <div className="section__head">
            <h2 className="h2 manchete-serifada" id="t-form">
              Manda o seu pedido.
            </h2>
            <p className="lede">
              Seis campos. A gente responde em até um dia útil com as próximas perguntas — ou
              já com uma data para medir.
            </p>
          </div>

          <FormularioContato />
        </section>

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
