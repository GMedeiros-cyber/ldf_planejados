import { avaliacoes, googleAgregado, type Avaliacao } from "@/lib/avaliacoes";

/* Avaliações do Google em faixa contínua, entre a Fábrica e o CTA. É a
   primeira prova social que entra no site — o slot correspondente saiu de
   `slotsProva` em lib/dados.ts no mesmo commit, porque continuar listando
   como pendente o que acabou de ser entregue passa a ser falso.

   NENHUM TEXTO DESTA SEÇÃO É NOSSO, exceto o h2. Os trechos são literais e
   cortados, nunca reescritos — inclusive a grafia. "intercorrencias" está sem
   acento porque foi assim que a pessoa escreveu, e corrigir seria começar a
   editar depoimento. O porquê da seleção está em lib/avaliacoes.ts.

   O AGREGADO E O LINK SÃO A SEÇÃO. Oito trechos escolhidos por nós são
   vitrine; a nota média, o total e o caminho para a lista inteira — com as
   ruins junto — são o que transforma a vitrine em amostra. Nada disso sai
   daqui sem a seção sair junto.

   SEM FOTO DE PERFIL. As fotos do Google são hospedadas pelo Google, com a
   cara de quem escreveu, e nem o arquivo nem a autorização são nossos. O
   círculo de iniciais é desenhado em CSS: identifica sem tomar emprestado.

   ══ POR QUE ESTE ARQUIVO NÃO É "use client" ══

   O marquee inteiro é @keyframes: duas listas iguais lado a lado, ambas
   deslizando -100% da própria largura. Quando a primeira sai pela esquerda a
   segunda está exatamente onde a primeira começou, e o laço reinicia sem
   salto — desde que a caixa não use `gap` entre as duas listas, senão o vão
   da emenda não bate com o vão entre cartões. É por isso que o espaçamento
   mora no margin-inline-end do cartão, e não num gap da trilha.

   A pausa é :hover e :focus-within, a máscara é linear-gradient, e o
   movimento reduzido é uma media query. Zero JavaScript no cliente, e nada
   que dependa de medir o DOM.

   Movimento reduzido resolvido 100% em CSS, sem hook — mesmo motivo
   documentado em AmbienteBloco.tsx: useReducedMotion devolve um valor no
   servidor e outro no cliente, e qualquer marcação que mude por causa dele
   vira divergência de hidratação. Lá isso já custou um atributo pendurado no
   DOM. A media query esconde a lista duplicada e quebra a trilha em grade.

   A CÓPIA DUPLICADA É aria-hidden. Ela existe só para fechar o laço; sem
   isso o leitor de tela leria dezesseis avaliações e concluiria que há
   dezesseis. */

/* Caminho da estrela em caixa de 24. Cinco delas numa SVG só, deslocadas de
   24 em 24 — daí o viewBox de 120. Cheia e vazia são classe, e a tinta das
   duas mora no CSS, como no Icones.tsx. A única exceção é a estrela cortada
   do agregado, que aponta para um gradiente definido logo ao lado dela: a
   referência e o alvo têm de andar juntos. */
const ESTRELA =
  "M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27Z";

const CINCO = [0, 1, 2, 3, 4];

/* Partículas fora: "Diógenes R. da Silva" tem de dar DS, não DD. */
const PARTICULAS = new Set(["de", "da", "do", "das", "dos", "e"]);

const iniciais = (nome: string) => {
  const partes = nome.split(" ").filter((p) => p && !PARTICULAS.has(p.toLowerCase()));
  const primeira = partes[0] ?? "";
  const ultima = partes.length > 1 ? partes[partes.length - 1] : "";
  return `${primeira[0] ?? ""}${ultima[0] ?? ""}`;
};

/* 4.6 → "4,6". toLocaleString resolveria, mas depende dos dados de locale do
   runtime e o número aqui tem uma casa decimal e nada mais. */
const virgula = (n: number) => String(n).replace(".", ",");

function Cartao({ a }: { a: Avaliacao }) {
  return (
    <li className="avaliacao">
      <svg className="avaliacao__estrelas" viewBox="0 0 120 24" aria-hidden="true">
        {CINCO.map((i) => (
          <path
            key={i}
            d={ESTRELA}
            transform={`translate(${i * 24} 0)`}
            className={i < a.nota ? "estrela--cheia" : "estrela--vazia"}
          />
        ))}
      </svg>
      {/* As estrelas são desenho: quem carrega a nota para o leitor de tela
          é esta linha, e ela vem antes do texto pela mesma razão que a
          imagem vem antes — é o enquadramento da citação. */}
      <span className="oculto-visual">Nota {a.nota} de 5.</span>

      <blockquote className="avaliacao__texto">“{a.texto}”</blockquote>

      <p className="avaliacao__pe">
        <span className="avaliacao__iniciais" aria-hidden="true">
          {iniciais(a.nome)}
        </span>
        <span className="avaliacao__quem">
          <span className="avaliacao__nome">{a.nome}</span>
          <span className="avaliacao__quando">{a.quando}</span>
        </span>
      </p>
    </li>
  );
}

/* Uma passagem da lista. A segunda é cópia visual e some do leitor de tela.
   Nenhum cartão carrega id: a única referência interna do documento é o
   gradiente da nota, que vive no cabeçalho e não se repete aqui. */
function Trilho({ eco }: { eco?: boolean }) {
  return (
    <ul className="avaliacoes__trilho" {...(eco ? { "aria-hidden": "true" } : {})}>
      {avaliacoes.map((a) => (
        <Cartao key={a.nome} a={a} />
      ))}
    </ul>
  );
}

export default function Avaliacoes() {
  /* 4,6 → quatro cheias e UMA cortada em 60%. Não é meia estrela arredondada:
     é a fração exata da nota, e ela vive numa estrela só.

     ARMADILHA JÁ PAGA: a primeira versão atravessava as cinco com um gradiente
     só, cortado em 92% (4,6 ÷ 5), com gradientUnits="userSpaceOnUse" e x2=120.
     Rendeu CINCO ESTRELAS CHEIAS. O `transform` de cada <path> estabelece o
     espaço de usuário dela, e é NESSE espaço que o userSpaceOnUse é resolvido —
     não no da SVG. Cada estrela ficava inteira dentro do seu próprio 0–92%.
     Medido em pixel na página, não deduzido: as cinco saíam idênticas.

     O que vale é o contrário — objectBoundingBox, o padrão, relativo à caixa
     da própria estrela e imune ao transform. Um gradiente, uma estrela, e o
     corte é a parte fracionária. Enche 60% do DESENHO da estrela, e não 60%
     da célula de 24: é assim que meia estrela se parece com meia estrela. */
  const cheias = Math.floor(googleAgregado.nota);
  const fracao = googleAgregado.nota - cheias;
  const corte = `${Math.round(fracao * 100)}%`;

  return (
    <section className="section wrap avaliacoes" aria-labelledby="t-avaliacoes">
      <div className="section__head avaliacoes__cabeca rise">
        {/* O número sai do dado, e não da frase: quando o total mudar, a
            manchete e a linha do agregado mudam juntas ou nenhuma muda. */}
        <h2 className="h2" id="t-avaliacoes">
          {googleAgregado.total} pessoas já disseram o que acharam.
        </h2>

        <p className="avaliacoes__agregado">
          <svg className="avaliacoes__media" viewBox="0 0 120 24" aria-hidden="true">
            {fracao > 0 ? (
              <defs>
                {/* Duas paradas no mesmo ponto: corte seco, não esfumaçado. */}
                <linearGradient id="avaliacoes-media" x1="0" y1="0" x2="1" y2="0">
                  <stop offset={corte} />
                  <stop offset={corte} />
                </linearGradient>
              </defs>
            ) : null}
            {CINCO.map((i) => (
              <path
                key={i}
                d={ESTRELA}
                transform={`translate(${i * 24} 0)`}
                {...(i < cheias
                  ? { className: "estrela--cheia" }
                  : i === cheias && fracao > 0
                    ? { fill: "url(#avaliacoes-media)" }
                    : { className: "estrela--vazia" })}
              />
            ))}
          </svg>

          <strong className="avaliacoes__nota num">{virgula(googleAgregado.nota)}</strong>
          <span className="oculto-visual"> de 5,</span>{" "}
          <a className="avaliacoes__link" href={googleAgregado.url} target="_blank" rel="noopener">
            em {googleAgregado.total} avaliações no Google
          </a>
        </p>
      </div>

      {/* tabindex no quadro, e não decoração: a faixa se move sozinha e a
          pausa por :focus-within precisa de algo que receba foco lá dentro.
          Nenhum cartão é clicável, então sem isto quem navega por teclado
          nunca para a faixa — passaria direto do link do agregado para o
          botão do CTA, com oito avaliações desfilando ao lado. */}
      <div
        className="avaliacoes__faixa"
        tabIndex={0}
        role="group"
        aria-label="Avaliações de clientes no Google"
      >
        <Trilho />
        <Trilho eco />
      </div>
    </section>
  );
}
