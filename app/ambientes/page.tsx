import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import AmbienteBloco from "@/components/AmbienteBloco";
import TracoAmbientes from "@/components/TracoAmbientes";
import Fechamento from "@/components/Fechamento";
import ProjetoComercial from "@/components/ProjetoComercial";
import { ambientes } from "@/lib/dados";

export const metadata: Metadata = {
  title: "Ambientes planejados — LDF Planejados",
  description:
    "Cozinha, dormitório e sala planejados, de fábrica própria, com foto de obra entregue. Closet, home office, área gourmet, lavanderia e banheiro entram no mesmo projeto do ambiente vizinho. E uma loja comercial inteira, da fachada à linha de serviço.",
};

/* Quatro tempos: abertura → lista → projeto comercial → CTA.

   A LISTA SÓ RENDERIZA AMBIENTE COM FOTO. O array tem quatro, e o banheiro
   entra com `fotos: []` de propósito — a única foto existente é print de story
   e não sobrevive ao recorte. O filtro é por fotos.length, e não por uma flag
   separada: a condição de aparecer é ter material, e ler isso do próprio
   material evita o segundo campo que alguém esquece de virar.

   O ÍNDICE PASSADO AO BLOCO É O DE DEPOIS DO FILTRO. É ele que decide o
   espelhamento, e usar o índice do array original faria a alternância pular um
   lado toda vez que um ambiente sem foto caísse no meio.

   A revelação em máscara saiu. Ela abria a foto por clip-path conforme o bloco
   atravessava a viewport, e medida com fotografia real só chegava ao quadro
   cheio quando o bloco já saía pelo topo — na posição de leitura a foto era um
   disco. No lugar, cada bloco tem uma pilha de fotos do mesmo ambiente,
   trocadas por botão: a foto está inteira desde o primeiro quadro, e quem
   escolhe o que ver é quem está lendo.

   O TRAÇO continua puxado pela rolagem, como sempre foi. As ondas contam os
   blocos que REALMENTE renderizam, mais uma de entrada — contar o array inteiro
   daria uma onda a mais para um bloco que não existe na página.

   O QUARTO TEMPO É NOVO, E NÃO É O ANTIGO BLOCO COMERCIAL DE VOLTA. O
   <Comercial /> e o <Elevacao /> que ele consumia foram apagados duas rodadas
   atrás, e continuam apagados: aquilo era um desenho vetorial de elevação com
   texto argumentativo e nenhuma fotografia — uma seção que se sustentava no
   argumento porque não havia material. O que entra agora é o
   <ProjetoComercial />, arquivo novo, e ele é o material: quatro fotos de uma
   loja entregue. Quem for mexer aqui não deve recuperar o arquivo antigo do
   histórico.

   O id="comercial" NÃO VOLTOU. Ele era a âncora desta rota e saiu junto com o
   bloco antigo; o item "Espaços comerciais" saiu do rodapé no mesmo commit.
   A seção nova é rotulada por aria-labelledby="t-com" e não tem id — reviver
   a âncora exigiria devolver o link do rodapé, e isso é outra decisão.

   Nota para quem for reconstruir: o comentário que estava aqui afirmava que o
   <Comercial /> "continua também na home". Era falso — o grep mostra que ele
   só era importado por este arquivo, e a home nunca o teve na lista. Foi por
   isso que a remoção pôde ser feita numa rota só, e é por isso que esta volta
   também é de uma rota só.

   O CTA reaproveita o <Fechamento />, que traz o id="contato" junto. */

const comFoto = ambientes.filter((a) => a.fotos.length > 0);

export default function PaginaAmbientes() {
  return (
    <>
      <Nav />
      <main>
        <section className="section wrap pagina-ambientes" aria-labelledby="t-amb">
          {/* A cortina cobre só o cabeçalho e sobe quando ele entra na tela.
              O gatilho é o `rise` daqui, que o Reveal do layout já observa —
              nenhum IntersectionObserver novo. O CSS da seção 11a explica por
              que o `rise` precisa ser neutralizado neste elemento.

              A FAIXA É DE PONTA A PONTA e o TEXTO NÃO. Quem escapa do gutter é
              só o .cortina; o .cortina__cabeca devolve o gutter ao conteúdo.
              Manchete correndo até o pixel da borda num monitor largo não se
              lê — a linha fica longa demais para o olho voltar ao começo.

              A CORTINA ANIMA EM TODA ENTRADA, e voltou a ser CSS puro. Por
              uma rodada ela subiu uma vez por sessão, guardada em
              sessionStorage por um componente cliente; a decisão foi revertida
              de propósito. Animar na primeira visita e não animar nas
              seguintes lê como defeito, não como memória — a inconsistência
              custa mais que os ~600ms. O que mitiga a repetição é a animação
              ser curta, e não ela sumir.

              Esta rota voltou a ser 100% servidor: nenhum componente cliente
              nasceu aqui. Ver a seção 11a da folha. */}
          <div className="cortina rise">
            <div className="cortina__faixas" aria-hidden="true">
              <span className="cortina__faixa" />
              <span className="cortina__faixa" />
              <span className="cortina__faixa" />
              <span className="cortina__faixa" />
              <span className="cortina__faixa" />
            </div>

            {/* NÃO É REDUNDANTE com o @media (scripting: none) do fim da folha.
                Aquela regra revela `.rise`; as faixas não são `.rise` — são
                spans cujo repouso é scaleY(1), e quem as move é `.cortina.in`,
                que sem JS nunca chega. Sem este <noscript> a abertura da rota
                seria uma tapadeira vermelha de borda a borda por cima do
                cabeçalho. Verificado no protocolo, com o script desligado: esta
                é a ÚNICA regra que casa com .cortina__faixas e a esconde.
                Também é o caminho que vale em navegador sem suporte a
                `scripting`, onde a media query nem é lida. */}
            <noscript>
              <style>{".cortina__faixas{display:none}"}</style>
            </noscript>

            {/* .display dá o degrau de TAMANHO; .manchete-serifada troca a
                família para a Instrument Serif e zera o eixo "wdth" que a
                .display pede — a serifada não é variável, e o eixo aplicado
                nela dá resultado que muda de navegador para navegador. O
                porquê completo está na seção 3 da folha.

                CORREÇÃO DE ROTA: por uma rodada esta manchete saiu em Archivo,
                porque `.display` não declara família e herda a do body. O
                :root sempre disse que a serifada é da manchete — era a home
                que estava certa, e esta página é que estava fora do sistema. */}
            <div className="section__head cortina__cabeca rise">
              <h1 className="display manchete-serifada" id="t-amb">
                Cada ambiente tem a sua régua, e é ela que decide o projeto.
              </h1>
              <p className="lede">
                Uma cozinha se resolve por circulação e altura de bancada. Um closet, por
                volumetria e iluminação interna. São projetos diferentes, e o site trata cada um no
                seu próprio capítulo.
              </p>
            </div>
          </div>

          <div className="lista-ambientes">
            <TracoAmbientes ondas={comFoto.length + 1} />

            {comFoto.map((amb, i) => (
              <AmbienteBloco key={amb.nome} amb={amb} indice={i} />
            ))}
          </div>
        </section>

        {/* IRMÃ da lista, não filha: fica FORA do </section> acima. A lista de
            ambientes é residencial e tem o próprio cabeçalho e o próprio
            traço; pendurar a obra comercial dentro dela a faria parecer mais
            um item da lista, sob o mesmo h1. */}
        <ProjetoComercial />

        <Fechamento />
      </main>
      <Footer />
    </>
  );
}
