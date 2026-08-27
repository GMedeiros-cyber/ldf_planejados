/* Galeria-acordeão das onze etapas do processo.

   Sem estado React: a abertura é resolvida com group-hover / group-focus-within
   e transição de flex-grow. Nada de transição de width — com flex, width trava
   o reflow. O texto de cada etapa fica sempre no DOM (escondido por opacidade e
   clip), para leitor de tela e para não haver salto de layout ao abrir. */

// TODO: substituir por fotos reais da LDF.
// São seis fotos de banco repetidas para cobrir as onze etapas — os seis ids
// abaixo são os únicos verificados. Ao trocar, uma foto por etapa, na ordem.
const IMAGENS = [
  "https://images.unsplash.com/photo-1719368472026-dc26f70a9b76?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1649265825072-f7dd6942baed?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1555212697-194d092e3b8f?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1729086046027-09979ade13fd?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1601568494843-772eb04aca5d?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1585687501004-615dfdfde7f1?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1719368472026-dc26f70a9b76?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1649265825072-f7dd6942baed?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1555212697-194d092e3b8f?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1729086046027-09979ade13fd?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1601568494843-772eb04aca5d?q=80&w=800&auto=format&fit=crop",
] as const;

const VEU =
  "linear-gradient(0deg, var(--ground-deep) 8%," +
  " color-mix(in srgb, var(--ground-deep) 94%, transparent) 38%," +
  " color-mix(in srgb, var(--ground-deep) 78%, transparent) 72%," +
  " color-mix(in srgb, var(--ground-deep) 62%, transparent) 100%)";

interface EtapaGaleriaProps {
  itens: readonly { titulo: string; texto: string; marco?: boolean }[];
}

export function EtapaGaleria({ itens }: EtapaGaleriaProps) {
  return (
    <ol className="rise mt-10 flex flex-col gap-2 lg:h-[30rem] lg:flex-row lg:gap-1">
      {itens.map((etapa, i) => (
        <li
          key={etapa.titulo}
          tabIndex={0}
          className={[
            "group relative isolate overflow-hidden bg-[var(--ground-lift)] outline-offset-2",
            // Desktop: todos partem iguais (flex: 1 1 0) e o ativo cresce.
            "lg:min-w-0 lg:basis-0 lg:grow",
            "lg:transition-[flex-grow] lg:duration-500 lg:ease-out",
            "lg:hover:grow-[5] lg:focus-within:grow-[5]",
            etapa.marco
              ? "lg:ring-1 lg:ring-inset lg:ring-[color-mix(in_srgb,var(--red)_55%,transparent)]"
              : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <img
            src={IMAGENS[i % IMAGENS.length]}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="h-44 w-full object-cover object-center lg:absolute lg:inset-0 lg:h-full"
          />

          {/* Véu de leitura. Só no acordeão: no empilhado o texto fica fora da foto. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 hidden lg:block"
            style={{ background: VEU }}
          />

          {/* O marco que inicia o prazo permanece sinalizado, aberto ou fechado. */}
          {etapa.marco && (
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 z-20 h-[3px] bg-[var(--red)]"
            />
          )}

          <div className="relative z-10 flex flex-col gap-3 p-5 lg:absolute lg:inset-0 lg:justify-start lg:gap-4 lg:p-4">
            <span
              className={[
                "text-[length:var(--t-sm)] font-bold leading-none tabular-nums",
                etapa.marco ? "text-[var(--red-bright)]" : "text-[var(--ink-3)]",
              ].join(" ")}
            >
              {String(i + 1).padStart(2, "0")}
            </span>

            <div className="flex flex-col gap-2">
              <h3
                className={[
                  "text-base font-bold leading-tight tracking-tight text-[var(--ink)]",
                  // Fechado: título de pé. Aberto (ou sem animação): deitado.
                  "lg:[writing-mode:vertical-rl]",
                  "lg:group-hover:[writing-mode:horizontal-tb]",
                  "lg:group-focus-within:[writing-mode:horizontal-tb]",
                  "lg:motion-reduce:[writing-mode:horizontal-tb]",
                ].join(" ")}
              >
                {etapa.titulo}
              </h3>

              {/* Sempre no DOM: escondido por opacidade e clip, nunca display:none. */}
              <p
                className={[
                  "max-w-[36ch] text-[length:var(--t-sm)] leading-snug text-[var(--ink-2)]",
                  "lg:max-h-0 lg:overflow-hidden lg:opacity-0",
                  "lg:transition-[max-height,opacity] lg:duration-500 lg:ease-out",
                  "lg:group-hover:max-h-56 lg:group-hover:opacity-100",
                  "lg:group-focus-within:max-h-56 lg:group-focus-within:opacity-100",
                ].join(" ")}
              >
                {etapa.texto}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
