"use client";

import { useEffect, useRef, useState } from "react";

/* PROVISÓRIO: vídeo de móvel instalado, não da fábrica. Substituir por
   filmagem da produção em Guarulhos quando o cliente enviar.

   Por isso não há legenda, alt nem qualquer texto ligando esta imagem à
   fábrica: ele entra como registro de trabalho entregue e nada além disso.
   O conteúdo informativo da seção é o texto e o diagrama da cadeia — o vídeo
   é ornamento, e sai inteiro da árvore de acessibilidade.

   Duas fontes, WebM antes do MP4: o VP9 pesa menos da metade, e o H.264
   cobre as versões de Safari que não tocam VP9. Os quatro atributos de
   autoplay andam juntos — sem `muted` o navegador bloqueia, sem
   `playsInline` o iOS abre em tela cheia. */

export default function VideoFabrica() {
  const video = useRef<HTMLVideoElement>(null);
  /* Falso no servidor e na primeira renderização do cliente, para a
     hidratação bater. Enquanto for falso o que existe é o pôster: assim, em
     movimento reduzido, os 883 KB de vídeo nunca chegam a ser pedidos. */
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
        width={576}
        height={768}
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
