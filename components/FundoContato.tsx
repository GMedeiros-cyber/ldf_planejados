"use client";

import { useEffect, useRef } from "react";

/* Fundo da seção de duas colunas de /contato: pilha de radial-gradient com
   desfoque, que respira devagar atrás do ponteiro.

   ══ A ESTRUTURA VEIO DO "DESERT HORIZON", A PALETA NÃO ══

   Do original (21st.dev) ficaram a forma e só ela: uma <div> com
   `container-type: size`, uma camada interna sangrando um pouco para fora
   (`inset` negativo) com `blur`, e quatro radial-gradient empilhados em
   `cqmin`. Zero dependência, um elemento.

   A PALETA FOI DESCARTADA, e é o ponto. O original tem base #7A4B3A com
   paradas em creme rgba(255,241,207) — nosso texto é `--ink`, quase branco, e
   sobre creme daria contraste perto de 1:1. Ilegível. As cores novas estão no
   CSS, seção 18e, medidas contra a manchete e contra o texto do formulário.

   O MOVIMENTO É ACRÉSCIMO NOSSO. O original é estático.

   ══ O PADRÃO DO MOVIMENTO É O DO FundoMadeira ══

   Não foi inventado aqui, e a razão de cada escolha já está escrita naquele
   arquivo:

     DUAS CUSTOM PROPERTIES, e não um motion.div. Os dois desenham igual, mas
     `motion.div` arrasta a camada de componentes e o motor de animação da
     motion para o pacote — medido, +112 KB na home. Escrevendo variáveis que
     o CSS consome, o custo some. Aqui é ainda mais barato: nem `motion` é
     importada.

     translate3d NO CSS, e não style.transform no ouvinte. O que o JS toca é
     uma variável; quem compõe é a folha.

   A AMPLITUDE É DISCRETA de propósito: --amplitude é o percurso TOTAL em px, e
   o deslocamento vai de -amplitude/2 a +amplitude/2 em cada eixo. É
   respiração, não parallax de vitrine.

   ══ TRÊS DESLIGAMENTOS, TODOS ANTES DE CRIAR O OUVINTE ══

   O objetivo é NÃO REGISTRAR o listener, e não registrar e ignorar:

     movimento reduzido   quem pediu menos movimento não recebe nenhum.
     (hover: none)        em tela de toque não existe ponteiro que se mova. Um
                          listener de mousemove ali é bateria gasta para um
                          evento que nunca chega.
     sem JS               o efeito nem monta, e a seção fica com o gradiente
                          parado — que é a decoração inteira. Nada de conteúdo
                          depende disto.

   O ouvinte sai no cleanup, e é `passive` porque nunca chama preventDefault. */

/* Percurso total, em px, de ponta a ponta do movimento. */
const AMPLITUDE = 14;

export default function FundoContato() {
  const camada = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const alvo = camada.current;
    if (!alvo) return;

    const semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const semPonteiro = window.matchMedia("(hover: none)").matches;
    if (semMovimento || semPonteiro) return;

    /* O deslocamento é medido contra a JANELA, e não contra a seção: assim ele
       é contínuo enquanto o ponteiro atravessa a página, em vez de saltar
       quando entra e sai da caixa. */
    let raf = 0;
    let px = 0;
    let py = 0;

    const escrever = () => {
      raf = 0;
      alvo.style.setProperty("--px", `${px.toFixed(2)}px`);
      alvo.style.setProperty("--py", `${py.toFixed(2)}px`);
    };

    /* O evento chega mais vezes que a tela desenha. Guardar o valor e escrever
       num requestAnimationFrame é o que impede duas escritas no mesmo quadro. */
    const aoMover = (e: MouseEvent) => {
      px = (e.clientX / window.innerWidth - 0.5) * AMPLITUDE;
      py = (e.clientY / window.innerHeight - 0.5) * AMPLITUDE;
      if (!raf) raf = requestAnimationFrame(escrever);
    };

    window.addEventListener("mousemove", aoMover, { passive: true });

    return () => {
      window.removeEventListener("mousemove", aoMover);
      if (raf) cancelAnimationFrame(raf);
      /* Deixa a camada no centro, e não na última posição do ponteiro. */
      alvo.style.removeProperty("--px");
      alvo.style.removeProperty("--py");
    };
  }, []);

  return (
    <div className="fundo-contato" aria-hidden="true">
      <div className="fundo-contato__camada" ref={camada} />
    </div>
  );
}
