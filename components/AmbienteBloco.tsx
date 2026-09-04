"use client";

import { useRef, useState } from "react";

import { Seta } from "./Icones";
import { AMBIENTE_ALTURA, AMBIENTE_LARGURA, type Ambiente } from "@/lib/dados";

/* Um ambiente da lista de /ambientes: foto de um lado, texto do outro. Quem
   alterna os lados é o CSS, pelo índice — ver .ambiente--espelho.

   CADA BLOCO TEM UMA PILHA DE FOTOS DO MESMO AMBIENTE, trocadas por botão.
   Todas ficam no DOM, empilhadas na mesma célula de grade, e a troca é
   crossfade por opacity mais um scale de 1.03 a 1. Nenhuma delas entra ou sai
   da árvore: montar e desmontar <img> a cada clique devolveria o problema que
   o crossfade existe para resolver — a foto seguinte chegaria depois do
   clique, com um quadro vazio no meio.

   Nada de layout se move na troca. Opacity e transform não são propriedades de
   layout, e as fotos dividem a MESMA célula, então a altura do quadro é a
   mesma esteja qual estiver visível.

   ══ POR QUE NÃO HÁ useReducedMotion AQUI ══

   Este arquivo já foi dois componentes irmãos de marcação idêntica, e a
   ginástica tinha motivo: a revelação em máscara chamava useScroll, e um hook
   não pode ser desligado por condicional sem quebrar a ordem entre
   renderizações — a saída era escolher qual COMPONENTE renderizar.

   A máscara saiu, e com ela o useScroll. Não há mais hook a pular, então a
   divisão perdeu a função e o useReducedMotion perdeu o lugar: ele devolve um
   valor no servidor e outro no cliente, e qualquer coisa que mudasse na
   marcação por causa dele viraria divergência de hidratação. Já mordeu esta
   base uma vez — um `data-revela` de depuração ficou pendurado no DOM depois
   da troca, anunciando animação numa árvore que não tinha nenhuma.

   Movimento reduzido é resolvido 100% em CSS, pela media query no fim da seção
   11b. Um componente só, sem ramo de hidratação. Se um dia voltar a existir um
   hook que precise não ser criado, a divisão em dois volta com ele — e não
   antes. */

type Props = { amb: Ambiente; indice: number };

/* Navegação circular. O módulo com o comprimento somado antes cobre o passo
   negativo, que em JS devolveria -1 em vez do último. */
const passo = (i: number, delta: number, total: number) => (i + delta + total) % total;

const doisDigitos = (n: number) => String(n).padStart(2, "0");

/* ══ O ARRASTO: DOIS LIMIARES, E CADA UM RESOLVE UM PROBLEMA DIFERENTE ══

   LIMIAR_EIXO decide QUEM fica com o gesto. Nos primeiros 10px o movimento
   ainda não tem direção confiável: um polegar que quer rolar a página começa
   quase sempre com alguma componente horizontal. Só depois de 10px o
   componente compara |dx| e |dy| — e se o vertical vencer, ele DESISTE do
   gesto de vez e deixa a página rolar. Sem essa desistência a lista de
   ambientes fica travada no telefone.

   LIMIAR_TROCA decide SE a foto muda. 44px é o mesmo número do alvo de toque
   mínimo: menos que isso é toque acidental ou tremor de mão, não intenção.

   Os dois são independentes. Um arrasto pode passar do LIMIAR_EIXO — e a
   partir daí a página não rola mais — e mesmo assim voltar sem trocar nada,
   porque não chegou aos 44px. É o comportamento certo: quem arrasta e devolve
   está desistindo. */
const LIMIAR_EIXO = 10;
const LIMIAR_TROCA = 44;

export default function AmbienteBloco({ amb, indice }: Props) {
  const [foto, setFoto] = useState(0);
  const total = amb.fotos.length;
  const varias = total > 1;

  /* ══ O ESTADO DO ARRASTO VIVE EM REF, NÃO EM useState ══

     Nada do que está aqui é desenhado: são coordenadas de trabalho, lidas e
     escritas várias vezes por gesto. Em estado, cada `pointermove` agendaria
     uma renderização da árvore inteira do bloco — e o bloco tem três <img> —
     para não mudar um pixel. `null` significa "não há gesto em curso". */
  const arrasto = useRef<{ x: number; y: number; eixo: null | "x" | "y" } | null>(null);

  const aoDescer = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!varias) return;
    /* Botão do meio, direito e caneta com botão lateral não iniciam gesto. */
    if (e.button !== 0) return;
    arrasto.current = { x: e.clientX, y: e.clientY, eixo: null };
  };

  const aoMover = (e: React.PointerEvent<HTMLDivElement>) => {
    const a = arrasto.current;
    if (!a) return;

    const dx = e.clientX - a.x;
    const dy = e.clientY - a.y;

    /* O eixo se decide UMA vez por gesto e não volta atrás: um arrasto que
       começa horizontal e curva não devolve a rolagem no meio do caminho, e
       um que começa vertical não rouba a foto depois. */
    if (a.eixo === null) {
      if (Math.abs(dx) < LIMIAR_EIXO && Math.abs(dy) < LIMIAR_EIXO) return;
      if (Math.abs(dy) > Math.abs(dx)) {
        /* Vertical: a página rola, e o gesto acaba aqui. */
        arrasto.current = null;
        return;
      }
      a.eixo = "x";
      /* ══ A CAPTURA FAZ DUAS COISAS, E A SEGUNDA NÃO É ÓBVIA ══

         A primeira é a esperada: garante que o `pointerup` chegue mesmo se o
         dedo sair do quadro. Sem ela, arrastar para fora da foto deixa o gesto
         pendurado.

         A segunda evita um defeito real. As setas sobre a foto são botões, e um
         arrasto que COMEÇA em cima de uma delas dispararia o gesto e o clique —
         duas fotos de avanço num gesto só. Com a captura, o `pointerup` passa a
         mirar o quadro; o navegador dispara o `click` no ancestral comum entre
         o alvo do down e o do up, que é o próprio quadro, e o `onClick` do botão
         nunca roda. Testado: arrasto de −120px começando na seta avança UMA. */
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  };

  const aoSubir = (e: React.PointerEvent<HTMLDivElement>) => {
    const a = arrasto.current;
    arrasto.current = null;
    if (!a || a.eixo !== "x") return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    const dx = e.clientX - a.x;
    if (Math.abs(dx) < LIMIAR_TROCA) return;
    /* Arrastar para a ESQUERDA traz a próxima: o conteúdo acompanha o dedo,
       que é a convenção de toda galeria de telefone. */
    setFoto((i) => passo(i, dx < 0 ? 1 : -1, total));
  };

  /* O navegador cancela o ponteiro quando decide rolar a página, e também na
     troca de aba. Sem isto o gesto ficaria aberto e o próximo toque herdaria
     coordenadas velhas. */
  const aoCancelar = () => {
    arrasto.current = null;
  };

  const aoTeclar = (e: React.KeyboardEvent<HTMLElement>) => {
    if (!varias) return;
    if (e.key === "ArrowRight") setFoto((i) => passo(i, 1, total));
    else if (e.key === "ArrowLeft") setFoto((i) => passo(i, -1, total));
    else return;
    /* Só depois de reconhecer a tecla: as outras seguem para a página. */
    e.preventDefault();
  };

  /* O alt sai de `nome` e `meta`, que já descrevem o que a foto mostra. */
  const alt = `${amb.nome}: ${amb.meta}.`;

  return (
    <article
      className={`ambiente${indice % 2 ? " ambiente--espelho" : ""}`}
      onKeyDown={aoTeclar}
    >
      {/* `rise` no QUADRO, nunca em cada <img>. O Reveal do layout observa toda
          .rise da página e acrescenta .in quando ela entra na viewport; a
          classe mexe na opacity do elemento em que está. Posta em cada foto,
          disputaria a opacity com o crossfade — as fotos alternam por essa
          mesma propriedade, e uma zeraria a outra. No quadro as duas opacidades
          se multiplicam, que é o que se quer: o quadro surge, e dentro dele as
          fotos trocam. */}
      {/* ⚠ `touch-action: pan-y` MORA NO CSS e é o que faz este gesto conviver
          com a rolagem. Ele diz ao navegador: o pan vertical é seu, o
          horizontal é meu. Sem ele o navegador engole o horizontal também e o
          `pointermove` chega cancelado; com `none` no lugar dele, a página
          para de rolar em cima da foto. Ver a seção 11b da folha. */}
      <div
        className="ambiente__quadro rise"
        onPointerDown={aoDescer}
        onPointerMove={aoMover}
        onPointerUp={aoSubir}
        onPointerCancel={aoCancelar}
      >
        {amb.fotos.map((src, i) => (
          <img
            key={src}
            className="ambiente__foto"
            src={src}
            /* Só a primeira foto do PRIMEIRO bloco está acima da dobra. Todo o
               resto — as outras da pilha e os blocos seguintes — espera a
               rolagem se aproximar. */
            loading={indice === 0 && i === 0 ? "eager" : "lazy"}
            fetchPriority={indice === 0 && i === 0 ? "high" : "auto"}
            decoding="async"
            width={AMBIENTE_LARGURA}
            height={AMBIENTE_ALTURA}
            alt={alt}
            {...(i === foto ? { "data-ativo": "" } : {})}
            /* As ocultas saem da árvore de acessibilidade e da ordem de
               leitura: só uma foto está à vista de cada vez, e as outras
               repetiriam o mesmo alt. */
            aria-hidden={i === foto ? undefined : "true"}
            /* O arrasto é do quadro. Sem isto o navegador inicia o seu próprio
               arrasto de imagem no meio do gesto, e no desktop o cursor vira
               "copiar arquivo". */
            draggable={false}
          />
        ))}

        {/* ══ AS SETAS SOBRE A FOTO: DE PISTA VISUAL A CONTROLE ÚNICO ══

            Elas nasceram como affordance — arrasto é gesto invisível, e sem
            nada na foto ninguém descobre que dá para arrastar. Eram
            `aria-hidden` com `tabIndex={-1}`, porque as setas embaixo do texto
            eram os controles de verdade e repetir os rótulos faria a pessoa
            ouvir "Foto anterior de Cozinha" duas vezes no mesmo bloco.

            ⚠ ISSO MUDOU, E A MUDANÇA VEIO EM DUAS PARTES QUE NÃO PODEM SER
            SEPARADAS. Onde não há ponteiro, as setas de baixo agora SOMEM (ver
            a seção 11b) — e estas passam a ser os únicos controles do bloco.
            Um controle único não pode ser invisível para o teclado nem para o
            leitor de tela. Por isso saíram o `aria-hidden` do invólucro e o
            `tabIndex={-1}` dos botões, e entraram os `aria-label`.

            REMOVER AS DE BAIXO SEM ISTO SERIA REGRESSÃO, não simplificação: o
            bloco ficaria com dois botões sem nome, fora da ordem do Tab, e sem
            nenhuma outra forma de trocar a foto além do arrasto.

            E NÃO HÁ RÓTULO EM DOBRO. Onde há ponteiro, o invólucro é
            `display: none` — que tira da ordem de foco E da árvore de
            acessibilidade de uma vez. As duas filas nunca coexistem para
            ninguém.

            SÃO BOTÕES DE VERDADE desde sempre, não enfeite com
            `pointer-events: none`. Uma seta desenhada sobre a foto parece
            tocável; se o toque atravessasse para o quadro, que só responde a
            arrasto, ela seria uma zona morta que mente sobre o que faz. */}
        {varias ? (
          <div className="ambiente__sobre">
            <button
              type="button"
              className="ambiente__seta-sobre"
              onClick={() => setFoto((i) => passo(i, -1, total))}
              aria-label={`Foto anterior de ${amb.nome}`}
            >
              <Seta />
            </button>
            <button
              type="button"
              className="ambiente__seta-sobre"
              onClick={() => setFoto((i) => passo(i, 1, total))}
              aria-label={`Próxima foto de ${amb.nome}`}
            >
              <Seta />
            </button>
          </div>
        ) : null}
      </div>

      <div className="ambiente__texto">
        {/* Sem contador onde há uma foto só: ele anunciaria uma navegação que
            não existe. aria-live para quem não vê a foto trocar. */}
        {varias ? (
          <p className="ambiente__contador" aria-live="polite">
            <span className="ambiente__risco" aria-hidden="true" />
            {doisDigitos(foto + 1)} / {doisDigitos(total)}
          </p>
        ) : null}

        <h2 className="ambiente__nome">{amb.nome}</h2>
        <p className="ambiente__subline">{amb.subline}</p>
        <p className="ambiente__meta">{amb.texto}</p>

        {varias ? (
          <div className="ambiente__setas">
            <button
              type="button"
              className="ambiente__seta"
              onClick={() => setFoto((i) => passo(i, -1, total))}
              aria-label={`Foto anterior de ${amb.nome}`}
            >
              <Seta />
            </button>
            <button
              type="button"
              className="ambiente__seta"
              onClick={() => setFoto((i) => passo(i, 1, total))}
              aria-label={`Próxima foto de ${amb.nome}`}
            >
              <Seta />
            </button>
          </div>
        ) : null}
      </div>
    </article>
  );
}
