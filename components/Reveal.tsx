"use client";

import { useEffect } from "react";

/* Revelação: uma vez, ao entrar na viewport.
   Montado uma única vez no layout; observa todo elemento .rise da página. */

export default function Reveal() {
  useEffect(() => {
    const alvos = document.querySelectorAll<HTMLElement>(".rise:not(.in)");

    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      alvos.forEach((el) => el.classList.add("in"));
      return;
    }

    const obs = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (!entrada.isIntersecting) return;
          entrada.target.classList.add("in");
          obs.unobserve(entrada.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.06 },
    );

    alvos.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return null;
}
