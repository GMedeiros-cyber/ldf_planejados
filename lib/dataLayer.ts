/* A fila do Google Tag Manager, e a única porta para empurrar evento nela.

   Existe por duas razões pequenas e concretas:

     1. O TIPO. `window.dataLayer` não existe no DOM padrão, e sem esta
        declaração cada arquivo que mexesse nele precisaria do seu próprio
        `declare global` — ou de um `any`, que é como se perde o nome de um
        evento num erro de digitação.

     2. O `|| []`. Ele não é paranoia: o push pode acontecer ANTES do gtm.js
        carregar, e é isso que faz o evento sobreviver à espera do
        consentimento. Repetir essa linha em cada lugar é repetir a chance de
        alguém escrever só o push e criar um `undefined.push` em produção.

   ⚠ OS NOMES DOS EVENTOS SÃO CONTRATO COM O GTM, e não detalhe de
   implementação. `whatsapp_click` e `form_lead` estão configurados como
   gatilhos no container GTM-KGBMCM4F; renomear aqui apaga a conversão do lado
   de lá sem erro nenhum deste lado. */

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function empurrarEvento(event: "whatsapp_click" | "form_lead") {
  const fila = (window.dataLayer = window.dataLayer ?? []);
  fila.push({ event });
}
