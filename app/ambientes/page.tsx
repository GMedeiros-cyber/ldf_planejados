import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import AmbienteBloco from "@/components/AmbienteBloco";
import TracoAmbientes from "@/components/TracoAmbientes";
import Comercial from "@/components/Comercial";
import Fechamento from "@/components/Fechamento";
import { ambientes } from "@/lib/dados";

export const metadata: Metadata = {
  title: "Ambientes planejados — LDF Planejados",
  description:
    "Cozinha, dormitório e sala planejados, de fábrica própria, com foto de obra entregue. Closet, home office, área gourmet, lavanderia e banheiro entram no mesmo projeto do ambiente vizinho.",
};

/* Quatro tempos: abertura → lista → comercial → CTA.

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

   O <Comercial /> continua IRMÃO da seção, e continua também na home. O
   id="comercial" dele é a âncora desta rota. O CTA reaproveita o
   <Fechamento />, que traz o id="contato" junto. */

const comFoto = ambientes.filter((a) => a.fotos.length > 0);

export default function PaginaAmbientes() {
  return (
    <>
      <Nav />
      <main>
        <section className="section wrap pagina-ambientes" aria-labelledby="t-amb">
          <div className="section__head rise">
            <h1 className="h2" id="t-amb">
              Cada ambiente tem a sua régua.
            </h1>
            <p className="lede">
              Uma cozinha se resolve por circulação e altura de bancada. Um closet, por volumetria
              e iluminação interna. São projetos diferentes, e o site trata cada um no seu próprio
              capítulo.
            </p>
          </div>

          <div className="lista-ambientes">
            <TracoAmbientes ondas={comFoto.length + 1} />

            {comFoto.map((amb, i) => (
              <AmbienteBloco key={amb.nome} amb={amb} indice={i} />
            ))}
          </div>
        </section>

        <Comercial />

        <Fechamento />
      </main>
      <Footer />
    </>
  );
}
