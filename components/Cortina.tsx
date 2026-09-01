"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

/* A cortina de abertura de /ambientes, e a única regra que ela tem: sobe UMA
   VEZ POR SESSÃO.

   ══ POR QUE POR SESSÃO, E NÃO POR VISITA ══

   Por visita era o que existia, e media ~950ms do primeiro movimento até
   liberar o cabeçalho — em toda entrada na rota. Depois que a navegação entre
   rotas voltou a funcionar, a terceira vez que se entra em /ambientes pelo
   menu ainda esperava a cortina, cobrindo justamente a manchete. Repetida, ela
   deixa de ler como teatro e passa a ler como tela de carregamento.

   ══ POR QUE sessionStorage, E NÃO localStorage ══

   A cortina é gesto de PRIMEIRA IMPRESSÃO DA SESSÃO, não uma coisa que a
   pessoa vê uma vez na vida e nunca mais. Quem volta ao site na semana
   seguinte chega de novo pela primeira vez naquela visita, e merece a abertura
   inteira. Com localStorage a cortina seria desenhada, paga e vista uma única
   vez por navegador — trabalho de design que o segundo acesso jogaria fora.

   sessionStorage morre com a aba, que é exatamente o recorte certo: aba nova,
   abertura nova.

   ══ OS CUIDADOS, QUE SÃO A PARTE DIFÍCIL ══

   1. NADA É LIDO NA RENDERIZAÇÃO. sessionStorage não existe no servidor, e ler
      durante o render seria divergência de hidratação garantida. O HTML do
      servidor e o primeiro render do cliente são IDÊNTICOS — sem atributo — e
      quem marca é o efeito, depois da montagem.

   2. O REPOUSO CONTINUA SENDO "FAIXAS COBRINDO". Inverter para "descoberto por
      padrão, cobre se ainda não viu" mostraria o cabeçalho por um quadro antes
      de a cortina descer na primeira visita — pior que o problema original.
      Por isso o atributo que aparece é o da EXCEÇÃO (`data-cortina="vista"`),
      e nunca o da regra.

   3. É `useLayoutEffect` no cliente, e não `useEffect`. O efeito passivo roda
      DEPOIS da pintura, e na visita repetida isso daria um quadro de faixa
      vermelha de ponta a ponta antes de sumir — um flash pior que a animação
      que ele veio evitar. O layout effect roda antes da pintura, então a
      visita repetida abre já descoberta. No servidor ele vira useEffect, senão
      o React avisa que useLayoutEffect não faz nada em SSR. A escolha acontece
      uma vez, na carga do módulo, então a ordem dos hooks nunca muda.

   4. sessionStorage LANÇA em modo restrito de alguns navegadores, e não só
      devolve nulo. Os dois acessos vão em try/catch, e o catch se comporta
      como primeira visita: animar a mais é melhor do que quebrar a página.

   5. A CHAVE SÓ É ESCRITA QUANDO A CORTINA REALMENTE SOBE, isto é, quando o
      Reveal marca o bloco com `in`. Escrever na montagem marcaria como vista
      uma cortina que alguém pode não ter chegado a ver.

   Movimento reduzido continua ganhando de tudo, e não passa por aqui: a media
   query da seção 11a tira as faixas em qualquer visita. O <noscript> da página
   também continua sendo o que salva o cabeçalho sem JavaScript — este arquivo
   inteiro não roda nesse caso. */

const CHAVE = "ldf:cortina-ambientes";

/* Ver o cuidado 3. */
const efeitoAntesDaPintura = typeof window === "undefined" ? useEffect : useLayoutEffect;

export default function Cortina({ children }: { children: React.ReactNode }) {
  const caixa = useRef<HTMLDivElement>(null);

  efeitoAntesDaPintura(() => {
    const el = caixa.current;
    if (!el) return;

    let jaSubiu = false;
    try {
      jaSubiu = sessionStorage.getItem(CHAVE) === "1";
    } catch {
      /* Modo restrito: trata como primeira visita e anima. */
      jaSubiu = false;
    }

    if (jaSubiu) {
      el.dataset.cortina = "vista";
      return;
    }

    const marcar = () => {
      try {
        sessionStorage.setItem(CHAVE, "1");
      } catch {
        /* Sem onde guardar: a próxima entrada anima de novo, e tudo bem. */
      }
    };

    /* O Reveal pode já ter marcado antes deste efeito rodar. */
    if (el.classList.contains("in")) {
      marcar();
      return;
    }

    const obs = new MutationObserver(() => {
      if (!el.classList.contains("in")) return;
      marcar();
      obs.disconnect();
    });
    obs.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  /* `rise` continua aqui: é o gatilho que o Reveal do layout observa. */
  return (
    <div className="cortina rise" ref={caixa}>
      {children}
    </div>
  );
}
