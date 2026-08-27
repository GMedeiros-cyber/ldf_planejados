"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import Logo from "./Logo";

/* Navegação fixa: transparente sobre a capa; ganha fundo e régua depois do
   scroll. Todos os destinos abaixo apontam para ids que existem em
   app/page.tsx — conferido, nenhum órfão. */

const links = [
  { href: "/#ambientes", texto: "Ambientes" },
  { href: "/#comercial", texto: "Espaços comerciais" },
  { href: "/#processo", texto: "Como funciona" },
  { href: "/#fabrica", texto: "A LDF" },
  { href: "/#contato", texto: "Contato" },
];

export default function Nav() {
  const [rolado, setRolado] = useState(false);
  const [aberto, setAberto] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const marcar = () => setRolado(window.scrollY > 24);
    marcar();
    window.addEventListener("scroll", marcar, { passive: true });
    return () => window.removeEventListener("scroll", marcar);
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
    <header className="nav" {...(rolado ? { "data-rolado": "" } : {})}>
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
              <Link key={l.href} className="nav__link" href={l.href}>
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
