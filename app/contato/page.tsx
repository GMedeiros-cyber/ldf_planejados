import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ChamadaMadeira from "@/components/ChamadaMadeira";
import FormularioContato from "@/components/FormularioContato";
import CartaoEndereco from "@/components/CartaoEndereco";
import FundoContato from "@/components/FundoContato";
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

══ AS ÂNCORAS MIGRARAM ══

   O gatilho estava escrito há três rodadas: a migração aconteceria "quando o
   formulário existir". Ele existe, e os três links do site passaram a apontar
   para esta rota:

     Nav 22   item "Contato" do menu
     Nav 157  a cápsula "Quero meu projeto"
     Footer 7 o item "Contato" do institucional

   Com isso o `id="contato"` do <Fechamento /> ficou sem ninguém apontando
   para ele e foi REMOVIDO — o porquê está naquele arquivo. Não existe mais
   nenhuma âncora "#contato" no projeto.

   O item "Contato" do menu agora ACENDE aqui, e só aqui: a função `ehAtual`
   do Nav ignorava qualquer href com "#", e sem o hash ela cai na comparação
   de rota.

══ A ROTA É DE DUAS COLUNAS, E A FAIXA VIROU CARTÃO ══

   Abaixo do herói existe UMA seção, em duas colunas:

     esquerda  manchete, lede e o <CartaoEndereco /> — a foto reservada da
               fachada, o endereço, os dois canais e o botão de mapa.
     direita   o formulário, sem uma linha alterada.

   A seção "Onde nos achar", que era uma faixa empilhada abaixo do formulário,
   DEIXOU DE EXISTIR. O conteúdo dela é o cartão agora, e o endereço aparece
   uma vez só na rota — antes ele corria o risco de ser digitado em dois
   lugares e divergir.

   ABAIXO DE 900px VIRA UMA COLUNA, E O FORMULÁRIO VEM PRIMEIRO. A ordem no
   DOM é esquerda-depois-direita, que é a de leitura no desktop; no celular o
   CSS inverte com `order`. Quem abre /contato no telefone veio preencher, e
   empurrar o formulário para depois de uma foto, um endereço e um botão de
   mapa é pedir que role três telas antes de fazer o que veio fazer.

   ⚠ A INVERSÃO É SÓ VISUAL. A ordem do Tab e a do leitor de tela seguem o DOM,
   então no celular o teclado ainda passa pelo cartão antes do formulário. É o
   preço de inverter por CSS, e é o certo: `order` não deve mexer na ordem de
   leitura. Se um dia isso incomodar, o conserto é trocar a ordem no DOM e
   inverter no desktop, não pôr tabindex.

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

        <section className="contato__corpo" aria-labelledby="t-form">
          <FundoContato />

          <div className="contato__grade wrap">
            {/* COLUNA ESQUERDA — no DOM primeiro, na tela à esquerda, e no
                celular DEPOIS do formulário (ver a nota no topo). */}
            <div className="contato__lado">
              <div className="section__head">
                <h2 className="h2 manchete-serifada" id="t-form">
                  Manda o seu pedido.
                </h2>
                <p className="lede">
                  Seis campos. A gente responde em até um dia útil com as próximas perguntas —
                  ou já com uma data para medir.
                </p>
              </div>

              <CartaoEndereco />
            </div>

            {/* COLUNA DIREITA — o formulário, sem uma linha alterada. */}
            <div className="contato__coluna-form">
              <FormularioContato />
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
