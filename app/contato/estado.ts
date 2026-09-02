/* Tipos e estado inicial do formulário de contato.

   MORAM AQUI, E NÃO EM actions.ts, POR UMA REGRA DO RUNTIME: num módulo
   marcado com "use server" TODO export precisa ser uma função assíncrona. Um
   objeto exportado de lá — como o ESTADO_INICIAL era — não sobrevive à
   travessia: o build passa, e em tempo de execução o valor chega `undefined`
   no cliente. Foi exatamente o que aconteceu, e a prerenderização de /contato
   quebrou em `Cannot read properties of undefined`.

   Este arquivo não tem diretiva nenhuma, então é código comum que os dois
   lados importam sem cerimônia. */

/* ── O que a interface recebe de volta ──────────────────────────────────────
   `valores` existe para o formulário poder repovoar os campos depois de um
   envio falho — inclusive SEM JS, onde a página é redesenhada do zero e não
   sobra nada do que foi digitado. Perder o texto de quem escreveu é o pior
   desfecho possível aqui. */
export type ValoresContato = {
  nome: string;
  whatsapp: string;
  email: string;
  ambiente: string[];
  estagio: string;
  mensagem: string;
  consentimento: boolean;
};

export type EstadoContato = {
  estado: "inicial" | "erro" | "falha" | "sucesso";
  /* Por campo, para o aria-describedby de cada um. */
  erros: Partial<Record<keyof ValoresContato, string>>;
  /* Frase única do resumo no topo. Nula quando não há o que resumir. */
  resumo: string | null;
  valores: ValoresContato;
};

export const ESTADO_INICIAL: EstadoContato = {
  estado: "inicial",
  erros: {},
  resumo: null,
  valores: { nome: "", whatsapp: "", email: "", ambiente: [], estagio: "", mensagem: "", consentimento: false },
};
