"use client";

import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

gsap.registerPlugin(SplitText, ScrollTrigger, useGSAP);

/* Revelação por linha: um retângulo opaco cresce por cima do texto da esquerda
   para a direita, o texto acende debaixo dele, e o retângulo se recolhe também
   para a direita, deixando a linha exposta.

   Correções sobre o componente original:

   a) prefers-reduced-motion — o gsap.matchMedia() só executa o contexto quando
      a consulta casa. Em "reduce" nada roda: não há SplitText, não há timeline
      e não há retângulo. Os children ficam como vieram do servidor, visíveis.

   b) split.revert() no cleanup — o SplitText reescreve o DOM do elemento. Sem
      reverter, cada remontagem (navegar para /ambientes e voltar, um Fast
      Refresh) empilha wrappers em cima dos wrappers da vez anterior.

      O revert NÃO pode ficar no return do callback do useGSAP: o hook limpa
      chamando context.revert(), e isso mexe em tween e ScrollTrigger, não no
      DOM que o SplitText reescreveu nem no matchMedia criado dentro. Medido:
      o return nunca era executado. Por isso a limpeza mora em `limpar()`,
      chamada na mão no topo de cada passada e no cleanup de um useEffect
      próprio, que é o que roda na desmontagem.

   c) Re-split no resize — as linhas são medidas na largura do momento. O
      observador abaixo é debounced e só reage a mudança de LARGURA: no celular
      a barra de URL muda a altura a cada rolagem, e refazer o split ali seria
      trabalho puro. Se a animação já rodou, o resize apenas desfaz o split e
      não refaz nenhum: o texto volta ao DOM limpo, sem wrapper nenhum, e
      requebra sozinho na largura nova.

   d) toggleActions "play none none none" — dispara uma vez e fica. Com
      "reverse" no fim, rolar de volta desfazia a revelação e o texto sumia.

   e) Tipagem — props em interface e os retângulos em HTMLDivElement[].

   Além dessas: os retângulos são decorativos e saem da árvore de
   acessibilidade, e o wrapper de cada linha ganha uma folga vertical, porque
   o overflow: hidden corta no limite da caixa da linha e a tinta passa dela
   (acentos em cima, descendentes embaixo) quando a entrelinha é apertada. */

interface TextBlockAnimationProps {
  children: ReactNode;
  /** Dispara ao entrar na viewport. Falso anima na montagem. */
  animateOnScroll?: boolean;
  /** Atraso, em segundos, antes de a timeline começar. */
  delay?: number;
  /** Cor do retângulo que varre a linha. */
  blockColor?: string;
  /** Intervalo entre uma linha e a seguinte. */
  stagger?: number;
  /** Duração de cada metade da varredura. */
  duration?: number;
}

export default function TextBlockAnimation({
  children,
  animateOnScroll = true,
  delay = 0,
  blockColor = "#000",
  stagger = 0.1,
  duration = 0.6,
}: TextBlockAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  /* Uma vez revelado, revelado fica: nem o resize nem uma remontagem devolvem
     o texto para a opacidade zero. */
  const jaRevelou = useRef(false);
  const [refazerSplit, setRefazerSplit] = useState(0);
  const splitRef = useRef<SplitText | null>(null);
  const mmRef = useRef<ReturnType<typeof gsap.matchMedia> | null>(null);

  /* Desfaz a passada anterior por inteiro: o revert do matchMedia mata a
     timeline e o ScrollTrigger e dispara o cleanup do contexto, e o do
     SplitText devolve o HTML original — com ele vão embora os wrappers e os
     retângulos, que moram dentro do elemento dividido. */
  const limpar = () => {
    mmRef.current?.revert();
    mmRef.current = null;
    splitRef.current?.revert();
    splitRef.current = null;
  };

  useEffect(() => {
    let larguraAnterior = window.innerWidth;
    let debounce: ReturnType<typeof setTimeout>;

    const aoRedimensionar = () => {
      if (window.innerWidth === larguraAnterior) return;
      larguraAnterior = window.innerWidth;
      clearTimeout(debounce);
      debounce = setTimeout(() => setRefazerSplit((n) => n + 1), 200);
    };

    window.addEventListener("resize", aoRedimensionar);
    return () => {
      window.removeEventListener("resize", aoRedimensionar);
      clearTimeout(debounce);
    };
  }, []);

  /* Desmontagem: navegar para outra rota, ou um Fast Refresh. Só aqui o React
     garante a chamada — o useGSAP não repassa o return do callback. */
  useEffect(() => limpar, []);

  useGSAP(
    () => {
      const alvo = containerRef.current;
      if (!alvo) return;

      limpar();

      const mm = gsap.matchMedia();
      mmRef.current = mm;

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        /* Já rodou: não divide de novo. O texto fica no DOM limpo e requebra
           sozinho na largura nova. */
        if (jaRevelou.current) return;

        /* aria: "none" NÃO é enfeite. O padrão do SplitText é "auto": ele põe
           aria-hidden="true" em cada pedaço e devolve o texto num aria-label
           no elemento dividido — que aqui é a div do componente. aria-label é
           PROIBIDO em role=generic, então o leitor de tela ignora o rótulo,
           obedece aos aria-hidden e o bloco inteiro some da árvore. Pior no
           h2: a seção o aponta por aria-labelledby="t-fab" e ficaria sem nome
           acessível. Com "none" o SplitText não encosta em aria nenhum, e as
           linhas são lidas como o texto corrido que são. */
        const split = new SplitText(alvo, {
          type: "lines",
          linesClass: "block-line-parent",
          aria: "none",
          /* O padrão reduceWhiteSpace: true normaliza os espaços ao remontar
             as linhas, e com eles morrem os espaços rígidos que prendem os
             nomes dos elos da cadeia. Sem isto, "projetista da loja" volta a
             quebrar no meio — o SplitText desfaz no cliente o que o servidor
             mandou certo. */
          reduceWhiteSpace: false,
        });

        splitRef.current = split;

        const linhas = split.lines as HTMLElement[];
        const blocos: HTMLDivElement[] = [];

        linhas.forEach((linha) => {
          const pai = linha.parentNode;
          if (!pai) return;

          const wrapper = document.createElement("div");
          wrapper.style.position = "relative";
          wrapper.style.display = "block";
          /* O corte precisa de FOLGA vertical: a tinta passa da caixa da
             linha (acentos em cima, descendentes embaixo) e, na manchete,
             ainda há o -0,173em que encosta a maiúscula na borda do vídeo —
             sem folga o overflow come o til do Ã.

             A folga vem de overflow-clip-margin, e não de padding com margem
             negativa. Os dois parecem equivalentes e não são: entre wrappers
             vizinhos as margens negativas COLAPSAM numa só (a de maior
             módulo, não a soma), então cada vão entre linhas ganhava uma
             folga inteira — a entrelinha da lede abria de 32px para 42px. O
             clip-margin afasta só o CORTE e não toca no layout: entrelinha e
             medida da coluna ficam exatamente como eram sem o componente.

             A medida sai da ALTURA da linha, não do font-size: quando o bloco
             é uma manchete de uma linha só, o SplitText devolve o próprio
             <h2> como "linha" e o wrapper nasce POR FORA dele — ali o
             font-size herdado é o do corpo (~17px), não os 54px da manchete,
             enquanto a altura já reflete o filho.

             overflow:clip sobrescreve o hidden onde há suporte; onde não há,
             fica o hidden e o retângulo segue contido (é inset:0, nunca passa
             da caixa). */
          const corpo = Math.max(
            linha.getBoundingClientRect().height,
            parseFloat(getComputedStyle(linha).fontSize) || 16,
          );
          wrapper.style.overflow = "hidden";
          wrapper.style.overflow = "clip";
          wrapper.style.overflowClipMargin = Math.round(corpo * 0.34) + "px";

          const bloco = document.createElement("div");
          bloco.setAttribute("aria-hidden", "true");
          bloco.style.position = "absolute";
          bloco.style.top = "0";
          bloco.style.left = "0";
          bloco.style.width = "100%";
          bloco.style.height = "100%";
          bloco.style.backgroundColor = blockColor;
          bloco.style.zIndex = "2";
          bloco.style.transform = "scaleX(0)";
          bloco.style.transformOrigin = "left center";
          bloco.style.pointerEvents = "none";

          pai.insertBefore(wrapper, linha);
          wrapper.appendChild(linha);
          wrapper.appendChild(bloco);

          gsap.set(linha, { opacity: 0 });
          blocos.push(bloco);
        });

        const tl = gsap.timeline({
          defaults: { ease: "expo.inOut" },
          delay,
          onComplete: () => {
            jaRevelou.current = true;
          },
          scrollTrigger: animateOnScroll
            ? {
                trigger: alvo,
                start: "top 85%",
                toggleActions: "play none none none",
              }
            : undefined,
        });

        tl.to(blocos, {
          scaleX: 1,
          duration,
          stagger,
          transformOrigin: "left center",
        })
          .set(linhas, { opacity: 1, stagger }, `<${duration / 2}`)
          .to(
            blocos,
            {
              scaleX: 0,
              duration,
              stagger,
              transformOrigin: "right center",
            },
            `<${duration * 0.4}`,
          );

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });
    },
    {
      scope: containerRef,
      dependencies: [animateOnScroll, delay, blockColor, stagger, duration, refazerSplit],
    },
  );

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      {children}
    </div>
  );
}
