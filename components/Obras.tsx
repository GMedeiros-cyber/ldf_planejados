import { obras } from "@/lib/dados";

/* Carrossel de obras, full-bleed. A pista corre sozinha em loop por
   animação de transform — nada de requestAnimationFrame nem scrollLeft, e
   nada de pausa: ela não para com o ponteiro em cima.

   A lista é renderizada em DUAS METADES idênticas: com duas cópias de
   largura igual, o -50% dos keyframes cai exatamente no início da segunda e
   a volta ao começo não aparece. Nenhum card reage ao mouse.
   Ver a seção 8b em globals.css. */

type Obra = (typeof obras)[number];

function Cartao({ obra, copia }: { obra: Obra; copia?: boolean }) {
  return (
    <li className="obra">
      <figure className="obra__figura">
        <span className="obra__quadro">
          <img
            src={obra.img}
            alt={copia ? "" : obra.alt}
            loading="lazy"
            decoding="async"
          />
        </span>
        {/* A SIGLA SAIU DA TELA. Era um <span class="obra__sigla"> com "CZ",
            "DR", "SL"… — o único rótulo VISÍVEL do card, com o nome completo
            atrás dele em oculto-visual. Decisão do cliente: o card mostra a
            foto e nada mais.

            O NOME CONTINUA, e continua sendo o que o leitor de tela anuncia.
            Ele nunca esteve na tela: .obra__nome é oculto-visual — fora da
            vista, dentro da árvore de acessibilidade. Tirar a sigla não mexeu
            nele, e é por isso que o card não ficou mudo.

            ⚠ O CAMPO `sigla` CONTINUA EM lib/dados.ts e agora não tem leitor.
            Não é chave (a key é `obra.nome`) nem rótulo acessível — foi
            conferido por grep antes da remoção. Ficou de propósito: apagar
            dado do cliente é outra conversa. */}
        <figcaption className="obra__rotulo">
          <span className="obra__nome">{obra.nome}</span>
        </figcaption>
      </figure>
    </li>
  );
}

/* A segunda metade existe só para fechar o loop: sai da árvore de
   acessibilidade para o leitor de tela não anunciar tudo duas vezes. */
function Metade({ copia }: { copia?: boolean }) {
  return (
    <ul className="obras__metade" aria-hidden={copia || undefined}>
      {obras.map((obra) => (
        <Cartao key={obra.nome} obra={obra} copia={copia} />
      ))}
    </ul>
  );
}

export default function Obras() {
  return (
    <section className="section obras" id="obras" aria-labelledby="t-obras">
      <div className="wrap section__head rise">
        <h2 className="h2" id="t-obras">
          Trabalho que fala por nós.
        </h2>
        <p className="lede">
          Projeto, corte, montagem e entrega. Tudo sai da nossa fábrica direto para sua
          casa. Nenhum intermediário no caminho.
        </p>
      </div>

      <div className="obras__trilho" role="region" aria-label="Obras entregues" tabIndex={0}>
        <div className="obras__pista">
          <Metade />
          <Metade copia />
        </div>
      </div>
    </section>
  );
}
