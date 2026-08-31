"use client";

import { useEffect, useRef } from "react";
import { useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";

/* Fundo de madeira do bloco de CTA, com parallax.

   É uma CAMADA, não um invólucro: nasce dentro do .fechamento e se posiciona
   contra ele, do mesmo jeito que o FundoAuralis faz na História e no
   Processo. Foi um wrapper enquanto a madeira atravessava a Fábrica e o
   Fechamento; com uma seção só, envolver deixou de fazer sentido — e assim o
   Fechamento continua componente de servidor, sem arrastar o Link e o Logo
   para o pacote do cliente.

   A textura é MAIS ALTA que a seção (130%) e nasce centrada (top: -15%),
   então sobra 15% da altura em cada ponta. É essa sobra que o parallax
   consome: sem ela, qualquer deslocamento abriria faixa vazia numa das
   pontas. Quem recorta o excesso é o overflow do .fundo-madeira.

   Nada de background-attachment: fixed. É o caminho curto e é falso: o iOS
   ignora e trava o fundo, e em vários navegadores ele desliga a composição em
   GPU.

   O deslocamento vai para uma CUSTOM PROPERTY, e não para um motion.div. Os
   dois desenham igual, mas `motion.div` arrasta a camada de componentes e o
   motor de animação da motion para o bundle: medido, +112 KB na home, que só
   usa o useScroll aqui. Assinando o MotionValue e escrevendo uma variável que
   o CSS consome, o custo some. Isto NÃO é um handler de scroll escrevendo
   style.transform: quem dispara é o laço de quadros da própria motion, e o
   que muda é uma variável que alimenta um translate3d declarado no CSS. */

/* Percentual da altura da PRÓPRIA camada (1,3x a da seção), para cada lado.
   Recalibrado quando a madeira encolheu da faixa inteira para só o CTA: o
   percurso de rolagem sobre um bloco curto é dominado pela altura da janela,
   não pela do bloco, então manter a mesma porcentagem faria o movimento
   render menos deslocamento sobre quase a mesma distância — que foi o que
   deixou o efeito imperceptível. Ver a conta no relatório da rodada. */
const AMPLITUDE = 5;

export default function FundoMadeira() {
  const alvo = useRef<HTMLDivElement>(null);
  const textura = useRef<HTMLDivElement>(null);
  const semMovimento = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: alvo,
    offset: ["start end", "end start"],
  });

  /* Sentido contrário ao da rolagem: o progresso cresce enquanto a página
     desce, e o deslocamento vai de positivo a negativo — a madeira sobe. */
  const deslocamento = useTransform(scrollYProgress, [0, 1], [AMPLITUDE, -AMPLITUDE]);

  const escrever = (v: number) => {
    textura.current?.style.setProperty("--deslocamento", `${v.toFixed(3)}%`);
  };

  /* Quem chega com a página já rolada (âncora, recarregar no meio) não recebe
     evento de mudança nenhum: o valor de partida é escrito na montagem. */
  useEffect(() => {
    if (semMovimento) {
      textura.current?.style.removeProperty("--deslocamento");
      return;
    }
    escrever(deslocamento.get());
  }, [semMovimento, deslocamento]);

  /* Movimento reduzido: o fundo fica, o movimento sai. Sem a variável, o CSS
     cai no fallback 0%, que é a posição central. */
  useMotionValueEvent(deslocamento, "change", (v) => {
    if (semMovimento) return;
    escrever(v);
  });

  return (
    <div className="fundo-madeira" ref={alvo} aria-hidden="true">
      <div className="fundo-madeira__textura" ref={textura} />
      <div className="fundo-madeira__veu" />
    </div>
  );
}
