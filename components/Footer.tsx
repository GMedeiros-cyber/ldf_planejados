import Link from "next/link";
import Logo from "./Logo";
import { contato, creditos, empresa, whatsappUrl } from "@/lib/dados";
import { menu } from "@/lib/menu";

/* O rodapé. Um bloco de identificação à esquerda, três colunas de links à
   direita, a assinatura gravada, e a barra de base.

   ══ O QUE SAIU NESTA RODADA, E POR QUÊ ══

   1. A COLUNA "AMBIENTES". Listava os quatro ambientes, e os quatro apontavam
      para /ambientes — o mesmo destino, quatro vezes, ocupando uma coluna
      inteira. Não é escolha: é uma lista que perdeu o sentido quando a rota
      por ambiente (/ambientes/cozinha) foi apagada e o `a.href ?? "/ambientes"`
      virou "/ambientes" fixo. Quem quer os ambientes clica em Ambientes, que
      está no Menu.

   2. A COLUNA "INSTITUCIONAL", com "A LDF" (/#fabrica) e "Como funciona"
      (/#processo). Virou o Menu, que agora lê `menu` de lib/menu.ts — a MESMA
      lista da barra do topo, e não uma segunda lista que diverge dela.

   3. A RAZÃO SOCIAL E O CNPJ da barra de base.

      ⚠ ELES NÃO FORAM ESQUECIDOS. Os dois REAPARECEM na política de
      privacidade, em /politica-de-privacidade, onde são obrigatórios: a LGPD
      exige que o controlador dos dados esteja identificado, e razão social mais
      CNPJ é como se identifica uma pessoa jurídica. Ali eles informam; aqui
      eram só duas linhas de cadastro no pé de toda página do site. Quem
      procurar por eles acha, e acha no lugar onde eles significam algo.

   O ENDEREÇO, ESSE, FICA — e fica de propósito. É SINAL DE SEO LOCAL: NAP
   (nome, endereço, telefone) consistente e presente em todas as páginas é um
   dos sinais que o Google usa para ranquear negócio físico em busca com
   intenção local. A LDF vive de "móveis planejados em Guarulhos"; tirar o
   endereço do rodapé para deixar o bloco mais limpo seria trocar posição em
   busca por estética. O endereço aparece duas vezes no site — aqui e no cartão
   de /contato — e as duas leem de `contato`, então não podem divergir.

   ══ TIPOGRAFIA: A DA PÁGINA, NÃO UMA ESCALA DE RODAPÉ ══

   Rótulos de coluna no degrau `.label`, links no corpo de texto da folha. O
   que o rodapé declarava só para si saiu do CSS — a lista do que foi removido
   está na seção do rodapé em globals.css. */

/* A frase curta sobre a LDF. É CONDENSAÇÃO de `historia` e do terceiro slide
   do herói ("Sem revenda no meio"), não afirmação nova: fábrica própria em
   Guarulhos e ausência de intermediário são fatos que o site já sustenta em
   outros três lugares. Fica inline, e não no dados.ts, porque é COPY deste
   bloco — não é dado que outro componente vá querer ler. */
const SOBRE =
  "Fábrica própria em Guarulhos. O móvel sai de onde foi desenhado, sem revenda no meio.";

/* Instagram, Facebook e Google, todos de `contato`. A lista existe para o JSX
   não repetir três vezes a mesma âncora com `target` e `rel`. */
const social = [
  { href: contato.instagram, texto: "Instagram" },
  { href: contato.facebook, texto: "Facebook" },
  { href: contato.google, texto: "Google" },
];

export default function Footer() {
  /* Ano do COPYRIGHT. Avaliado na renderização — e como todas as rotas são
     estáticas, na prática é o ano do build. É o comportamento certo: um número
     escrito à mão envelhece em silêncio no dia 1º de janeiro, e este se corrige
     sozinho a cada publicação. */
  const ano = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="wrap footer__grid">
        <div className="footer__identificacao">
          <Logo className="footer__marca" />

          <p className="footer__sobre">{SOBRE}</p>

          {/* NAP completo: nome (a marca acima), endereço e telefone. Ver a
              nota de SEO local no topo antes de mexer. */}
          <div>
            <h3 className="label" id="rodape-fabrica">
              Fábrica e loja
            </h3>
            <address className="footer__endereco" aria-labelledby="rodape-fabrica">
              {contato.endereco.rua}
              <br />
              {contato.endereco.bairro}
              <br />
              {contato.endereco.cep}
              <br />
              <br />
              <a href={whatsappUrl} target="_blank" rel="noopener">
                {contato.whatsappExibicao}
              </a>
              <br />
              <a href={`mailto:${contato.email}`}>{contato.email}</a>
              <br />
              <br />
              {contato.horario}
            </address>
          </div>
        </div>

        {/* UM landmark de navegação para as três colunas, e cada lista amarrada
            ao seu rótulo por aria-labelledby: o leitor de tela anuncia "Menu,
            lista de 3 itens" em vez de três listas anônimas seguidas. */}
        <nav className="footer__navegacao" aria-label="Rodapé">
          <div className="footer__coluna">
            <h3 className="label" id="rodape-menu">
              Menu
            </h3>
            <ul aria-labelledby="rodape-menu">
              {menu.map((i) => (
                <li key={i.href}>
                  <Link href={i.href}>{i.texto}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__coluna">
            <h3 className="label" id="rodape-social">
              Social
            </h3>
            <ul aria-labelledby="rodape-social">
              {social.map((s) => (
                <li key={s.texto}>
                  <a href={s.href} target="_blank" rel="noopener">
                    {s.texto}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__coluna">
            <h3 className="label" id="rodape-legal">
              Legal
            </h3>
            <ul aria-labelledby="rodape-legal">
              <li>
                {/* Era um <span> morto — texto de link sem link. A rota existe
                    desde esta rodada, e o TODO do lib/dados.ts que registrava a
                    pendência está fechado. */}
                <Link href="/politica-de-privacidade">Política de Privacidade</Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      {/* Ornamento, não conteúdo: o nome da empresa está na barra de base logo
          abaixo. Fica fora da árvore de acessibilidade e fora do ponteiro. */}
      <img
        className="footer__assinatura"
        src="/assinatura-ldf.png"
        width={2630}
        height={607}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
      />

      {/* A barra de base: copyright à esquerda, crédito à direita. */}
      <div className="wrap footer__base">
        <p className="footer__copyright">
          © {ano} {empresa.nomeFantasia}
        </p>
        <a href={creditos.url} target="_blank" rel="noopener">
          Design e site por {creditos.autor}
        </a>
      </div>
    </footer>
  );
}
