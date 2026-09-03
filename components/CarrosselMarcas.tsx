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

   1. currentColor vira a tinta clara do site. Dentro de um <img> o SVG é
      documento isolado: não existe contexto CSS de onde herdar cor, e
      currentColor cairia no preto. O valor é literal porque canvas não lê
      custom property — é o mesmo #EFEBE5 de var(--ink), e as duas pontas (o
      símbolo do SVG e o nome do fillText) usam a MESMA constante.

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
/* var(--ink) em hex: o canvas não resolve custom property. Símbolo e nome
   partilham esta constante, para não saírem de cor um do outro. */
const TINTA = "#EFEBE5";

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
    let imagens: (HTMLImageElement | null)[] = [];
    let pecas: Peca[] = [];
    let deslocamento = 0;
    let ultimo = 0;
    let naTela = true;
    let larguraCSS = 0;
    let alturaCSS = 64;
    let espaco = 56;
    /* Fração da meia-largura que fica SEM queda. Ver `--nucleo` na folha. */
    let nucleo = 0;

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
        nucleo: num("--nucleo", 0),
        fonte: cs.getPropertyValue("--fonte-nome").trim() || "serif",
      };
    };

    /* Símbolo e nome num canvas próprio, no tamanho final e já em resolução
       de tela. O laço depois só reposiciona esta peça pronta. */
    /* `img` é NULO quando a marca entra só com o nome — ver lib/dados.ts. Nesse
       caso o desenho começa em x = 0 e a peça não reserva o vão do símbolo.

       A LARGURA TEM DE ACOMPANHAR. Se ela continuasse contando um símbolo que
       não foi desenhado, a peça carregaria um buraco do tamanho do símbolo
       mais o vão, e o laço do carrossel abriria um vazio a cada volta — a fila
       é montada somando `largura + espaco` peça por peça, então uma medida
       generosa vira espaço morto e não margem. */
    const montarPeca = (img: HTMLImageElement | null, nome: string, dpr: number): Peca => {
      const m = medidas();
      const fonteNome = `${m.nome}px ${m.fonte}`;

      const medidor = document.createElement("canvas").getContext("2d");
      if (!medidor) return { tela: document.createElement("canvas"), largura: 0 };
      medidor.font = fonteNome;
      const larguraTexto = medidor.measureText(nome).width;

      const escala = img ? m.simbolo / (img.naturalHeight || 44) : 0;
      const larguraSimbolo = img ? (img.naturalWidth || LARGURA_SIMBOLO) * escala : 0;
      /* Sem símbolo não há vão a reservar: o nome é a peça inteira. */
      const recuoNome = img ? larguraSimbolo + m.vao : 0;
      const largura = recuoNome + larguraTexto;

      const peca = document.createElement("canvas");
      peca.width = Math.max(1, Math.ceil(largura * dpr));
      peca.height = Math.max(1, Math.ceil(alturaCSS * dpr));
      const p = peca.getContext("2d");
      if (!p) return { tela: peca, largura };
      p.scale(dpr, dpr);

      if (img) p.drawImage(img, 0, (alturaCSS - m.simbolo) / 2, larguraSimbolo, m.simbolo);

      p.font = fonteNome;
      p.fillStyle = TINTA;
      p.textBaseline = "middle";
      p.fillText(nome, recuoNome, alturaCSS / 2 + 1);

      return { tela: peca, largura };
    };

    const dimensionar = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      larguraCSS = container.getBoundingClientRect().width;
      alturaCSS = parseFloat(getComputedStyle(canvas).height) || 64;
      const m = medidas();
      espaco = m.espaco;
      /* Lido AQUI e guardado, não no `pintar`: getComputedStyle a 60fps é
         leitura de layout por quadro, e este valor só muda quando a faixa
         muda de tamanho — que é exatamente quando `dimensionar` roda. */
      nucleo = Math.min(Math.max(m.nucleo, 0), 0.98);
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
            /* Distância crua até o centro, de 0 (no centro) a 1 (na borda). */
            const bruta = Math.min(Math.abs(x + p.largura / 2 - centro) / centro, 1);
            /* O NÚCLEO REMAPEIA essa distância: tudo dentro dele vira 0, e a
               queda inteira passa a acontecer no que sobra. É o que alarga a
               área nítida sem tocar na velocidade nem na aritmética do laço —
               `deslocamento`, `conjunto` e `voltas` continuam como estavam. */
            const d =
              nucleo > 0
                ? Math.min(Math.max((bruta - nucleo) / (1 - nucleo), 0), 1)
                : bruta;
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

    /* Devolve null para marca sem símbolo, em vez de buscar arquivo que não
       existe. A posição no array é preservada: o índice continua casando com
       `marcas[i].nome` lá embaixo. */
    const carregar = async (arquivo?: string): Promise<HTMLImageElement | null> => {
      if (!arquivo) return null;
      const cru = await (await fetch(arquivo)).text();
      const vb = /viewBox="([^"]+)"/.exec(cru);
      const altura = vb ? Number(vb[1].trim().split(/\s+/)[3]) || 44 : 44;

      const pronto = cru
        .replace(/<text[\s\S]*?<\/text>/g, "")
        .replace(/currentColor/g, TINTA)
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
