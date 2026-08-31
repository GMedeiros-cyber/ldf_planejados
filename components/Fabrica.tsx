import FundoAuralis from "./FundoAuralis";
import VideoFabrica from "./VideoFabrica";
import TextBlockAnimation from "./ui/text-block-animation";

/* Duas colunas: vídeo à esquerda, argumento à direita. A faixa técnica que
   atravessava as duas embaixo saiu — as duas células viraram a última linha
   da coluna de texto, e é ela que encosta na base do vídeo. O que era ficha
   virou nota corrida porque não é dado de consulta: é o rodapé do argumento.

   As colunas estão INVERTIDAS em relação à ordem do DOM, e de propósito. A
   História, logo acima, é texto à esquerda com imagem à direita; repetir o
   arranjo faria as duas lerem como a mesma seção. A troca acontece no CSS
   por grid-column, e não reordenando o markup, porque a ordem de leitura
   correta é a que está aqui: o argumento antes da ilustração. É também a
   ordem que vale em coluna única, abaixo de 992px — sem regra extra.

   O vídeo é ornamento e é aria-hidden; quem carrega o argumento é o diagrama
   da cadeia, que mantém o aria-label. Ele também não participa da revelação:
   a varredura é do texto, e um retângulo passando por cima do vídeo seria
   ornamento sobre ornamento.

   Esta seção continua SERVER COMPONENT. O TextBlockAnimation é que é
   "use client"; o texto vai para ele como children, já renderizado no
   servidor, e chega ao HTML inteiro mesmo se o JS não carregar.

   A coluna NÃO leva .rise. A revelação por bloco substitui aquele fade do
   conjunto: os dois juntos fariam a varredura acontecer debaixo de uma
   opacidade ainda subindo, e o acender do texto viraria fade.

   O atraso em cascata é explícito, um por bloco, na ordem de leitura. Os
   ScrollTriggers são independentes — cada bloco tem o seu — então o delay é
   o que garante que a sequência siga o texto e não a posição na tela. */

/* A cor do retângulo da varredura. O campo agora é o shader, que VARIA: sob a
   coluna de texto a luminância medida vai de 0,00219 no vale a 0,00658 no
   pico, três vezes uma da outra. Não dá para calibrar contra um valor só, como
   dava no campo chapado — a barra vai ler diferente conforme a luz do fundo
   naquele instante.

   --ground-lift é o que atravessa essa faixa melhor: 1,16:1 contra o vale e
   1,07:1 contra o pico. Sempre um degrau acima do fundo, nunca um retângulo
   recortado — e é o mesmo token que a barra usava antes de a seção ganhar
   campo próprio. */
const COR_BLOCO = "var(--ground-lift)";

export default function Fabrica() {
  return (
    <section className="section wrap fabrica-campo" id="fabrica" aria-labelledby="t-fab">
      {/* Mesmo fundo da História e do Processo. O véu é escopado no CSS: aqui
          ele é uniforme, e o porquê está no bloco .fabrica-campo. */}
      <FundoAuralis />

      <div className="fabrica">
        <div className="fabrica__texto">
          <TextBlockAnimation blockColor={COR_BLOCO} delay={0}>
            <h2 className="h2" id="t-fab">
              Não tem revenda no meio.
            </h2>
          </TextBlockAnimation>

          <TextBlockAnimation blockColor={COR_BLOCO} delay={0.1}>
            <p className="lede lede--espacada">
              As grandes marcas de planejados são redes de franquia: quem projeta e quem vende para
              você não é quem fabrica. Na LDF é a mesma empresa do desenho à montagem.
            </p>
          </TextBlockAnimation>

          <TextBlockAnimation blockColor={COR_BLOCO} delay={0.2}>
            <p className="paragrafo-secundario">
              Isso muda três coisas práticas. O prazo é o nosso prazo, não o da fila de uma fábrica
              que atende centenas de lojas. Uma alteração no projeto conversa direto com quem vai
              cortar a chapa. E na assistência técnica não existe para quem apontar o dedo.
            </p>
          </TextBlockAnimation>

          <div
            className="cadeia"
            aria-label="Comparação entre a cadeia de uma rede de franquia e a da LDF"
          >
            <TextBlockAnimation blockColor={COR_BLOCO} delay={0.3}>
              <div className="cadeia__row">
                <span className="cadeia__who">Rede de franquia</span>
                {/* Os nomes dos elos vão com espaço rígido: no corpo maior a linha
                    quebra, e sem isso ela partia em "projetista da / loja" — no meio
                    de um elo, que é justamente o que uma cadeia não pode fazer.
                    Assim a quebra só cai nas setas, e continua lendo como sequência. */}
                <span className="cadeia__what">
                  Fábrica → franqueado → projetista&nbsp;da&nbsp;loja → montador&nbsp;terceirizado
                  → você
                </span>
              </div>
            </TextBlockAnimation>

            <TextBlockAnimation blockColor={COR_BLOCO} delay={0.4}>
              <div className="cadeia__row cadeia__row--ldf">
                <span className="cadeia__who">LDF</span>
                <span className="cadeia__what">Fábrica → você</span>
              </div>
            </TextBlockAnimation>
          </div>

          <TextBlockAnimation blockColor={COR_BLOCO} delay={0.5}>
            <p className="fabrica__nota">
              MDF 100%, corrediças telescópicas com amortecedor e fundos de 3 ou 6&nbsp;mm.
              Fabricado em Guarulhos, entregue em São&nbsp;Paulo.
            </p>
          </TextBlockAnimation>
        </div>

        <div className="fabrica__video">
          <VideoFabrica />
        </div>
      </div>
    </section>
  );
}
