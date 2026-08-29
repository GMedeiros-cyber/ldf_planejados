"use client";

import { useEffect, useRef, useState } from "react";
import { numeros } from "@/lib/dados";

/* Faixa de números entre a capa e a história.

   O contador é escrito à mão em requestAnimationFrame de propósito: o projeto
   não tem nenhuma biblioteca de animação, e três contadores não justificam
   abrir mão disso. São ~40 linhas contra ~35 KB. */

const DURACAO = 1800;

/* easeOutCubic. Velocidade constante fica mecânica — é a desaceleração no
   fim que dá a sensação de chegada. */
const saida = (t: number) => 1 - Math.pow(1 - t, 3);

/* Sempre pt-BR, nunca o padrão do navegador: o default de um visitante em
   locale inglês renderiza "1,200" com vírgula. */
const formata = (n: number) => n.toLocaleString("pt-BR");

/* O leitor de tela recebe a frase pronta — "Mais de 1.200 projetos entregues
   e montados" — e nunca a contagem subindo. */
const frase = (n: (typeof numeros)[number]) =>
  `${n.prefixo === "+" ? "Mais de " : ""}${formata(n.alvo)}${n.sufixo} ` +
  n.rotulo.charAt(0).toLowerCase() +
  n.rotulo.slice(1);

export default function Numeros() {
  const faixa = useRef<HTMLElement>(null);
  const quadro = useRef(0);

  /* Começa no valor final: é o que o servidor manda, o que sobrevive sem JS
     e o que fica em movimento reduzido. Quem anima zera no efeito — a faixa
     nasce fora da tela, então essa troca nunca é vista. */
  const [valores, setValores] = useState<number[]>(() => numeros.map((n) => n.alvo));

  useEffect(() => {
    const alvo = faixa.current;
    if (!alvo) return;

    /* Movimento reduzido: o valor final já está na tela. Não anima, e não
       chega a criar o observer. */
    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    setValores(numeros.map(() => 0));

    /* Um só rAF move os três: com o mesmo t, o 1200 e o 5 chegam juntos.
       Velocidade constante faria o 1200 demorar oitenta vezes mais. */
    const correr = () => {
      const inicio = performance.now();

      const passo = (agora: number) => {
        const t = Math.min((agora - inicio) / DURACAO, 1);
        const p = saida(t);
        setValores(numeros.map((n) => Math.round(n.alvo * p)));
        if (t < 1) quadro.current = requestAnimationFrame(passo);
      };

      quadro.current = requestAnimationFrame(passo);
    };

    const obs = new IntersectionObserver(
      (entradas) => {
        if (!entradas.some((e) => e.isIntersecting)) return;
        /* Uma vez só: desconecta antes de contar, e não recomeça na volta. */
        obs.disconnect();
        correr();
      },
      { threshold: 0.4 },
    );

    obs.observe(alvo);

    return () => {
      obs.disconnect();
      cancelAnimationFrame(quadro.current);
    };
  }, []);

  return (
    <section className="numeros" aria-label="Números da LDF" ref={faixa}>
      <div className="wrap numeros__grade">
        {numeros.map((n, i) => (
          <div className="numeros__item" key={n.rotulo}>
            {/* A reserva invisível carrega o valor final e trava a largura da
                célula; o valor corrente pinta por cima, na mesma célula. */}
            <span className="numeros__valor" aria-hidden="true" aria-live="off">
              <span className="numeros__reserva">
                {n.prefixo}
                {formata(n.alvo)}
                {n.sufixo}
              </span>
              <span className="numeros__corrente">
                {n.prefixo}
                {formata(valores[i])}
                {n.sufixo}
              </span>
            </span>

            <span className="numeros__rotulo" aria-hidden="true">
              {n.rotulo}
            </span>

            <span className="oculto-visual">{frase(n)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
