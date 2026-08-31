/* Emenda entre duas seções do trecho de madeira: o sulco entre duas chapas,
   com uma placa de ferragem parafusada em cima.

   O sulco são DUAS linhas, não uma. A de cima em 0.28, a de baixo em 0.12 e
   2px abaixo — é o par que lê como rebaixo entre chapas. Uma linha sozinha
   fica chapada, como régua de seção.

   A placa é DESLOCADA do centro, e isso é o ponto. Ferragem centrada e
   simétrica lê como ornamento aplicado; fora do eixo lê como construção — a
   peça está onde a estrutura pediu, não onde o desenho quis. As duas emendas
   da página usam deslocamentos diferentes (26% e 68%) para não formarem
   coluna quando se rola.

   Componente de servidor, e sem movimento nenhum: a placa fica parada na
   junta. Ela marca o limite entre duas superfícies e deslizar em relação a
   qualquer uma das duas desmentiria o que ela representa.

   Decorativa de ponta a ponta: aria-hidden e pointer-events: none. O SVG
   também sai da árvore, apesar do role/aria-label do arquivo original. */

export default function Emenda({
  x = "26%",
  xMovel = "20%",
}: {
  /** Posição horizontal da placa. Fora do centro, sempre. */
  x?: string;
  /** Abaixo de 768px: 68% jogaria a peça quase na borda direita. */
  xMovel?: string;
}) {
  return (
    <div
      className="emenda"
      aria-hidden="true"
      style={{ "--x": x, "--x-movel": xMovel } as React.CSSProperties}
    >
      <span className="emenda__placa">
        <svg viewBox="0 0 96 22" fill="none" aria-hidden="true" focusable="false">
          <rect
            x="0.5"
            y="4.5"
            width="95"
            height="13"
            rx="2"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.34"
          />
          <line x1="0" y1="11" x2="96" y2="11" stroke="currentColor" strokeWidth="1" opacity="0.16" />
          <g stroke="currentColor" strokeWidth="1.1" opacity="0.72">
            <circle cx="20" cy="11" r="3.6" />
            <line x1="17.6" y1="8.6" x2="22.4" y2="13.4" />
            <circle cx="76" cy="11" r="3.6" />
            <line x1="73.6" y1="13.4" x2="78.4" y2="8.6" />
          </g>
        </svg>
      </span>
    </div>
  );
}
