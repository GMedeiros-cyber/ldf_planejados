"use client";

import Link from "next/link";
import { useActionState, useEffect, useId, useRef, useState } from "react";

import BotaoRevelar from "./BotaoRevelar";
import { consentimento, opcoesAmbiente, opcoesEstagio, whatsappUrl } from "@/lib/dados";
import { empurrarEvento } from "@/lib/dataLayer";
import { enviarContato } from "@/app/contato/actions";
import {
  ESTADO_INICIAL,
  mensagemWhatsApp,
  resumoDeErros,
  TETO_CRU,
  validar,
  type EstadoContato,
  type ValoresContato,
} from "@/app/contato/estado";

/* O formulário de /contato. Seis campos, um consentimento e um botão.

   ══ FUNCIONA SEM JAVASCRIPT, E ISSO É O EIXO DO ARQUIVO ══

   `useActionState` com uma Server Action é o único arranjo que dá as duas
   coisas ao mesmo tempo: sem JS o navegador faz o POST nativo e o servidor
   devolve a página já com o resultado; com JS o mesmo estado volta sem
   navegação e sem recarregar. Não há dois caminhos de código — há um, e o
   script só melhora o que já funcionava.

   É por isso que este componente é `"use client"` e mesmo assim não exige
   cliente nenhum. O `"use client"` existe para o `useActionState` e para o
   carimbo de tempo; tirar o script de cena não quebra nada, só apaga o resumo
   ao vivo e o estado "enviando".

   ══ OS VALORES SOBREVIVEM AO ERRO ══

   Todo campo lê `defaultValue`/`defaultChecked` do estado devolvido pela
   action. Num envio falho — de validação ou de rede — a pessoa reencontra
   exatamente o que digitou, inclusive sem JS, onde a página é redesenhada do
   zero. Perder o texto de quem escreveu é o pior desfecho possível aqui.

   ══ POR QUE fieldset/legend, E NÃO UM LABEL SOLTO ══

   Ambiente e Estágio são GRUPOS de controles. Com `<fieldset><legend>`, o
   leitor de tela anuncia a pergunta do grupo antes de cada opção — "Ambiente,
   Cozinha, caixa de seleção, não marcada". Com um <p> por cima de um monte de
   caixas, ele anuncia só "Cozinha", e a pessoa não sabe do que se trata.

   E NÃO SÃO <select>. No celular, quatro pastilhas são um toque; um select é
   três — abrir, rolar, confirmar. Além disso o grupo 4 é de múltipla escolha,
   e select múltiplo em telefone é dos piores controles que existem.

   ══ O QUE NÃO ENTROU, E É DECISÃO ══

   Faixa de orçamento, prazo e "como conheceu" foram discutidos e ficaram
   FORA. Cada campo custa conversão, e os três são úteis para nós e inúteis
   para quem preenche. Não acrescente campo aqui sem essa conversa. */

const NOME_DO_ESTADO_ENVIANDO = "Enviando…";

/* ══════════════════════════════════════════════════════════════════════════
   ⚠⚠⚠  A ENTREGA É POR WHATSAPP, E É PROVISÓRIA
   ══════════════════════════════════════════════════════════════════════════

   Com JavaScript, o botão NÃO posta na Server Action: ele abre o WhatsApp da
   LDF com o pedido já escrito, em nova aba. Vale enquanto o webhook definitivo
   não existir — e ele não existe: a automação foi adiada pelo cliente, e a
   ferramenta é decisão em aberto.

   ══ O NÚMERO É O DA LDF, E VEM DO dados.ts ══

   `whatsappUrl` — o MESMO endereço que o rodapé e o cartão de /contato usam,
   derivado de `contato.whatsapp`. Não há segundo número escrito em lugar
   nenhum, e trocar o da empresa troca o do formulário junto.

   ISTO SUBSTITUIU UMA VARIÁVEL DE AMBIENTE. Por uma rodada o destino foi um
   `NEXT_PUBLIC_WHATSAPP_TESTE`, com um número de teste que só existia no .env
   de quem estava testando. O cliente confirmou o número de produção, e a
   variável saiu — do código e do .env.example. Não a traga de volta para
   "poder trocar sem build": o número é dado do site, e dado do site mora no
   lib/dados.ts.

   ══ OS DOIS VISITANTES TERMINAM NO MESMO LUGAR ══

   Por duas rodadas não terminavam, e o registro do defeito antigo ficou aqui
   porque a correção é fácil de desfazer sem querer.

   ERA ASSIM: abrir o wa.me é ação de cliente. Sem script o `onSubmit` não
   roda, o navegador faz o POST nativo e cai na Server Action — que, com
   `LEAD_WEBHOOK_URL` vazia em produção, respondia FALHA. Só o visitante sem
   JavaScript era mandado embora com uma mensagem de erro.

   AGORA A ACTION REDIRECIONA para o mesmo wa.me, com a mesma mensagem. Os dois
   caminhos entregam igual, com ou sem script. É exatamente o conserto que
   estava escrito aqui como plano B, aplicado quando o webhook deixou de ter
   data.

   ⚠ `mensagemWhatsApp` MORA EM app/contato/estado.ts, e não neste arquivo.
   Ela subiu para lá no mesmo commit, pelo motivo que subiu a `validar()`: dois
   lados montando o texto, uma cópia só. Não a traga de volta para cá.

   ══ O QUE ESTE CAMINHO NÃO TEM, e precisa estar escrito porque some sem aviso ══

     1. O ANTISPAM DE SERVIDOR. Honeypot e carimbo de tempo moram na action, e
        este caminho não passa por ela. Um robô que preencha o formulário com
        JS ligado abre uma aba de WhatsApp — barulho, não vazamento, mas vale
        saber. (O visitante sem JS continua coberto: ele passa pela action.)

     2. A CHECAGEM QUE DECIDE. A do cliente usa `validar()`, a MESMA função da
        action (ver app/contato/estado.ts). Não diverge — mas continua sendo
        checagem de navegador, que qualquer um contorna.

   O QUE NÃO SE PERDE: a Server Action e a `LEAD_WEBHOOK_URL` continuam
   inteiras, no lugar, funcionando. Nada foi apagado.

   ⚠ TODO — DESFAZER QUANDO O WEBHOOK EXISTIR.

   O gatilho é o mesmo TODO que já está em app/contato/actions.ts, no bloco
   "ENTREGA": no dia em que `LEAD_WEBHOOK_URL` for preenchida, daqui saem o
   `aoEnviar`, o `estadoTeste`, o `urlBloqueada` e o `onSubmit` do <form>. O
   formulário volta a ser `<form action={acao}>` puro, e o `redirect()` da
   action cai junto por não ter mais como ser alcançado. Nada além disso
   precisa mudar — foi desenhado para sair inteiro. */

export default function FormularioContato() {
  const [estado, acao, pendente] = useActionState(enviarContato, ESTADO_INICIAL);

  /* Ids estáveis entre servidor e cliente, para o aria-describedby de cada
     campo. `useId` existe exatamente para isso — string fixa daria colisão se
     o formulário aparecesse duas vezes na página. */
  const id = useId();
  const campo = (n: string) => `${id}-${n}`;
  const erroId = (n: string) => `${id}-${n}-erro`;

  const resumoRef = useRef<HTMLDivElement>(null);
  const sucessoRef = useRef<HTMLDivElement>(null);

  /* O CARIMBO É ESCRITO NO CLIENTE, na montagem. Não pode vir do servidor: a
     rota é estática, então o valor seria a hora do build — igual para todo
     mundo e velho de horas. Sem JS ele fica vazio e a action PULA a checagem,
     em vez de reprovar; o porquê está escrito lá. */
  const [carimbo, setCarimbo] = useState("");
  useEffect(() => setCarimbo(String(Date.now())), []);

  /* O estado do caminho de TESTE. Fica separado do `estado` da action de
     propósito: são dois caminhos, e misturar os dois num objeto só faria o
     resultado de um aparecer depois do outro sem ninguém entender por quê.
     Nulo enquanto ninguém tentou enviar pelo modo de teste. */
  const [estadoTeste, setEstadoTeste] = useState<EstadoContato | null>(null);

  /* ⚠ A URL DO WHATSAPP QUANDO A JANELA NÃO ABRIU.

     `window.open` devolve `null` quando o navegador bloqueia o pop-up, e o
     bloqueio é comum: basta o navegador não reconhecer o envio como gesto do
     usuário, ou a pessoa ter o bloqueador ligado. Guardando a URL aqui, o
     pedido não se perde — ela vira um link que a pessoa clica.

     Nula quando não há nada pendente. */
  const [urlBloqueada, setUrlBloqueada] = useState<string | null>(null);

  /* ══ UM PEDIDO CONTA UMA VEZ ══

     `form_lead` sai de dois pontos — o envio normal e o link de recuperação do
     pop-up bloqueado —, e os dois podem ser acionados de novo com o MESMO
     pedido: dois cliques no link, ou o link seguido de outro Enviar. Sem esta
     guarda, cada um virava um lead no relatório, e um contato aparecia dois ou
     três.

     A IDENTIDADE DO PEDIDO É A URL. Ela carrega a mensagem inteira, montada
     dos campos preenchidos: mesmos dados, mesma URL, mesmo pedido. Mudou um
     campo, mudou a URL — e aí é pedido novo, que conta.

     Ref, e não estado: lembrar o que já foi medido não muda nada na tela, e
     não pode custar uma renderização. */
  const leadMedido = useRef<string | null>(null);
  const medirLead = (url: string) => {
    if (leadMedido.current === url) return;
    leadMedido.current = url;
    empurrarEvento("form_lead");
  };

  /* Quem manda na tela: o teste, quando houve tentativa; a action, senão. */
  const visivel = estadoTeste ?? estado;

  /* FOCO NO RESUMO quando o envio falha. Sem isto o leitor de tela não fica
     sabendo de nada: a página não navegou, e o texto novo apareceu longe do
     ponto de foco. O resumo tem tabIndex -1 para poder receber foco por
     script sem entrar na ordem do Tab.

     E FOCO NA CONFIRMAÇÃO quando dá certo, pelo mesmo motivo e com a mesma
     técnica. No sucesso o <form> DESMONTA — e o elemento que tinha o foco (o
     botão de enviar) some junto. Sem este foco, ele caía no <body>: o
     próximo Tab recomeçava do topo da página, e quem usa leitor de tela
     ficava sem saber onde estava. */
  useEffect(() => {
    if (visivel.estado === "erro" || visivel.estado === "falha") resumoRef.current?.focus();
    else if (visivel.estado === "sucesso") sucessoRef.current?.focus();
  }, [visivel]);

  /* ⚠ PROVISÓRIO — ver o bloco A ENTREGA É POR WHATSAPP no topo do arquivo.

     `preventDefault` é o que tira a Server Action do caminho quando há script.
     Sem script esta função não roda, e o POST nativo vai para a action — os
     dois destinos e o porquê estão documentados lá em cima. */
  function aoEnviar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    const dados = new FormData(evento.currentTarget);
    const ler = (c: string) => {
      const x = dados.get(c);
      return typeof x === "string" ? x.trim() : "";
    };
    const valores: ValoresContato = {
      nome: ler("nome"),
      whatsapp: ler("whatsapp"),
      email: ler("email"),
      ambiente: dados.getAll("ambiente").filter((x): x is string => typeof x === "string"),
      estagio: ler("estagio"),
      mensagem: ler("mensagem"),
      consentimento: dados.get("consentimento") === "sim",
    };

    /* A MESMA validação da action. Ver app/contato/estado.ts. */
    const erros = validar(valores, { ambientes: opcoesAmbiente, estagios: opcoesEstagio }, dados);
    const resumo = resumoDeErros(erros);
    if (resumo) {
      setEstadoTeste({ estado: "erro", erros, resumo, valores });
      /* ⚠ O LINK DE RECUPERAÇÃO SAI JUNTO. Se um envio anterior teve o pop-up
         bloqueado, o aviso guarda a URL DAQUELE pedido. A pessoa corrige o
         telefone, erra outro campo e envia: sem esta linha, o aviso ficava na
         tela com o link montado com o telefone ANTIGO — e quem clicasse
         mandaria para a LDF um pedido que já não é o que está no formulário.
         Com erro, não há pedido válido para oferecer. */
      setUrlBloqueada(null);
      return;
    }

    /* `whatsappUrl` já é `https://wa.me/<contato.whatsapp>` — o mesmo endereço
       do rodapé e do cartão. Só o `?text=` é daqui. */
    const url = `${whatsappUrl}?text=${encodeURIComponent(mensagemWhatsApp(valores))}`;

    /* ══ O RETORNO DE `window.open` É VERIFICADO, E ANTES NÃO ERA ══

       O defeito: a chamada acontecia e a linha seguinte marcava sucesso sem
       olhar o resultado. Com o pop-up bloqueado, `window.open` devolve `null`,
       nenhuma aba abria, e a tela dizia "Projeto recebido!". O pedido sumia e
       a pessoa ia embora achando que tinha enviado — o pior desfecho que este
       formulário pode ter, porque ele não deixa rastro nenhum do outro lado.

       AS TRÊS CHECAGENS SÃO NECESSÁRIAS, e cada uma cobre um navegador
       diferente: `null` é o caso comum; `undefined` aparece em ambientes
       embutidos que não implementam o retorno; e uma janela que nasce com
       `closed === true` é o que alguns bloqueadores devolvem no lugar de
       `null` — abrem e fecham no mesmo quadro. */
    const janela = window.open(url, "_blank", "noopener,noreferrer");
    if (!janela || janela.closed) {
      setUrlBloqueada(url);
      /* SEM sucesso. O formulário fica na tela, com os valores intactos: a
         pessoa clica no link, ou aperta Enviar de novo — o segundo toque
         costuma passar, porque aí o navegador tem um gesto recente. */
      return;
    }

    setUrlBloqueada(null);

    /* ══ `form_lead` DISPARA AQUI — E NO LINK DE RECUPERAÇÃO, MAIS NADA ══

       Depois da validação, depois do antispam e depois de a janela do WhatsApp
       ter ABERTO de verdade — a checagem acima já descartou o pop-up
       bloqueado. Quando o pop-up é bloqueado, o pedido sai pelo outro ponto:
       o link "Abrir o WhatsApp" do aviso, que empurra o mesmo `form_lead` no
       clique. São os dois únicos lugares em que o pedido realmente sai.

       ⚠ NÃO SUBA ESTA LINHA. Disparar antes do `window.open` contaria como
       lead todo envio que o bloqueador de pop-up matou, e esses são
       exatamente os que NÃO chegaram na LDF — o relatório mostraria
       conversão onde houve perda.

       ⚠ E NÃO DISPARA `whatsapp_click` AQUI. O ouvinte global do
       MedicaoCliques.tsx cobre os três links de WhatsApp do site; este envio
       é o `form_lead`. Contar os dois faria cada lead aparecer duas vezes, e
       a soma dos eventos deixaria de ser o total de contatos.

       O CAMINHO SEM JAVASCRIPT NÃO É MEDIDO: lá a Server Action responde com
       `redirect()`, o navegador troca de página e nenhum script roda. Está
       registrado no topo de lib/dataLayer.ts.

       Passa por `medirLead`, e não direto por `empurrarEvento`: se este mesmo
       pedido já saiu pelo link de recuperação, ele não conta de novo. */
    medirLead(url);

    setEstadoTeste({ estado: "sucesso", erros: {}, resumo: null, valores: ESTADO_INICIAL.valores });
  }

  const v = visivel.valores;
  const erro = visivel.erros;

  const enviado = visivel.estado === "sucesso";
  const falhou = visivel.estado === "erro" || visivel.estado === "falha";

  /* ══ SUCESSO: o formulário SAI e a confirmação entra no lugar ══

     Nada de navegar para outra rota — a pessoa perderia o contexto e o botão
     Voltar reenviaria o formulário — e nada de alert(), que é um diálogo do
     navegador e não parte da página.

     ⚠ A REGIÃO VIVA ESTÁ SEMPRE MONTADA, E SÓ O CONTEÚDO DELA TROCA.

     A versão anterior devolvia um <div role="status"> que NASCIA já com o
     texto dentro. Região viva que nasce cheia não é anunciada de forma
     confiável: o leitor de tela registra a região quando ela aparece e só
     fala o que MUDA depois disso — e ali nada mudava, tudo chegava junto. O
     contêiner abaixo existe desde a primeira renderização, vazio, e o que
     entra nele no sucesso é uma mudança de verdade.

     Vazio e sem classe, ele não ocupa espaço: a coluna do formulário é bloco
     simples, sem `gap`, e um <div> sem conteúdo tem altura zero.

     O FOCO vai para o bloco de dentro (`sucessoRef`, tabIndex -1), não para
     o contêiner: é o bloco que tem desenho, e é o anel dele que quem enxerga
     precisa ver. */
  return (
    <>
      <div role="status" aria-live="polite">
        {enviado ? (
          <div className="form__sucesso" tabIndex={-1} ref={sucessoRef}>
            <p className="form__sucesso-titulo">Projeto recebido!</p>
            <p className="form__sucesso-texto">
              A gente responde em até um dia útil. Se for urgente, chama no WhatsApp — o número
              está logo abaixo.
            </p>
          </div>
        ) : null}
      </div>

      {enviado ? null : (
    <form className="form" action={acao} onSubmit={aoEnviar} noValidate>
      {/* ══ HONEYPOT ══
          Fora da tela pela classe, invisível para leitor de tela pelo
          aria-hidden, fora do Tab pelo tabIndex -1 e ignorado pelo
          preenchimento automático. Gente não chega nele por nenhum caminho;
          robô que lê o HTML e completa tudo, sim. A action descarta em
          silêncio — ver o comentário lá. */}
      <div className="form__isca" aria-hidden="true">
        <label htmlFor={campo("site")}>Não preencha este campo</label>
        <input id={campo("site")} name="site" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <input type="hidden" name="carimbo" value={carimbo} />

      {/* O RESUMO DE ERROS, no topo e antes de tudo. É o que dá ao leitor de
          tela a notícia de que o envio falhou; sem ele, a única pista seria
          visual. `role="alert"` anuncia na hora. */}
      {falhou && visivel.resumo ? (
        <div className="form__resumo" role="alert" tabIndex={-1} ref={resumoRef}>
          {visivel.resumo}
        </div>
      ) : null}

      {/* ══ O POP-UP FOI BLOQUEADO ══

          `role="alert"` porque é notícia que interrompe: a pessoa acha que
          enviou e não enviou. O link carrega a MESMA url que a janela teria
          aberto, com a mensagem inteira dentro — nada precisa ser redigitado.

          Fica ACIMA do formulário e não no lugar dele: o pedido continua na
          tela, então tentar de novo é apertar o botão. */}
      {urlBloqueada ? (
        <div className="form__bloqueado" role="alert">
          <p className="form__bloqueado-titulo">O WhatsApp não abriu.</p>
          <p className="form__bloqueado-texto">
            O navegador bloqueou a janela. Seu pedido está pronto — abra a conversa pelo link
            abaixo, com a mensagem já escrita.
          </p>
          {/* ⚠ ESTE CLIQUE É UM LEAD, NÃO UM `whatsapp_click`.

              É o mesmo pedido que o envio teria entregado, só que pela mão da
              pessoa em vez da janela que o navegador bloqueou. Por isso ele
              empurra `form_lead` — e o `data-medicao="form"` é o que faz o
              ouvinte global do MedicaoCliques.tsx IGNORAR este link, que
              senão o contaria como clique avulso de WhatsApp, por ser um
              <a> de wa.me como os outros três. */}
          <a
            className="form__bloqueado-link"
            href={urlBloqueada}
            target="_blank"
            rel="noopener noreferrer"
            data-medicao="form"
            onClick={() => medirLead(urlBloqueada)}
          >
            Abrir o WhatsApp
          </a>
        </div>
      ) : null}

      <div className="form__campo">
        <label className="form__rotulo" htmlFor={campo("nome")}>
          Nome
        </label>
        <input
          className="form__entrada"
          id={campo("nome")}
          name="nome"
          type="text"
          autoComplete="name"
          required
          /* O TETO CRU, e não o máximo de conteúdo (80). A folga deixa caber
             um nome colado com espaço nas pontas — o trim tira, e o servidor
             segue exigindo 2..80 no que sobra. Os três `maxLength` deste
             formulário leem a MESMA constante que o `validar()` usa no
             servidor, para não poderem divergir. */
          maxLength={TETO_CRU.nome}
          defaultValue={v.nome}
          aria-invalid={erro.nome ? true : undefined}
          aria-describedby={erro.nome ? erroId("nome") : undefined}
        />
        {erro.nome ? (
          <p className="form__erro" id={erroId("nome")}>
            {erro.nome}
          </p>
        ) : null}
      </div>

      <div className="form__campo">
        <label className="form__rotulo" htmlFor={campo("whatsapp")}>
          WhatsApp
        </label>
        {/* `inputMode="tel"` levanta o teclado numérico no celular sem exigir
            máscara — e máscara pediria dependência, que não entra. */}
        <input
          className="form__entrada"
          id={campo("whatsapp")}
          name="whatsapp"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
          maxLength={TETO_CRU.whatsapp}
          placeholder="(11) 90000-0000"
          defaultValue={v.whatsapp}
          aria-invalid={erro.whatsapp ? true : undefined}
          aria-describedby={erro.whatsapp ? erroId("whatsapp") : undefined}
        />
        {erro.whatsapp ? (
          <p className="form__erro" id={erroId("whatsapp")}>
            {erro.whatsapp}
          </p>
        ) : null}
      </div>

      <div className="form__campo">
        <label className="form__rotulo" htmlFor={campo("email")}>
          E-mail
        </label>
        <input
          className="form__entrada"
          id={campo("email")}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          maxLength={TETO_CRU.email}
          defaultValue={v.email}
          aria-invalid={erro.email ? true : undefined}
          aria-describedby={erro.email ? erroId("email") : undefined}
        />
        {erro.email ? (
          <p className="form__erro" id={erroId("email")}>
            {erro.email}
          </p>
        ) : null}
      </div>

      {/* GRUPO 4 — múltipla escolha, checkbox por baixo das pastilhas.

          ══ O ERRO DO GRUPO VAI EM CADA INPUT, E NÃO SÓ NO FIELDSET ══

          `aria-invalid` não é suportado em fieldset (papel `group`): o leitor
          de tela ignorava, e quem tabulava para uma pastilha ouvia "Cozinha,
          caixa de seleção" sem saber que o grupo estava com erro. Agora cada
          input do grupo carrega `aria-invalid` e aponta, por
          `aria-describedby`, para a MESMA mensagem — só enquanto o grupo
          estiver com erro. O fieldset mantém o `aria-describedby`, para quem
          navega pelo grupo inteiro.

          O input é o controle real mesmo escondido: a pastilha o cobre com
          `opacity: 0` (seção de pastilhas da folha), não com `display: none`. */}
      <fieldset
        className="form__grupo"
        aria-describedby={erro.ambiente ? erroId("ambiente") : undefined}
      >
        <legend className="form__rotulo">Ambiente</legend>
        <p className="form__ajuda">Pode marcar mais de um.</p>
        <div className="form__pastilhas">
          {opcoesAmbiente.map((op) => (
            <label className="form__pastilha" key={op}>
              <input
                type="checkbox"
                name="ambiente"
                value={op}
                defaultChecked={v.ambiente.includes(op)}
                aria-invalid={erro.ambiente ? true : undefined}
                aria-describedby={erro.ambiente ? erroId("ambiente") : undefined}
              />
              <span>{op}</span>
            </label>
          ))}
        </div>
        {erro.ambiente ? (
          <p className="form__erro" id={erroId("ambiente")}>
            {erro.ambiente}
          </p>
        ) : null}
      </fieldset>

      {/* GRUPO 5 — escolha única, radio por baixo. O erro vai em cada input
          pelo mesmo motivo do grupo 4, logo acima. */}
      <fieldset
        className="form__grupo"
        aria-describedby={erro.estagio ? erroId("estagio") : undefined}
      >
        <legend className="form__rotulo">Estágio da obra</legend>
        <div className="form__pastilhas">
          {opcoesEstagio.map((op) => (
            <label className="form__pastilha" key={op}>
              <input
                type="radio"
                name="estagio"
                value={op}
                defaultChecked={v.estagio === op}
                aria-invalid={erro.estagio ? true : undefined}
                aria-describedby={erro.estagio ? erroId("estagio") : undefined}
              />
              <span>{op}</span>
            </label>
          ))}
        </div>
        {erro.estagio ? (
          <p className="form__erro" id={erroId("estagio")}>
            {erro.estagio}
          </p>
        ) : null}
      </fieldset>

      <div className="form__campo">
        <label className="form__rotulo" htmlFor={campo("mensagem")}>
          Mensagem <span className="form__opcional">(opcional)</span>
        </label>
        <textarea
          className="form__entrada form__area"
          id={campo("mensagem")}
          name="mensagem"
          rows={4}
          maxLength={1000}
          defaultValue={v.mensagem}
          aria-invalid={erro.mensagem ? true : undefined}
          aria-describedby={erro.mensagem ? erroId("mensagem") : undefined}
        />
        {erro.mensagem ? (
          <p className="form__erro" id={erroId("mensagem")}>
            {erro.mensagem}
          </p>
        ) : null}
      </div>

      {/* ══ CONSENTIMENTO ══
          Caixa separada, e ANTES do botão. Consentimento embutido no ato de
          enviar ("ao enviar você concorda") não é consentimento: não há ato
          próprio, e não dá para enviar sem concordar sem querer.

          ══ O LINK DA POLÍTICA CHEGOU, E FICA FORA DA DECLARAÇÃO ══

          O TODO que morava aqui — "o texto não tem link porque a política ainda
          não existe" — está fechado: /politica-de-privacidade nasceu, e o
          registro completo está em lib/dados.ts, junto de `consentimento`.

          O LINK NÃO ENTROU NO MEIO DO TEXTO DA CAIXA, e é decisão. O que está
          dentro do <label> é a DECLARAÇÃO que a pessoa assina; misturar nela um
          link é misturar o que se aceita com onde se lê sobre isso — e, em
          termos práticos, é pôr um alvo de clique que navega para fora dentro
          do alvo de clique que marca a caixa. Quem erra o alvo perde o
          formulário preenchido.

          A linha abaixo é a saída: mesmo bloco, fora do rótulo, alcançável pelo
          Tab logo depois da caixa. */}
      <div className="form__consentimento">
        <label className="form__aceite">
          <input
            type="checkbox"
            name="consentimento"
            value="sim"
            defaultChecked={v.consentimento}
            aria-invalid={erro.consentimento ? true : undefined}
            aria-describedby={erro.consentimento ? erroId("consentimento") : undefined}
          />
          <span>{consentimento.texto}</span>
        </label>
        {erro.consentimento ? (
          <p className="form__erro" id={erroId("consentimento")}>
            {erro.consentimento}
          </p>
        ) : null}
        <p className="form__nota-politica">
          Quais dados, por quanto tempo e como pedir para apagar:{" "}
          <Link href="/politica-de-privacidade">Política de Privacidade</Link>.
        </p>
      </div>

      <BotaoRevelar
        tipo="submit"
        pendente={pendente}
        rotulo={pendente ? NOME_DO_ESTADO_ENVIANDO : "Enviar projeto"}
      />
    </form>
      )}
    </>
  );
}
