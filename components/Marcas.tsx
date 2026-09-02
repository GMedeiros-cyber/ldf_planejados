import { marcas } from "@/lib/dados";
import CarrosselMarcas from "./CarrosselMarcas";

/* Faixa de marcas entre o Processo e a Fábrica. Fundo chapado, em
   --ground-deep, entre duas seções que usam o shader do FundoAuralis. É o liso
   entre as duas texturas que separa a faixa dos blocos de argumento — não um
   fundo próprio dela.

   ══ A SEÇÃO SAIU DE PLACEHOLDER ══

   Havia aqui um aviso de bloqueio de deploy com duas condições, e as duas
   foram cumpridas: as cinco empresas são CLIENTES REAIS, o Renan trabalhou
   com todas, e o uso das marcas está autorizado. O aviso saiu junto com os
   nomes fictícios que ele descrevia.

   A HEADLINE FICA COMO ESTÁ. "Empresas que já confiaram na gente" é
   declaração direta de clientes atendidos — era ela que tornava o placeholder
   insustentável, e é exatamente a frase que passou a ser verdadeira. Trocar
   agora por algo mais frouxo enfraqueceria uma afirmação que a LDF pode
   fazer.

   DUAS DAS CINCO ENTRAM SÓ COM O NOME, sem símbolo, e o porquê está em
   lib/dados.ts: as marcas da Tesla Soluções e do Espaço Harmony são
   ilustração densa de traço fino, que não sobrevive ao tamanho da faixa.
   Elas continuam sendo clientes e continuam sendo nomeadas — o que falta é o
   desenho, não a autorização.

   ACESSIBILIDADE: o desenho dos logos vive num <canvas>, que leitor de tela
   não lê — e por isso o canvas é aria-hidden. Quem carrega a informação é a
   lista abaixo, visualmente oculta mas presente no HTML do servidor. Ela não
   é redundância: é a única via textual dos nomes, e lista AS CINCO, inclusive
   as duas que aparecem sem símbolo — para quem ouve a página, as cinco são
   iguais.

   A chave da lista é o `nome`, e não o `arquivo`: com `arquivo` opcional, as
   duas sem símbolo colidiriam numa chave `undefined`.

   O rótulo é um h2 de verdade, fora do canvas, e dá o nome acessível da
   seção pelo aria-labelledby. */

export default function Marcas() {
  return (
    <section className="section wrap marcas" aria-labelledby="t-marcas">
      <h2 className="marcas__rotulo" id="t-marcas">
        Empresas que já confiaram na gente
      </h2>

      <ul className="oculto-visual">
        {marcas.map((m) => (
          <li key={m.nome}>{m.nome}</li>
        ))}
      </ul>

      <CarrosselMarcas />
    </section>
  );
}
