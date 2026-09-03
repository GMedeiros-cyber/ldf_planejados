"use client";

import { useEffect, useRef, useState } from "react";

/* ⚠ PROVISÓRIO, E CONTINUA SENDO. O arquivo trocou nesta rodada; a ressalva
   não. É um passeio por uma cozinha de apartamento entregue — marcenaria
   instalada, não linha de produção. Substituir por filmagem da fábrica em
   Guarulhos quando o cliente enviar.

   480×854 (0,5621), contra os 576×768 (0,75) do arquivo anterior. A caixa
   NÃO acompanhou: `.fabrica__peca` segue 3:4 e o `object-fit: cover` corta
   25% da altura do quadro, centrado. O porquê está no globals.css, junto da
   regra.

   Por isso não há legenda, alt nem qualquer texto ligando esta imagem à
   fábrica: ele entra como registro de trabalho entregue e nada além disso.
   O conteúdo informativo da seção é o texto e o diagrama da cadeia — o vídeo
   é ornamento, e sai inteiro da árvore de acessibilidade.

   Duas fontes, WebM antes do MP4: o H.264 cobre as versões de Safari que não
   tocam VP9, e a ordem faz o resto dos navegadores pegar o WebM.

   ⚠ A ORDEM DEIXOU DE PAGAR O QUE PROMETIA. Aqui morava "o VP9 pesa menos da
   metade", e isso valia para o arquivo antigo: 304 KB de WebM contra 578 do
   MP4. Nos arquivos NOVOS a relação inverteu — 476 KB de WebM contra 454 do
   MP4 — então a maioria dos visitantes baixa o mais pesado dos dois. Não é
   defeito de código: é o encode. Reencodar o WebM em VP9 com CRF mais alto
   devolve a vantagem, e enquanto não acontecer a ordem está entregando 22 KB
   a mais por visita.

   Os quatro atributos de autoplay andam juntos — sem `muted` o navegador
   bloqueia, sem `playsInline` o iOS abre em tela cheia. */

export default function VideoFabrica() {
  const video = useRef<HTMLVideoElement>(null);
  /* Falso no servidor e na primeira renderização do cliente, para a
     hidratação bater. Enquanto for falso o que existe é o pôster: assim, em
     movimento reduzido, os 476 KB do WebM nunca chegam a ser pedidos — é o
     WebM porque ele vem primeiro no <source> e é o que quase todo navegador
     escolhe; o MP4 tem 454 KB e só entra no Safari antigo. */
  const [comVideo, setComVideo] = useState(false);

  useEffect(() => {
    setComVideo(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const v = video.current;
    if (!v) return;

    /* Vídeo em autoplay decodifica quadro a quadro mesmo fora da tela, e esta
       página já tem dois canvas WebGL e a rolagem do Processo disputando a
       GPU. Fora da viewport ele para. */
    const obs = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          /* play() devolve uma promessa que rejeita quando o navegador
             recusa o autoplay. Sem o catch, vira erro não tratado no console. */
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { threshold: 0 },
    );
    obs.observe(v);

    return () => obs.disconnect();
  }, [comVideo]);

  if (!comVideo) {
    return (
      <img
        className="fabrica__peca"
        src="/fabrica/fabrica-poster.webp"
        /* As medidas do ARQUIVO, e o pôster tem as mesmas do vídeo. Elas não
           desenham a caixa — quem faz isso é o aspect-ratio 3:4 do CSS — mas
           sem elas o navegador não tem proporção intrínseca antes do byte
           chegar, e sem JavaScript a caixa nasceria com altura zero. */
        width={480}
        height={854}
        alt=""
        aria-hidden="true"
        decoding="async"
      />
    );
  }

  return (
    <video
      className="fabrica__peca"
      ref={video}
      autoPlay
      loop
      muted
      playsInline
      poster="/fabrica/fabrica-poster.webp"
      preload="metadata"
      aria-hidden="true"
    >
      <source src="/fabrica/fabrica-loop.webm" type="video/webm" />
      <source src="/fabrica/fabrica-loop.mp4" type="video/mp4" />
    </video>
  );
}
