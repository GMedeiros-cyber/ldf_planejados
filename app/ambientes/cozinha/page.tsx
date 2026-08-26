import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Zap from "@/components/Zap";
import Elevacao from "@/components/Elevacao";
import Amostrario from "@/components/Amostrario";
import { Seta } from "@/components/Icones";
import { whatsappUrl } from "@/lib/dados";

export const metadata: Metadata = {
  title: "Cozinha planejada em Guarulhos — LDF Planejados",
  description:
    "Cozinha planejada feita em fábrica própria: torre quente, gaveteiro, despensa e painel de coifa. Medição no local antes do projeto 3D.",
};

const modulos = [
  {
    titulo: "Torre quente",
    texto:
      "Forno e micro-ondas em coluna, na altura em que você não precisa se abaixar com a assadeira quente. Exige ponto de força dedicado, definido na medição.",
  },
  {
    titulo: "Gaveteiro",
    texto:
      "Corrediças telescópicas retas ou invisíveis com amortecedor. A gaveta funda de panela é a que mais decide a satisfação com a cozinha depois de um ano de uso.",
  },
  {
    titulo: "Despensa",
    texto:
      "Coluna de prateleiras reguláveis. Onde o espaço é curto, vira uma torre estreita com prateleiras de menor profundidade em vez de sumir do projeto.",
  },
  {
    titulo: "Armários superiores",
    texto:
      "Com portas de abrir ou basculantes com pistão. A altura é calculada a partir da bancada e da coifa, não de uma medida padrão.",
  },
  {
    titulo: "Ilha ou península",
    texto:
      "Só entra quando a circulação permite. Se a passagem fica apertada, dizemos isso no projeto em vez de vender o módulo.",
  },
  {
    titulo: "Painel de coifa e nichos",
    texto:
      "Fecha o vão acima do cooktop e esconde a tubulação. É onde a cozinha ganha o acabamento contínuo que se vê de fora.",
  },
];

const medicao = [
  {
    chave: "Prumo e esquadro",
    valor: "A parede é torta",
    detalhe:
      "Quase sempre é, em algum grau. O projeto absorve isso com folgas e rodapés, mas precisa saber onde.",
  },
  {
    chave: "Pontos de água e gás",
    valor: "Onde já estão",
    detalhe:
      "Mudar de lugar é obra. O projeto trabalha com o que existe, ou avisa que vai precisar de obra.",
  },
  {
    chave: "Tomadas e interruptores",
    valor: "Altura e quantidade",
    detalhe: "Definem onde a torre quente pode ficar e onde o armário precisa de recorte.",
  },
  {
    chave: "Pé-direito e forro",
    valor: "Até onde sobe",
    detalhe: "Decide se o armário superior vai até o teto ou se ganha um arremate por cima.",
  },
];

const slots = [
  {
    o: "Galeria de cozinhas entregues",
    porque:
      "Resolução original, direto da câmera ou do celular. Com antes e depois quando houver.",
  },
  {
    o: "Detalhe de ferragem e acabamento",
    porque:
      "Gaveta aberta, fita de borda, encaixe. É o que separa uma foto de catálogo de uma prova.",
  },
];

function Chevron() {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
    </svg>
  );
}

export default function Cozinha() {
  return (
    <>
      <Nav />
      <main>
        <section className="hero" aria-labelledby="t-hero">
          <div className="hero__stage">
            <Elevacao label="Elevação desenhada de uma cozinha planejada, com armários superiores, bancada e gaveteiro no acabamento selecionado." />

            <div className="hero__overlay">
              <p className="migalha">
                <Link href="/">LDF</Link>
                <Chevron />
                <Link href="/#ambientes">Ambientes</Link>
                <Chevron />
                <span>Cozinha</span>
              </p>
              <h1 className="display" id="t-hero">
                Cozinha
              </h1>
              <p className="lede">
                O ambiente que mais depende da medição. Meio centímetro de erro no prumo aparece no
                rodapé, e um ponto de água fora do lugar muda a distribuição inteira dos módulos.
              </p>
              <div className="hero__actions">
                <Link className="btn" href="#contato">
                  Quero meu projeto 3D
                  <Seta />
                </Link>
              </div>
              <div className="hero__note">
                <p>
                  <strong>Toque um acabamento</strong> para vestir a cozinha. Todos são MDF 100%,
                  madeirado ou laca fosca.
                </p>
              </div>
            </div>
          </div>

          <Amostrario />
        </section>

        <section className="section wrap" aria-labelledby="t-mod">
          <div className="section__head rise">
            <h2 className="h2" id="t-mod">
              O que costuma entrar.
            </h2>
            <p className="lede">
              Nenhuma cozinha leva tudo, e nenhuma leva exatamente isto. A lista existe para você
              marcar o que reconhece antes da medição.
            </p>
          </div>

          <ul className="mods rise">
            {modulos.map((m) => (
              <li key={m.titulo} className="mod">
                <span className="mod__chip mat" aria-hidden="true" />
                <div className="mod__body">
                  <span className="mod__t">{m.titulo}</span>
                  <p className="mod__d">{m.texto}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="section wrap" aria-labelledby="t-med">
          <div className="section__head rise">
            <h2 className="h2" id="t-med">
              Quatro coisas que só se sabe no local.
            </h2>
          </div>
          <div className="ficha rise">
            {medicao.map((m) => (
              <div key={m.chave} className="ficha__cell">
                <span className="label ficha__k">{m.chave}</span>
                <span className="ficha__v ficha__v--sm">{m.valor}</span>
                <span className="ficha__d">{m.detalhe}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="section wrap" aria-labelledby="t-fotos">
          <div className="section__head rise">
            <h2 className="h2" id="t-fotos">
              As fotos entram aqui.
            </h2>
          </div>
          <div className="aguardando rise">
            {slots.map((s) => (
              <div key={s.o} className="slot">
                <span className="slot__tag">A inserir</span>
                <span className="slot__what">{s.o}</span>
                <span className="slot__why">{s.porque}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="section fechamento wrap" id="contato" aria-labelledby="t-cta">
          <h2 className="display" id="t-cta">
            Manda a planta
            <br />
            da sua cozinha.
          </h2>
          <p className="lede">
            Da planta baixa sai o primeiro estudo. Da medição sai o projeto. Do projeto aprovado sai
            o orçamento — nessa ordem, sempre.
          </p>
          <div className="hero__actions">
            <a className="btn" href={whatsappUrl} target="_blank" rel="noopener">
              Falar no WhatsApp
              <Seta />
            </a>
            <Link className="btn btn--ghost" href="/#ambientes">
              Ver outros ambientes
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <Zap />
    </>
  );
}
