import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { contato, empresa, politica } from "@/lib/dados";

export const metadata: Metadata = {
  title: "Política de Privacidade — LDF Planejados",
  description:
    "Quem trata os seus dados, o que o formulário coleta, para quê, por quanto tempo e como exercer seus direitos. Este site não usa cookies.",
};

/* A política de privacidade. Um documento, não uma página de campanha.

   ══ NENHUM DADO DA EMPRESA ESTÁ ESCRITO AQUI ══

   Razão social, CNPJ, endereço, e-mail, prazos de retenção e a data desta
   versão vêm todos de lib/dados.ts. É a mesma regra do resto do site, e aqui
   ela pesa mais: um CNPJ digitado à mão numa página legal que ninguém relê é
   exatamente o tipo de erro que só aparece quando alguém precisa dele.

   O QUE MORA AQUI é o texto corrido. Ele não é dado — é redação, e redação
   pertence à rota que a exibe.

   ══ POR QUE O RODAPÉ PERDEU A RAZÃO SOCIAL E O CNPJ ══

   Eles estavam na barra de base do <Footer />, em todas as páginas do site, e
   saíram nesta mesma rodada. Não foi esquecimento: a LGPD exige que o
   CONTROLADOR esteja identificado, e é aqui que essa identificação significa
   alguma coisa. No rodapé eram duas linhas de cadastro; aqui são a resposta à
   pergunta "quem é que está com os meus dados".

   ══⚠══ TODO GRANDE — GOOGLE ANALYTICS ══⚠══

   A SEÇÃO "Cookies" DESTA PÁGINA AFIRMA QUE O SITE NÃO GRAVA NENHUM COOKIE.
   Hoje é verdade, e foi verificado: nenhuma rota carrega analytics, tag
   manager, pixel ou script de terceiro, e as fontes entram por
   next/font/google, que baixa os arquivos no build e os serve do próprio
   domínio — sem requisição ao Google em execução.

   O CLIENTE VAI INSTALAR GOOGLE ANALYTICS depois da revisão do site. No dia em
   que isso acontecer, TRÊS COISAS ENTRAM NO MESMO COMMIT:

     1. o banner de consentimento, com recusa tão fácil quanto o aceite, e o
        script do GA disparando SÓ depois do aceite;
     2. a reescrita da seção #cookies aqui, dizendo quais cookies, de quem,
        para quê e por quanto tempo;
     3. a remoção da afirmação "este site não usa cookies", que passa a ser
        falsa no segundo em que o script subir.

   GA NO AR COM ESTA PÁGINA DIZENDO "NÃO USAMOS COOKIES" É DECLARAÇÃO FALSA EM
   DOCUMENTO LEGAL. Ou os três entram juntos, ou o GA não sobe. O mesmo aviso
   está em lib/dados.ts, junto de `politica`.

   ══ HIERARQUIA ══

   Um <h1> só, o título do documento. Cada seção é <h2> com id — ancorável, e
   escrito para responder à dúvida de quem chegou ("Por quanto tempo vocês
   guardam") em vez de classificar juridicamente ("Do prazo de retenção"). */

/* A data de exibição é DERIVADA de `politica.atualizadaEm`, que é a única
   fonte. `Date.UTC` mais `timeZone: "UTC"` evitam a armadilha clássica: uma
   data ISO sem hora é interpretada como meia-noite UTC, e formatada num
   servidor a oeste de Greenwich ela recua um dia. */
function dataPorExtenso(iso: string) {
  const [ano, mes, dia] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(ano, mes - 1, dia)));
}

export default function PaginaPolitica() {
  const enderecoCompleto = `${contato.endereco.rua}, ${contato.endereco.bairro}, ${contato.endereco.cep}`;

  return (
    <>
      <Nav />
      <main>
        <section className="legal" aria-labelledby="t-politica">
          <div className="wrap legal__coluna">
            <header className="legal__cabecalho">
              <h1 className="h2 manchete-serifada" id="t-politica">
                Política de Privacidade
              </h1>
              <p className="lede">
                O que a LDF faz com o que você escreve no formulário deste site: quais dados,
                para quê, com quem, por quanto tempo — e o que você pode exigir a respeito.
              </p>
              <span className="label legal__data">
                Última atualização em{" "}
                <time dateTime={politica.atualizadaEm}>
                  {dataPorExtenso(politica.atualizadaEm)}
                </time>
              </span>
            </header>

            <section className="legal__secao" id="controlador">
              <h2 className="h3">Quem está com os seus dados</h2>
              <p>
                Quem decide o que é feito com os seus dados — o <strong>controlador</strong>, no
                vocabulário da LGPD — é a empresa abaixo. É para ela que você reclama, e é dela
                que você cobra.
              </p>
              <address className="legal__controlador">
                {empresa.razaoSocial}
                <br />
                CNPJ <span className="num">{empresa.cnpj}</span>
                <br />
                {enderecoCompleto}
                <br />
                <br />
                <a href={`mailto:${contato.email}`}>{contato.email}</a>
              </address>
              <p className="paragrafo-secundario">
                Qualquer pedido sobre os seus dados — ver, corrigir, apagar, revogar — vai para
                esse e-mail. Não existe formulário separado nem canal especial: é o mesmo
                endereço que responde o resto.
              </p>
            </section>

            <section className="legal__secao" id="dados">
              <h2 className="h3">Que dados a gente coleta</h2>
              <p>
                Só o que o formulário de contato pede, e nada além. Quando você envia um pedido
                de projeto, chegam até a LDF:
              </p>
              <ul className="legal__lista">
                <li>seu nome;</li>
                <li>seu WhatsApp;</li>
                <li>seu e-mail;</li>
                <li>os ambientes que você marcou como de interesse;</li>
                <li>o estágio em que a obra está;</li>
                <li>a mensagem, quando você escreve uma — o campo é opcional;</li>
                <li>a data e a hora do envio.</li>
              </ul>
              <p>
                Não pedimos CPF, RG, dado de pagamento nem o endereço da sua obra. Se algum
                desses for necessário mais adiante, será pedido diretamente a você, na conversa,
                e não por este site.
              </p>
            </section>

            <section className="legal__secao" id="para-que">
              <h2 className="h3">Para que a gente usa</h2>
              <p>
                Para duas coisas, e as duas são o que você esperaria de quem pediu um orçamento:
              </p>
              <ul className="legal__lista">
                <li>
                  <strong>Responder ao seu pedido de projeto</strong> — entender o que você quer
                  fazer, tirar dúvidas, combinar a medição no local e apresentar o projeto.
                </li>
                <li>
                  <strong>Fazer contato comercial sobre esse projeto</strong> — retomar a
                  conversa se ela parar, avisar de prazo e falar de condições.
                </li>
              </ul>
              <p>
                Não usamos os seus dados para perfilamento, não montamos público de anúncio com
                eles e não decidimos nada sobre você de forma automatizada.
              </p>
            </section>

            <section className="legal__secao" id="base-legal">
              <h2 className="h3">Com que direito a gente trata</h2>
              <p>
                São duas bases legais diferentes, e elas valem separadamente — essa separação é o
                que garante que você não perca uma coisa ao recusar a outra.
              </p>
              <ul className="legal__lista">
                <li>
                  <strong>Responder ao seu pedido:</strong> procedimentos preliminares de
                  contrato, a pedido do titular — art. 7º, V da LGPD. Você pediu um orçamento; a
                  LDF precisa dos seus dados para dar esse orçamento. Aqui não há consentimento a
                  dar nem a revogar: é o que você foi lá fazer.
                </li>
                <li>
                  <strong>Contato comercial depois disso:</strong> consentimento — art. 7º, I da
                  LGPD. É a caixa que você marca no formulário, e é só ela.
                </li>
              </ul>
              <p>
                <strong>
                  Revogar o consentimento não cancela a resposta ao seu pedido.
                </strong>{" "}
                Se você pedir para parar de receber contato comercial, a LDF para — e continua
                devendo, e entregando, a resposta ao orçamento que você solicitou. São coisas
                separadas de propósito.
              </p>
            </section>

            {/* ══ O CAMINHO DO LEAD, CONFIRMADO ══

                CONFIRMADO PELO CLIENTE: o pedido vai para o WhatsApp da LDF —
                o mesmo número de `contato.whatsapp`. O destino é da LDF, e não
                um repositório de terceiro.

                Por isso a Tribus Labs NÃO é nomeada como operadora aqui. Ela
                desenvolve e mantém as páginas; o pedido não fica armazenado do
                lado dela. Nomeá-la como operadora seria descrever um tratamento
                que não acontece.

                HOJE O TEXTO ABAIXO DESCREVE O CAMINHO INTEIRO, sem sobra. Com
                `LEAD_WEBHOOK_URL` vazia — e ela está vazia em todo o
                repositório —, os DOIS caminhos do formulário terminam no
                WhatsApp da LDF: com script o componente abre o wa.me, sem
                script a Server Action redireciona para o mesmo endereço. Não há
                terceiro no meio, e não há nada armazenado fora do WhatsApp.

                Foi por isso que o fluxo automatizado saiu daqui. Por duas
                rodadas este comentário nomeava um fluxo n8n como o destino
                pendente; o cliente adiou a automação e a ferramenta virou
                decisão em aberto. Descrever ferramenta que ninguém contratou é
                descrever tratamento que não acontece.

                ⚠ TODO — RECONFERIR QUANDO `LEAD_WEBHOOK_URL` FOR PREENCHIDA.

                No dia em que houver um webhook, o pedido passa a trafegar por
                ele ANTES do WhatsApp, e aí há um intermediário a declarar. O
                PRODUCT.md registra hospedagem e propriedade desse sistema como
                pendência comercial em aberto. Olhe o host da variável:

                  domínio da LDF / VPS do cliente  → este texto está certo.
                  infraestrutura da Tribus Labs    → o pedido TRAFEGA por ela,
                    ela vira operadora no sentido do art. 5º, VII, e o <li> do
                    desenvolvedor tem de ser trocado por este:

                      <li>
                        <strong>Prestador de tecnologia.</strong> O formulário
                        entrega o seu pedido a um fluxo automatizado operado
                        pela Tribus Labs, que desenvolve e mantém este site. Ela
                        atua como <strong>operadora</strong>: trata os dados por
                        conta e ordem da LDF, seguindo instruções dela, e não
                        pode usá-los para finalidade própria.
                      </li>

                Não é detalhe de redação: é a diferença entre o documento
                descrever o caminho dos dados certo ou errado. */}
            <section className="legal__secao" id="compartilhamento">
              <h2 className="h3">Com quem a gente compartilha</h2>
              <p>
                O seu pedido não é vendido, alugado nem cedido a ninguém. Ele passa apenas por
                quem precisa tocá-lo para que a LDF consiga responder:
              </p>
              <ul className="legal__lista">
                <li>
                  <strong>Plataforma de mensageria.</strong> O formulário entrega o seu pedido a
                  um fluxo automatizado que o encaminha para o WhatsApp da própria LDF. O
                  WhatsApp é da Meta, e da primeira mensagem em diante a conversa acontece dentro
                  dessa plataforma, sujeita também à política de privacidade dela.
                </li>
                <li>
                  <strong>Quem desenvolve o site.</strong> A Tribus Labs desenvolve e mantém
                  estas páginas. O seu pedido não fica armazenado do lado dela: do formulário ele
                  segue para o WhatsApp da LDF, e é lá que a conversa acontece.
                </li>
                <li>
                  <strong>Hospedagem.</strong> As páginas e o processamento do formulário rodam
                  na infraestrutura do provedor de hospedagem contratado, que registra o acesso
                  como qualquer servidor web faz.
                </li>
              </ul>
              <p>
                Fora esses três, ninguém. Não há rede de publicidade, corretora de dados nem
                parceiro comercial recebendo o seu contato.
              </p>
            </section>

            <section className="legal__secao" id="prazo">
              <h2 className="h3">Por quanto tempo a gente guarda</h2>
              <ul className="legal__lista">
                <li>
                  <strong>Se você pediu orçamento e não fechou:</strong>{" "}
                  {politica.retencaoLeadMeses} meses, contados do último contato entre nós.
                  Depois disso o dado é eliminado.
                </li>
                <li>
                  <strong>Se você virou cliente:</strong> {politica.retencaoClienteAnos} anos,
                  contados da entrega dos móveis.
                </li>
              </ul>
              <p>
                Os {politica.retencaoClienteAnos} anos não são um número redondo escolhido por
                comodidade: são exatamente o prazo da garantia que a LDF dá nas madeiras. Durante
                todo o período em que a empresa pode ser acionada por um projeto, ela precisa
                conseguir dizer de quem era esse projeto, o que foi executado e quando. Guardar
                menos que a garantia seria não ter como honrar a garantia.
              </p>
            </section>

            <section className="legal__secao" id="direitos">
              <h2 className="h3">Os seus direitos, e como usar</h2>
              <p>
                O art. 18 da LGPD te dá o seguinte, sobre os dados que a LDF tem a seu respeito:
              </p>
              <ul className="legal__lista">
                <li>
                  <strong>Confirmação</strong> — saber se existe algum tratamento dos seus dados.
                </li>
                <li>
                  <strong>Acesso</strong> — ver quais dados a LDF tem.
                </li>
                <li>
                  <strong>Correção</strong> — consertar dado incompleto, inexato ou
                  desatualizado.
                </li>
                <li>
                  <strong>Anonimização, bloqueio ou eliminação</strong> — de dado desnecessário,
                  excessivo ou tratado fora da lei.
                </li>
                <li>
                  <strong>Portabilidade</strong> — receber os seus dados em formato que dê para
                  levar a outro fornecedor.
                </li>
                <li>
                  <strong>Eliminação</strong> — apagar os dados tratados com base no seu
                  consentimento.
                </li>
                <li>
                  <strong>Informação sobre compartilhamento</strong> — saber com que entidades
                  públicas e privadas a LDF compartilhou os seus dados.
                </li>
                <li>
                  <strong>Revogação do consentimento</strong> — a qualquer momento, sem
                  justificar, e sem perder a resposta ao pedido que você fez.
                </li>
              </ul>
              <p>
                Para exercer qualquer um deles, escreva para{" "}
                <a href={`mailto:${contato.email}`}>{contato.email}</a>. Diga qual direito você
                quer exercer e o nome e o e-mail que você usou no formulário — é o que permite
                achar o seu registro. A LDF responde em até 15 dias.
              </p>
            </section>

            <section className="legal__secao" id="cookies">
              <h2 className="h3">Cookies: este site não usa</h2>
              <p className="legal__destaque">
                Este site não grava nenhum cookie no seu navegador. Nenhum, nem os chamados
                &ldquo;essenciais&rdquo;.
              </p>
              <p>
                Não há Google Analytics, não há gerenciador de tags, não há pixel de rede social
                e não há script de terceiro em nenhuma página. As fontes tipográficas são
                baixadas na hora em que o site é publicado e servidas do nosso próprio domínio —
                então nem o Google Fonts recebe uma requisição sua ao abrir estas páginas.
              </p>
              <p>
                É por isso que você não vê banner de cookies aqui. Não existe um porque não há o
                que consentir. Se isso mudar, esta seção muda junto e no mesmo dia, e o banner
                aparece antes de qualquer script novo rodar.
              </p>
            </section>

            <section className="legal__secao" id="mudancas">
              <h2 className="h3">Se esta política mudar</h2>
              <p>
                A data no topo desta página é a da versão vigente. Mudança que altere o que é
                coletado, para quê ou com quem é compartilhado vem acompanhada de nova data — e,
                quando depender do seu consentimento, de um novo pedido de consentimento, não de
                um aviso.
              </p>
              <p className="paragrafo-secundario">
                Dúvida sobre qualquer coisa aqui:{" "}
                <a href={`mailto:${contato.email}`}>{contato.email}</a>, ou pelos canais da{" "}
                <Link href="/contato">página de contato</Link>.
              </p>
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
