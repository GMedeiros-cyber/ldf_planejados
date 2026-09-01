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

   REVALIDAR periodicamente: nota e total mudam. */

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

export const avaliacoes = [
  { nome: "Jadiel Bantim", nota: 5, quando: "7 meses atrás",
    texto: "nossa casa é antiga e as paredes um pouco tortas, mas a equipe se empenhou e conseguiu atender da melhor forma possível" },
  { nome: "Diógenes R. da Silva", nota: 5, quando: "5 meses atrás",
    texto: "a montagem foi bem organizada, com o pessoal tendo disponibilidade a fazer os ajustes necessários, por conta das irregularidades nas paredes do quarto" },
  { nome: "Mayke Rodrigues", nota: 5, quando: "9 meses atrás",
    texto: "deram o prazo de 30 dias, com 25 dias o projeto estava pronto e logo em seguida já vieram instalar os móveis" },
  { nome: "Marcio Coimbra de Novaes", nota: 4, quando: "5 meses atrás",
    texto: "houve alguns ajustes, mas graças a Deus e ao empenho de todos conseguimos alcançar o objetivo" },
  { nome: "Cleidiane Santos Silva", nota: 4, quando: "um mês atrás",
    texto: "Tivemos algumas intercorrencias no caminho, mas o serviço foi entregue. Trabalharam até tarde para entregarem a montagem" },
  { nome: "Thais Aguiar Cardoso", nota: 5, quando: "7 meses atrás",
    texto: "Cumpriu com o prazo de entrega e início da montagem; Acabamento e entrega final do projeto ficou excelente." },
  { nome: "Nathalie F. P. de Freitas", nota: 5, quando: "3 anos atrás",
    texto: "analisa com você cada detalhe do projeto, vai até sua casa fazer as medidas corretas" },
  { nome: "José Cleiton Carvalho", nota: 5, quando: "7 meses atrás",
    texto: "Recebi dentro do prazo acordado, atendimento excelente e materiais de qualidade." },
] as const;

export type Avaliacao = (typeof avaliacoes)[number];
