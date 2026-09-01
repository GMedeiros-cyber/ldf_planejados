"use client";

import Link from "next/link";
import { useState } from "react";

import TracoAmbientes from "./TracoAmbientes";
import { Seta, SetaDiagonal } from "./Icones";
import { AMBIENTE_ALTURA, AMBIENTE_LARGURA, ambientes } from "@/lib/dados";

/* Vitrine de ambientes: um painel só, um ambiente por vez, navegação por
   setas. Substituiu a lista vertical de oito blocos com revelação em máscara.

   AS QUATRO FOTOS FICAM TODAS NO DOM, empilhadas na mesma célula de grade, e a
   troca é crossfade por opacity mais um scale de 1.04 a 1. Nenhuma delas entra
   ou sai da árvore: montar e desmontar <img> a cada clique devolveria o
   problema que o crossfade existe para resolver — a foto seguinte chegaria
   depois do clique, com um quadro vazio no meio. Aqui as quatro já estão
   decodificadas quando a primeira troca acontece.

   Nada de layout se move na troca: opacity e transform não são propriedades de
   layout, e as quatro ocupam a MESMA célula, então a altura do quadro é a
   mesma esteja qual estiver visível.

   POR QUE ESTE COMPONENTE NÃO É DOIS. O padrão de dois componentes irmãos, que
   o AmbienteBloco usa e que o TracoAmbientes usa, existe para um problema
   específico: não CRIAR um hook (lá, o useScroll) quando o movimento está
   reduzido, já que desligar hook por condicional quebra a ordem entre
   renderizações. Aqui não há hook a pular — o crossfade é CSS, e quem o
   desliga é a media query no fim da seção 11b. Um irmão estático teria a mesma
   marcação, os mesmos hooks e o mesmo comportamento, e o único efeito real
   seria expor a troca de componente na hidratação, que é justamente a
   armadilha que o comentário do AmbienteBloco descreve. O hook a pular existe
   no TracoAmbientes, e é lá que a divisão está feita. */

/* Navegação circular: do 04 volta ao 01. O módulo com o comprimento somado
   antes cobre o passo negativo, que em JS devolveria -1 em vez de 3. */
const passo = (i: number, delta: number) =>
  (i + delta + ambientes.length) % ambientes.length;

const doisDigitos = (n: number) => String(n).padStart(2, "0");

export default function VitrineAmbientes() {
  const [indice, setIndice] = useState(0);
  const atual = ambientes[indice];

  const aoTeclar = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") setIndice((i) => passo(i, 1));
    else if (e.key === "ArrowLeft") setIndice((i) => passo(i, -1));
    else return;
    /* Só depois de reconhecer a tecla: as outras seguem para a página. */
    e.preventDefault();
  };

  return (
    <div className="vitrine" onKeyDown={aoTeclar}>
      {/* O traço é irmão do conteúdo, não pai. A .traco__caixa é absoluta e
          resolve contra .pagina-ambientes, que é quem tem position: relative —
          por isso ele cobre o cabeçalho da página também, e não só a vitrine.
          O progresso vai de 0 a 1 em três passos, um por troca. */}
      <TracoAmbientes ondas={4} progresso={indice / (ambientes.length - 1)} />

      <div className="vitrine__grade">
        {/* aria-live no bloco inteiro: quem não vê a foto trocar precisa ouvir
            o nome, a composição e o texto do ambiente novo. */}
        <div className="vitrine__texto" aria-live="polite">
          <p className="vitrine__contador">
            <span className="vitrine__risco" aria-hidden="true" />
            {doisDigitos(indice + 1)} / {doisDigitos(ambientes.length)}
          </p>

          <h2 className="vitrine__nome">{atual.nome}</h2>
          <p className="vitrine__subline">{atual.subline}</p>
          <p className="vitrine__corpo">{atual.texto}</p>

          {/* Sem href não vai nada no lugar: quem está vendo o ambiente não
              precisa de um rótulo dizendo que a página não existe.
              O artigo é feminino porque hoje só a Cozinha tem página; quando
              um ambiente masculino ganhar a dele, isto vira dado. */}
          {atual.href ? (
            <Link className="vitrine__link" href={atual.href}>
              Ver a {atual.nome.toLowerCase()}
              <SetaDiagonal className="vitrine__link-seta" />
            </Link>
          ) : null}

          <div className="vitrine__setas">
            <button
              type="button"
              className="vitrine__seta"
              onClick={() => setIndice((i) => passo(i, -1))}
              aria-label="Ambiente anterior"
            >
              <Seta />
            </button>
            <button
              type="button"
              className="vitrine__seta vitrine__seta--ativa"
              onClick={() => setIndice((i) => passo(i, 1))}
              aria-label="Próximo ambiente"
            >
              <Seta />
            </button>
          </div>
        </div>

        <div className="vitrine__quadro">
          {ambientes.map((a, i) => (
            <img
              key={a.img}
              className="vitrine__foto"
              src={a.img}
              /* A primeira é a que aparece; as outras três só depois. */
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "auto"}
              decoding="async"
              width={AMBIENTE_LARGURA}
              height={AMBIENTE_ALTURA}
              /* O alt sai de `nome` e `meta`, a mesma regra de sempre: a
                 descrição do que a foto mostra já existe nos dados. */
              alt={`${a.nome}: ${a.meta}.`}
              {...(i === indice ? { "data-ativo": "" } : {})}
              /* As três ocultas saem da árvore de acessibilidade e da ordem de
                 leitura: só uma foto está à vista de cada vez. */
              aria-hidden={i === indice ? undefined : "true"}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
