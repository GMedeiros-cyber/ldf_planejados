import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FundoMadeira from "@/components/FundoMadeira";
import Logo from "@/components/Logo";
import BotaoRevelar from "@/components/BotaoRevelar";
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

   ══ A MADEIRA É OUTRA, E É DE PROPÓSITO ══

   Esta textura é bem mais quente que a do CTA da home: RGB médio (88,53,30)
   contra (53,50,45), medido nos arquivos de 1600. A diferença de temperatura é
   o que faz esta rota parecer outro lugar, e não a home com outro texto. NÃO é
   inconsistência a corrigir. As URLs entram por `--textura-1x` e
   `--textura-2x` no seletor pai — ver .contato__palco na seção 18 da folha, e
   o porquê do arranjo em .fundo-madeira__textura, na 11b. O <FundoMadeira />
   é o MESMO componente do Fechamento, com o mesmo parallax; nada foi
   duplicado. */

export default function PaginaContato() {
  return (
    <>
      <Nav />
      <main>
        <section className="contato__palco" aria-labelledby="t-contato">
          <FundoMadeira />

          <div className="contato__conteudo wrap">
            <Logo className="contato__marca" />

            {/* Instrument Serif pela terceira vez nesta base, e pela terceira
                vez com as mesmas três linhas: família, peso 400 e
                `font-variation-settings: normal`. A fonte NÃO é variável, e
                herdar o eixo "wdth" do body — ou de um degrau da rampa — dá
                resultado que muda de navegador para navegador. O precedente é
                o .ambiente__nome; ver a seção 3 da folha. */}
            <h1 className="contato__frase" id="t-contato">
              Conta o que você quer fazer.
            </h1>

            {/* Sem `href`: não há para onde mandar ainda. A prop existe e a
                troca é de uma linha quando o formulário nascer. */}
            <BotaoRevelar rotulo="Falar com a LDF" />

            {/* A linha segue o botão e explica por que ele está apagado. Em
                --ink-2, não em --ink-3: sob o véu desta madeira o --ink-3 mede
                2,1:1 no pixel mais claro. O número está na seção 18. */}
            <p className="contato__aviso">Formulário em breve.</p>
          </div>
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
                rel="noopener noreferrer"
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
