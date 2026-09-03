import Link from "next/link";
import Logo from "./Logo";
import FundoMadeira from "./FundoMadeira";

/* Faixa de fechamento: três elementos centrados — logo, frase, botão. A lede
   e os dois botões antigos saíram de propósito: o fim da página faz um pedido
   só, não três.

   A MADEIRA FRIA é daqui, e só daqui. Ela já foi contínua por trás da Fábrica
   também, e por isso não havia divisa entre as duas seções — dividiam a mesma
   superfície. Agora a Fábrica é escura como o resto da página e a troca de
   material faz a divisão sozinha: nenhuma régua, nenhuma linha.

   "Só daqui" vale para ESTE arquivo de textura, e não para o material. Existe
   uma segunda madeira no site, mais quente, na `.chamada` de /contato — a
   escolha entre as duas é medida, e a conta está na seção 15 da folha. As duas
   dividem o mesmo <FundoMadeira />; o que as separa são duas variáveis CSS.

   O desenho do fundo mora no FundoMadeira, uma camada absoluta dentro desta
   seção — mesmo arranjo do FundoAuralis na História e no Processo.

   ══ ESTE BLOCO FECHA DUAS ROTAS: A HOME E /ambientes ══

   Foi só da home por duas rodadas, enquanto /ambientes fechava com o
   <ChamadaMadeira />. O cliente viu aquilo no ar e preferiu este — a volta é
   decisão dele, não conserto de defeito. O registro completo da reversão está
   no topo de app/ambientes/page.tsx.

   O <ChamadaMadeira /> NÃO foi apagado, e não é substituído por este
   componente: ele é a capa de /contato. Os dois são blocos de madeira e
   dividem a mesma camada de fundo, mas este traz o id="contato" e um <Link>
   para /contato, e aquele traz o botão de revelação. Fundir os dois é decisão
   a tomar quando o formulário existir e o id sair daqui — não antes.

══ O id="contato" SAIU, E A MIGRAÇÃO ACONTECEU ══

   Este bloco teve `id="contato"` desde sempre, e era o alvo das três âncoras
   "/#contato" do site — Nav 22, Nav 157 e Footer 7. O id NÃO EXISTE MAIS, em
   nenhuma das duas páginas onde este componente aparece.

   O motivo é que ele ficou sem ninguém apontando para ele. A migração estava
   adiada com um gatilho escrito: aconteceria "quando o formulário existir". O
   formulário existe, em app/contato, então os três links passaram a apontar
   para a rota "/contato" e o id virou um alvo que nada endereça.

   ID SEM LINK DE ENTRADA É LIXO QUE PARECE CONTRATO. Quem o encontrasse
   depois teria de descobrir sozinho se algo ainda depende dele — e a resposta
   estaria espalhada por três arquivos. Sai agora, junto com a migração que o
   aposentou, que é o único momento em que a remoção é obviamente segura.

   O <Link> para "/contato" logo abaixo continua, e agora é o QUARTO caminho
   até a rota, ao lado dos três do menu e do rodapé. Ele não dependia do id e
   não muda.

   ⚠ SE UMA ÂNCORA "#contato" VOLTAR A APARECER em algum lugar, ela não vai
   resolver — não há mais o que casar. O certo é apontar para "/contato".

   A lista de quem apontava para cá encolheu: o bloco comercial e a página da
   cozinha, que também citavam este id, não existem mais. */

export default function Fechamento() {
  return (
    <section className="fechamento" aria-labelledby="t-cta">
      <FundoMadeira />

      <div className="fechamento__conteudo wrap">
        <Logo className="fechamento__marca" />

        <h2 className="fechamento__frase" id="t-cta">
          Manda a planta.
          <br />A gente desenha.
        </h2>

        {/* A rota existe. TODO: o formulário — ver o bloco no topo do arquivo
            para o que a chegada dele destrava. */}
        <Link className="btn btn--contorno" href="/contato">
          Enviar projeto
        </Link>
      </div>
    </section>
  );
}
