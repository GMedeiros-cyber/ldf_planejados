"use client";

import { useEffect, useState } from "react";

import { heroSlides, heroLarguras, contato } from "@/lib/dados";
import {
  IconeFacebook,
  IconeInstagram,
  IconeLocal,
  IconePinterest,
} from "./Icones";

/* Capa em três slides que se cruzam por opacidade. Sem efeito de scroll e sem
   biblioteca de animação: um setInterval troca o slide ativo e o CSS faz o
   crossfade. A headline pertence ao slide, então atravessa junto com a foto. */

const INTERVALO = 6000;

/* Instagram e Facebook são os endereços reais da LDF (lib/dados.ts). Os dois
   últimos ainda não têm destino, e por isso não abrem em aba nova: mandar
   alguém para uma aba em branco é pior do que não abrir nada. O target sai
   de `href !== "#"`, então os dois passam a abrir sozinhos quando o link
   chegar. */
const sociais = [
  { rotulo: "LDF no Facebook", href: contato.facebook, Icone: IconeFacebook },
  { rotulo: "LDF no Instagram", href: contato.instagram, Icone: IconeInstagram },
  /* TODO: perfil da LDF no Pinterest — não há conta documentada em cliente/ */
  { rotulo: "LDF no Pinterest", href: "#", Icone: IconePinterest },
  /* TODO: link do Google Maps da fábrica */
  { rotulo: "Onde estamos", href: "#", Icone: IconeLocal },
];

const srcSet = (base: string) =>
  heroLarguras.map((w) => `${base}-${w}.webp ${w}w`).join(", ");

/* ══ O FUNDO VERMELHO DA PALAVRA DE DESTAQUE ══

   A palavra vem de `slide.destaque`, no lib/dados.ts. Aqui só se procura onde
   ela está na linha e se corta o texto em três.

   ⚠ SÓ NO HERÓI. Nada disto atravessa para os numerais, para a faixa de marcas
   ou para qualquer outra seção — o fundo vermelho é o gesto de abertura da
   página, e repetido em outro lugar deixa de ser gesto e vira decoração.

   A BUSCA IGNORA CAIXA e devolve `null` quando a palavra não está na linha; o
   porquê dos dois está no lib/dados.ts, junto do campo. */
function partir(linha: string, palavra: string) {
  const i = linha.toLowerCase().indexOf(palavra.toLowerCase());
  if (i < 0) return null;
  return {
    antes: linha.slice(0, i),
    /* A fatia vem da LINHA, não do campo `destaque`: assim a capitalização que
       aparece na tela é a do título, e o campo serve só para localizar. */
    palavra: linha.slice(i, i + palavra.length),
    depois: linha.slice(i + palavra.length),
  };
}

export default function Hero() {
  const [ativo, setAtivo] = useState(0);

  useEffect(() => {
    /* Sem movimento automático quando o visitante pede menos movimento:
       fica só o primeiro slide, estático. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = setInterval(() => {
      setAtivo((i) => (i + 1) % heroSlides.length);
    }, INTERVALO);

    return () => clearInterval(id);
  }, []);

  return (
    <section className="hero hero--capa" aria-roledescription="carrossel" aria-label="Apresentação">
      <ul className="hero__slides">
        {heroSlides.map((slide, i) => (
          <li
            className="hero__slide"
            key={slide.img}
            {...(i === ativo ? { "data-ativo": "" } : {})}
            aria-hidden={i === ativo ? undefined : true}
          >
            <img
              className="hero__foto"
              src={`${slide.img}-1920.webp`}
              srcSet={srcSet(slide.img)}
              sizes="100vw"
              alt={slide.alt}
              {...(i === 0
                ? { fetchPriority: "high" as const, loading: "eager" as const }
                : { loading: "lazy" as const })}
              decoding="async"
            />
            <div className="hero__vinheta" />
            <h1 className="hero__titulo">
              <Linha texto={slide.titulo[0]} destaque={slide.destaque} />
              <br />
              <Linha
                texto={slide.titulo[1]}
                /* A palavra só pode ser destacada UMA vez. Se ela estiver na
                   primeira linha, a segunda recebe `undefined` e sai limpa —
                   sem isso, um título com a palavra repetida ganharia dois
                   destaques e o gesto perderia o sentido. */
                destaque={partir(slide.titulo[0], slide.destaque) ? undefined : slide.destaque}
              />
            </h1>
          </li>
        ))}
      </ul>

      <ul className="hero__sociais">
        {sociais.map(({ rotulo, href, Icone }) => (
          <li key={rotulo}>
            <a
              className="hero__social"
              href={href}
              aria-label={rotulo}
              {...(href !== "#"
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              <Icone />
            </a>
          </li>
        ))}
      </ul>

      <div className="hero__seta" aria-hidden="true">
        <svg viewBox="0 0 24 40" fill="none">
          <path d="M12 2v34M4 28l8 8 8-8" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </div>
    </section>
  );
}

/* Uma linha do título. Sem palavra a destacar — ou com uma que não está nesta
   linha — ela devolve o texto cru, e o herói fica exatamente como era.

   ⚠ A FAIXA VERMELHA SAIU. Por uma rodada o destaque foi um fundo animado por
   trás da palavra, com `motion` e `scaleX`. O cliente preferiu o vermelho na
   LETRA, e com a faixa foram junto o elemento animado, o `motion` e o
   `useReducedMotion` — não sobrou movimento nenhum neste arquivo para
   respeitar. O <span> continua, porque a cor precisa de um alvo. */
function Linha({ texto, destaque }: { texto: string; destaque?: string }) {
  const corte = destaque ? partir(texto, destaque) : null;
  if (!corte) return <>{texto}</>;

  return (
    <>
      {corte.antes}
      <span className="hero__destaque">{corte.palavra}</span>
      {corte.depois}
    </>
  );
}
