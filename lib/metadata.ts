import type { Metadata } from "next";

import { contato, empresa, siteUrl } from "./dados";

/* O montador de metadata das rotas. UM lugar define o que é igual em todas;
   cada rota declara só o que é dela.

   ══ POR QUE ISTO NÃO MORA NO lib/dados.ts ══

   É a mesma separação do lib/menu.ts, por um motivo parecido mas não igual.

   O dados.ts é CONTEÚDO: o que a empresa é, o que ela vende, o que está
   escrito no site. Não sabe que existe Next, não importa tipo de framework
   nenhum, e é assim que ele consegue ser lido por servidor e cliente sem
   arrastar nada junto.

   Isto aqui é MONTAGEM: pega o conteúdo e o arruma no formato que o Next
   espera. Precisa do `import type { Metadata } from "next"` — e enfiar esse
   import no dados.ts amarraria a fonte única de conteúdo ao framework, para
   servir a um único consumidor entre dezenas.

   A divisão que sobra é limpa: dados.ts guarda, menu.ts navega, metadata.ts
   monta. Os três leem do primeiro; nenhum reexporta o outro.

   ══ O BUG QUE ESTE ARQUIVO EXISTE PARA FECHAR ══

   O layout.tsx declarava `alternates: { canonical: "/" }` e `openGraph.url:
   "/"`, e as rotas-filhas não sobrescreviam. O Next herda — então /ambientes,
   /contato e /politica-de-privacidade declaravam a HOME como canônica delas.

   Isso não é sinal ambíguo. É uma instrução clara e errada ao buscador: "esta
   página é cópia da home, não a indexe". Três das quatro rotas pediam para
   sair do índice, em silêncio, enquanto o sitemap as entregava.

   ⚠ POR QUE UM HELPER, E NÃO O BLOCO REPETIDO EM CADA ROTA

   Porque o merge de metadata do Next é SHALLOW, e está documentado como tal
   (node_modules/next/dist/docs — generate-metadata.md, seção "Merging"):
   campo aninhado declarado na filha SUBSTITUI o da raiz inteiro, não funde.

   Ou seja: bastava escrever `openGraph: { url: "/ambientes" }` na rota para
   perder `images`, `type`, `locale` e `siteName` de uma vez — e perder a
   `images` é o link de WhatsApp indo sem foto, que é o formato em que este
   site mais circula. O jeito de a rota ter `url` próprio é redeclarar o bloco
   COMPLETO, e quatro cópias do bloco completo são quatro lugares para a
   próxima alteração esquecer um.

   ⚠ ROTA NOVA: chame `metadataDaRota()` e acabou. Não copie bloco de outra
   rota, e não declare `openGraph` ou `twitter` à mão em página nenhuma. */

/* A imagem de compartilhamento. UM lugar, lido pelo Open Graph e pelo Twitter.

   1200×630 é a medida que WhatsApp e Facebook recortam sem cortar nada. JPEG,
   e não WebP: o WebP passa no navegador, mas os leitores de link ainda tratam
   mal — e este é o formato em que o site mais circula.

   O caminho é relativo de propósito. O `metadataBase` do layout.tsx resolve
   para o domínio absoluto na hora de emitir a tag; escrever o domínio aqui
   seria a segunda cópia dele, e o lib/dados.ts diz que só existe uma. */
const imagemSocial = {
  url: "/og.jpg",
  width: 1200,
  height: 630,
  alt: "Cozinha planejada da LDF",
} as const;

type Rota = {
  /* O caminho da rota, com barra na frente: "/" ou "/ambientes". É ele que
     vira a canônica e o og:url, resolvidos contra o metadataBase. */
  caminho: string;
  titulo: string;
  descricao: string;
  /* OPCIONAL, e serve para uma coisa só: quando a descrição que o buscador lê
     precisa ser diferente da que o WhatsApp mostra.

     Os dois orçamentos de texto não são o mesmo. O Google corta perto de 155
     caracteres; a prévia de link do WhatsApp mostra bem menos que isso. Uma
     descrição escrita para caber na busca pode chegar truncada na conversa.

     Sem este campo, o social herda a `descricao` — que é o certo como padrão.
     Quem passa hoje é só a home, e é para PRESERVAR um texto que já existia:
     ela sempre teve uma versão mais curta no Open Graph. Não é invenção desta
     refatoração, e está aqui para não ser achatada por ela. */
  descricaoSocial?: string;
};

/* Monta o objeto de metadata completo de uma rota.

   Devolve `title`, `description`, a canônica e os blocos `openGraph` e
   `twitter` inteiros. O `twitter` sai daqui derivado, e não escrito à mão:
   ele repetia título e descrição em todas as rotas, e repetição à mão é a
   divergência esperando a primeira alteração que só lembre de um dos dois. */
export function metadataDaRota({ caminho, titulo, descricao, descricaoSocial }: Rota): Metadata {
  const social = descricaoSocial ?? descricao;

  return {
    title: titulo,
    description: descricao,
    alternates: { canonical: caminho },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      siteName: empresa.nomeFantasia,
      url: caminho,
      title: titulo,
      description: social,
      images: [imagemSocial],
    },
    twitter: {
      card: "summary_large_image",
      title: titulo,
      description: social,
      images: [imagemSocial.url],
    },
  };
}

/* ══════════════════════════════════════════════════════════════════════════
   DADOS ESTRUTURADOS — O NEGÓCIO LOCAL (JSON-LD)
   ══════════════════════════════════════════════════════════════════════════

   O que o Google precisa para entender que existe uma marcenaria física em
   Guarulhos, com endereço, horário e telefone — e não só um site que fala de
   móveis. Para quem vive de busca local, é a diferença entre aparecer no mapa
   e não aparecer.

   ══ POR QUE ISTO MORA AQUI, E NÃO NO layout.tsx ══

   Pela divisão que este arquivo já estabeleceu: dados.ts guarda, menu.ts
   navega, metadata.ts MONTA. Isto é montagem — pega o que o dados.ts guarda e
   arruma no vocabulário do schema.org, do mesmo jeito que o metadataDaRota()
   arruma no vocabulário do Next.

   O layout.tsx só IMPRIME. Se o objeto fosse escrito lá, o arquivo que existe
   para montar a árvore da página passaria a ser também o que decide o que é
   `addressRegion` — e o próximo campo de schema entraria no meio do JSX.

   ⚠ NADA AQUI É VALOR ESCRITO À MÃO. Tudo vem do dados.ts. Se você está
   prestes a digitar um endereço, um telefone ou um horário neste arquivo,
   pare: o campo já existe lá, ou precisa passar a existir lá.

   ══ POR QUE NÃO É next/script ══

   Porque `afterInteractive` injeta a tag DEPOIS da hidratação, e o rastreador
   quer o dado no HTML que o servidor entregou. Este objeto vira um <script>
   comum, renderizado no servidor pelo layout — sem biblioteca, sem hidratação,
   sem custo de JavaScript no cliente.

   ══ O TIPO: FurnitureStore ══

   Escolhido entre os três candidatos, e é uma decisão de precisão:

     LocalBusiness              certo, mas é o mínimo — descreve "negócio com
                                endereço", e não o que a LDF faz.
     HomeAndConstructionBusiness  é a família das EMPREITEIRAS, e os subtipos
                                que ela define são eletricista, encanador,
                                pintor, telhadista. Nenhum descreve a LDF, e
                                usar o pai abstrato seria MENOS específico que
                                a alternativa, não mais.
     FurnitureStore             o mais específico que o vocabulário oferece
                                para "vende móveis em ponto físico" — que é o
                                que o endereço, o horário comercial e a placa
                                de "Fábrica e loja" descrevem.

   FurnitureStore herda de LocalBusiness, então todos os campos que interessam
   (address, openingHoursSpecification, telephone, areaServed) continuam
   válidos. A fabricação própria não desqualifica: a loja existe, tem porta,
   endereço e horário — e é ela que a busca local procura.

   ══ O QUE FALTA, E POR QUE FALTA ══

   ⚠ TODO — A FICHA DO GOOGLE NO `sameAs`.

   O `contato.google` de hoje é uma URL de BUSCA
   (`google.com/search?q=ldf+planejados`), e não o perfil da empresa. Para o
   `sameAs` vale o link direto da ficha do Google Business Profile — aquele que
   abre o painel com fotos, avaliações e rota.

   A busca NÃO serve no lugar: `sameAs` afirma "esta é outra página oficial
   DESTA MESMA entidade", e uma página de resultados não é a entidade. Declarar
   a busca ali é afirmar algo falso ao rastreador.

   O link ainda não foi levantado. Quando for, ele entra no `contato` do
   dados.ts como um campo NOVO (o `google` atual continua servindo ao rodapé e
   ao <Avaliacoes />) e é acrescentado ao array abaixo.

   ⚠ TODO — A NOTA AGREGADA (`aggregateRating`) FICA DE FORA, E É DELIBERADO.

   Os 4,6 em 130 avaliações do lib/avaliacoes.ts são verdadeiros, e é tentador.
   Mas o Google exige duas coisas do `aggregateRating`: que a nota esteja
   VISÍVEL na página que carrega o schema, e que venha de avaliações que o
   PRÓPRIO SITE coleta.

   A nossa não cumpre a segunda: ela é do perfil do Google deles, coletada por
   terceiro. Declarar como nossa cai na definição de avaliação auto-declarada,
   e a punição para isso não é o rich result não aparecer — é ação manual no
   site inteiro.

   SÓ ENTRA se um dia a LDF coletar avaliação própria. Reaproveitar a nota do
   perfil aqui não é atalho; é risco assimétrico. */

/* Os nomes de dia do schema.org, na ordem ISO-8601 — o índice 0 não existe,
   porque o ISO começa a semana em 1 (segunda). O `contato.horarioEstruturado`
   guarda os números; a tradução para o vocabulário é aqui. */
const diasDoSchema = [
  "",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

const { diaInicio, diaFim, abre, fecha } = contato.horarioEstruturado;

const diasAbertos = Array.from(
  { length: diaFim - diaInicio + 1 },
  (_, i) => diasDoSchema[diaInicio + i],
);

export const jsonLdNegocioLocal = {
  "@context": "https://schema.org",
  "@type": "FurnitureStore",
  /* Identidade estável da entidade. Serve para que uma marcação futura —
     produto, avaliação, migalha de pão — consiga apontar para ESTE negócio em
     vez de descrever um novo do zero. */
  "@id": `${siteUrl}/#negocio`,
  name: empresa.nomeFantasia,
  legalName: empresa.razaoSocial,
  /* O CNPJ é identificador fiscal da entidade, e o schema.org tem campo para
     isso. Não é exigido pelo Google, e entra porque o dado já existe e amarra
     a ficha a uma pessoa jurídica real. */
  taxID: empresa.cnpj,
  url: siteUrl,
  /* O logotipo é o app/icon.svg — o mesmo vetor vermelho que serve de ícone da
     aba. Não há arquivo de logotipo em public/: o <Logo /> do site é SVG
     inline, e vetor dentro de componente não tem endereço que um rastreador
     consiga buscar. */
  logo: `${siteUrl}/icon.svg`,
  image: `${siteUrl}/og.jpg`,
  /* E.164, que é o formato que o schema espera: o `contato.whatsapp` já é
     55 + DDD + número, então o que falta é o "+". Sem segundo número escrito
     em lugar nenhum — é o mesmo que alimenta os cinco links de WhatsApp. */
  telephone: `+${contato.whatsapp}`,
  email: contato.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: contato.endereco.rua,
    /* De `empresa.cidade`, e não de um campo novo: é o mesmo Guarulhos, e
       duas cópias dele divergiriam. */
    addressLocality: empresa.cidade,
    addressRegion: contato.endereco.uf,
    postalCode: contato.endereco.cepNumero,
    addressCountry: contato.endereco.pais,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: diasAbertos,
      opens: abre,
      closes: fecha,
    },
  ],
  /* "Fabricação própria em Guarulhos, entrega garantida em São Paulo" — é o
     que o <Fabrica /> afirma na home, e o schema não pode prometer mais que a
     página. Duas cidades, não o estado inteiro. */
  areaServed: [
    { "@type": "City", name: empresa.cidade },
    { "@type": "City", name: "São Paulo" },
  ],
  sameAs: [contato.instagram, contato.facebook],
} as const;
