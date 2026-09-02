import { mapaUrl } from "@/lib/dados";

/* "Ver no mapa": pílula vermelha com alfinete, e sob o ponteiro um mapa de
   papel se desdobra por baixo dela.

   PORTADO do componente do Uiverse (dexter-st). O desenho é o mesmo; o que
   mudou foi tudo o que fazia dele um enfeite em vez de um controle. Os quatro
   defeitos da fonte estão consertados, e cada conserto está anotado onde ele
   acontece — no CSS, seção 18d, ou aqui embaixo.

   ══ (d) É UM <a>, E NÃO UM <div> ══

   Este é o conserto que muda a natureza da peça. Na fonte o rótulo era um
   `<div class="map-btn">`: sem href, sem papel, fora da ordem do Tab e mudo
   para o leitor de tela. Aqui é NAVEGAÇÃO — leva para fora do site —, então é
   uma âncora de verdade, com destino, `target="_blank"` e `rel="noopener"`,
   que é a convenção do Footer e das Avaliações desta base.

   O `:focus-visible` produz exatamente o mesmo estado do `:hover`, e isso está
   no CSS: sem esse par, quem navega por teclado chegaria ao botão e não veria
   o mapa se abrir.

   ══ O MAPA É DECORAÇÃO, E ISSO PRECISA FICAR CLARO ══

   O desenho que se desdobra NÃO é a redondeza da fábrica. É um borrão de
   `feTurbulence` deslocado, sem uma rua, sem um nome, sem escala. Ele é
   `aria-hidden` porque não carrega informação nenhuma — quem quiser o mapa de
   verdade clica e vai para o Google.

   É justamente por não afirmar nada que ele passa. Se um dia alguém trocar
   este borrão por ruas desenhadas, o componente passa a afirmar uma
   localização que ninguém conferiu, e aí ou o desenho fica correto ou sai.

   ══ (b) O FILTRO É SINGLETON, E ISSO É CONTRATO ══

   O `<filter>` tem um id de documento — `ldf-mapa-terra` —, e o CSS o alcança
   por `url(#ldf-mapa-terra)`. Id é global: DUAS INSTÂNCIAS NA MESMA PÁGINA
   dariam id repetido, que é HTML inválido.

   O que NÃO aconteceria é o desenho quebrar: as duas definições são idênticas,
   e as duas referências resolveriam para a primeira. O prejuízo é de validade
   e de ferramenta, não de pixel — vale saber para não caçar um bug visual que
   não existe.

   A GARANTIA É ESTRUTURAL: o único consumidor é o <CartaoEndereco />, e o
   cartão é um por rota. Se um segundo aparecer, o conserto é uma prop `id`
   aqui e a mesma prop na `--filtro-terra` do CSS. Não use `useId` para isso
   sem pensar: ele obrigaria este componente a ser cliente, e ele não tem
   estado nenhum. */

export default function BotaoMapa() {
  return (
    <div className="mapa">
      {/* O SVG existe só para hospedar o filtro. `height/width` zero e
          `aria-hidden` para ele não ocupar caixa nem entrar na leitura.

          ══ (c) SEIS OITAVAS VIRARAM TRÊS ══

          A fonte usava numOctaves="7". Cada oitava dobra a frequência a partir
          de baseFrequency 0.006 — a sétima roda a 0,384, uma granulação que o
          `scale=700` do deslocamento esmaga e ninguém enxerga. Medido em
          celular: com 7 oitavas o filtro custa caro para desenhar algo
          indistinguível do que 3 oitavas dão.

          E o filtro só é APLICADO no hover e no foco. Na fonte ele era
          calculado sempre, mesmo com o mapa em `opacity: 0` e `scaleX(0)` —
          custo integral por um desenho invisível. O CSS da seção 18d só liga
          `filter: url(...)` quando o mapa vai realmente aparecer. */}
      <svg className="mapa__filtro" height="0" width="0" aria-hidden="true" focusable="false">
        <filter id="ldf-mapa-terra">
          <feTurbulence result="turb" numOctaves="3" baseFrequency="0.006" type="fractalNoise" />
          <feDisplacementMap
            yChannelSelector="G"
            xChannelSelector="R"
            scale="700"
            in="SourceGraphic"
            in2="turb"
          />
        </filter>
      </svg>

      <a className="mapa__botao" href={mapaUrl} target="_blank" rel="noopener">
        Ver no mapa
      </a>

      <span className="mapa__alfinete" aria-hidden="true" />

      <span className="mapa__papel" aria-hidden="true">
        <span className="mapa__dobra mapa__dobra--1" />
        <span className="mapa__dobra mapa__dobra--2" />
        <span className="mapa__dobra mapa__dobra--3" />
        <span className="mapa__dobra mapa__dobra--4" />
      </span>
    </div>
  );
}
