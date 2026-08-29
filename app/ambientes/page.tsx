import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Ambientes from "@/components/Ambientes";
import Comercial from "@/components/Comercial";

export const metadata: Metadata = {
  title: "Ambientes planejados — LDF Planejados",
  description:
    "Cozinha, dormitório, closet, home office, área gourmet, banheiro, sala e lavanderia: cada ambiente tem a sua régua, e a LDF projeta cada um no seu próprio capítulo.",
};

/* A pilha de cards depende de position: sticky, e sticky morre em silêncio se
   QUALQUER ancestral tiver overflow hidden, clip ou auto. A cadeia aqui é
   <html> → <body> → <main> → .section.wrap → .pilha, e nenhum deles declara
   overflow (o único overflow do bloco é o .pilha__card, que é descendente do
   sticky, não ancestral). Não envolva isto em wrapper novo sem conferir.

   O <Comercial /> entra como IRMÃO dessa section, não dentro dela: assim ele
   não chega a ser ancestral da pilha, e a questão do overflow nem se coloca.
   O id="comercial" dele passa a ser âncora desta rota.

   O texto do cabeçalho é o que vivia em Ambientes.tsx, com o h2 promovido a
   h1: agora é o título da página, não de uma seção da home. */

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

          <Ambientes />
        </section>

        <Comercial />
      </main>
      <Footer />
    </>
  );
}
