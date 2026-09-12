import type { Metadata } from "next";

import { empresa } from "./dados";

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
