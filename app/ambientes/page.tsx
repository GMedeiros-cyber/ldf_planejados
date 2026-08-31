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
    "Cozinha, dormitório, closet, home office, área gourmet, banheiro, sala e lavanderia: cada ambiente tem a sua régua, e a LDF projeta cada um no seu próprio capítulo.",
};

/* Quatro tempos: abertura → residencial → comercial → CTA.

   A PILHA SAIU. Cards que grudavam no topo e eram cobertos pelo seguinte
   funcionam com quatro ou cinco; com oito viravam sete telas de rolagem
   presa, e quem quisesse chegar ao comercial pagava as oito antes. No lugar
   entra uma lista comum, que rola no ritmo de quem lê, com a revelação em
   máscara marcando a chegada de cada bloco.

   Com ela saiu também a restrição que dominava este arquivo: o sticky morria
   em silêncio se qualquer ancestral tivesse overflow. A regra continua boa
   higiene e nada aqui a viola — .lista-ambientes é `position: relative` e só,
   porque precisa ser o bloco de contenção do traço, e nenhum wrapper novo
   declara overflow. Mas hoje a página não depende mais disso para funcionar.

   O TRAÇO é irmão dos blocos, não pai: uma camada absoluta dentro da mesma
   seção. Assim ele não entra na cadeia de ancestrais de nada.

   O <Comercial /> continua IRMÃO da seção residencial, e continua também na
   home. O id="comercial" dele é a âncora desta rota.

   O CTA reaproveita o <Fechamento />, com o fundo de madeira. Ele traz o
   id="contato" junto — é o mesmo alvo que a home oferece, agora também aqui,
   e por isso o botão do <Comercial /> continuar apontando para "/#contato"
   manda para a home quando bastaria descer. Não mexi nisso: é decisão do
   Comercial, que vive nas duas páginas. */

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
            {/* Uma onda por bloco, mais uma de entrada, para o traço já estar
                em curso quando o primeiro ambiente chega. */}
            <TracoAmbientes ondas={ambientes.length + 1} />

            {ambientes.map((amb, i) => (
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
