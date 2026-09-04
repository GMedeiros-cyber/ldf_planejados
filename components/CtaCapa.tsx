import Link from "next/link";

/* O CTA de conversão da capa. Mora DENTRO da fila de ícones do herói, no lugar
   que era do ícone de WhatsApp.

   ══ POR QUE ELE ESTÁ NA FILA, E NÃO COLADO NA MANCHETE ══

   O canto inferior direito já era o lugar de ação da capa: as três redes e o
   mapa vivem ali. Um botão solto perto da headline abriria um SEGUNDO ponto de
   ação na mesma tela, e a capa passaria a ter dois centros — a manchete
   disputando com ela mesma.

   ⚠ ELE PERTENCE À FILA, E ISSO É REGRA DE DESENHO, NÃO ACASO. Mesma altura de
   alvo dos ícones (--fila-altura), mesma sombra projetada, mesma tinta. O que
   o diferencia é o rótulo e o contorno — nada mais. Um botão preenchido ali
   pareceria peça de outra tela, colada depois.

   ══ POR QUE COMPONENTE PRÓPRIO, E NÃO O `.btn-capsula` DA NAV ══

   Pedido explícito do cliente: não repetir componente. E há razão de desenho
   junto — a cápsula da nav é preenchida e mora sobre a barra escura; este vive
   sobre FOTOGRAFIA, que muda a cada seis segundos, e por isso é vazado e
   carrega a sombra que os ícones vizinhos já carregam.

   ⚠ LINK INTERNO: sem target="_blank". Quem clica continua no site — é o
   caminho para /contato, não uma saída para fora.

   ══ A TIPOGRAFIA CONVERSA COM A MANCHETE, E TEM ARMADILHA ══

   É a mesma Instrument Serif 400 do `.hero__titulo`. O
   `font-variation-settings: normal` do CSS não é enfeite e já mordeu esta base
   três vezes: a Instrument Serif NÃO é variável, e qualquer degrau da rampa
   que carregue um eixo `wdth` faz o navegador sintetizar um falso-negrito. O
   precedente está no `.hero__titulo`, e a regra daqui copia. */

export default function CtaCapa() {
  return (
    <Link className="hero__cta" href="/contato">
      Começar agora
    </Link>
  );
}
