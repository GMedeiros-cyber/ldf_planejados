import { COMERCIAL_ALTURA, COMERCIAL_LARGURA, projetoComercial } from "@/lib/dados";

/* Uma obra comercial entregue, em quatro fotos. Fecha /ambientes logo antes do
   CTA.

   NÃO É A VOLTA DO <Comercial /> QUE FOI APAGADO. Aquele era um desenho
   vetorial de elevação — o <Elevacao />, que saiu junto — com texto
   argumentativo e nenhuma fotografia; sustentava a seção no argumento porque
   não havia material. Aqui há material, e a seção é o material: quatro
   fotografias de uma loja pronta. Nome novo, arquivo novo, e o antigo continua
   morto de propósito. Não o ressuscite do histórico para "reaproveitar".

   Componente de SERVIDOR. Todo o comportamento é CSS — nenhum estado, nenhum
   ouvinte, nenhum "use client". /ambientes voltou a ser 100% servidor numa
   rodada anterior e continua assim depois desta.

   ══ TRÊS DECISÕES DE MARCAÇÃO, TODAS DELIBERADAS ══

   a) <img> DE VERDADE, e não background-image num style inline. O efeito de
      foco desta grade veio de um componente de referência que pintava as fotos
      como fundo CSS, e o fundo derruba de uma vez três coisas que aqui são
      obrigatórias: o alt (a foto é conteúdo, não decoração), o loading="lazy"
      (são quatro arquivos abaixo da dobra) e o par width/height, que é o que
      reserva a caixa antes do byte chegar. Esta base já pagou CLS por foto sem
      caixa reservada — foi o que a assinatura do Renan cobrou.

   b) A LEGENDA FICA ABAIXO DA FOTO, e não sobreposta com véu de gradiente. Com
      texto por cima da imagem o contraste passa a depender da fotografia, e
      basta uma foto clara no lugar de uma escura para o rótulo sumir. Fora
      isso, /ambientes nunca pôs texto sobre foto: seria um padrão novo
      inaugurado no fim da página.

   c) width e height são o TAMANHO DO ARQUIVO (900×1200), não o tamanho na
      tela. Quem dimensiona é o CSS da grade; os atributos existem só para o
      navegador saber a proporção antes do download.

   O EFEITO DE FOCO É SÓ ÊNFASE. Nenhuma informação depende do ponteiro: as
   quatro legendas estão sempre visíveis, e os quatro alt estão sempre na
   árvore. Quem nunca produz hover — toque, teclado, leitor de tela — não perde
   nada. Ver a seção 11d da folha, que trata :focus-visible, movimento reduzido
   e (hover: none). */

export default function ProjetoComercial() {
  return (
    <section className="section wrap comercial" aria-labelledby="t-com">
      {/* `.h2` dá o degrau de TAMANHO; `.manchete-serifada` troca a família para
          a Instrument Serif e zera o eixo "wdth" que a `.h2` pede — a serifada
          não é variável, e o eixo aplicado nela dá resultado que muda de
          navegador para navegador. O par `.h2.manchete-serifada` já resolve
          para o mesmo clamp do `.ambiente__nome`, que é o degrau serifado de
          seção; declarar a família de novo numa classe local só criaria um
          terceiro lugar para manter a mesma decisão. Ver a seção 3 da folha. */}
      <div className="section__head rise">
        <h2 className="h2 manchete-serifada" id="t-com">
          {projetoComercial.titulo}
        </h2>
        <p className="lede">{projetoComercial.lede}</p>
      </div>

      {/* tabIndex={0} em cada figura, e não um link nem um botão: os cards não
          levam a lugar nenhum e não fazem nada ao serem acionados. É só o que
          põe os quatro na ordem do Tab e dá ao :focus-visible onde acontecer —
          sem isso, quem navega por teclado percorreria a seção inteira sem
          nunca ver o destaque que o ponteiro dá.

          A <figure> FICA SEM NOME ACESSÍVEL, e é o certo. Verificado na árvore
          de acessibilidade do Chrome: cada figura entra como `figure ""` com
          dois filhos — a imagem com o seu alt e o figcaption com a sua legenda.
          Pôr um aria-label ou um aria-labelledby apontando para o figcaption
          nomearia a figura com o mesmo texto que já está dentro dela, e o
          leitor de tela diria a legenda duas vezes. `figure` não é componente
          de interface, então o 4.1.2 não pede nome aqui; o que ele pede — que
          o foco seja visível — é o anel da seção 11d da folha. */}
      <div className="comercial__grade">
        {projetoComercial.fotos.map((f) => (
          <figure className="comercial__card" key={f.arquivo} tabIndex={0}>
            <img
              className="comercial__foto"
              src={f.arquivo}
              width={COMERCIAL_LARGURA}
              height={COMERCIAL_ALTURA}
              alt={f.alt}
              loading="lazy"
              decoding="async"
            />
            <figcaption className="comercial__legenda">{f.legenda}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
