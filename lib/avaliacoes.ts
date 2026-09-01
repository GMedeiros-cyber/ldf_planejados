import { contato } from "./dados";

/* Trechos literais de avaliações públicas no Google, coletadas em 2026-09-01.
   NADA aqui é escrito pela LDF nem por nós — ver o comentário de Prova.tsx.

   Os trechos são cortados, nunca reescritos. Escolhidos por serem ESPECÍFICOS
   (parede torta, prazo, ajuste em obra) em vez de elogio genérico, e por não
   nomearem funcionário: depoimento que nomeia vendedor envelhece mal.

   Duas de 4 estrelas entram de propósito. Um mural só de 5 lê como filtrado;
   uma que nomeia o atrito e a resolução dá crédito ao conjunto.

   O agregado e o link são obrigatórios e não podem ser removidos: são eles que
   fazem desta seção uma amostra honesta em vez de vitrine. Quem quiser as
   avaliações ruins está a um clique.

   REVALIDAR periodicamente: nota e total mudam.

   ══ O CAMPO `ambiente` É OPCIONAL, E OS VAZIOS SÃO VAZIOS DE PROPÓSITO ══

   Só três das oito avaliações dizem qual ambiente foi feito. O rótulo de cada
   uma saiu das PALAVRAS DA PRÓPRIA PESSOA, e está anotado item a item com o
   trecho que o sustenta.

   ATENÇÃO AO CONFERIR: a frase que prova o ambiente nem sempre está no `texto`
   publicado aqui. O `texto` é um recorte curto da avaliação; a menção ao
   ambiente às vezes vive em outra parte da mesma avaliação, fora do recorte.
   Quem for auditar tem de ler a avaliação inteira no Google, e não só o
   trecho deste arquivo — ver a citação ao lado de cada `ambiente`.

   AS OUTRAS CINCO NÃO TÊM O CAMPO, e não podem ganhar um. Deduzir ambiente de
   trecho que não o nomeia é inventar dado de cliente: "as paredes do quarto"
   descreve onde a montagem foi difícil, não necessariamente o que foi
   comprado. Ausente é ausente — o cartão foi desenhado para ficar resolvido
   sem o rótulo, sem placeholder e sem traço no lugar. */

/* A URL sai de `contato.google`, que é a mesma que o rodapé já usa — o site
   tem UM endereço de Google, e ele mora em lib/dados.ts como todo o resto.

   ⚠ O QUE ESTÁ LÁ É A BUSCA (`google.com/search?q=ldf+planejados`), NÃO O
   PERFIL. Ela abre o painel do negócio com o bloco de avaliações, então o
   link cumpre a promessa da frase, mas cai na página de resultados em vez de
   já abrir a lista de avaliações.
   TODO: trocar `contato.google` pela URL curta do perfil (o `g.page/...` ou o
   `maps.app.goo.gl/...` que o Google dá em "Compartilhar" no perfil da
   empresa). Trocar LÁ, não aqui: o rodapé melhora junto. */
export const googleAgregado = {
  nota: 4.6,
  total: 130,
  url: contato.google,
  coletadoEm: "2026-09-01",
};

/* O tipo é DECLARADO, e não inferido de um `as const`. Com `as const` cada
   item vira o seu próprio tipo literal, e `avaliacoes[n].ambiente` não
   compilaria nos cinco que não têm o campo — a propriedade simplesmente não
   existiria naqueles membros da união. Declarando `ambiente?`, os oito
   partilham a mesma forma e o componente pode perguntar por ele em todos. */
export type Avaliacao = {
  readonly nome: string;
  readonly nota: number;
  readonly quando: string;
  readonly texto: string;
  /* Só quando a pessoa disse qual foi. Ver o bloco no topo do arquivo. */
  readonly ambiente?: string;
};

export const avaliacoes: readonly Avaliacao[] = [
  { nome: "Jadiel Bantim", nota: 5, quando: "7 meses atrás",
    texto: "nossa casa é antiga e as paredes um pouco tortas, mas a equipe se empenhou e conseguiu atender da melhor forma possível" },
  /* "o dormitório ficou bonito e funcional" — a própria avaliação nomeia. */
  { nome: "Diógenes R. da Silva", nota: 5, quando: "5 meses atrás", ambiente: "Dormitório",
    texto: "a montagem foi bem organizada, com o pessoal tendo disponibilidade a fazer os ajustes necessários, por conta das irregularidades nas paredes do quarto" },
  { nome: "Mayke Rodrigues", nota: 5, quando: "9 meses atrás",
    texto: "deram o prazo de 30 dias, com 25 dias o projeto estava pronto e logo em seguida já vieram instalar os móveis" },
  { nome: "Marcio Coimbra de Novaes", nota: 4, quando: "5 meses atrás",
    texto: "houve alguns ajustes, mas graças a Deus e ao empenho de todos conseguimos alcançar o objetivo" },
  /* "estava montando o quarto dos meus filhos" — fora do recorte publicado. */
  { nome: "Cleidiane Santos Silva", nota: 4, quando: "um mês atrás", ambiente: "Dormitório",
    texto: "Tivemos algumas intercorrencias no caminho, mas o serviço foi entregue. Trabalharam até tarde para entregarem a montagem" },
  { nome: "Thais Aguiar Cardoso", nota: 5, quando: "7 meses atrás",
    texto: "Cumpriu com o prazo de entrega e início da montagem; Acabamento e entrega final do projeto ficou excelente." },
  /* "comprei um armário de cozinha" — fora do recorte publicado. */
  { nome: "Nathalie F. P. de Freitas", nota: 5, quando: "3 anos atrás", ambiente: "Cozinha",
    texto: "analisa com você cada detalhe do projeto, vai até sua casa fazer as medidas corretas" },
  { nome: "José Cleiton Carvalho", nota: 5, quando: "7 meses atrás",
    texto: "Recebi dentro do prazo acordado, atendimento excelente e materiais de qualidade." },
];
