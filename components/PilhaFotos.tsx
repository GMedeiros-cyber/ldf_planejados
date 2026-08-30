"use client";

import { useEffect, useRef, useState } from "react";

/* Pilha de fotos em perspectiva, na coluna direita da Fábrica.

   Escrito do zero: o componente de referência que circula com este efeito
   importa um index.css que não existe aqui, e é justamente lá que mora todo o
   efeito — o que sobra dele é um map de imagens.

   A GEOMETRIA foi escolhida por medição, não por tentativa. Projetando os
   quatro cantos das seis cartas pela cadeia rotateY(-25°)·rotateZ(-120°) mais
   a divisão de perspectiva, o eixo LOCAL Y do trilho cai a 32° na tela (para
   cima e à direita) — é ele que carrega o escalonamento. Com passo 150 e
   curso 220 nunca há menos de cinco cartas com mais de 35% de área dentro do
   enquadramento, em nenhum ponto da rolagem, e o baralho anda ~205px.

   O DESLOCAMENTO vem da posição DA SEÇÃO, nunca de window.scrollY: a Fábrica
   fica lá pelos 4000px de rolagem, e scrollY direto jogaria as cartas para
   fora antes de o visitante chegar nelas.

   TODO: chegaram três fotos, não seis. Cada uma entra duas vezes, com
   enquadramento diferente — o mesmo recurso que lib/dados.ts já usa em
   `obras`. Substituir por seis fotos distintas da fábrica da LDF. */

const CARTAS = [
  { src: "/fabrica/serra-esquadria-a.webp" },
  { src: "/fabrica/torno-madeira-a.webp" },
  { src: "/fabrica/cnc-corte-a.webp" },
  { src: "/fabrica/serra-esquadria-b.webp" },
  { src: "/fabrica/torno-madeira-b.webp" },
  { src: "/fabrica/cnc-corte-b.webp" },
];

export default function PilhaFotos() {
  const caixa = useRef<HTMLDivElement>(null);
  /* Falso no servidor e na primeira renderização do cliente, então a
     hidratação bate. Abaixo de 640px nunca vira true: a pilha sai do DOM em
     vez de ficar escondida carregando seis imagens que ninguém vê. */
  const [montar, setMontar] = useState(false);

  useEffect(() => {
    setMontar(window.matchMedia("(min-width: 640px)").matches);
  }, []);

  useEffect(() => {
    const alvo = caixa.current;
    if (!alvo) return;

    /* Movimento reduzido: sem observer, sem listener, sem nada. O CSS já
       nasce com --desliza: 1, que é a posição final. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let quadro = 0;
    let ligado = false;

    /* Todo getBoundingClientRect acontece DENTRO do rAF, nunca no handler:
       a página já tem scroll-driven animation no Processo e a navbar que
       recolhe, e mais uma leitura de layout por evento custaria caro. */
    const medir = () => {
      quadro = 0;
      const r = alvo.getBoundingClientRect();
      const alturaTela = window.innerHeight || document.documentElement.clientHeight;
      /* 0 quando o topo do bloco encosta na base da tela; 1 quando a base do
         bloco encosta no topo. Tudo relativo à seção. */
      const bruto = (alturaTela - r.top) / (alturaTela + r.height);
      const p = Math.min(1, Math.max(0, bruto));
      alvo.style.setProperty("--desliza", p.toFixed(4));
    };

    const agendar = () => {
      if (!quadro) quadro = requestAnimationFrame(medir);
    };

    const ligar = () => {
      if (ligado) return;
      ligado = true;
      window.addEventListener("scroll", agendar, { passive: true });
      window.addEventListener("resize", agendar, { passive: true });
      agendar();
    };
    const desligar = () => {
      if (!ligado) return;
      ligado = false;
      window.removeEventListener("scroll", agendar);
      window.removeEventListener("resize", agendar);
    };

    /* Uma medição imediata, antes e independente do observer. Sem ela o CSS
       fallback (--desliza: 1, a posição final) valeria até a seção entrar na
       tela — e no instante em que entrasse, com progresso ~0, o baralho
       saltaria 205px de uma vez, à vista. */
    agendar();

    /* O observer não decide a posição, só liga e desliga o listener: fora da
       tela nem o scroll é escutado. */
    const obs = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) ligar();
        else desligar();
      },
      { threshold: 0 },
    );
    obs.observe(alvo);

    return () => {
      obs.disconnect();
      desligar();
      cancelAnimationFrame(quadro);
    };
  }, [montar]);

  if (!montar) return null;

  return (
    <div className="pilha-fotos" ref={caixa} aria-hidden="true">
      <ul className="pilha-fotos__trilho">
        {CARTAS.map((c, i) => (
          <li
            className="pilha-fotos__carta"
            key={c.src}
            style={{ ["--i" as string]: i } as React.CSSProperties}
          >
            <span className="pilha-fotos__moldura">
              <img src={c.src} width={1000} height={1333} alt="" loading="lazy" decoding="async" />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
