import type { CSSProperties } from "react";

/* Elevação: desenho de material. Não é fotografia e não se apresenta como uma.
   O painel de porta recebe a cor do acabamento selecionado via data-fin no body. */

type Variante = "cozinha" | "comercial";

type Porta = { i: number; style?: CSSProperties };

const cozinha: { uppers: Porta[]; lowers: Porta[] } = {
  uppers: [{ i: 0 }, { i: 1 }, { i: 2 }, { i: 3 }],
  lowers: [
    { i: 4 },
    { i: 5 },
    { i: 6, style: { gridRow: "span 3" } },
    { i: 5 },
    { i: 6 },
    { i: 6 },
    { i: 7 },
  ],
};

const comercial: { uppers: Porta[]; lowers: Porta[] } = {
  uppers: [{ i: 0 }, { i: 1 }, { i: 2 }],
  lowers: [{ i: 3 }, { i: 4 }, { i: 5 }, { i: 6 }, { i: 4 }, { i: 5 }, { i: 6 }, { i: 7 }],
};

export default function Elevacao({
  variante = "cozinha",
  className = "",
  style,
  label,
}: {
  variante?: Variante;
  className?: string;
  style?: CSSProperties;
  label: string;
}) {
  const conjunto = variante === "comercial" ? comercial : cozinha;

  const gradeUppers: CSSProperties | undefined =
    variante === "comercial" ? { gridTemplateColumns: "1fr 1fr 1fr" } : undefined;

  const gradeLowers: CSSProperties | undefined =
    variante === "comercial"
      ? { gridTemplateColumns: "1fr 1fr 1fr 1fr", gridTemplateRows: "1fr 1fr" }
      : undefined;

  return (
    <div className={`elev ${className}`.trim()} style={style} role="img" aria-label={label}>
      <div className="elev__row elev__uppers" style={gradeUppers}>
        {conjunto.uppers.map((p, n) => (
          <div
            key={n}
            className="elev__door mat"
            style={{ ["--i" as string]: p.i, ...p.style } as CSSProperties}
          />
        ))}
      </div>
      <div className="elev__splash" />
      <div className="elev__counter">
        <div className="mat--stone" />
      </div>
      <div className="elev__row elev__lowers" style={gradeLowers}>
        {conjunto.lowers.map((p, n) => (
          <div
            key={n}
            className="elev__door mat"
            style={{ ["--i" as string]: p.i, ...p.style } as CSSProperties}
          />
        ))}
      </div>
      <div className="elev__toe" />
    </div>
  );
}
