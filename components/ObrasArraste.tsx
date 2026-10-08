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
                rolagem volta para a borda da faixa de repouso. Dali o
                transform tem uma cópia inteira de curso pela frente e nunca
                passa do fim.

   ⚠ O RESTO `% cópia` É O QUE FAZ ISSO SER INVISÍVEL. As duas metades são
   idênticas, então deslocar por exatamente uma cópia mostra o mesmo pixel. É
   isso que permite normalizar a rolagem sem que nada salte na tela — e é a
   mesma propriedade que faz o `-50%` dos keyframes fechar o laço sem costura.

   ══ E A NORMALIZAÇÃO VALE DURANTE O GESTO, NÃO SÓ NAS PONTAS ══

   Por uma rodada ela existia só na transferência, ao soltar. Durante o arrasto
   não havia nenhuma, e o `scrollLeft` nativo é LIMITADO: arrastando rápido, ou
   continuando a arrastar, ele encostava em `scrollWidth - clientWidth`, o
   conteúdo acabava de verdade e a área ficava preta.

   Agora a rolagem é mantida dentro de uma faixa que não toca nenhuma das duas
   pontas — ver `piso()` e `normalizar()` abaixo. Cruzar a borda vira um salto
   de uma cópia, invisível, e o arrasto segue indefinidamente nos dois
   sentidos.

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

    /* ══ A FAIXA DE REPOUSO, E POR QUE ELA NÃO COMEÇA NO ZERO ══

       A rolagem nativa é LIMITADA: vai de 0 a `scrollWidth - clientWidth`. Ao
       encostar numa das pontas o conteúdo acaba de verdade e sobra o fundo da
       seção — a faixa preta. Dar a volta é manter a rolagem SEMPRE longe das
       duas pontas, saltando uma cópia inteira quando ela se aproxima.

       O salto é invisível pela mesma razão que o `-50%` fecha o laço: as duas
       metades são idênticas, então somar ou subtrair exatamente uma cópia
       mostra o mesmo pixel no mesmo lugar.

       ⚠ O PISO NÃO É ZERO, E ISSO É O QUE FAZ A VOLTA VALER PARA OS DOIS
       LADOS. Com a faixa em [0, C) o lado esquerdo encostaria no limite
       nativo: `scrollLeft` não vai abaixo de zero, então um gesto para a
       direita pararia seco em vez de dar a volta. Centrando a faixa dentro do
       curso disponível, sobra margem igual dos dois lados — medido, 416px a
       1440 e 617px a 390 —, e é nessa margem que a rolagem entra antes de a
       gente reposicionar.

       A conta que decide se isto funciona é V ≤ C: a janela tem de caber
       inteira dentro de uma cópia, senão duas cópias não dão a volta e seria
       preciso uma terceira. Medido nas sete larguras, a folga C−V vai de
       831px (1440) a 1503px (768). Sobra. */
    const piso = () => Math.max(0, (umaCopia() - trilho.clientWidth) / 2);

    /* Traz qualquer rolagem para dentro da faixa [piso, piso + C), somando ou
       subtraindo cópias inteiras.

       A CONTA É PURA e recebe as medidas prontas: o arrasto passa as que leu
       uma vez no pointerdown (ver `gesto`, abaixo). `normalizar` mede na hora
       e serve aos caminhos que rodam raramente — pausar, rolagem nativa. */
    function normalizarCom(x: number, copia: number, p: number) {
      if (copia <= 0) return x;
      return p + ((((x - p) % copia) + copia) % copia);
    }
    const normalizar = (x: number) => normalizarCom(x, umaCopia(), piso());

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

    /* ══ AS MEDIDAS DO GESTO, LIDAS UMA VEZ NO POINTERDOWN ══

       A largura de uma cópia, o piso da faixa de repouso e o `scroll-behavior`
       do trilho NÃO MUDAM durante um arrasto. Antes eram relidos a cada
       pointermove: `normalizar` lia `offsetWidth` duas vezes e `clientWidth`
       uma, e o `rolarSeco` escrevia `scrollLeft` e o lia de volta. Leitura de
       layout intercalada com escrita, evento após evento, é o padrão que obriga
       o navegador a refazer o layout no meio do quadro — medido, 40 movimentos
       custavam 80 leituras de offsetWidth, 40 de clientWidth e 40 escritas.

       Ficam guardadas aqui, como `xInicial` e `rolagemInicial` ao lado — o
       mesmo papel de um ref, no idioma do resto deste efeito. */
    const gesto = { copia: 0, piso: 0, comportamento: "" };

    /* ══ UMA ESCRITA POR QUADRO ══

       Um mouse de alta frequência dispara vários pointermove por quadro, e
       escrever a rolagem em cada um é trabalho que ninguém vê: só o último
       valor do quadro chega à tela. O move guarda o alvo; o
       requestAnimationFrame escreve uma vez. */
    let quadroPendente = 0;
    let alvoPendente = 0;

    /* A escrita do arrasto. Não lê nada de volta: o alvo já vem normalizado
       para dentro da faixa [piso, piso + C), e a faixa cabe inteira no curso
       nativo (V ≤ C, ver o bloco da faixa de repouso) — o navegador não tem o
       que limitar. O arredondamento do scrollLeft fica dentro da tolerância de
       1px da guarda em `aoRolar`. */
    function escreverGesto(x: number) {
      trilho!.style.scrollBehavior = "auto";
      trilho!.scrollLeft = x;
      rolagemEscrita = x;
      trilho!.style.scrollBehavior = gesto.comportamento;
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
      /* Normalizado ja aqui: a fase transferida pode jogar a rolagem para fora
         da faixa de repouso, e ela precisa entrar no gesto ja dentro dela. */
      rolarSeco(normalizar(trilho!.scrollLeft + desloc));
      pausado = true;
    }

    /* ══ PARADA ENQUANTO HÁ ALGUÉM OLHANDO — E POR QUE ISSO É DAQUI, E NÃO SÓ DO CSS ══

       A folha pausa a pista em `:hover` e `:focus-within`, como faz com a faixa
       de avaliações. Só que esta animação também é controlada por SCRIPT — o
       `pausar()` e o `retomar()` deste arquivo —, e um `play()` de script passa
       por cima do `animation-play-state`. Medido: antes do primeiro gesto o
       hover pausava; depois de rodar a roda com o mouse em cima, o `retomar()`
       soltava a faixa DEBAIXO do cursor, e daí em diante o CSS nunca mais
       pausava — nem no hover, nem no foco. A regra da folha vale até o
       primeiro gesto (e sem JavaScript); depois dele, quem decide é aqui.

       ⚠ O HOVER É UMA BANDEIRA DE MOUSE, E NÃO `:hover`. No celular o `:hover`
       GRUDA depois de um toque e só sai quando se toca em outro lugar — com
       ele, a faixa congelaria após qualquer toque nela. `pointerenter` e
       `pointerleave` só contam quando o ponteiro é mouse.

       ⚠ O FOCO É SÓ O DE TECLADO (`:focus-visible`), e não `:focus-within`. O
       trilho tem tabIndex 0, e um TOQUE nele o foca — medido no Pixel 7:
       depois de um toque, `:focus-within` verdadeiro e `:focus-visible` falso.
       Com `:focus-within`, a faixa ficaria parada depois de qualquer toque,
       até a pessoa tocar em outro lugar. (O mouse não foca: o `aoDescer` faz
       `preventDefault()` no pointerdown de mouse.) */
    let sobMouse = false;
    const focoDeTeclado = () =>
      trilho!.matches(":focus-visible") || trilho!.querySelector(":focus-visible") !== null;

    function retomar() {
      const a = animacao();
      if (!a || !pausado || arrastando || sobMouse || focoDeTeclado()) return;
      const copia = umaCopia();
      const p = piso();
      /* O resto por uma cópia, medido A PARTIR DO PISO: mesma imagem na tela, e
         a rolagem volta para a borda da faixa de repouso, deixando o curso
         inteiro do transform livre pela frente.

         ⚠ ANTES ISTO VOLTAVA PARA ZERO. Com a faixa de repouso deslocada, zero
         deixou de ser o ponto neutro — voltar para lá gastaria de saída a
         margem esquerda que existe para o gesto seguinte poder dar a volta. */
      const fase = ((((trilho!.scrollLeft - p) % copia) + copia) % copia);
      rolarSeco(p);
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
      gesto.copia = umaCopia();
      gesto.piso = Math.max(0, (gesto.copia - trilho!.clientWidth) / 2);
      gesto.comportamento = trilho!.style.scrollBehavior;
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
      /* ⚠ NORMALIZADO A CADA QUADRO, e nao so nas pontas. Sem isto o gesto
         empurra a rolagem ate o limite nativo e a pista acaba: era esse o
         defeito. Com a normalizacao, cruzar a borda da faixa vira um salto de
         uma copia — invisivel — e o arrasto segue indefinidamente.

         A conta continua saindo da posicao ABSOLUTA do ponteiro, entao o
         salto nao desalinha o gesto: `rolagemInicial` e `xInicial` seguem
         valendo, e o proximo evento recalcula tudo de novo. */
      alvoPendente = normalizarCom(rolagemInicial - (e.clientX - xInicial), gesto.copia, gesto.piso);
      if (!quadroPendente) {
        quadroPendente = requestAnimationFrame(() => {
          quadroPendente = 0;
          escreverGesto(alvoPendente);
        });
      }
    }

    function aoSoltar(e: PointerEvent) {
      if (arrastando) {
        /* Um alvo ainda na fila é o último movimento do gesto: escreve agora,
           senão a retomada leria a rolagem um quadro atrasada. */
        if (quadroPendente) {
          cancelAnimationFrame(quadroPendente);
          quadroPendente = 0;
          escreverGesto(alvoPendente);
        }
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
         Ver o porquê de a guarda ser um VALOR, lá em cima.

         ⚠ E TODA escrita da normalização passa por `rolarSeco`, então cada uma
         delas arma esta guarda. Era o risco de reabrir o bug do b1fed40: a
         normalização escreve com frequência, e sem a guarda cada escrita seria
         lida como gesto e mataria a animação no quadro seguinte. */
      if (rolagemEscrita !== null && Math.abs(trilho!.scrollLeft - rolagemEscrita) < 1) {
        rolagemEscrita = null;
        return;
      }

      pausar();

      /* ══ A VOLTA DA ROLAGEM NATIVA ══

         Quem rola aqui é o navegador — o dedo, a inércia depois dele, a roda
         do mouse, as setas do teclado. Nenhum desses passa pelo `aoMover`, e
         todos podem empurrar a rolagem até a ponta. Reposicionar só quando ela
         sai da faixa mantém a escrita rara: uma vez por cópia percorrida, e
         não uma por quadro. */
      const atual = trilho!.scrollLeft;
      const dentro = normalizar(atual);
      if (Math.abs(dentro - atual) > 0.5) rolarSeco(dentro);

      agendarRetomada();
    }

    function aoEntrar(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      sobMouse = true;
      window.clearTimeout(ocioso);
      pausar();
    }

    function aoSair(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      sobMouse = false;
      agendarRetomada();
    }

    function aoFocar() {
      if (!focoDeTeclado()) return;
      window.clearTimeout(ocioso);
      pausar();
    }

    /* Não precisa checar nada: o `retomar()` agendado reavalia o foco e o
       mouse quando roda, e o foco que só pulou para dentro da faixa continua
       segurando a pausa. */
    const aoDesfocar = () => agendarRetomada();

    trilho.addEventListener("pointerenter", aoEntrar);
    trilho.addEventListener("pointerleave", aoSair);
    trilho.addEventListener("focusin", aoFocar);
    trilho.addEventListener("focusout", aoDesfocar);
    trilho.addEventListener("pointerdown", aoDescer);
    trilho.addEventListener("pointermove", aoMover);
    trilho.addEventListener("pointerup", aoSoltar);
    trilho.addEventListener("pointercancel", aoSoltar);
    trilho.addEventListener("scroll", aoRolar, { passive: true });

    return () => {
      window.clearTimeout(ocioso);
      cancelAnimationFrame(quadroPendente);
      trilho.removeEventListener("pointerdown", aoDescer);
      trilho.removeEventListener("pointermove", aoMover);
      trilho.removeEventListener("pointerup", aoSoltar);
      trilho.removeEventListener("pointercancel", aoSoltar);
      trilho.removeEventListener("scroll", aoRolar);
      trilho.removeEventListener("pointerenter", aoEntrar);
      trilho.removeEventListener("pointerleave", aoSair);
      trilho.removeEventListener("focusin", aoFocar);
      trilho.removeEventListener("focusout", aoDesfocar);
      /* Sai deixando a pista correndo, e não parada num estado nosso. */
      animacao()?.play();
      trilho.classList.remove("obras__trilho--arrastando");
    };
  }, []);

  return null;
}
