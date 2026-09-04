"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

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

   ══ A ARMADILHA QUE ESTE ARQUIVO JÁ CAIU — A MESMA DO <Reveal /> ══

   `useEffect` com DEPENDÊNCIA VAZIA dentro de um LAYOUT QUE NÃO REMONTA.

   Este componente é montado em app/layout.tsx, duas linhas acima do
   <Reveal />, e no App Router o layout é o MESMO nó React do começo ao fim da
   sessão: só `children` troca. Com `[]`, o efeito rodava uma vez, na primeira
   rota carregada, e nunca mais.

   O caminho que quebrava, medido: entrando por /ambientes, /contato ou a
   política — nenhuma tem `.hero` —, o efeito caía no `if (!heroi)`, marcava
   `true` e NÃO criava observador nenhum. Navegando dali para a home, o efeito
   não rodava de novo, `visivel` seguia `true`, e o botão pousava sobre a capa,
   em cima do <CtaCapa />. Carga direta na home funcionava, e era isso que
   fazia o defeito parecer intermitente.

   O <Reveal /> teve exatamente este bug e foi consertado com `usePathname()`
   na lista de dependências. Aqui é a mesma forma, pelo mesmo motivo: a cada
   pathname novo o cleanup desconecta o observador da rota anterior e o efeito
   reavalia se a rota nova tem herói.

   Se um dia este componente sair do layout e passar a viver dentro da página,
   ele volta a remontar sozinho e a dependência deixa de ser necessária. Até
   lá, ela é o que faz o efeito acompanhar a rota.

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
  const rota = usePathname();
  const [visivel, setVisivel] = useState(false);

  /* ⚠ O RESET ACONTECE NA RENDERIZAÇÃO, E NÃO NO EFEITO — E ISSO É O CONSERTO
     DO PISCO.

     `useEffect` é efeito PASSIVO: roda depois da pintura. Zerar o estado lá
     dentro chega tarde — entre o commit da rota nova (com a capa já no DOM) e
     o efeito, existe pelo menos um quadro PINTADO com o botão ainda visível
     por herança da rota anterior. Medido antes desta mudança: vindo de
     /ambientes, de /contato e de /ambientes-depois-da-home, o botão aparecia
     sobre a capa e só então começava a sumir — e como a saída tem 260ms de
     transição, o pisco durava o suficiente para ser visto em cima do
     <CtaCapa />.

     Ajustar estado durante a renderização quando uma entrada muda é o padrão
     do próprio React para isto: ele descarta a renderização em curso e refaz
     na hora, sem pintar o estado intermediário. */
  const [rotaAnterior, setRotaAnterior] = useState(rota);
  if (rota !== rotaAnterior) {
    setRotaAnterior(rota);
    setVisivel(false);
  }

  useEffect(() => {
    const heroi = document.querySelector(".hero");

    /* ⚠ ROTA SEM HERÓI: O EFEITO NÃO FAZ NADA, E É DE PROPÓSITO.

       Quem mostra o botão nessas rotas é o CSS, com
       `body:not(:has(.hero)) .zap` — ver a seção 17b. Marcar `data-visivel`
       aqui reabriria o bug pelo outro lado: o atributo sobreviveria à troca de
       rota e a home herdaria um botão visível sobre a capa.

       De quebra, isso faz as três rotas sem herói funcionarem sem JavaScript
       nenhum, sem depender de `@media (scripting: none)`. */
    if (!heroi) return;

    /* `threshold: 0` é o que queremos: a virada acontece quando o herói deixa
       de tocar a viewport, nem um pixel antes. Como a fila de ícones e o CTA
       moram no PÉ do herói, quando esta condição vira eles já saíram junto. */
    const observador = new IntersectionObserver(
      ([entrada]) => setVisivel(!entrada.isIntersecting),
      { threshold: 0 },
    );
    observador.observe(heroi);
    return () => observador.disconnect();
    /* ⚠ `[rota]`, E NUNCA `[]` — VER O BLOCO NO TOPO DESTE ARQUIVO. */
  }, [rota]);

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
