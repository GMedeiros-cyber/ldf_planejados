"use client";

import { useEffect, useState } from "react";

import { whatsappUrl } from "@/lib/dados";
import { IconeWhatsApp } from "./Icones";

/* WhatsApp flutuante, fixo no canto inferior direito de todas as rotas.

   ══ ESTE ARQUIVO JÁ EXISTIU E FOI APAGADO ══

   Saiu no d8632fb junto com a seção 18 do globals.css, e voltou. O que veio do
   original: o <a> com `whatsappUrl`, o `aria-label`, o `target`/`rel` e o
   lugar no canto. O que mudou está abaixo.

   O destino é `whatsappUrl` — o mesmo endereço do rodapé, do cartão de
   /contato e do formulário, derivado de `contato.whatsapp`. Não há segundo
   número escrito em lugar nenhum, e trocar o da empresa troca este junto.

   ══ ELE SÓ APARECE DEPOIS QUE O HERÓI SAI DA TELA ══

   Sobre a capa ele NÃO existe, e isso resolve por construção a colisão que
   motivou a remoção no d8632fb: naquela época ele dividia o canto com a fila
   de ícones, e a fila teve de subir para caber. Hoje a fila divide o canto com
   o <CtaCapa />, e um terceiro elemento ali seria demais.

   ⚠ IntersectionObserver, E NÃO listener de `scroll`. A base inteira usa
   observer (ver Reveal.tsx e o traço de /ambientes); `scroll` dispara a cada
   quadro, no thread principal, para responder uma pergunta que o observer
   responde sozinho, fora dele.

   ══ AS ROTAS SEM HERÓI SÃO O CASO QUE PRECISA DE CUIDADO ══

   `/ambientes`, `/contato` e a política NÃO têm `.hero`. Se o observer
   simplesmente não achasse alvo, o botão ficaria invisível para sempre nelas —
   e some justamente onde ele é mais útil, porque ali não há CTA de capa
   competindo pelo canto.

   Por isso a ausência de alvo é tratada como um estado, e não como erro: sem
   herói, ele aparece DE IMEDIATO. É a primeira coisa que o efeito decide.

   ══ COMO ELE SOME, E POR QUE NÃO É `aria-hidden` ══

   Quem esconde é o CSS, com `visibility: hidden` — e isso é decisão, não
   atalho. `visibility: hidden` tira o elemento da árvore de acessibilidade E
   da ordem de foco de uma vez só, sem depender de nenhum atributo estar
   sincronizado com o estado visual.

   O caminho com `aria-hidden` + `tabIndex={-1}` daria o mesmo resultado com
   JavaScript ligado e MENTIRIA sem ele: os dois atributos ficariam gravados no
   HTML servido, e qualquer regra que tornasse o botão visível sem script
   entregaria um elemento visível, focável pelo mouse e invisível para leitor
   de tela. Com `visibility`, estado visual e estado semântico são a mesma
   coisa, sempre.

   O que o JavaScript faz é só ligar o `data-visivel`. Ver a seção 17b. */

export default function Zap() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const heroi = document.querySelector(".hero");

    /* Rota sem herói: nada a observar, e o botão vale desde o primeiro quadro. */
    if (!heroi) {
      setVisivel(true);
      return;
    }

    /* `threshold: 0` é o que queremos: a virada acontece quando o herói deixa
       de tocar a viewport, nem um pixel antes. Como a fila de ícones e o CTA
       moram no PÉ do herói, quando esta condição vira eles já saíram junto. */
    const observador = new IntersectionObserver(
      ([entrada]) => setVisivel(!entrada.isIntersecting),
      { threshold: 0 },
    );
    observador.observe(heroi);
    return () => observador.disconnect();
  }, []);

  return (
    <a
      className="zap"
      /* Atributo sem valor: o CSS casa com `[data-visivel]` e o React o omite
         inteiro quando é `undefined`. */
      data-visivel={visivel ? "" : undefined}
      href={whatsappUrl}
      target="_blank"
      rel="noopener"
      aria-label="Falar com a LDF no WhatsApp"
    >
      <IconeWhatsApp />
    </a>
  );
}
