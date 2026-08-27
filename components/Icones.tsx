/* Ícones de traço. Sem biblioteca: são caminhos escritos à mão.
   Os sociais seguem todos a mesma receita — viewBox 24, sem
   preenchimento, traço de 1.5 em currentColor. */

export function Seta() {
  return (
    <svg className="btn__arrow" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M2 8h11M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="square"
      />
    </svg>
  );
}

export function SetaDiagonal({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 18 18 6M9 6h9v9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="square" />
    </svg>
  );
}

export function IconeWhatsApp() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.17 8.17 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.13-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.53.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.44.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.41-.56-.42h-.47c-.16 0-.43.06-.65.31-.22.24-.85.83-.85 2.03s.87 2.35.99 2.51c.12.16 1.71 2.61 4.14 3.66.58.25 1.03.4 1.38.51.58.19 1.11.16 1.53.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.17-.47-.29Z" />
    </svg>
  );
}

/* --- Redes e localização -------------------------------------------------
   Todos no mesmo gabarito: quem os pinta é a cor herdada, quem os dimensiona
   é o CSS. Nenhum carrega tamanho próprio. */

type PropsIcone = { className?: string };

const tracado = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function IconeFacebook({ className }: PropsIcone) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...tracado}>
      <path d="M17 3h-2.5A4.5 4.5 0 0 0 10 7.5V10H7.5v3.5H10V21h3.5v-7.5h2.6l.4-3.5h-3V7.5c0-.6.4-1 1-1H17V3Z" />
    </svg>
  );
}

export function IconeInstagram({ className }: PropsIcone) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...tracado}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      {/* Traço de comprimento zero com ponta redonda: vira um ponto do
          diâmetro do traço, sem precisar de um segundo círculo. */}
      <path d="M16.9 7.1h.01" />
    </svg>
  );
}

export function IconePinterest({ className }: PropsIcone) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...tracado}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.4 20.2 12 11.6" />
      <path d="M10.6 13.7c.5 1.3 1.5 2.1 2.7 2.1 2.2 0 3.9-1.7 3.9-4.2a5 5 0 0 0-9.7-1.7" />
    </svg>
  );
}

export function IconeLocal({ className }: PropsIcone) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...tracado}>
      <path d="M20 10.4c0 5.6-8 12.1-8 12.1S4 16 4 10.4a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10.2" r="2.8" />
    </svg>
  );
}
