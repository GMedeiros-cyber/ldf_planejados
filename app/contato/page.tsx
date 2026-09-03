import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FormularioContato from "@/components/FormularioContato";
import CartaoEndereco from "@/components/CartaoEndereco";
import FundoContato from "@/components/FundoContato";
import { contato, whatsappUrl } from "@/lib/dados";

export const metadata: Metadata = {
  title: "Contato — LDF Planejados",
  description:
    "Fale com a fábrica: endereço em Guarulhos, e-mail e WhatsApp da LDF Planejados. Formulário de projeto em breve.",
};

/* A ROTA COMEÇA NO FORMULÁRIO. Não há capa.

   ══ O HERÓI DE MADEIRA SAIU, E COM ELE O ÚLTIMO <ChamadaMadeira /> ══

   Esta página abria com o bloco de madeira — logotipo, a frase "Conta o seu
   projeto pra gente." e nada mais. Decisão do cliente: quem chega em /contato
   veio preencher, e uma tela de capa antes disso é uma rolagem entre a pessoa
   e o que ela veio fazer.

   ⚠ O <ChamadaMadeira /> FICOU SEM CONSUMIDOR NENHUM. Esta rota era a última;
   /ambientes já tinha voltado ao <Fechamento /> uma rodada antes. O componente
   NÃO foi apagado — a decisão de apagar é outra conversa, e está reportada.
   Se ele voltar a ser usado, o contrato das cinco props continua de pé.

   ══ QUEM VIROU O <h1> ══

   O título do formulário — "Preencha os dados do projeto." — passou de <h2> a
   <h1>. É o único <h1> da rota, e é o certo: agora ele é a manchete da página,
   não o subtítulo de uma capa.

   ⚠ ISSO ABRIU UM PULO DE NÍVEL: o <h3> "Fábrica e loja" do <CartaoEndereco />
   e os quatro do rodapé passaram a vir logo depois de um <h1>, sem <h2> no
   meio. Não é falha de critério do WCAG, é aviso de auditoria — e o conserto é
   uma tag no CartaoEndereco. Ficou de fora desta rodada de propósito: mexer
   naquele componente não estava no pedido.

   O <BotaoRevelar> continua sendo o botão de ENVIAR do formulário, com
   `tipo="submit"`. É o lugar certo para ele.

   ══ A ROTA PASSOU A REVELAR NA ROLAGEM ══

   /contato era a única rota que entrava seca: nenhum bloco tinha `.rise`, a
   classe que o <Reveal /> do layout observa. Agora três têm — o cabeçalho da
   seção, o cartão e a coluna do formulário —, e é a MESMA classe e o MESMO
   observador do resto do site. Nenhuma animação nova foi inventada.

   ⚠ O CABEÇALHO E O FORMULÁRIO NASCEM ACIMA DA DOBRA, e por isso revelam de
   imediato: o IntersectionObserver já os encontra intersectando na primeira
   varredura, o `in` entra no mesmo quadro e não há atraso nenhum. É esperado,
   não defeito — com a capa de madeira fora, o topo da página É o formulário.
   Quem de fato ganha percurso é o cartão, que em telas normais começa abaixo
   da dobra.

   ⚠ O CARTÃO GANHOU UM <div> DE INVÓLUCRO em vez de receber a classe direto.
   O `.contato__lado` é `position: sticky` acima de 900px, e `.rise` anima
   `transform` — transform num ancestral cria bloco de contenção e MATA o
   sticky do filho. O invólucro fica por dentro do sticky, então o que se move
   é o cartão, e a coluna continua acompanhando a rolagem.

   SEM JAVASCRIPT tudo aparece: a `@media (scripting: none)` no fim da folha
   devolve `.rise` a opacity 1. Conferido nesta rodada, não deduzido.

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

   ══ A HISTÓRIA DO PALCO DE MADEIRA, PARA QUEM VIER DEPOIS ══

   Ele já foi escrito à mão neste arquivo — <FundoMadeira />, <Logo />, a frase
   e um botão —, virou o <ChamadaMadeira /> quando /ambientes passou a fechar
   com o mesmo bloco, sobreviveu à volta daquela rota ao <Fechamento />, e
   agora saiu daqui também. Não sobrou consumidor.

   O ARQUIVO CONTINUA EM components/ChamadaMadeira.tsx, com o contrato de cinco
   props intacto e a documentação dele de pé. A madeira, a medição do véu e o
   porquê de a URL vir por variável estão na seção 15 da folha.

   ⚠ SE ALGUÉM FOR RESSUSCITÁ-LO, leia o topo daquele arquivo antes: `titulo`
   escolhe o nível do cabeçalho e tem padrão "h2", `marca` decide se o logotipo
   entra, e `rotulo`/`aviso` só fazem sentido onde há botão. Esta rota o usava
   com `marca` e `titulo="h1"` — combinação de CAPA, que é justamente o papel
   que ela deixou de querer. */

export default function PaginaContato() {
  return (
    <>
      <Nav />
      <main>
        <section className="contato__corpo" aria-labelledby="t-form">
          <FundoContato />

          <div className="contato__grade wrap">
            {/* COLUNA ESQUERDA — no DOM primeiro, na tela à esquerda, e no
                celular DEPOIS do formulário (ver a nota no topo). */}
            <div className="contato__lado">
              <div className="section__head rise">
                {/* VIROU O <h1> DA ROTA quando a capa de madeira saiu. As
                    classes não mudaram: `.h2` dá o TAMANHO e `.manchete-
                    serifada` dá a família — o nível é decisão de hierarquia de
                    documento, e o sistema já trata as duas coisas como
                    separadas (ver a seção 3 da folha). */}
                <h1 className="h2 manchete-serifada" id="t-form">
                  Preencha os dados do projeto.
                </h1>
                <p className="lede">
                  Apenas seis campos. Respondemos em até um dia útil com os próximos passos ou já
                  com uma data para medir.
                </p>
              </div>

              <div className="rise">
                <CartaoEndereco />
              </div>
            </div>

            {/* COLUNA DIREITA — o formulário. */}
            <div className="contato__coluna-form rise">
              <FormularioContato />
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
