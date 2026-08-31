"use client";

import { useEffect, useRef, type Ref } from "react";
import { useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";

/* O traço que costura /ambientes: uma linha só, serpenteando por trás dos
   blocos, desenhada conforme o visitante rola.

   ══ COMO O TRAÇO ACOMPANHA A ALTURA REAL DA PÁGINA ══

   O caminho é escrito num viewBox de 100×1000 unidades e o SVG é esticado
   para 100% da caixa com `preserveAspectRatio="none"`. Não há altura em px em
   lugar nenhum: a caixa é absoluta sobre a seção inteira, então o traço
   acompanha a altura real, seja qual for a largura da tela ou como o texto
   quebrar. Não há medição na montagem e não há recálculo no resize — não
   existe o número que poderia descolar.

   O preço dessa escolha é a distorção: esticar 1000 unidades para, digamos,
   6000px multiplicaria a espessura por seis nos trechos horizontais e por um
   nos verticais, e a curva sairia com a espessura variando ao longo dela.
   `vector-effect="non-scaling-stroke"` cancela isso — a espessura passa a ser
   medida depois da transformação, e 1px é 1px em qualquer trecho.

   A alternativa seria medir a altura no cliente e redesenhar o path a cada
   resize. Além do trabalho por evento, ela tem um furo que este caminho não
   tem: entre a primeira pintura e a primeira medição o traço fica errado, e
   quem chega com a página já rolada vê o erro.

   ══ COMO O DESENHO É FEITO ══

   `pathLength={1}` renormaliza o comprimento do caminho para 1, seja qual for
   a geometria. Com `stroke-dasharray: 1`, o offset vai de 1 (nada desenhado)
   a 0 (linha inteira) — e a conta continua valendo se o caminho mudar de
   forma, porque nada aqui depende do comprimento verdadeiro em unidades.

   O repouso é o traço COMPLETO: `stroke-dashoffset: var(--traco, 0)`. Sem JS,
   ou com movimento reduzido, a linha aparece inteira em vez de sumir. */

const ALTURA_VB = 1000;

function desenhar(ondas: number) {
  const passo = ALTURA_VB / ondas;
  let d = "M 50 0";
  for (let i = 0; i < ondas; i++) {
    /* Alterna o lado do bulbo, acompanhando a alternância dos blocos em vez
       de cruzá-la sempre no mesmo ponto. */
    const x = i % 2 === 0 ? 22 : 78;
    const y = i * passo;
    const p = (f: number) => (y + passo * f).toFixed(1);
    d += ` C 50 ${p(0.28)} ${x} ${p(0.22)} ${x} ${p(0.5)}`;
    d += ` C ${x} ${p(0.78)} 50 ${p(0.72)} 50 ${p(1)}`;
  }
  return d;
}

type Props = { ondas: number };

function Desenho({ ondas, linhaRef }: Props & { linhaRef?: Ref<SVGPathElement> }) {
  return (
    <svg
      className="traco"
      viewBox={`0 0 100 ${ALTURA_VB}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        ref={linhaRef}
        className="traco__linha"
        d={desenhar(ondas)}
        fill="none"
        pathLength={1}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/* Movimento reduzido: o traço aparece completo, sem useScroll e sem
   assinatura de rolagem. O padrão do CSS já é o offset zero. */
function TracoEstatico({ ondas }: Props) {
  return (
    <div className="traco__caixa" aria-hidden="true">
      <Desenho ondas={ondas} />
    </div>
  );
}

function TracoAnimado({ ondas }: Props) {
  /* A caixa é absoluta sobre a seção inteira, então a altura dela É a altura
     da seção — serve de alvo do useScroll sem precisar de um segundo ref
     apontando para o container. */
  const caixa = useRef<HTMLDivElement>(null);
  const linha = useRef<SVGPathElement>(null);

  const { scrollYProgress } = useScroll({
    target: caixa,
    offset: ["start start", "end end"],
  });

  const suave = useSpring(scrollYProgress, { stiffness: 170, damping: 24 });
  const offset = useTransform(suave, [0, 1], [1, 0]);

  const escrever = (v: number) => {
    linha.current?.style.setProperty("--traco", v.toFixed(4));
  };

  useEffect(() => {
    escrever(offset.get());
  }, [offset]);

  useMotionValueEvent(offset, "change", escrever);

  return (
    <div className="traco__caixa" ref={caixa} aria-hidden="true">
      <Desenho ondas={ondas} linhaRef={linha} />
    </div>
  );
}

export default function TracoAmbientes(props: Props) {
  const semMovimento = useReducedMotion();
  return semMovimento ? <TracoEstatico {...props} /> : <TracoAnimado {...props} />;
}
