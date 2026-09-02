"use server";

import { opcoesAmbiente, opcoesEstagio } from "@/lib/dados";
import { ESTADO_INICIAL, type EstadoContato, type ValoresContato } from "./estado";

/* Envio do formulário de contato.

   SERVER ACTION, e não rota de API com fetch do cliente. A diferença que
   importa é uma só: `<form action={acao}>` funciona SEM JAVASCRIPT. O
   navegador faz o POST nativo, o servidor roda esta função e devolve a página
   já com o resultado. Este site trata "sem JS" como estado real desde a
   `@media (scripting: none)` da folha; o formulário não podia ser a primeira
   coisa a exigir script.

   NENHUMA DEPENDÊNCIA. Sem zod, sem lib de validação, sem SDK de e-mail. A
   validação abaixo é escrita à mão porque são sete campos com regras curtas —
   uma biblioteca aqui custaria mais bytes que o formulário inteiro.

   ══ VALIDAÇÃO É SEMPRE DO SERVIDOR ══

   O `required` do HTML e o `type="email"` ajudam quem tem JS e navegador
   moderno, e não são garantia de nada: um POST direto ignora os dois. Tudo o
   que decide se o pedido entra está NESTA função.

   REJEITAR, NÃO NORMALIZAR. Valor de `ambiente` ou `estagio` fora das listas
   conhecidas vira erro, e não é "ajustado" para o mais parecido. Normalizar
   entrada desconhecida é aceitar que alguém decidiu por nós o que o campo
   significa. */

/* ── Regras ────────────────────────────────────────────────────────────────
   Os limites são deliberados e cada um tem motivo:

     nome 2..80        dois caracteres é o menor nome próprio real; 80 cobre
                       nome completo com sobrenomes compostos.
     whatsapp 10 ou 11 telefone brasileiro depois de limpo: DDD + 8 (fixo) ou
                       DDD + 9 (celular). Não aceitamos +55 porque a máscara do
                       campo não pede país; um número com 12 ou 13 dígitos é
                       colagem de outro formato, e é melhor devolver erro do
                       que adivinhar onde cortar.
     mensagem 0..1000  opcional, e o teto existe para o webhook não receber um
                       romance colado. */
const LIMITE_NOME = { min: 2, max: 80 };
const LIMITE_MENSAGEM = 1000;

/* E-mail: verificação SIMPLES, e é decisão. A regex "completa" do RFC 5322
   tem centenas de caracteres, rejeita endereços válidos e aceita inválidos —
   o único teste que de fato prova um e-mail é mandar mensagem para ele. Aqui
   basta separar erro de digitação de coisa que não é endereço: um arroba, algo
   antes, algo depois, um ponto no domínio, nenhum espaço. */
const pareceEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const soDigitos = (v: string) => v.replace(/\D+/g, "");

/* Envio em menos disto, com o carimbo presente, é robô. */
const RAPIDO_DEMAIS_MS = 3000;

function texto(dados: FormData, campo: string) {
  const v = dados.get(campo);
  return typeof v === "string" ? v.trim() : "";
}

export async function enviarContato(
  _anterior: EstadoContato,
  dados: FormData,
): Promise<EstadoContato> {
  const valores: ValoresContato = {
    nome: texto(dados, "nome"),
    whatsapp: texto(dados, "whatsapp"),
    email: texto(dados, "email"),
    ambiente: dados.getAll("ambiente").filter((v): v is string => typeof v === "string"),
    estagio: texto(dados, "estagio"),
    mensagem: texto(dados, "mensagem"),
    consentimento: dados.get("consentimento") === "sim",
  };

  /* ══ ANTISPAM, ANTES DE QUALQUER OUTRA COISA ══

     Os dois descartes abaixo respondem SUCESSO e jogam fora. É de propósito:
     dizer "você é um robô" ensina o robô a tentar de outro jeito, e um humano
     nunca cai aqui.

     1. HONEYPOT. O campo `site` está fora da tela, com aria-hidden, tabindex
        -1 e autocomplete off — gente não vê, não tabula e não preenche.
        Preenchido, é robô que leu o HTML e completou tudo. */
  if (texto(dados, "site") !== "") {
    return { estado: "sucesso", erros: {}, resumo: null, valores: ESTADO_INICIAL.valores };
  }

  /*   2. CARIMBO DE TEMPO. O campo `carimbo` é escrito PELO CLIENTE ao montar
        o formulário. Menos de 3 segundos entre montar e enviar é robô: ninguém
        lê seis campos e um consentimento nesse tempo.

        ⚠ SEM JS O CARIMBO NÃO EXISTE, e aí a checagem é PULADA em vez de
        reprovar. É a escolha certa e vale registrar por que: a página é
        estática, então um carimbo renderizado no servidor seria a hora do
        BUILD, igual para todo mundo e velho de horas — passaria sempre, e daria
        a impressão de proteção sem proteger. Melhor uma checagem que se
        declara ausente do que uma que mente. Quem não tem JS continua coberto
        pelo honeypot, que não depende de script nenhum. */
  const carimbo = Number(texto(dados, "carimbo"));
  if (Number.isFinite(carimbo) && carimbo > 0 && Date.now() - carimbo < RAPIDO_DEMAIS_MS) {
    return { estado: "sucesso", erros: {}, resumo: null, valores: ESTADO_INICIAL.valores };
  }

  /* ══ VALIDAÇÃO ══ */
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
  } else if (!valores.ambiente.every((a) => (opcoesAmbiente as readonly string[]).includes(a))) {
    /* Fora da lista conhecida: rejeita, não conserta. */
    erros.ambiente = "Escolha ao menos um ambiente.";
  }

  if (!(opcoesEstagio as readonly string[]).includes(valores.estagio)) {
    erros.estagio = "Diga em que estágio a obra está.";
  }

  if (valores.mensagem.length > LIMITE_MENSAGEM) {
    erros.mensagem = `A mensagem passa de ${LIMITE_MENSAGEM} caracteres.`;
  }

  if (!valores.consentimento) {
    erros.consentimento = "Precisamos da sua autorização para entrar em contato.";
  }

  const quantos = Object.keys(erros).length;
  if (quantos > 0) {
    return {
      estado: "erro",
      erros,
      resumo:
        quantos === 1
          ? "Falta corrigir um campo antes de enviar."
          : `Faltam corrigir ${quantos} campos antes de enviar.`,
      valores,
    };
  }

  /* ══ ENTREGA ══

     O destino é um fluxo n8n do cliente, em LEAD_WEBHOOK_URL. Ele ainda não
     existe, então a variável pode estar vazia — e o comportamento nesse caso é
     DIFERENTE por ambiente, de propósito:

       desenvolvimento  loga e devolve sucesso, para o formulário poder ser
                        testado de ponta a ponta sem depender do n8n.
       produção         devolve FALHA. Um formulário que diz "recebemos" sem
                        ter para onde mandar é pior que um formulário fora do
                        ar: o pedido some e ninguém fica sabendo.

     Nenhum SDK, nenhum serviço de e-mail inventado. Um POST com fetch. */
  const destino = process.env.LEAD_WEBHOOK_URL;

  if (!destino) {
    if (process.env.NODE_ENV === "production") {
      return {
        estado: "falha",
        erros: {},
        resumo:
          "Não conseguimos enviar agora. Tente de novo em alguns minutos, ou chame no WhatsApp — o número está logo abaixo.",
        valores,
      };
    }
    console.warn("[contato] LEAD_WEBHOOK_URL vazia — pedido NÃO enviado:", valores);
    return { estado: "sucesso", erros: {}, resumo: null, valores: ESTADO_INICIAL.valores };
  }

  try {
    const resposta = await fetch(destino, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...valores,
        whatsapp: digitos,
        recebidoEm: new Date().toISOString(),
        origem: "site/contato",
      }),
      /* Sem timeout o pedido pode ficar pendurado e a pessoa olhando um botão
         desabilitado. 10s é folgado para um webhook e curto para a espera. */
      signal: AbortSignal.timeout(10_000),
    });

    if (!resposta.ok) throw new Error(`webhook devolveu ${resposta.status}`);
  } catch (erro) {
    console.error("[contato] falha ao enviar:", erro);
    return {
      estado: "falha",
      erros: {},
      /* A mensagem diz O QUE FAZER, e os valores voltam junto — o formulário
         se repovoa e ninguém redigita nada. */
      resumo:
        "Não conseguimos enviar agora. Tente de novo em alguns minutos, ou chame no WhatsApp — o número está logo abaixo.",
      valores,
    };
  }

  return { estado: "sucesso", erros: {}, resumo: null, valores: ESTADO_INICIAL.valores };
}
