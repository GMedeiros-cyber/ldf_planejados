"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";

/* Fundo de madeira contínuo atrás da Fábrica e do Fechamento. A textura era
   exclusiva do bloco de CTA; agora atravessa as duas seções, e o Fechamento
   perdeu a madeira própria para não empilhar madeira sobre madeira.

   A fronteira com a seção de cima não leva marca nenhuma: a troca de
   superfície — campo dourado para madeira — já é a divisão.

   A camada de fundo é MAIS ALTA que o container (130%) e nasce centrada
   (top: -15%), então sobra 15% da altura acima e abaixo. É essa sobra que o
   parallax consome: sem ela, qualquer deslocamento abriria faixa vazia numa
   das pontas. Quem recorta a sobra é o overflow do .faixa-madeira.

   AMPLITUDE é a fração da SOBRA que o movimento usa — 20% dos 30% extras, ou
   seja 6% da altura do container. Em percentual da própria camada (1,3x o
   container) dá os 2,3% de cada lado. Amplitude maior faz a textura escorregar
   de forma óbvia e denunciar o truque.

   Nada de background-attachment: fixed. É o caminho curto e é falso: o iOS
   ignora e trava o fundo, e em vários navegadores ele desliga a composição em
   GPU.

   O deslocamento vai para uma CUSTOM PROPERTY, e não para um motion.div. Os
   dois desenham igual, mas `motion.div` arrasta a camada de componentes e o
   motor de animação da motion para o bundle: medido, +112 KB na home, que até
   aqui só usava o useScroll do Processo. Assinando o MotionValue e escrevendo
   uma variável que o CSS consome, o custo some. Isto NÃO é um handler de
   scroll escrevendo style.transform: quem dispara é o laço de quadros da
   própria motion, e o que muda é uma variável que alimenta um translate3d
   declarado no CSS. */

const AMPLITUDE = 2.3;

export default function FaixaMadeira({ children }: { children: ReactNode }) {
  const alvo = useRef<HTMLDivElement>(null);
  const fundo = useRef<HTMLDivElement>(null);
  const semMovimento = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: alvo,
    offset: ["start end", "end start"],
  });

  /* Sentido contrário ao da rolagem: o progresso cresce enquanto a página
     desce, e o deslocamento vai de positivo a negativo — a madeira sobe. */
  const deslocamento = useTransform(scrollYProgress, [0, 1], [AMPLITUDE, -AMPLITUDE]);

  const escrever = (v: number) => {
    fundo.current?.style.setProperty("--deslocamento", `${v.toFixed(3)}%`);
  };

  /* Quem chega com a página já rolada (âncora, recarregar no meio) não recebe
     evento de mudança nenhum: o valor de partida é escrito na montagem. */
  useEffect(() => {
    if (semMovimento) {
      fundo.current?.style.removeProperty("--deslocamento");
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
    <div className="faixa-madeira" ref={alvo}>
      <div className="faixa-madeira__fundo" ref={fundo} aria-hidden="true" />
      <div className="faixa-madeira__veu" aria-hidden="true" />
      {children}
    </div>
  );
}
