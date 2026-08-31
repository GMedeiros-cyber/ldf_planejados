"use client";

import Link from "next/link";
import { useEffect, useRef, type Ref } from "react";
import { useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";

import { SetaDiagonal } from "./Icones";
import { AMBIENTE_ALTURA, AMBIENTE_LARGURA, type Ambiente } from "@/lib/dados";

/* Um ambiente da listagem de /ambientes: foto de um lado, nome e a linha de
   composição do outro. Quem alterna os lados é o CSS, pelo índice — ver
   .ambiente--espelho.

   A REVELAÇÃO: a foto começa recortada num círculo pequeno e abre até o quadro
   cheio conforme o bloco atravessa a viewport. Só clip-path e opacity se
   movem; nenhuma propriedade de layout entra na conta, então o efeito não
   dispara reflow.

   DOIS COMPONENTES, E NÃO UM COM `if`. O caso de movimento reduzido não pode
   chamar useScroll, e desligar um hook por condicional viola as regras dos
   hooks — o React perde a ordem entre renderizações. Escolher qual COMPONENTE
   renderizar resolve: cada um tem o seu conjunto de hooks, sempre completo e
   sempre na mesma ordem.

   A MARCAÇÃO QUE OS DOIS DEVOLVEM É BYTE A BYTE IGUAL, e isso não é detalhe.
   O servidor não tem media query: ele sempre renderiza a versão animada, e no
   cliente com movimento reduzido a estática toma o lugar dela. Se as duas
   diferissem em um atributo que fosse, a hidratação ficaria com o do servidor
   pendurado no DOM — foi o que aconteceu com um `data-revela` que existia aqui
   só para depuração e que sobrevivia à troca, anunciando animação numa árvore
   que não tinha nenhuma. Quem quiser saber qual das duas está viva olha o
   `--raio` inline: só a animada escreve.

   É a mesma armadilha, por outro caminho, do erro que circula no componente
   de referência deste efeito: lá o useTransform é chamado dentro do objeto
   `style`, dentro de um ternário. Aqui todo valor derivado é calculado no
   corpo do componente, antes do return.

   O VALOR VAI PARA UMA CUSTOM PROPERTY, e não para um motion.div. Os dois
   desenham igual, mas o componente arrasta a camada de componentes da motion
   para o pacote da rota. É a mesma escolha, pelo mesmo motivo, que o
   FundoMadeira já fazia na home.

   E dá de brinde o estado de repouso certo: `circle(var(--raio, 75%))` já é o
   quadro cheio antes de o JS escrever qualquer coisa. Sem isso a foto nasceria
   recortada num disco e só abriria depois da hidratação — que é exatamente o
   que se vê num bloco acima da dobra. */

type Props = { amb: Ambiente; indice: number };

/* O raio é percentual do quadro. 75% cobre a caixa inteira com folga: a
   referência de `circle(r%)` é a diagonal sobre raiz de dois, que num 4:3 de
   1400×1050 dá 1237px — 75% são 928px contra 875px de meia-diagonal. E 16%
   dá um disco de ~198px, pequeno o bastante para ler como abertura. */
const RAIO_FECHADO = 16;
const RAIO_ABERTO = 75;

function Corpo({ amb, indice, quadro }: Props & { quadro?: Ref<HTMLDivElement> }) {
  /* O alt sai de `nome` e `meta`, que são a descrição que já existe do que a
     foto mostra. Nada é inventado aqui. */
  const alt = `${amb.nome}: ${amb.meta}.`;

  return (
    <>
      <div className="ambiente__quadro" ref={quadro}>
        <img
          className="ambiente__foto"
          src={amb.img}
          /* A primeira foto é a única acima da dobra; as outras sete só chegam
             quando a rolagem se aproxima. */
          loading={indice === 0 ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={indice === 0 ? "high" : "auto"}
          width={AMBIENTE_LARGURA}
          height={AMBIENTE_ALTURA}
          alt={alt}
        />
      </div>

      <div className="ambiente__texto">
        <h2 className="ambiente__nome">
          {amb.href ? (
            <Link className="ambiente__link" href={amb.href}>
              {amb.nome}
              <SetaDiagonal className="ambiente__go" />
            </Link>
          ) : (
            amb.nome
          )}
        </h2>
        <p className="ambiente__meta">{amb.meta}</p>
        {amb.href ? null : <span className="ambiente__breve">Página em breve</span>}
      </div>
    </>
  );
}

/* Movimento reduzido: a foto aparece inteira e parada. Nenhum useScroll é
   criado, nenhum assinante de rolagem existe — não é a animação escondida
   atrás de opacidade 1, é a animação inexistente. */
function BlocoEstatico(props: Props) {
  return (
    <article className={`ambiente${props.indice % 2 ? " ambiente--espelho" : ""}`}>
      <Corpo {...props} />
    </article>
  );
}

function BlocoRevelado(props: Props) {
  const alvo = useRef<HTMLElement>(null);
  const quadro = useRef<HTMLDivElement>(null);

  /* "start 85%" = o topo do bloco a 85% da altura da janela, ou seja, logo
     que ele assoma por baixo. "end 15%" = a base já perto do topo da tela.
     A abertura acontece durante a travessia, e não depois dela. */
  const { scrollYProgress } = useScroll({
    target: alvo,
    offset: ["start 85%", "end 15%"],
  });

  /* Sem a mola o raio segue o dedo: em rolagem por trackpad, que chega em
     saltos, a borda do círculo pula. A mola transforma o salto em percurso. */
  const suave = useSpring(scrollYProgress, { stiffness: 170, damping: 24 });

  /* TODOS os derivados no corpo do componente, nunca dentro do style nem de
     um ternário. */
  const raio = useTransform(suave, [0, 1], [RAIO_FECHADO, RAIO_ABERTO]);
  const opacidade = useTransform(suave, [0, 0.55], [0.35, 1]);

  const escrever = (r: number, o: number) => {
    const el = quadro.current;
    if (!el) return;
    el.style.setProperty("--raio", `${r.toFixed(2)}%`);
    el.style.setProperty("--opacidade", o.toFixed(3));
  };

  /* Quem chega com a página já rolada — âncora, recarregar no meio, voltar
     pelo histórico — não recebe evento de mudança nenhum. O valor de partida
     é escrito na montagem. */
  useEffect(() => {
    escrever(raio.get(), opacidade.get());
  }, [raio, opacidade]);

  useMotionValueEvent(raio, "change", (v) => escrever(v, opacidade.get()));
  useMotionValueEvent(opacidade, "change", (v) => escrever(raio.get(), v));

  return (
    <article className={`ambiente${props.indice % 2 ? " ambiente--espelho" : ""}`} ref={alvo}>
      <Corpo {...props} quadro={quadro} />
    </article>
  );
}

export default function AmbienteBloco(props: Props) {
  const semMovimento = useReducedMotion();
  return semMovimento ? <BlocoEstatico {...props} /> : <BlocoRevelado {...props} />;
}
