"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Script from "next/script";

/* O banner de consentimento, e o lugar ÚNICO de onde o Google Tag Manager
   entra no site.

   ══⚠══ O GTM NÃO ESTÁ NO <head>, E ISSO É DELIBERADO ══⚠══

   O trecho que o Google publica manda pôr o snippet "o mais alto possível" no
   <head>. Aqui ele carrega DEPOIS do aceite, e a razão não é técnica, é legal:

     1. A LGPD não aceita o padrão de carregar e "esperar". Quando o gtm.js
        roda, o container já pode gravar cookie e já fez requisição ao Google —
        e nesse ponto o consentimento virou formalidade, porque o que ele
        deveria impedir já aconteceu.

     2. A política de privacidade deste site PROMETE isso por escrito, na
        seção "Cookies": "o banner aparece antes de qualquer script novo
        rodar". Carregar no <head> tornaria a frase falsa no dia do deploy.

   O preço é real e está medido: o GTM perde os primeiros instantes da visita,
   e eventos disparados antes do aceite não chegam a ele. O `dataLayer` é um
   array comum — os pushes feitos antes ficam na fila e o GTM os processa ao
   carregar —, mas para quem RECUSA eles nunca são processados. Ou seja: o
   número que o GTM mostra é o de quem consentiu, e não o total. É o que a
   lei pede.

   ══ O IFRAME DE <noscript> NÃO EXISTE AQUI, E NÃO É ESQUECIMENTO ══

   Aquele iframe serve para medir quem navega sem JavaScript. Mas sem
   JavaScript não há banner, não há localStorage e não há como pedir
   consentimento — então o iframe mediria exatamente as pessoas de quem nunca
   se pediu permissão. Sem script não há o que consentir, e por isso também
   não há o que carregar.

   ══ O ID VEM DO AMBIENTE ══

   `NEXT_PUBLIC_GTM_ID`. Com a variável vazia NADA acontece: sem script e sem
   banner, porque sem medição não há o que consentir. É o que mantém o
   desenvolvimento limpo e o que torna a medição desligável sem deploy de
   código.

   ⚠ PRECISA ESTAR DEFINIDA NA VERCEL, senão o site vai ao ar sem medir nada e
   sem avisar ninguém. */

const CHAVE = "ldf-consentimento";
const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

type Escolha = "aceito" | "recusado";

/* Lê a escolha guardada. Devolve `null` tanto para "nunca respondeu" quanto
   para "não consegui ler" — navegação privada e armazenamento bloqueado fazem
   o acesso LANÇAR, e um throw aqui derrubaria o layout inteiro. Sem conseguir
   ler, o certo é perguntar de novo, nunca presumir aceite. */
function lerEscolha(): Escolha | null {
  try {
    const v = localStorage.getItem(CHAVE);
    return v === "aceito" || v === "recusado" ? v : null;
  } catch {
    return null;
  }
}

function gravarEscolha(v: Escolha) {
  try {
    localStorage.setItem(CHAVE, v);
  } catch {
    /* Sem armazenamento, a escolha vale só para esta visita. Perguntar de novo
       na próxima é o comportamento correto — o contrário seria tratar silêncio
       como consentimento. */
  }
}

/* Apaga os cookies que o GA4 grava pelo GTM. São de PRIMEIRA parte, no nosso
   domínio, então o JavaScript da página alcança: `_ga` e `_ga_<ID>` (dois
   anos), `_gid` (24h).

   O apagamento tenta dois domínios porque o GA grava no domínio raiz: o host
   atual e o mesmo host com ponto na frente. Cookie que não existe ignora a
   escrita, então tentar os dois não tem custo nem efeito colateral. */
function apagarCookiesDeMedicao() {
  const alvos = document.cookie
    .split(";")
    .map((c) => c.split("=")[0].trim())
    .filter((n) => n.startsWith("_ga") || n === "_gid");

  const raiz = location.hostname.replace(/^www\./, "");

  for (const nome of alvos) {
    for (const dominio of ["", `; domain=${raiz}`, `; domain=.${raiz}`]) {
      document.cookie = `${nome}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${dominio}`;
    }
  }
}

export default function Consentimento() {
  /* `null` = ainda não li o armazenamento. O primeiro render do servidor e o
     da hidratação precisam ser IGUAIS, e o servidor não tem localStorage —
     então ninguém decide nada antes do efeito rodar. */
  const [escolha, setEscolha] = useState<Escolha | null>(null);
  const [perguntando, setPerguntando] = useState(false);
  const painel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gtmId) return;
    const guardada = lerEscolha();
    if (guardada) setEscolha(guardada);
    else setPerguntando(true);
  }, []);

  /* ══ A ALTURA DO BANNER VIRA VARIÁVEL CSS, E É O QUE RESOLVE A COLISÃO ══

     O <Zap /> é `position: fixed` no canto inferior direito, e este banner é
     fixo na base: nas rotas sem herói — /ambientes, /contato e a política — o
     botão verde aparece de imediato e os dois disputam o mesmo canto.

     A folha sobe o botão em `calc(var(--zap-piso) + var(--banner-altura))`
     enquanto o banner está na tela. A altura é MEDIDA, e não um valor por
     breakpoint: o texto reflui em larguras estreitas e um número cravado
     erraria exatamente onde o espaço é mais curto. O ResizeObserver mantém a
     conta certa enquanto a janela muda de tamanho. */
  useEffect(() => {
    const el = painel.current;
    if (!perguntando || !el) return;

    const medir = () =>
      document.documentElement.style.setProperty("--banner-altura", `${el.offsetHeight}px`);

    medir();
    const obs = new ResizeObserver(medir);
    obs.observe(el);

    /* O foco vai para o banner. É intrusivo de propósito: quem navega por
        teclado ou leitor de tela precisa encontrar a pergunta ANTES do
        conteúdo, senão responde a uma decisão que já foi tomada por omissão.
        O `role="dialog"` com `aria-modal="false"` diz que é uma pergunta, sem
        prender a navegação no resto da página. */
    el.focus();

    return () => {
      obs.disconnect();
      document.documentElement.style.removeProperty("--banner-altura");
    };
  }, [perguntando]);

  const responder = useCallback((v: Escolha) => {
    gravarEscolha(v);
    setEscolha(v);
    setPerguntando(false);
    if (v === "recusado") apagarCookiesDeMedicao();
  }, []);

  /* Esc FECHA SEM RESPONDER, e não é o mesmo que recusar. Nada é gravado,
     nada carrega, e a pergunta volta na próxima visita. Tratar Esc como
     recusa definitiva seria ler um gesto de "sai da frente" como decisão
     sobre dados pessoais; tratar como aceite seria pior. */
  const aoTeclar = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") setPerguntando(false);
  };

  if (!gtmId) return null;

  return (
    <>
      {escolha === "aceito" && (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`}
        </Script>
      )}

      {perguntando && (
        <div
          className="consent"
          ref={painel}
          role="dialog"
          aria-modal="false"
          aria-labelledby="consent-titulo"
          aria-describedby="consent-texto"
          tabIndex={-1}
          onKeyDown={aoTeclar}
        >
          <div className="consent__texto">
            <p className="consent__titulo" id="consent-titulo">
              Pode medir sua visita?
            </p>
            <p id="consent-texto">
              A gente usa o Google Analytics para saber quais páginas as pessoas procuram. Se
              você recusar, nada é instalado e nenhum dado seu sai daqui.{" "}
              <Link href="/politica-de-privacidade#cookies">Ver o que fica gravado</Link>.
            </p>
          </div>

          {/* ══ OS DOIS BOTÕES TÊM O MESMO PESO, E ISSO É REQUISITO ══

              Mesma classe, mesmo tamanho, mesma borda, mesmo contraste. Um
              "Recusar" em letra menor, cinza ou escondido atrás de "mais
              opções" descaracteriza o consentimento: a escolha precisa ser
              igualmente fácil nos dois sentidos, senão não é livre.

              Recusar vem PRIMEIRO no DOM. Quem chega por teclado alcança a
              opção que não instala nada antes da que instala. */}
          <div className="consent__acoes">
            <button type="button" className="consent__botao" onClick={() => responder("recusado")}>
              Recusar
            </button>
            <button type="button" className="consent__botao" onClick={() => responder("aceito")}>
              Aceitar
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* O controle de revogação, renderizado pela política de privacidade.

   A política precisa dizer como voltar atrás, e "limpe os cookies no seu
   navegador" é empurrar o trabalho para quem não tem como fazê-lo. Aqui a
   revogação é um botão: apaga a escolha, apaga os cookies do GA e recarrega a
   página — o GTM não volta porque não há mais consentimento guardado.

   ⚠ MORA NESTE ARQUIVO, e não num componente próprio, porque compartilha a
   chave de armazenamento e a função de apagar cookie com o banner. Separar
   criaria duas cópias do nome `ldf-consentimento`, e a que ninguém olha é a
   que envelhece.

   ELE SE ESCONDE QUANDO NÃO HÁ NADA A REVOGAR. Sem medição configurada, ou
   para quem nunca aceitou, o botão não aparece: oferecer "revogar" a quem não
   consentiu é oferecer uma ação sem efeito. */
export function BotaoRevogarConsentimento() {
  const [escolha, setEscolha] = useState<Escolha | null>(null);

  useEffect(() => setEscolha(lerEscolha()), []);

  if (!gtmId || escolha !== "aceito") return null;

  return (
    <p>
      <button
        type="button"
        className="consent__botao"
        onClick={() => {
          try {
            localStorage.removeItem(CHAVE);
          } catch {
            /* Se não dá para remover, também não deu para gravar — não havia
               consentimento persistido. Apagar o cookie e recarregar ainda é a
               coisa certa a fazer. */
          }
          apagarCookiesDeMedicao();
          location.reload();
        }}
      >
        Revogar meu consentimento
      </button>
    </p>
  );
}
