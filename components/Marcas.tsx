import type { ReactElement } from "react";
import { marcas } from "@/lib/dados";

/* Faixa de logos entre o Processo e a Fábrica.

   ⚠ AS CINCO MARCAS SÃO FICTÍCIAS. Nenhuma dessas empresas existe — ver o
   PLACEHOLDER em lib/dados.ts. Enquanto for assim, esta seção NÃO vai ao ar.

   O rótulo é "Também fabricamos para" por decisão do cliente. Registro aqui
   que ele ainda afirma relação comercial com cinco empresas inventadas: a
   frase precisa sair, ou os nomes precisam ser reais, antes do deploy.

   Os desenhos estão INLINE, e não em <img src>, porque os SVG pintam com
   currentColor: dentro de <img> eles viram documento próprio, não herdam a
   cor do pai e o hover não teria efeito. Os arquivos em public/marcas/ são a
   fonte — o campo `arquivo` de lib/dados.ts é a chave que liga os dois, para
   nome e desenho não saírem de sincronia. */

const DESENHOS: Record<string, ReactElement> = {
  "/marcas/vertice.svg": (
    <svg viewBox="0 0 190 44" aria-hidden="true" focusable="false" fill="none">
      <g fill="currentColor">
        <path d="M22 8 L38 34 H6 Z M22 16 L13 30 h18 Z" />
      </g>
      <text x="58" y="28" className="marcas__nome">
        Clínica Vértice
      </text>
    </svg>
  ),
  "/marcas/aurora.svg": (
    <svg viewBox="0 0 196 44" aria-hidden="true" focusable="false" fill="none">
      <g fill="currentColor">
        <path d="M22 30a12 12 0 0 1 24 0h-4a8 8 0 0 0-16 0z" transform="translate(-12,0)" />
        <rect x="21" y="6" width="2" height="7" rx="1" />
        <rect x="9" y="12" width="2" height="7" rx="1" transform="rotate(-40 10 15)" />
        <rect x="33" y="12" width="2" height="7" rx="1" transform="rotate(40 34 15)" />
      </g>
      <text x="58" y="28" className="marcas__nome">
        Colégio Aurora
      </text>
    </svg>
  ),
  "/marcas/lume.svg": (
    <svg viewBox="0 0 170 44" aria-hidden="true" focusable="false" fill="none">
      <g fill="currentColor">
        <path d="M22 6 38 22 22 38 6 22Z M22 14 14 22l8 8 8-8Z" />
      </g>
      <text x="58" y="28" className="marcas__nome">
        Studio Lume
      </text>
    </svg>
  ),
  "/marcas/pilar.svg": (
    <svg viewBox="0 0 166 44" aria-hidden="true" focusable="false" fill="none">
      <g fill="currentColor">
        <rect x="8" y="10" width="6" height="24" rx="1" />
        <rect x="19" y="6" width="6" height="28" rx="1" />
        <rect x="30" y="14" width="6" height="20" rx="1" />
      </g>
      <text x="58" y="28" className="marcas__nome">
        Grupo Pilar
      </text>
    </svg>
  ),
  "/marcas/traco.svg": (
    <svg viewBox="0 0 210 44" aria-hidden="true" focusable="false" fill="none">
      <g fill="currentColor">
        <path d="M6 12h32v20H6Z M12 18v8h20v-8Z" />
        <rect x="6" y="6" width="14" height="3" rx="1.5" />
      </g>
      <text x="58" y="28" className="marcas__nome">
        Traço Escritórios
      </text>
    </svg>
  ),
};

export default function Marcas() {
  return (
    <section className="section wrap marcas" aria-labelledby="t-marcas">
      <h2 className="marcas__rotulo" id="t-marcas">
        Também fabricamos para
      </h2>

      <ul className="marcas__faixa">
        {marcas.map((m) => (
          /* O nome vive no texto do SVG, que é desenho; o <li> carrega o nome
             legível para quem não vê o desenho, e o SVG sai da árvore. */
          <li className="marcas__item" key={m.arquivo}>
            <span className="oculto-visual">{m.nome}</span>
            {DESENHOS[m.arquivo]}
          </li>
        ))}
      </ul>
    </section>
  );
}
