"use client";

import { useState } from "react";
import { acabamentos, acabamentoInicial, type ChaveAcabamento } from "@/lib/dados";

/* O Amostrário: a interação assinatura.
   Vestir a peça com o acabamento escolhido. O data-fin vive no <body> porque
   a elevação e as placas de ambiente leem esse mesmo estado. */

export default function Amostrario() {
  const [atual, setAtual] = useState<ChaveAcabamento>(acabamentoInicial);
  const escolhido = acabamentos.find((a) => a.chave === atual) ?? acabamentos[0];

  function vestir(chave: ChaveAcabamento) {
    setAtual(chave);
    document.body.setAttribute("data-fin", chave);
  }

  return (
    <>
      <div className="amostrario-head">
        <span className="label">Acabamento</span>
        <span className="regua" aria-hidden="true" />
        <span className="amostrario-head__estado">
          <strong>{escolhido.nome}</strong> <span>{escolhido.tipo}</span>
        </span>
      </div>

      <div className="amostrario" role="group" aria-label="Amostrário de acabamentos">
        {acabamentos.map((a) => (
          <button
            key={a.chave}
            className="sample"
            type="button"
            aria-pressed={a.chave === atual}
            data-fin={a.chave}
            onClick={() => vestir(a.chave)}
          >
            <span className="sample__face mat" aria-hidden="true" />
            <span className="sample__name">{a.nome}</span>
          </button>
        ))}
      </div>

      <p className="provisorio">
        <span className="slot__tag">A confirmar</span> Os seis acabamentos acima são exemplos de
        referência. A cartela real da LDF entra aqui quando o cliente informar as opções e os
        códigos.
      </p>
    </>
  );
}
