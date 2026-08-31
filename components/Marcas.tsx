import { marcas } from "@/lib/dados";
import CarrosselMarcas from "./CarrosselMarcas";

/* Faixa de logos entre o Processo e a Fábrica, em campo dourado.

   ⚠ AS CINCO MARCAS SÃO FICTÍCIAS. Nenhuma dessas empresas existe — ver o
   PLACEHOLDER em lib/dados.ts. Enquanto for assim, esta seção NÃO vai ao ar.

   O rótulo é "Também fabricamos para" por decisão do cliente. Registro aqui
   que ele ainda afirma relação comercial com cinco empresas inventadas: a
   frase precisa sair, ou os nomes precisam ser reais, antes do deploy.

   ACESSIBILIDADE: o desenho dos logos vive num <canvas>, que leitor de tela
   não lê — e por isso o canvas é aria-hidden. Quem carrega a informação é a
   lista abaixo, visualmente oculta mas presente no HTML do servidor. Ela não
   é redundância: é a única via textual dos nomes.

   O rótulo é um h2 de verdade, fora do canvas, e dá o nome acessível da
   seção pelo aria-labelledby. */

export default function Marcas() {
  return (
    <section className="section wrap marcas" aria-labelledby="t-marcas">
      <h2 className="marcas__rotulo" id="t-marcas">
        Também fabricamos para
      </h2>

      <ul className="oculto-visual">
        {marcas.map((m) => (
          <li key={m.arquivo}>{m.nome}</li>
        ))}
      </ul>

      <CarrosselMarcas />
    </section>
  );
}
