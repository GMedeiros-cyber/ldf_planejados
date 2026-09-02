import FundoAuralis from "./FundoAuralis";
import { historia } from "@/lib/dados";

/* História: duas colunas acima de 992px, uma abaixo. O fundo é o
   FundoAuralis; o véu dele garante o contraste do texto. */

export default function Historia() {
  return (
    <section className="section historia" id="historia" aria-labelledby="t-hist">
      <FundoAuralis />

      <div className="wrap historia__grade rise">
        <div className="historia__texto">
          <h2 className="historia__titulo" id="t-hist">
            {historia.titulo[0]}
            <br />
            {historia.titulo[1]}
          </h2>

          {historia.paragrafos.map((p) => (
            <p className="historia__p" key={p}>
              {p}
            </p>
          ))}

          {/* A FIRMA É CONTEÚDO, NÃO ORNAMENTO, e por isso leva alt de verdade
              e fica na árvore de acessibilidade. Não é o tratamento do rodapé:
              lá o /assinatura-ldf.png é aria-hidden com alt vazio, porque o
              nome da empresa aparece na barra legal logo abaixo. Aqui a
              assinatura é a ÚNICA atribuição da seção — sem alt, os três
              parágrafos ficam sem autor.

              width e height são o viewBox arredondado (1217,67 × 200). Estão
              aqui para o navegador reservar a caixa antes de baixar o arquivo,
              e não para dimensionar: quem dimensiona é o CSS.

              A SEGUNDA LINHA MUDOU DE CONTEÚDO. Antes ela repetia
              `{nome} · {cargo}` porque a firma mostrava só o primeiro nome; a
              assinatura agora traz o nome completo, então a linha passa a ser
              só o cargo. Continua existindo apenas quando houver cargo — hoje
              não há, e ela não renderiza. */}
          <div className="historia__assinatura">
            <img
              className="historia__firma"
              src={historia.assinatura.svg}
              alt={historia.assinatura.nome}
              width={1218}
              height={200}
              loading="lazy"
              decoding="async"
            />
            {historia.assinatura.cargo ? (
              <span className="historia__cargo">{historia.assinatura.cargo}</span>
            ) : null}
          </div>
        </div>

        <div className="historia__figura">
          <img src={historia.img} alt={historia.alt} loading="lazy" decoding="async" />
        </div>
      </div>
    </section>
  );
}
