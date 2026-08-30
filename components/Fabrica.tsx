import VideoFabrica from "./VideoFabrica";

/* Três faixas: vídeo à esquerda, texto + diagrama à direita, e as duas
   células técnicas atravessando as duas colunas embaixo.

   As colunas estão INVERTIDAS em relação à ordem do DOM, e de propósito. A
   História, logo acima, é texto à esquerda com imagem à direita; repetir o
   arranjo faria as duas lerem como a mesma seção. A troca acontece no CSS
   por grid-column, e não reordenando o markup, porque a ordem de leitura
   correta é a que está aqui: o argumento antes da ilustração. É também a
   ordem que vale em coluna única, abaixo de 992px — sem regra extra.

   O vídeo é ornamento e é aria-hidden; quem carrega o argumento é o diagrama
   da cadeia, que mantém o aria-label. */

export default function Fabrica() {
  return (
    <section className="section wrap" id="fabrica" aria-labelledby="t-fab">
      <div className="fabrica">
        <div className="fabrica__texto rise">
          <h2 className="h2" id="t-fab">
            Não tem revenda no meio.
          </h2>
          <p className="lede lede--espacada">
            As grandes marcas de planejados são redes de franquia: quem projeta e quem vende para
            você não é quem fabrica. Na LDF é a mesma empresa do desenho à montagem.
          </p>
          <p className="paragrafo-secundario">
            Isso muda três coisas práticas. O prazo é o nosso prazo, não o da fila de uma fábrica
            que atende centenas de lojas. Uma alteração no projeto conversa direto com quem vai
            cortar a chapa. E na assistência técnica não existe para quem apontar o dedo.
          </p>

          <div
            className="cadeia"
            aria-label="Comparação entre a cadeia de uma rede de franquia e a da LDF"
          >
            <div className="cadeia__row">
              <span className="cadeia__who">Rede de franquia</span>
              <span className="cadeia__what">
                Fábrica → franqueado → projetista da loja → montador terceirizado → você
              </span>
            </div>
            <div className="cadeia__row cadeia__row--ldf">
              <span className="cadeia__who">LDF</span>
              <span className="cadeia__what">Fábrica → você</span>
            </div>
          </div>
        </div>

        <div className="fabrica__video">
          <VideoFabrica />
        </div>

        <div className="ficha ficha--nua fabrica__tecnica rise">
          <div className="ficha__cell">
            <span className="label ficha__k">Material</span>
            <span className="ficha__v ficha__v--sm">MDF 100%</span>
            <span className="ficha__d">
              Corrediças telescópicas retas ou invisíveis com amortecedor, dobradiças com
              amortecimento, fundos de 3&nbsp;mm ou 6&nbsp;mm.
            </span>
          </div>
          <div className="ficha__cell">
            <span className="label ficha__k">Onde ficamos</span>
            <span className="ficha__v ficha__v--sm">Guarulhos</span>
            <span className="ficha__d">
              Atendemos São Paulo em geral. Enviamos para outros estados sem montagem.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
