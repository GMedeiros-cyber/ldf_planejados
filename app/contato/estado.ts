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

/* ── A VALIDAÇÃO MORA AQUI, E NÃO NA ACTION ────────────────────────────────

   Ela nasceu dentro de app/contato/actions.ts e SUBIU para este arquivo quando
   o modo de teste por WhatsApp apareceu. O motivo é o mesmo que trouxe os
   tipos para cá: um módulo marcado com "use server" só pode exportar função
   assíncrona, então a action não consegue emprestar as regras dela a ninguém.
   Aqui não há diretiva nenhuma, e os dois lados importam sem cerimônia.

   ⚠ ESTA É A ÚNICA CÓPIA DAS REGRAS. A Server Action valida com `validar()`, e
   o caminho de teste no cliente valida com `validar()`. Escrever uma segunda
   checagem "só para o cliente" é como as duas divergem — e divergindo, o
   formulário passa a aceitar na tela o que o servidor recusa, ou o contrário.

   A validação de servidor CONTINUA SENDO A QUE DECIDE. O que roda no cliente é
   conveniência: um POST direto ignora tudo o que é do navegador, e por isso a
   action chama `validar()` de novo, sempre, sem confiar em nada que venha de
   fora.

   ── Os limites, e o motivo de cada um ──

     nome 2..80        dois caracteres é o menor nome próprio real; 80 cobre
                       nome completo com sobrenomes compostos.
     whatsapp 10 ou 11 telefone brasileiro depois de limpo: DDD + 8 (fixo) ou
                       DDD + 9 (celular). Não aceitamos +55 porque a máscara do
                       campo não pede país; um número com 12 ou 13 dígitos é
                       colagem de outro formato, e é melhor devolver erro do
                       que adivinhar onde cortar.
     mensagem 0..1000  opcional, e o teto existe para o webhook não receber um
                       romance colado. */
export const LIMITE_NOME = { min: 2, max: 80 };
export const LIMITE_MENSAGEM = 1000;

/* E-mail: verificação SIMPLES, e é decisão. A regex "completa" do RFC 5322
   tem centenas de caracteres, rejeita endereços válidos e aceita inválidos —
   o único teste que de fato prova um e-mail é mandar mensagem para ele. Aqui
   basta separar erro de digitação de coisa que não é endereço: um arroba, algo
   antes, algo depois, um ponto no domínio, nenhum espaço. */
export const pareceEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export const soDigitos = (v: string) => v.replace(/\D+/g, "");

/* REJEITAR, NÃO NORMALIZAR. Valor de `ambiente` ou `estagio` fora das listas
   conhecidas vira erro, e não é "ajustado" para o mais parecido. Normalizar
   entrada desconhecida é aceitar que alguém decidiu por nós o que o campo
   significa. */
export function validar(
  valores: ValoresContato,
  opcoes: { ambientes: readonly string[]; estagios: readonly string[] },
): EstadoContato["erros"] {
  const erros: EstadoContato["erros"] = {};

  if (valores.nome.length < LIMITE_NOME.min || valores.nome.length > LIMITE_NOME.max) {
    erros.nome = `Escreva seu nome, entre ${LIMITE_NOME.min} e ${LIMITE_NOME.max} caracteres.`;
  }

  const digitos = soDigitos(valores.whatsapp);
  if (digitos.length !== 10 && digitos.length !== 11) {
    erros.whatsapp = "Informe DDD e número, com 10 ou 11 dígitos.";
  }

  if (!pareceEmail(valores.email)) {
    erros.email = "Informe um e-mail válido, no formato nome@dominio.com.";
  }

  if (valores.ambiente.length === 0) {
    erros.ambiente = "Escolha ao menos um ambiente.";
  } else if (!valores.ambiente.every((a) => opcoes.ambientes.includes(a))) {
    erros.ambiente = "Escolha ao menos um ambiente.";
  }

  if (!opcoes.estagios.includes(valores.estagio)) {
    erros.estagio = "Diga em que estágio a obra está.";
  }

  if (valores.mensagem.length > LIMITE_MENSAGEM) {
    erros.mensagem = `A mensagem passa de ${LIMITE_MENSAGEM} caracteres.`;
  }

  if (!valores.consentimento) {
    erros.consentimento = "Precisamos da sua autorização para entrar em contato.";
  }

  return erros;
}

/* A frase única do resumo no topo, derivada da contagem de erros. Fica junto
   da validação para os dois caminhos contarem do mesmo jeito. */
export function resumoDeErros(erros: EstadoContato["erros"]): string | null {
  const quantos = Object.keys(erros).length;
  if (quantos === 0) return null;
  return quantos === 1
    ? "Falta corrigir um campo antes de enviar."
    : `Faltam corrigir ${quantos} campos antes de enviar.`;
}

export const ESTADO_INICIAL: EstadoContato = {
  estado: "inicial",
  erros: {},
  resumo: null,
  valores: { nome: "", whatsapp: "", email: "", ambiente: [], estagio: "", mensagem: "", consentimento: false },
};

/* ── A MENSAGEM QUE CHEGA NO WHATSAPP ──────────────────────────────────────

   Subiu para cá pelo mesmo motivo que a validação subiu: os DOIS caminhos do
   formulário terminam no WhatsApp, e cada um monta o texto de um lado da
   fronteira. Com JS, o cliente abre o wa.me em nova aba; sem JS, a Server
   Action redireciona para o mesmo endereço. Duas cópias desta função é como o
   pedido passaria a chegar diferente conforme o visitante tem script ou não —
   e ninguém perceberia, porque as duas continuariam funcionando.

   Os asteriscos são o negrito do aplicativo. */
export function mensagemWhatsApp(v: ValoresContato) {
  const linhas = [
    "*Novo pedido de projeto — site LDF*",
    "",
    `*Nome:* ${v.nome}`,
    `*WhatsApp:* ${v.whatsapp}`,
    `*E-mail:* ${v.email}`,
    `*Ambientes:* ${v.ambiente.join(", ")}`,
    `*Estágio da obra:* ${v.estagio}`,
  ];
  /* A mensagem é opcional: linha ausente em vez de "Mensagem: (vazio)". */
  if (v.mensagem) linhas.push("", "*Mensagem:*", v.mensagem);
  return linhas.join(String.fromCharCode(10));
}
