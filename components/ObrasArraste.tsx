"use client";

import { useEffect } from "react";

/* Arrastar a pista de obras — com o dedo e com o mouse, pelo mesmo código.

   Componente de COMPORTAMENTO: não desenha nada, devolve null. O <Obras />
   continua sendo server component e os cards continuam sendo HTML servido;
   o que vai para o navegador é só isto.

   ══ O PROBLEMA QUE ESTE ARQUIVO EXISTE PARA RESOLVER ══

   A pista NÃO é rolável de verdade. Ela é uma animação de `transform`
   (`obras-desliza`, 70s) dentro de um `overflow-x: auto`. São dois
   deslocamentos independentes sobre o mesmo conteúdo: o `scrollLeft`, que é do
   visitante, e o `translate3d`, que é da animação. Eles se SOMAM.

   E somados eles estouram a pista. Medido a 1440: cada cópia tem 2261px, a
   pista inteira 4522, a área visível 1430 e o `scrollLeft` máximo 3236. Com o
   transform no fim do ciclo (2261), a janela visível começaria em 3236+2261 =
   5497 — quase mil pixels DEPOIS do fim da pista. Resultado: faixa vazia.

   ══ A SAÍDA NÃO É SOMAR, É TRANSFERIR ══

   O deslocamento vive num lugar de cada vez.

     AO PEGAR   a fase da animação vira `scrollLeft`: lê-se quanto o transform
                já andou, zera-se a animação e soma-se aquilo à rolagem. A tela
                não muda de posição — o mesmo pixel continua no mesmo lugar —,
                e o visitante passa a arrastar num sistema limpo, onde só o
                `scrollLeft` existe e o limite dele é o fim da pista.

     AO SOLTAR   o caminho inverso: o `scrollLeft` vira fase da animação, e a
                rolagem volta a zero. Com a rolagem em zero, o transform tem os
                2261px inteiros de curso pela frente e nunca passa do fim.

   ⚠ O RESTO `% cópia` É O QUE FAZ ISSO SER INVISÍVEL. As duas metades são
   idênticas, então deslocar por exatamente uma cópia mostra o mesmo pixel. É
   isso que permite normalizar a rolagem de volta para dentro de uma cópia sem
   que nada salte na tela — e é a mesma propriedade que faz o `-50%` dos
   keyframes fechar o laço sem costura.

   ══ POR QUE O GATILHO TAMBÉM É O `scroll`, E NÃO SÓ O PONTEIRO ══

   No dedo, quem rola é o navegador: o `overflow-x: auto` já faz isso, com
   inércia, e tirar isso dele para reimplementar em JavaScript seria trocar
   uma rolagem boa por uma pior. Então o ponteiro só PAUSA, e o arrasto segue
   nativo.

   Só que a inércia continua depois do dedo sair, e a roda do mouse e as setas
   do teclado rolam sem passar por ponteiro nenhum. Um ouvinte de `scroll`
   cobre os três: qualquer rolagem pausa, e a retomada espera 140ms de silêncio
   — o suficiente para a inércia terminar antes de a animação voltar.

   O ARRASTO COM MOUSE é a única parte de fato implementada aqui, porque
   `overflow-x: auto` não dá arrasto com mouse — dá barra e roda. */

/* A duração precisa bater com a de `obras-desliza`, na seção 8b do
   globals.css. Não dá para ler do CSS sem parsear texto, então está aqui em
   número — e é a única coisa neste arquivo que precisa andar junto com a
   folha. */
const DURACAO_MS = 70_000;

/* Silêncio de rolagem antes de devolver a animação. Curto o bastante para não
   parecer travado, longo o bastante para a inércia do dedo terminar. */
const OCIO_MS = 140;

export default function ObrasArraste() {
  useEffect(() => {
    const trilho = document.querySelector<HTMLElement>(".obras__trilho");
    const pista = trilho?.querySelector<HTMLElement>(".obras__pista");
    if (!trilho || !pista) return;

    /* ⚠ SEM ANIMAÇÃO NÃO HÁ O QUE PAUSAR — MAS AINDA HÁ O QUE ARRASTAR.

       É o caso de `prefers-reduced-motion`: a folha zera a animação e liga o
       `scroll-snap`. Toda a coordenação abaixo vira inócua sozinha, porque
       `pausar()` e `retomar()` saem na primeira linha quando não há animação.

       O arrasto com mouse, esse continua valendo: ele é rolagem pura e não
       depende de animação nenhuma. Sair aqui deixaria o cursor `grab`
       prometendo um gesto que não aconteceria — e quem pede menos movimento
       não está pedindo menos controle. */
    const animacao = () => pista.getAnimations()[0] ?? null;

    /* Uma cópia. As duas metades são idênticas, então é metade da pista. */
    const umaCopia = () => pista.offsetWidth / 2;

    let pausado = false;
    let arrastando = false;
    let ocioso: number | undefined;

    /* Onde o dedo/mouse pegou, e onde a rolagem estava naquele instante. */
    let xInicial = 0;
    let rolagemInicial = 0;

    /* ⚠ A ÚLTIMA ROLAGEM QUE NÓS ESCREVEMOS, e não um booleano.

       Foi assim que a primeira versão deste arquivo se quebrou: a guarda era
       uma bandeira ligada e desligada em volta da escrita. Só que o evento
       `scroll` é ASSÍNCRONO — ele chega no quadro seguinte, quando a bandeira
       já desligou. Resultado medido: `retomar()` zerava a rolagem, o evento de
       scroll dessa própria escrita chegava depois, era lido como rolagem do
       visitante, e pausava tudo de novo. A animação voltava e morria no mesmo
       quadro, para sempre.

       Guardar o VALOR resolve porque ele sobrevive ao intervalo: quando o
       evento enfim chega, basta comparar. */
    let rolagemEscrita: number | null = null;

    /* Escreve rolagem sem passar pelo `scroll-behavior: smooth` do trilho: a
       transferência tem de acontecer no mesmo quadro, ou ela vira uma
       animação de rolagem por cima da animação de transform. */
    function rolarSeco(x: number) {
      const antes = trilho!.style.scrollBehavior;
      trilho!.style.scrollBehavior = "auto";
      trilho!.scrollLeft = x;
      /* O que o navegador de fato aceitou, já limitado pelas pontas. */
      rolagemEscrita = trilho!.scrollLeft;
      trilho!.style.scrollBehavior = antes;
    }

    /* Quanto o transform já andou, em pixels. */
    function deslocamentoDaAnimacao() {
      const a = animacao();
      if (!a) return 0;
      const t = Number(a.currentTime ?? 0) % DURACAO_MS;
      return (t / DURACAO_MS) * umaCopia();
    }

    function pausar() {
      const a = animacao();
      if (!a || pausado) return;
      const desloc = deslocamentoDaAnimacao();
      a.pause();
      a.currentTime = 0;
      rolarSeco(trilho!.scrollLeft + desloc);
      pausado = true;
    }

    function retomar() {
      const a = animacao();
      if (!a || !pausado || arrastando) return;
      const copia = umaCopia();
      /* O resto por uma cópia: mesma imagem na tela, e a rolagem volta para
         dentro do primeiro trecho, deixando o curso inteiro do transform
         livre. */
      const fase = ((trilho!.scrollLeft % copia) + copia) % copia;
      rolarSeco(0);
      a.currentTime = (fase / copia) * DURACAO_MS;
      a.play();
      pausado = false;
    }

    function agendarRetomada() {
      window.clearTimeout(ocioso);
      ocioso = window.setTimeout(retomar, OCIO_MS);
    }

    function aoDescer(e: PointerEvent) {
      pausar();
      window.clearTimeout(ocioso);
      if (e.pointerType !== "mouse") return;
      /* ⚠ SÓ O MOUSE É CAPTURADO. Capturar o toque tiraria o gesto do
         navegador e mataria a rolagem nativa com inércia — que é justamente a
         que queremos preservar. */
      arrastando = true;
      xInicial = e.clientX;
      rolagemInicial = trilho!.scrollLeft;
      trilho!.setPointerCapture(e.pointerId);
      trilho!.classList.add("obras__trilho--arrastando");
      /* Impede o navegador de iniciar o arrasto nativo de imagem, que
         sequestraria o gesto no meio. */
      e.preventDefault();
    }

    /* ⚠ A CONTA É POR POSIÇÃO ABSOLUTA, E NÃO POR `movementX`.

       A primeira versão somava `movementX` a cada evento, e a medição mostrou o
       gesto ENCOLHENDO: um arrasto de 320px movia 90px a 1440 e 246px a 390. O
       navegador junta vários movimentos num evento só quando o quadro atrasa, e
       o que se perde nesse agrupamento não volta — o erro acumula e nunca se
       corrige.

       Guardando onde o gesto começou, cada evento recalcula a rolagem inteira a
       partir do zero. Evento perdido não deixa rastro: o próximo já chega no
       lugar certo. */
    function aoMover(e: PointerEvent) {
      if (!arrastando) return;
      rolarSeco(rolagemInicial - (e.clientX - xInicial));
    }

    function aoSoltar(e: PointerEvent) {
      if (arrastando) {
        arrastando = false;
        if (trilho!.hasPointerCapture(e.pointerId)) trilho!.releasePointerCapture(e.pointerId);
        trilho!.classList.remove("obras__trilho--arrastando");
      }
      agendarRetomada();
    }

    /* Cobre roda do mouse, setas do teclado e a inércia do dedo depois que ele
       sai da tela — nenhuma delas passa por pointerdown. */
    function aoRolar() {
      /* Rolagem que nós mesmos escrevemos não conta como gesto do visitante.
         Ver o porquê de a guarda ser um VALOR, lá em cima. */
      if (rolagemEscrita !== null && Math.abs(trilho!.scrollLeft - rolagemEscrita) < 1) {
        rolagemEscrita = null;
        return;
      }
      pausar();
      agendarRetomada();
    }

    trilho.addEventListener("pointerdown", aoDescer);
    trilho.addEventListener("pointermove", aoMover);
    trilho.addEventListener("pointerup", aoSoltar);
    trilho.addEventListener("pointercancel", aoSoltar);
    trilho.addEventListener("scroll", aoRolar, { passive: true });

    return () => {
      window.clearTimeout(ocioso);
      trilho.removeEventListener("pointerdown", aoDescer);
      trilho.removeEventListener("pointermove", aoMover);
      trilho.removeEventListener("pointerup", aoSoltar);
      trilho.removeEventListener("pointercancel", aoSoltar);
      trilho.removeEventListener("scroll", aoRolar);
      /* Sai deixando a pista correndo, e não parada num estado nosso. */
      animacao()?.play();
      trilho.classList.remove("obras__trilho--arrastando");
    };
  }, []);

  return null;
}
