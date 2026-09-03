"use server";

import { redirect } from "next/navigation";

import { opcoesAmbiente, opcoesEstagio, whatsappUrl } from "@/lib/dados";
import {
  ESTADO_INICIAL,
  mensagemWhatsApp,
  resumoDeErros,
  soDigitos,
  validar,
  type EstadoContato,
  type ValoresContato,
} from "./estado";

/* Envio do formulário de contato.

   SERVER ACTION, e não rota de API com fetch do cliente. A diferença que
   importa é uma só: `<form action={acao}>` funciona SEM JAVASCRIPT. O
   navegador faz o POST nativo, o servidor roda esta função e devolve a página
   já com o resultado. Este site trata "sem JS" como estado real desde a
   `@media (scripting: none)` da folha; o formulário não podia ser a primeira
   coisa a exigir script.

   NENHUMA DEPENDÊNCIA. Sem zod, sem lib de validação, sem SDK de e-mail. A
   validação é escrita à mão porque são sete campos com regras curtas — uma
   biblioteca aqui custaria mais bytes que o formulário inteiro.

   ══ VALIDAÇÃO É SEMPRE DO SERVIDOR ══

   O `required` do HTML e o `type="email"` ajudam quem tem JS e navegador
   moderno, e não são garantia de nada: um POST direto ignora os dois. Quem
   DECIDE se o pedido entra é esta função, que chama `validar()` sempre, sem
   confiar em checagem nenhuma feita do outro lado.

   ⚠ AS REGRAS SAÍRAM DAQUI E FORAM PARA ./estado.ts. Não é reorganização por
   gosto: o modo de teste por WhatsApp valida no cliente, e um módulo
   "use server" não pode exportar nada além de função assíncrona — então esta
   action não conseguia emprestar as regras dela a ninguém. Com as duas pontas
   importando `validar()` do mesmo lugar, elas não podem divergir. Os limites e
   o porquê de cada um estão documentados lá. */

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

  /* ══ VALIDAÇÃO ══
     A MESMA função que o formulário usa no modo de teste. Ver ./estado.ts. */
  const erros: EstadoContato["erros"] = validar(valores, {
    ambientes: opcoesAmbiente,
    estagios: opcoesEstagio,
  });

  const resumo = resumoDeErros(erros);
  if (resumo) {
    return { estado: "erro", erros, resumo, valores };
  }

  const digitos = soDigitos(valores.whatsapp);

  /* ══ ENTREGA ══

     O destino é um webhook do cliente, em LEAD_WEBHOOK_URL. Um POST com fetch,
     nenhum SDK, nenhum serviço de e-mail inventado.

     ⚠ ELE NÃO EXISTE HOJE, E A ESPERA NÃO TEM DATA. Por duas rodadas o plano
     foi um fluxo n8n; o cliente adiou a automação, e a ferramenta voltou a ser
     uma decisão em aberto. A variável continua aqui, sem nome de fornecedor
     nenhum: no dia em que houver um endereço, ele entra e este arquivo não
     muda.

     ══ COM A VARIÁVEL VAZIA, O PEDIDO VAI PARA O WHATSAPP ══

     E não é atalho — é o conserto que os dois arquivos já prescreviam.

     Antes daqui, com a variável vazia, este caminho devolvia FALHA em
     produção. Fazia sentido enquanto o webhook era questão de dias: um
     formulário que diz "recebemos" sem ter para onde mandar é pior que um
     formulário fora do ar. Mas quem cai aqui é o visitante SEM JAVASCRIPT — o
     com script já abre o WhatsApp pelo componente —, e ir ao ar mandando só
     esse visitante embora com uma mensagem de erro é escolher o pior desfecho
     para justamente quem tem menos recurso.

     O `redirect()` termina os dois caminhos no MESMO lugar, com a MESMA
     mensagem (`mensagemWhatsApp`, em ./estado.ts). Nada se perde: a validação
     e o antispam acima já rodaram — é justamente o que o caminho com JS não
     tem.

     ⚠ O redirect fica FORA do try/catch de propósito: ele sinaliza desviando
     uma exceção interna do Next, e um catch por perto a engoliria. */
  const destino = process.env.LEAD_WEBHOOK_URL;

  if (!destino) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[contato] LEAD_WEBHOOK_URL vazia — indo para o WhatsApp:", valores);
    }
    redirect(`${whatsappUrl}?text=${encodeURIComponent(mensagemWhatsApp(valores))}`);
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
