import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import VitrineAmbientes from "@/components/VitrineAmbientes";
import Comercial from "@/components/Comercial";
import Fechamento from "@/components/Fechamento";

export const metadata: Metadata = {
  title: "Ambientes planejados — LDF Planejados",
  description:
    "Cozinha, dormitório, sala e banheiro planejados, de fábrica própria. Closet, home office, área gourmet e lavanderia entram no mesmo projeto do ambiente vizinho.",
};

/* Quatro tempos: abertura → vitrine → comercial → CTA.

   A LISTA VERTICAL SAIU, e com ela a revelação em máscara. Eram oito blocos
   alternando foto e texto, cada um abrindo por clip-path conforme atravessava
   a viewport. Dois motivos para trocar: os ambientes caíram de oito para
   quatro — quatro blocos não sustentam uma página de rolagem — e a máscara,
   medida com as fotos reais, só chegava ao quadro cheio quando o bloco já
   estava saindo pelo topo. Na posição de leitura a foto era um disco.

   No lugar entra a VitrineAmbientes: um painel só, um ambiente por vez,
   navegação por setas. A foto não é mais recompensa de rolagem; está inteira
   desde o primeiro quadro.

   O TRAÇO FICA, com outro trabalho. Deixou de desenhar conforme a página rola
   e passou a marcar em que ambiente se está — barra de progresso dos quatro.
   A .traco__caixa é absoluta e resolve contra ESTA section, que é quem tem
   position: relative, então ele cobre o cabeçalho também.

   O <Comercial /> continua IRMÃO da seção, e continua também na home. O
   id="comercial" dele é a âncora desta rota. O CTA reaproveita o
   <Fechamento />, que traz o id="contato" junto. */

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

          <VitrineAmbientes />
        </section>

        <Comercial />

        <Fechamento />
      </main>
      <Footer />
    </>
  );
}
