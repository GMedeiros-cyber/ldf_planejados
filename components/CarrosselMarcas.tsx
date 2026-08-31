"use client";

import { useEffect, useRef } from "react";
import { marcas } from "@/lib/dados";

/* Carrossel dos logos em canvas 2D. Não é 3D: não há rotação, eixo Z nem
   perspectiva. O que dá a sensação de profundidade é DESFOQUE somado a
   transparência, em função da distância até o centro do canvas.

   Por que canvas e não cinco SVG no DOM: são dois conjuntos desenhados em
   loop, cada um com desfoque próprio recalculado a cada quadro. Em DOM seriam
   dez elementos com `filter: blur()` animando juntos — dez camadas de
   composição. No canvas é um elemento só.

   OS SVG SÃO A FONTE ÚNICA. Não há cópia dos arquivos: cada um é buscado por
   fetch e transformado em memória. Três coisas mudam, e cada uma resolve um
   problema concreto:

   1. currentColor vira #1C1A18. Dentro de um <img> o SVG é documento isolado:
      não existe contexto CSS de onde herdar cor, e currentColor cai no preto.

   2. Entram width e height derivados do viewBox. Os arquivos têm viewBox mas
      nenhuma dimensão intrínseca, e o Firefox se recusa a pintar um SVG sem
      dimensão em drawImage — carrega, não dá erro, e não aparece nada.

   3. O <text> SAI. Um SVG carregado como Image não enxerga as fontes da
      página, então o nome sairia em Georgia (o fallback declarado no arquivo)
      e destoaria do resto. Do arquivo vem só o símbolo geométrico; o nome é
      escrito com ctx.fillText, no contexto do canvas, onde a fonte da página
      está disponível. Resolve tipografia e recorte de uma vez.

   Cada item é pré-renderizado UMA vez num canvas fora de tela. O laço de
   quadros só faz drawImage com filter e globalAlpha variáveis — sem fillText
   nem reescala de SVG a 60fps. */

/* O símbolo ocupa a faixa esquerda do viewBox original (o texto começava em
   x=58). 48 unidades cobrem o desenho dos cinco com folga. */
const LARGURA_SIMBOLO = 48;
const DESFOQUE_MAX = 7;
const ALFA_MIN = 0.2;
const VELOCIDADE = 38; // px por segundo, linear e constante

type Peca = { tela: HTMLCanvasElement; largura: number };

export default function CarrosselMarcas() {
  const caixa = useRef<HTMLDivElement>(null);
  const tela = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = caixa.current;
    const canvas = tela.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let vivo = true;
    let quadro = 0;
    let imagens: HTMLImageElement[] = [];
    let pecas: Peca[] = [];
    let deslocamento = 0;
    let ultimo = 0;
    let naTela = true;
    let larguraCSS = 0;
    let alturaCSS = 64;
    let espaco = 56;

    /* Os tamanhos moram no CSS, em custom properties: a faixa muda embaixo de
       768px e quem manda nisso é a folha, não um matchMedia aqui. */
    const medidas = () => {
      const cs = getComputedStyle(container);
      const num = (nome: string, padrao: number) =>
        parseFloat(cs.getPropertyValue(nome)) || padrao;
      return {
        espaco: num("--espaco", 56),
        simbolo: num("--simbolo", 26),
        nome: num("--nome", 15),
        vao: num("--vao", 14),
        fonte: cs.getPropertyValue("--fonte-nome").trim() || "serif",
      };
    };

    /* Símbolo e nome num canvas próprio, no tamanho final e já em resolução
       de tela. O laço depois só reposiciona esta peça pronta. */
    const montarPeca = (img: HTMLImageElement, nome: string, dpr: number): Peca => {
      const m = medidas();
      const fonteNome = `${m.nome}px ${m.fonte}`;

      const medidor = document.createElement("canvas").getContext("2d");
      if (!medidor) return { tela: document.createElement("canvas"), largura: 0 };
      medidor.font = fonteNome;
      const larguraTexto = medidor.measureText(nome).width;

      const escala = m.simbolo / (img.naturalHeight || 44);
      const larguraSimbolo = (img.naturalWidth || LARGURA_SIMBOLO) * escala;
      const largura = larguraSimbolo + m.vao + larguraTexto;

      const peca = document.createElement("canvas");
      peca.width = Math.max(1, Math.ceil(largura * dpr));
      peca.height = Math.max(1, Math.ceil(alturaCSS * dpr));
      const p = peca.getContext("2d");
      if (!p) return { tela: peca, largura };
      p.scale(dpr, dpr);

      p.drawImage(img, 0, (alturaCSS - m.simbolo) / 2, larguraSimbolo, m.simbolo);

      p.font = fonteNome;
      p.fillStyle = "#1C1A18";
      p.textBaseline = "middle";
      p.fillText(nome, larguraSimbolo + m.vao, alturaCSS / 2 + 1);

      return { tela: peca, largura };
    };

    const dimensionar = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      larguraCSS = container.getBoundingClientRect().width;
      alturaCSS = parseFloat(getComputedStyle(canvas).height) || 64;
      espaco = medidas().espaco;
      canvas.width = Math.max(1, Math.round(larguraCSS * dpr));
      canvas.height = Math.max(1, Math.round(alturaCSS * dpr));
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      return dpr;
    };

    const larguraConjunto = () => pecas.reduce((a, p) => a + p.largura + espaco, 0);

    const pintar = () => {
      ctx.clearRect(0, 0, larguraCSS, alturaCSS);
      if (!pecas.length) return;

      const conjunto = larguraConjunto();
      const centro = larguraCSS / 2;

      if (semMovimento) {
        /* Fila única, centrada, sem desfoque e com opacidade cheia. */
        ctx.filter = "none";
        ctx.globalAlpha = 1;
        let x = centro - (conjunto - espaco) / 2;
        for (const p of pecas) {
          ctx.drawImage(p.tela, x, 0, p.largura, alturaCSS);
          x += p.largura + espaco;
        }
        return;
      }

      /* Duas voltas além do necessário: a fila tem de continuar cheia
         enquanto a costura do módulo atravessa a tela. */
      const voltas = Math.ceil(larguraCSS / conjunto) + 2;
      let x = -deslocamento;

      for (let v = 0; v < voltas; v++) {
        for (const p of pecas) {
          if (x + p.largura > 0 && x < larguraCSS) {
            const d = Math.min(Math.abs(x + p.largura / 2 - centro) / centro, 1);
            const s = d * d * (3 - 2 * d); // smoothstep
            ctx.filter = `blur(${(s * DESFOQUE_MAX).toFixed(2)}px)`;
            ctx.globalAlpha = 1 - s * (1 - ALFA_MIN);
            ctx.drawImage(p.tela, x, 0, p.largura, alturaCSS);
          }
          x += p.largura + espaco;
        }
      }
      ctx.filter = "none";
      ctx.globalAlpha = 1;
    };

    const laco = (agora: number) => {
      if (!vivo) return;
      /* dt limitado: voltando de uma aba oculta, o primeiro intervalo seria
         de segundos e a fila daria um salto. */
      const dt = ultimo ? Math.min((agora - ultimo) / 1000, 0.1) : 0;
      ultimo = agora;

      const conjunto = larguraConjunto();
      if (conjunto > 0) deslocamento = (deslocamento + VELOCIDADE * dt) % conjunto;

      pintar();
      quadro = requestAnimationFrame(laco);
    };

    const tocar = () => {
      if (semMovimento || quadro || !naTela || document.hidden || !pecas.length) return;
      ultimo = 0;
      quadro = requestAnimationFrame(laco);
    };
    const parar = () => {
      if (!quadro) return;
      cancelAnimationFrame(quadro);
      quadro = 0;
    };

    const carregar = async (arquivo: string): Promise<HTMLImageElement> => {
      const cru = await (await fetch(arquivo)).text();
      const vb = /viewBox="([^"]+)"/.exec(cru);
      const altura = vb ? Number(vb[1].trim().split(/\s+/)[3]) || 44 : 44;

      const pronto = cru
        .replace(/<text[\s\S]*?<\/text>/g, "")
        .replace(/currentColor/g, "#1C1A18")
        .replace(/viewBox="[^"]+"/, `viewBox="0 0 ${LARGURA_SIMBOLO} ${altura}"`)
        .replace(/<svg /, `<svg width="${LARGURA_SIMBOLO}" height="${altura}" `);

      const url = URL.createObjectURL(new Blob([pronto], { type: "image/svg+xml" }));
      const img = new Image();
      img.src = url;
      try {
        await img.decode();
      } finally {
        URL.revokeObjectURL(url);
      }
      return img;
    };

    const dpr = dimensionar();

    void (async () => {
      /* A fonte precisa estar pronta ANTES de medir o texto: medido com a
         fonte de fallback, a peça nasce com a largura errada e corta o nome. */
      if (document.fonts?.ready) await document.fonts.ready;
      const carregadas = await Promise.all(marcas.map((m) => carregar(m.arquivo)));
      if (!vivo) return;
      imagens = carregadas;
      pecas = imagens.map((img, i) => montarPeca(img, marcas[i].nome, dpr));
      pintar();
      tocar();
    })().catch(() => {
      /* Se o fetch falhar o canvas fica vazio. A lista de nomes fora dele
         continua no DOM, então nenhum conteúdo se perde. */
    });

    const obsTamanho = new ResizeObserver(() => {
      const d = dimensionar();
      if (imagens.length) {
        pecas = imagens.map((img, i) => montarPeca(img, marcas[i].nome, d));
      }
      pintar();
    });
    obsTamanho.observe(container);

    /* Esta página já carrega um canvas WebGL na História e um vídeo em
       autoplay na Fábrica: fora da tela, ou com a aba oculta, o laço para. */
    const obsVista = new IntersectionObserver(
      ([e]) => {
        naTela = e.isIntersecting;
        if (naTela) tocar();
        else parar();
      },
      { threshold: 0 },
    );
    obsVista.observe(container);

    const aoTrocarAba = () => {
      if (document.hidden) parar();
      else tocar();
    };
    document.addEventListener("visibilitychange", aoTrocarAba);

    return () => {
      vivo = false;
      parar();
      obsTamanho.disconnect();
      obsVista.disconnect();
      document.removeEventListener("visibilitychange", aoTrocarAba);
    };
  }, []);

  return (
    <div className="marcas__carrossel" ref={caixa}>
      <canvas ref={tela} aria-hidden="true" />
    </div>
  );
}
