import { marcas } from "@/lib/dados";
import CarrosselMarcas from "./CarrosselMarcas";
import FundoAuralis from "./FundoAuralis";

/* Faixa de logos entre o Processo e a Fábrica. Fundo igual ao da História e
   ao do Processo: o shader do FundoAuralis.

   ══════════════════════════════════════════════════════════════════════════
   ⚠  ESTA SEÇÃO INTEIRA É PLACEHOLDER E NÃO PODE SER PUBLICADA.
   ══════════════════════════════════════════════════════════════════════════

   Duas coisas, e as DUAS bloqueiam o deploy:

   1. AS CINCO MARCAS SÃO FICTÍCIAS. Clínica Vértice, Colégio Aurora, Studio
      Lume, Grupo Pilar e Traço Escritórios não existem — ver o PLACEHOLDER em
      lib/dados.ts.

   2. A HEADLINE AFIRMA RELAÇÃO COMERCIAL. "Empresas que já confiaram na
      gente" é declaração direta de clientes atendidos, mais forte que o
      "Também fabricamos para" anterior. Sobre nomes inventados, é afirmação
      falsa sobre a operação da empresa — não é licença de layout.

   Antes de qualquer publicação: ou entram nomes reais de clientes que
   autorizaram o uso da marca, ou a seção sai da página. Trocar só a headline
   não resolve, porque os nomes continuam inventados; trocar só os nomes não
   resolve, porque a frase precisa corresponder ao que foi autorizado.

   ACESSIBILIDADE: o desenho dos logos vive num <canvas>, que leitor de tela
   não lê — e por isso o canvas é aria-hidden. Quem carrega a informação é a
   lista abaixo, visualmente oculta mas presente no HTML do servidor. Ela não
   é redundância: é a única via textual dos nomes.

   O rótulo é um h2 de verdade, fora do canvas, e dá o nome acessível da
   seção pelo aria-labelledby. */

export default function Marcas() {
  return (
    <section className="section wrap marcas" aria-labelledby="t-marcas">
      <FundoAuralis />

      {/* PLACEHOLDER — ver o aviso no topo do arquivo. */}
      <h2 className="marcas__rotulo" id="t-marcas">
        Empresas que já confiaram na gente
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
