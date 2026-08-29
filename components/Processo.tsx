"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, Ref } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { estagios } from "@/lib/dados";

/* Quatro estágios em escadinha, ligados por linhas em L.

   A seção rola normalmente: nada de sticky nem de prender a página por 300vh.
   A única coisa que o scroll move é a altura da linha de progresso de cada
   bloco, escrita direto numa custom property — não em estado — para não
   re-renderizar a cada quadro. */

type Estagio = (typeof estagios)[number];

/* Só a linha e o número mudam entre a versão parada e a animada; o bloco em
   si é o mesmo markup nos dois casos. */
function Bloco({
  estagio,
  indice,
  ref,
}: {
  estagio: Estagio;
  indice: number;
  ref?: Ref<HTMLLIElement>;
}) {
  const marco = "marco" in estagio && estagio.marco;

  return (
    <li
      ref={ref}
      className={marco ? "estagio estagio--marco" : "estagio"}
      style={{ "--i": indice } as CSSProperties}
    >
      <div className="estagio__cabeca">
        {/* A ordem já vem do <ol>; o numeral é reforço visual. */}
        <span className="estagio__n" aria-hidden="true">
          {estagio.n}
        </span>
        <h3 className="estagio__t">{estagio.titulo}</h3>
      </div>

      <div className="estagio__corpo">
        <p className="estagio__p">{estagio.texto}</p>

        <ul className="estagio__etapas">
          {estagio.etapas.map((e) => (
            <li className="estagio__etapa" key={e}>
              {e}
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

function BlocoAnimado({ estagio, indice }: { estagio: Estagio; indice: number }) {
  const bloco = useRef<HTMLLIElement>(null);

  /* "center center": a linha completa quando o bloco chega ao meio da tela,
     não quando ele sai por cima. */
  const { scrollYProgress } = useScroll({
    target: bloco,
    offset: ["start end", "center center"],
  });

  const escrever = useCallback((v: number) => {
    bloco.current?.style.setProperty("--progresso", String(v));
  }, []);

  /* O evento só dispara na MUDANÇA. Sem esta primeira escrita, um bloco que
     já nasce dentro da tela ficaria parado no fallback do CSS até o visitante
     rolar. */
  useEffect(() => {
    escrever(scrollYProgress.get());
  }, [escrever, scrollYProgress]);

  useMotionValueEvent(scrollYProgress, "change", escrever);

  return <Bloco estagio={estagio} indice={indice} ref={bloco} />;
}

export default function Processo() {
  /* Falso no servidor e na primeira renderização do cliente, então a
     hidratação bate. Quem pede menos movimento nunca sai daqui — e é por isso
     que o useScroll não chega a ser criado: BlocoAnimado não monta. */
  const [animar, setAnimar] = useState(false);

  useEffect(() => {
    setAnimar(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return (
    <section className="section wrap processo" id="processo" aria-labelledby="t-proc">
      <div className="section__head rise">
        <h2 className="h2" id="t-proc">
          O orçamento é o terceiro estágio, não o primeiro.
        </h2>
        <p className="lede">
          Ninguém consegue precificar um móvel que ainda não foi desenhado. Por isso a medição e o
          projeto vêm antes de qualquer número: você aprova o desenho no seu ambiente e só então vê
          o valor.
        </p>
      </div>

      <ol className="estagios">
        {estagios.map((e, i) =>
          animar ? (
            <BlocoAnimado estagio={e} indice={i} key={e.n} />
          ) : (
            <Bloco estagio={e} indice={i} key={e.n} />
          ),
        )}
      </ol>
    </section>
  );
}
