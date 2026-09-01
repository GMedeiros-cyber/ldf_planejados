"use client";

import Link from "next/link";
import { useState } from "react";

import { Seta, SetaDiagonal } from "./Icones";
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

export default function AmbienteBloco({ amb, indice }: Props) {
  const [foto, setFoto] = useState(0);
  const total = amb.fotos.length;
  const varias = total > 1;

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
      <div className="ambiente__quadro">
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
          />
        ))}
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

        {/* Sem href não vai nada no lugar. O artigo é feminino porque hoje só a
            Cozinha tem página; quando um ambiente masculino ganhar a dele,
            isto vira dado. */}
        {amb.href ? (
          <Link className="ambiente__link" href={amb.href}>
            Ver a {amb.nome.toLowerCase()}
            <SetaDiagonal className="ambiente__go" />
          </Link>
        ) : null}

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
              className="ambiente__seta ambiente__seta--ativa"
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
