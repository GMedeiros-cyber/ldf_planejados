"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import Logo from "./Logo";

/* Navegação em painel flutuante. Três destinos, e não mais cinco.

   O que saiu não sumiu do site: "Como funciona" e "A LDF" são seções da home,
   alcançáveis rolando, e continuam no rodapé — que é onde um mapa exaustivo
   pertence. A barra do topo carrega decisão, não índice.

   "Espaços comerciais" saiu da lista de vez: era âncora para #comercial em
   /ambientes, e aquela seção foi removida do site. O rodapé perdeu o item no
   mesmo commit. */

const links = [
  { href: "/", texto: "Home" },
  { href: "/ambientes", texto: "Ambientes" },
  { href: "/#contato", texto: "Contato" },
];

export default function Nav() {
  const [rolado, setRolado] = useState(false);
  const [aberto, setAberto] = useState(false);
  const [oculta, setOculta] = useState(false);
  const rota = usePathname();
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

  /* Quem manda no link apagado é a ROTA, não a seção visível.

     Antes um IntersectionObserver vigiava as seções da home e marcava o link
     da que cruzasse o meio da tela. Aquilo assumia que todo destino era
     "/#id" — lia o alvo com href.slice(2) — e com "/" e "/ambientes" na lista
     passaria a procurar por ids chamados "" e "mbientes". Além de quebrar, o
     observador rodava a cada rolagem para decidir uma coisa que só muda na
     navegação: saiu inteiro, e com ele um trabalho por quadro.

     Uma âncora nunca marca rota: "/#contato" é um salto dentro da página, e
     não um destino próprio — em "/" quem apaga é a Home.

     O prefixo com barra é o que separa uma subpágina do vizinho de nome
     parecido: sob "/ambientes", um futuro "/ambientes/closet" casa e um
     futuro "/ambientes-comerciais" não. Hoje não há subpágina nenhuma — a
     única que existia, /ambientes/cozinha, foi apagada —, e a barra fica
     porque é ela que impede o casamento errado quando a primeira voltar. */
  const ehAtual = (href: string) => {
    if (href.includes("#")) return false;
    if (href === "/") return rota === "/";
    return rota === href || rota.startsWith(href + "/");
  };

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
                /* "page" e não "true": agora o que se marca é a PÁGINA em que
                   se está, e esse é o valor canônico para isso. Enquanto o
                   indicador era de seção, "true" era o certo — "page" teria
                   mentido sobre uma âncora. */
                aria-current={ehAtual(l.href) ? "page" : undefined}
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
