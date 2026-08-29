"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import Logo from "./Logo";

/* Navegação em painel flutuante. Todos os destinos abaixo apontam para ids
   que existem em app/page.tsx — conferido, nenhum órfão. */

const links = [
  { href: "/ambientes", texto: "Ambientes" },
  { href: "/#comercial", texto: "Espaços comerciais" },
  { href: "/#processo", texto: "Como funciona" },
  { href: "/#fabrica", texto: "A LDF" },
  { href: "/#contato", texto: "Contato" },
];

export default function Nav() {
  const [rolado, setRolado] = useState(false);
  const [aberto, setAberto] = useState(false);
  const [atual, setAtual] = useState("");
  const [oculta, setOculta] = useState(false);
  /* Em ref, não em estado: a posição anterior é insumo do cálculo, não algo
     que a tela precise redesenhar a cada quadro de scroll. */
  const anterior = useRef(0);
  const burgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const marcar = () => setRolado(window.scrollY > 24);
    marcar();
    window.addEventListener("scroll", marcar, { passive: true });
    return () => window.removeEventListener("scroll", marcar);
  }, []);

  /* A barra recolhe ao descer e volta ao subir. É independente do data-rolado
     acima, e por isso tem o seu próprio listener: em movimento reduzido este
     aqui não chega a existir e a barra fica sempre visível, enquanto o outro
     continua trabalhando. */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    anterior.current = window.scrollY;

    const aoRolar = () => {
      const y = window.scrollY;
      const d = y - anterior.current;

      /* O topo manda, e manda antes da zona morta: chegar em y=0 por um
         salto de 3px ainda tem de revelar a barra. */
      if (y <= 8) {
        anterior.current = y;
        setOculta(false);
        return;
      }

      /* Zona morta. O scroll suave do trackpad e o bounce do iOS disparam
         dezenas de eventos de um ou dois pixels, alternando de sinal — sem
         este corte a barra treme. */
      if (Math.abs(d) <= 6) return;
      anterior.current = y;

      if (d > 0 && y > 120) {
        setOculta(true);
        /* Menu aberto pendurado numa barra que saiu da tela não faz sentido. */
        setAberto(false);
      } else if (d < 0) {
        setOculta(false);
      }
    };

    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  /* Qual seção está sendo lida. Sem isto o [aria-current] do CSS nunca
     casaria e o link atual jamais apagaria. A margem negativa de 45% em cima
     e embaixo reduz a área de observação a uma faixa no meio da tela: só a
     seção que cruza essa faixa conta como atual, então não há dois links
     apagados ao mesmo tempo. Em páginas internas nada casa e o efeito
     simplesmente não acontece. */
  useEffect(() => {
    const secoes = links
      .map((l) => document.getElementById(l.href.slice(2)))
      .filter((e): e is HTMLElement => e !== null);
    if (!secoes.length) return;

    const obs = new IntersectionObserver(
      (entradas) => {
        const dentro = entradas.find((e) => e.isIntersecting);
        if (dentro) setAtual(dentro.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    secoes.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!aberto) return;
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setAberto(false);
      burgerRef.current?.focus();
    };
    document.addEventListener("keydown", aoTeclar);
    return () => document.removeEventListener("keydown", aoTeclar);
  }, [aberto]);

  return (
    <header
      className="nav"
      {...(rolado ? { "data-rolado": "" } : {})}
      {...(oculta ? { "data-oculta": "" } : {})}
    >
      <div className="nav__interno">
        <Link
          className="nav__logo"
          href="/"
          aria-label="LDF Móveis Planejados, ir para o início"
        >
          <Logo className="nav__marca" />
        </Link>

        <div className="nav__direita">
          <nav
            className="nav__links"
            id="menu"
            aria-label="Principal"
            {...(aberto ? { "data-open": "" } : {})}
            onClick={(e) => {
              if ((e.target as HTMLElement).closest("a")) setAberto(false);
            }}
          >
            {links.map((l) => (
              <Link
                key={l.href}
                className="nav__link"
                href={l.href}
                /* "true" e não "location": é o valor com suporte largo em
                   leitores de tela, e aqui basta dizer "é esta". */
                aria-current={atual === l.href.slice(2) ? "true" : undefined}
              >
                {l.texto}
              </Link>
            ))}
          </nav>

          <Link className="btn-capsula" href="/#contato">
            <span className="btn-capsula__texto">
              <span className="btn__longo">Quero meu projeto</span>
              <span className="btn__curto">Projeto 3D</span>
            </span>
            <span className="btn-capsula__disco" aria-hidden="true">
              <svg viewBox="0 0 20 20" fill="none">
                <path
                  d="M6 14L14 6M14 6H7M14 6v7"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="square"
                />
              </svg>
              <svg viewBox="0 0 20 20" fill="none">
                <path
                  d="M6 14L14 6M14 6H7M14 6v7"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="square"
                />
              </svg>
            </span>
          </Link>

          {/* Em tela estreita o rótulo alterna junto com o ícone, como na referência. */}
        </div>

        <button
          ref={burgerRef}
          className="nav__burger"
          type="button"
          aria-expanded={aberto}
          aria-controls="menu"
          aria-label={aberto ? "Fechar menu" : "Abrir menu"}
          onClick={() => setAberto((v) => !v)}
        >
          <span className="nav__burger-rotulo" aria-hidden="true">
            <span className="nav__burger-menu">Menu</span>
            <span className="nav__burger-close">Close</span>
          </span>
          <svg
            className="bars"
            viewBox="0 0 18 18"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M1 4h16M1 9h16M1 14h16"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="square"
            />
          </svg>
          <svg className="x" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path
              d="M3 3l12 12M15 3L3 15"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="square"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
