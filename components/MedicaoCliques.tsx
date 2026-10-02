"use client";

import { useEffect } from "react";

import { empurrarEvento } from "@/lib/dataLayer";

/* O disparo de `whatsapp_click` no dataLayer. Não desenha nada.

   ══ UM OUVINTE NO DOCUMENTO, E NÃO UM onClick EM CADA LINK ══

   Há três links de WhatsApp no site — o do rodapé, o do cartão de /contato e
   o botão flutuante —, e eles vivem em três arquivos diferentes. Um `onClick`
   em cada um seria três lugares para a próxima alteração esquecer, e um link
   novo nasceria sem medição e sem ninguém notar.

   O ouvinte usa `closest()`, então vale para o <a> e para qualquer coisa
   dentro dele: o <svg> do botão flutuante é o alvo real do clique, e sem o
   `closest` o evento passaria batido.

   ⚠ O ENVIO DO FORMULÁRIO NÃO PASSA POR AQUI, e não deve passar. Ele abre o
   WhatsApp com `window.open()`, sem clique em <a> nenhum — então este ouvinte
   não o vê. O evento dele é o `form_lead`, disparado no próprio
   FormularioContato.tsx. Contar o envio como `whatsapp_click` TAMBÉM inflaria
   o funil: cada lead apareceria duas vezes, uma em cada evento, e a soma dos
   dois deixaria de ser o total de contatos.

   ══ O PUSH FUNCIONA ANTES DO GTM EXISTIR ══

   `dataLayer` é um array comum. Push feito antes do gtm.js carregar fica na
   fila e é processado quando ele chega — e, para quem recusou, nunca é
   processado, porque o GTM não carrega. Ou seja: este ouvinte não grava
   cookie, não faz requisição a ninguém e não precisa saber se houve
   consentimento. Ele só empilha num array em memória.

   É por isso que ele é montado SEM condição, enquanto o GTM depende do aceite.

   ══ O QUE ESTE OUVINTE NÃO ALCANÇA ══

   O caminho SEM JavaScript do formulário: a Server Action responde com um
   `redirect()` para o wa.me, o navegador troca de página e nenhum script roda.
   Esse envio não é medido, e não há como medi-lo do lado do cliente. */
export default function MedicaoCliques() {
  useEffect(() => {
    const aoClicar = (e: MouseEvent) => {
      const alvo = e.target as Element | null;
      const link = alvo?.closest?.('a[href*="wa.me"], a[href*="api.whatsapp.com"]');
      if (!link) return;

      empurrarEvento("whatsapp_click");
    };

    /* Na fase de captura: o clique é contado mesmo que algum handler no
       caminho chame `stopPropagation()` antes de o evento subir. */
    document.addEventListener("click", aoClicar, true);
    return () => document.removeEventListener("click", aoClicar, true);
  }, []);

  return null;
}
