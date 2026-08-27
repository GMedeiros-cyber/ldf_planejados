"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Seta } from "./Icones";
import { pilares } from "@/lib/dados";

gsap.registerPlugin(ScrollTrigger);

/* Capa da home: fotografia full-bleed, vinheta, texto centrado e a faixa dos
   três pilares. Ao rolar, a seção prende no topo, a foto escurece, o texto
   recua e os pilares sobem até assentar — tudo por scrub do ScrollTrigger.

   O pin só existe acima de 992px e só quando o visitante não pediu menos
   movimento. Abaixo disso a capa é estática e os pilares viram uma coluna. */

/* TODO: substituir por foto real da LDF — ambiente executado ou a fábrica em Guarulhos. */
const FUNDO =
  "https://images.unsplash.com/photo-1729086046027-09979ade13fd?q=80&w=2000&auto=format&fit=crop";

export default function Hero() {
  const secao = useRef<HTMLElement>(null);

  useEffect(() => {
    const alvo = secao.current;
    if (!alvo) return;

    const semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const estreito = window.matchMedia("(max-width: 991.98px)").matches;
    if (semMovimento || estreito) return;

    const ctx = gsap.context(() => {
      gsap.set(".hero__pilares", { top: "84svh" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: alvo,
          start: "top top",
          end: "+=100%",
          pin: true,
          pinSpacing: false,
          scrub: 1,
        },
      });

      tl.to(".hero__vinheta", { opacity: 0.85, duration: 1, ease: "power2.out" })
        .to(".hero__pilares", { top: "0svh", duration: 0.2, ease: "power2.out" }, "<")
        .to(".hero__conteudo", { opacity: 0.25, y: -24, duration: 0.6, ease: "power1.out" }, "<0.1");
    }, alvo);

    /* Sem isto, a navegação client-side do Next acumula triggers órfãos e o
       scroll da página inteira quebra ao voltar para a home. */
    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section className="hero hero--capa" id="capa" aria-labelledby="t-hero" ref={secao}>
      <div className="hero__fundo">
        <img
          src={FUNDO}
          alt="Sala de estar com marcenaria planejada, painel e iluminação embutida."
          fetchPriority="high"
          loading="eager"
          decoding="async"
        />
      </div>

      <div className="hero__vinheta" aria-hidden="true" />

      <div className="hero__conteudo">
        <span className="hero__selo">Fábrica própria · Guarulhos</span>

        <h1 className="display" id="t-hero">
          Escolha o acabamento.
          <br />O resto a gente fabrica.
        </h1>

        <p className="lede">
          Móveis planejados feitos na nossa fábrica em Guarulhos, sem revenda no meio do caminho. O
          projeto 3D vem antes do orçamento, para você aprovar o móvel e não um número.
        </p>

        <div className="hero__actions">
          <Link className="btn" href="#contato">
            Quero meu projeto 3D
            <Seta />
          </Link>
          <Link className="btn btn--ghost" href="#processo">
            Ver como funciona
          </Link>
        </div>
      </div>

      <ul className="hero__pilares">
        {pilares.map((p) => (
          <li key={p.titulo}>
            <Link className="pilar" href={p.href}>
              <span className="pilar__titulo">{p.titulo}</span>
              <span className="pilar__texto">{p.texto}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
