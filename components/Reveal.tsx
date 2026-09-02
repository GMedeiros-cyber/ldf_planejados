"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/* Revelação: uma vez, ao entrar na viewport. Montado uma única vez no layout,
   observa todo elemento .rise da página.

   ══ A ARMADILHA QUE ESTE ARQUIVO JÁ CAIU ══

   useEffect com DEPENDÊNCIA VAZIA dentro de um LAYOUT QUE NÃO REMONTA.

   No App Router o layout não é remontado em navegação client-side: é o mesmo
   nó React do começo ao fim da sessão, e só `children` troca. Com `[]`, o
   efeito rodava UMA vez, na primeira carga. O querySelectorAll fotografava o
   DOM daquela página e nunca mais olhava.

   O resultado, medido navegando Home → /ambientes → Home sem recarregar: na
   carga inicial as quatro .rise da home recebiam `in`; a partir da PRIMEIRA
   troca de rota, ZERO. Os .rise da página seguinte nunca eram observados,
   nunca recebiam `in`, e ficavam em opacity 0 para sempre. Como `.rise` está
   no section__head, no ambiente__quadro e na cortina de /ambientes, a rota de
   destino aparecia sem cabeçalho, sem foto e com a cortina baixada. Só um
   recarregamento completo consertava — e a navegação seguinte quebrava de
   novo. O cleanup nunca rodava, porque nada desmontava.

   `[rota]` é o que conserta: a cada pathname novo o cleanup desconecta os
   observadores da página anterior e o efeito revarre a nova. Navegação só de
   hash ("/#fabrica") não muda o pathname e não revarre — certo, porque o DOM
   também não muda.

   O exemplo era "/#contato" até o item de menu virar a rota "/contato". Hoje
   as únicas âncoras do site são "/#fabrica" e "/#processo", no rodapé.

   Se um dia este componente sair do layout e passar a viver dentro da página,
   ele volta a remontar sozinho e a dependência deixa de ser necessária. Até
   lá, ela é o que faz o efeito acompanhar a rota.

   ══ E A REDE DE SEGURANÇA ══

   `[rota]` cobre o que existe no DOM no instante em que a rota commita. Não
   cobre o que chega DEPOIS: um trecho que estava suspenso e terminou de
   streamar, ou qualquer coisa montada fora do ciclo de rota. O
   MutationObserver observa document.body e pega esses — sem ele, a próxima
   coisa renderizada fora do ciclo reabre exatamente o mesmo buraco.

   ══ SEM JAVASCRIPT ══

   Nada aqui roda, o `in` nunca chega, e sem tratamento o site ficaria em
   branco. Quem resolve é o @media (scripting: none) no fim do globals.css,
   e não este arquivo: é CSS que precisa valer justamente onde não há JS. */

export default function Reveal() {
  const rota = usePathname();

  useEffect(() => {
    /* Sem IntersectionObserver, ou com movimento reduzido pedido, não há
       revelação a coreografar: tudo aparece de uma vez, agora e no que chegar
       depois. O MutationObserver continua montado por isso — o conteúdo que
       stream, nesse modo, também precisa nascer visível. */
    const semAnimacao =
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const obs = semAnimacao
      ? null
      : new IntersectionObserver(
          /* O observador vem pelo segundo argumento, e não da constante que
             está sendo declarada aqui: um `const` não pode se referenciar no
             próprio inicializador. */
          (entradas, observador) => {
            entradas.forEach((entrada) => {
              if (!entrada.isIntersecting) return;
              entrada.target.classList.add("in");
              observador.unobserve(entrada.target);
            });
          },
          { rootMargin: "0px 0px -12% 0px", threshold: 0.06 },
        );

    const revelar = (raiz: ParentNode) => {
      raiz.querySelectorAll<HTMLElement>(".rise:not(.in)").forEach((el) => {
        if (obs) obs.observe(el);
        else el.classList.add("in");
      });
    };

    revelar(document);

    /* childList + subtree: interessa o que é INSERIDO, não o que muda de
       atributo. É de propósito — acrescentar `in` é mudança de atributo, e
       observar attributes aqui faria o observador reagir ao próprio trabalho. */
    const mutacoes = new MutationObserver((registros) => {
      for (const r of registros) {
        for (const no of r.addedNodes) {
          if (no.nodeType !== Node.ELEMENT_NODE) continue;
          const el = no as Element;
          /* O nó inserido pode ser o próprio .rise ou apenas contê-lo. */
          if (el.matches(".rise:not(.in)")) {
            if (obs) obs.observe(el);
            else el.classList.add("in");
          }
          revelar(el);
        }
      }
    });
    mutacoes.observe(document.body, { childList: true, subtree: true });

    return () => {
      obs?.disconnect();
      mutacoes.disconnect();
    };
  }, [rota]);

  return null;
}
