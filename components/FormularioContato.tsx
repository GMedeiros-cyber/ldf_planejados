"use client";

import Link from "next/link";
import { useActionState, useEffect, useId, useRef, useState } from "react";

import BotaoRevelar from "./BotaoRevelar";
import { consentimento, opcoesAmbiente, opcoesEstagio } from "@/lib/dados";
import { enviarContato } from "@/app/contato/actions";
import { ESTADO_INICIAL } from "@/app/contato/estado";

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

export default function FormularioContato() {
  const [estado, acao, pendente] = useActionState(enviarContato, ESTADO_INICIAL);

  /* Ids estáveis entre servidor e cliente, para o aria-describedby de cada
     campo. `useId` existe exatamente para isso — string fixa daria colisão se
     o formulário aparecesse duas vezes na página. */
  const id = useId();
  const campo = (n: string) => `${id}-${n}`;
  const erroId = (n: string) => `${id}-${n}-erro`;

  const resumoRef = useRef<HTMLDivElement>(null);

  /* O CARIMBO É ESCRITO NO CLIENTE, na montagem. Não pode vir do servidor: a
     rota é estática, então o valor seria a hora do build — igual para todo
     mundo e velho de horas. Sem JS ele fica vazio e a action PULA a checagem,
     em vez de reprovar; o porquê está escrito lá. */
  const [carimbo, setCarimbo] = useState("");
  useEffect(() => setCarimbo(String(Date.now())), []);

  /* FOCO NO RESUMO quando o envio falha. Sem isto o leitor de tela não fica
     sabendo de nada: a página não navegou, e o texto novo apareceu longe do
     ponto de foco. O resumo tem tabIndex -1 para poder receber foco por
     script sem entrar na ordem do Tab. */
  useEffect(() => {
    if (estado.estado === "erro" || estado.estado === "falha") resumoRef.current?.focus();
  }, [estado]);

  const v = estado.valores;
  const erro = estado.erros;

  /* ══ SUCESSO: o formulário SAI e a confirmação entra no lugar ══

     Em região `aria-live="polite"` com `role="status"`, para o leitor de tela
     anunciar sem interromper. Nada de navegar para outra rota — a pessoa
     perderia o contexto e o botão Voltar reenviaria o formulário — e nada de
     alert(), que é um diálogo do navegador e não parte da página. */
  if (estado.estado === "sucesso") {
    return (
      <div className="form__sucesso" role="status" aria-live="polite">
        <p className="form__sucesso-titulo">Projeto recebido!</p>
        <p className="form__sucesso-texto">
          A gente responde em até um dia útil. Se for urgente, chama no WhatsApp — o número
          está logo abaixo.
        </p>
      </div>
    );
  }

  const falhou = estado.estado === "erro" || estado.estado === "falha";

  return (
    <form className="form" action={acao} noValidate>
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
      {falhou && estado.resumo ? (
        <div className="form__resumo" role="alert" tabIndex={-1} ref={resumoRef}>
          {estado.resumo}
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
          maxLength={80}
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

      {/* GRUPO 4 — múltipla escolha, checkbox por baixo das pastilhas. */}
      <fieldset
        className="form__grupo"
        aria-invalid={erro.ambiente ? true : undefined}
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

      {/* GRUPO 5 — escolha única, radio por baixo. */}
      <fieldset
        className="form__grupo"
        aria-invalid={erro.estagio ? true : undefined}
        aria-describedby={erro.estagio ? erroId("estagio") : undefined}
      >
        <legend className="form__rotulo">Estágio da obra</legend>
        <div className="form__pastilhas">
          {opcoesEstagio.map((op) => (
            <label className="form__pastilha" key={op}>
              <input type="radio" name="estagio" value={op} defaultChecked={v.estagio === op} />
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
  );
}
