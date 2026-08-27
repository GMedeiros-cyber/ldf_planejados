"use client";

import { useEffect, useState } from "react";

import { heroSlides, heroLarguras } from "@/lib/dados";

/* Capa em três slides que se cruzam por opacidade. Sem efeito de scroll e sem
   biblioteca de animação: um setInterval troca o slide ativo e o CSS faz o
   crossfade. A headline pertence ao slide, então atravessa junto com a foto. */

const INTERVALO = 6000;

const srcSet = (base: string) =>
  heroLarguras.map((w) => `${base}-${w}.webp ${w}w`).join(", ");

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
              {slide.titulo[0]}
              <br />
              {slide.titulo[1]}
            </h1>
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
