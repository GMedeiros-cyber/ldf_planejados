/* Fonte única dos dados do site.
   Editar aqui muda todos os lugares onde o dado aparece. */

export const empresa = {
  nomeFantasia: "LDF Planejados",
  razaoSocial: "LDF Moveis Planejados Ltda — ME",
  cnpj: "57.951.247/0001-00",
  cidade: "Guarulhos",
} as const;

export const contato = {
  whatsapp: "5511947351488",
  whatsappExibicao: "(11) 94735-1488",
  email: "contato@ldfplanejados.com.br",
  endereco: {
    rua: "Av. Brigadeiro Faria Lima, 114",
    bairro: "Jardim Cocaia — Guarulhos/SP",
    cep: "CEP 07130-000",
  },
  horario: "Segunda a sábado, 9h–18h",
  instagram: "https://www.instagram.com/ldfplanejados",
  facebook: "https://web.facebook.com/LojadeFabricaMoveisPlanejados/",
  google: "https://www.google.com/search?q=ldf+planejados",
} as const;

export const whatsappUrl = `https://wa.me/${contato.whatsapp}`;

/* --- O endereço do site ----------------------------------------------------

   PRECISA SER ABSOLUTO, e é por isso que existe uma constante em vez de um
   caminho relativo espalhado pelo código. Três coisas só funcionam com o
   domínio inteiro: a URL canônica de cada rota, a imagem de compartilhamento
   (WhatsApp e Facebook baixam a foto de um endereço absoluto — com caminho
   relativo, o link vai sem imagem) e o sitemap.

   SEM BARRA NO FIM. O `new URL()` do metadataBase e o sitemap montam as rotas
   concatenando "/algo"; uma barra aqui viraria "//algo".

   ⚠ TROCAR AQUI SE O DOMÍNIO MUDAR. É o único lugar. */
export const siteUrl = "https://ldfplanejados.com.br";

/* --- O menu do site --------------------------------------------------------
   MORA EM lib/menu.ts, e não aqui. O <Nav /> é "use client", e importar deste
   arquivo arrastaria o catálogo inteiro do site para o grafo do navegador —
   medido: o conteúdo do dados.ts aparecia em três chunks de cliente com o
   import, e em um só sem ele. O porquê completo está naquele arquivo. */

/* Quem assinou o desenho e o código. Fica aqui, e não solto no JSX, pela
   mesma razão que o resto: um lugar só para editar. */
export const creditos = {
  autor: "Tribus Labs",
  /* Instagram, e não o domínio. `tribuslabs.com.br` era o endereço institucional;
     o perfil é o canal vivo, e é para onde o crédito do rodapé deve levar. */
  url: "https://www.instagram.com/tribus__labs/",
} as const;

/* --- Números da casa -------------------------------------------------------
   Confirmados pelo cliente. Não são estimativa nem arredondamento nosso. */

export const numeros = [
  { alvo: 1200, prefixo: "+", sufixo: "", rotulo: "Projetos entregues e montados" },
  { alvo: 15, prefixo: "+", sufixo: "", rotulo: "Anos de história" },
  { alvo: 5, prefixo: "", sufixo: "", rotulo: "Anos de garantia" },
] as const;

/* --- Acabamentos — SAÍRAM ---------------------------------------------------

   Eram seis: a cartela PROVISÓRIA que alimentava o <Amostrario />, a interação
   de vestir a peça com um acabamento. Ela ficou sem consumidor — a home deixou
   de montá-la —, e com ela caíram a `.mat` do globals.css, os seis blocos
   `[data-fin]` e o atributo no <body>.

   ⚠ A CARTELA REAL DA LDF CONTINUA PENDENTE (ver PRODUCT.md). Se ela chegar e
   a interação voltar, o bloco inteiro está no histórico do git — não precisa
   ser reescrito de memória. */

/* --- Ambientes ------------------------------------------------------------ */

/* Quatro ambientes, não oito. Closet, home office, área gourmet e lavanderia
   continuam sendo executados pela LDF — só não têm foto própria à altura, e
   por isso não ganham bloco com imagem aproximada.

   ⚠ ONDE ELES SÃO CITADOS MUDOU. Os textos do cliente que entraram em
   `texto` são sobre o ambiente principal, e os quatro secundários saíram do
   corpo: a lavanderia não é mais nomeada dentro da Cozinha, o closet saiu do
   Dormitório e a área gourmet saiu da Sala. O home office é o único que
   sobreviveu no corpo, como "o seu escritório", no Dormitório.

   QUEM OS NOMEIA AGORA É O `subline`, que segue trazendo LAVANDERIA, CLOSET,
   BANCADA DE TRABALHO e ÁREA GOURMET em caixa-alta acima de cada bloco. Se um
   dia o subline sair ou for reescrito, três dos quatro somem do site inteiro —
   e aí a decisão de não lhes dar bloco próprio precisa ser refeita.

   O BANHEIRO ESTÁ AQUI COM `fotos: []` DE PROPÓSITO. A única foto existente é
   print de story e, reenquadrada em 4:3, vira um close de duas gavetas. A
   página filtra por fotos.length > 0, então ele não renderiza. Mesmo tratamento
   que a Prova recebeu: o dado fica, a renderização espera material honesto.

   TODO: fotos de banheiro, e mais duas de sala — hoje ela tem uma só.
   TODO: closet, home office, área gourmet e lavanderia como blocos próprios,
   se e quando houver foto real de cada um.

   `fotos` é uma LISTA, e não um `img`: cada ambiente tem uma pilha de fotos
   trocadas por botão dentro do próprio bloco. Uma foto só é caso válido — a
   Sala — e nesse caso o bloco não mostra contador nem setas.

   O `alt` NÃO mora aqui de propósito: é montado no componente a partir de
   `nome` e `meta`, que já descrevem o que a foto mostra. Duplicar a descrição
   num terceiro campo é criar duas fontes para o mesmo fato, e a que ninguém
   olha é a que envelhece.

   NÃO HÁ MAIS `href`. O cliente deixou de querer página por ambiente, e a
   única que existia — /ambientes/cozinha — foi apagada. Nenhum bloco leva a
   lugar nenhum: a foto e o texto SÃO o conteúdo, não a chamada para ele. O
   rodapé continua listando os quatro, todos apontando para /ambientes. */

export const ambientes = [
  {
    nome: "Cozinha",
    meta: "Torre quente, gaveteiro, coifa e despensa",
    subline: "TORRE QUENTE · GAVETEIRO · DESPENSA · LAVANDERIA",
    texto:
      "O coração da casa bate na correria da manhã e no café fresco. Pensar nessa marcenaria vai muito além da estética e exige engenharia de rotina. Um projeto inteligente abraça o seu estilo de vida e otimiza a circulação sem gambiarras. Nós começamos o desenho entendendo os seus hábitos reais. Com base nisso, nossa fábrica entrega uma cozinha onde a beleza e a usabilidade caminham lado a lado.",
    fotos: [
      "/ambientes/cozinha-01.webp",
      "/ambientes/cozinha-02.webp",
      "/ambientes/cozinha-03.webp",
    ],
  },
  {
    nome: "Dormitório",
    meta: "Guarda-roupa, cabeceira e criado suspenso",
    subline: "GUARDA-ROUPA · CLOSET · BANCADA DE TRABALHO",
    texto:
      "O quarto deixou de ser apenas um lugar de repouso. Ele é o seu refúgio e muitas vezes o seu escritório. Tentar resolver essas funções com móveis soltos em espaços menores gera apenas aperto. A marcenaria planejada resolve o problema integrando tudo de forma harmônica. Guarda-roupas e mesas nascem desenhados para a geometria exata do ambiente. Criamos dormitórios que respiram espaço livre e entregam conforto para você recarregar as energias.",
    fotos: [
      "/ambientes/dormitorio-01.webp",
      "/ambientes/dormitorio-02.webp",
      "/ambientes/dormitorio-03.webp",
    ],
  },
  {
    nome: "Sala e living",
    meta: "Painel de TV, rack e estante",
    subline: "PAINEL DE TV · ESTANTE · ÁREA GOURMET",
    texto:
      "Os espaços de convivência são as áreas mais versáteis da casa reunindo descanso e lazer. Tratar esses ambientes múltiplos apenas como decoração ignora a necessidade de acomodar equipamentos e esconder fios soltos. Um projeto planejado trabalha nos bastidores para a beleza brilhar de forma contínua. Painéis, bancadas e estantes são calculados milimetricamente para desobstruir a passagem e integrar toda a rotina. Nós desenhamos o seu living unindo o design impecável com a funcionalidade pura.",
    fotos: ["/ambientes/sala-01.webp"],
  },
  {
    nome: "Banheiro",
    meta: "Gabinete, espelheira e nicho",
    subline: "GABINETE · ESPELHEIRA · NICHO",
    texto:
      "Ambiente pequeno em que cada centímetro é disputado com a hidráulica. O gabinete se resolve em torno do sifão, e não o contrário. A espelheira ganha profundidade onde a parede permite. O nicho entra na alvenaria e precisa ser decidido antes do revestimento — depois, vira quebra.",
    fotos: [],
  },
] as const;

export type Ambiente = (typeof ambientes)[number];

/* Proporção nativa das fotos de ambiente: deitado 4:3. Vai nos atributos width
   e height do <img> para o navegador reservar a caixa antes de baixar o
   arquivo — sem isso a lista salta a cada foto que chega. A caixa também
   reserva 4:3 por aspect-ratio no CSS; as duas dizem a mesma coisa por
   caminhos diferentes, e é de propósito: uma vale sem CSS, a outra sem os
   atributos. */
export const AMBIENTE_LARGURA = 1600;
export const AMBIENTE_ALTURA = 1200;

/* --- As onze etapas ------------------------------------------------------- */

export const etapas = [
  {
    titulo: "Contato inicial",
    texto:
      "Pelo WhatsApp, pelo site ou na loja. Aqui a gente entende qual ambiente é, para quando, e como você prefere ser atendido.",
  },
  {
    titulo: "Planta baixa ou medidas do ambiente",
    texto:
      "Serve a planta do apartamento, o projeto do arquiteto ou medidas tiradas por você. É o suficiente para começar a conversa.",
  },
  {
    titulo: "Medição no local",
    texto:
      "Essencial, e não tem substituto. Prumo, esquadro, ponto de água, ponto de luz e altura de forro decidem o que é possível de verdade.",
  },
  {
    titulo: "Desenvolvimento do projeto 3D",
    texto:
      "Distribuição dos módulos, alturas, cores, puxadores e acabamentos: o móvel desenhado no seu ambiente, não em um ambiente genérico.",
  },
  {
    titulo: "Apresentação do projeto",
    texto:
      "Por videochamada, em dia e horário combinados, ou presencial na loja. Você vê o projeto antes de ver qualquer valor.",
  },
  {
    titulo: "Aprovação do projeto",
    texto:
      "Ajustes até o desenho ficar do jeito que você quer. Mudar aqui não custa nada; mudar depois da produção custa.",
  },
  {
    titulo: "Orçamento completo",
    texto:
      "Com todas as especificações do que foi aprovado, módulo por módulo, acabamento por acabamento. Nada de valor por metro solto.",
  },
  {
    titulo: "Assinatura do projeto executivo",
    texto:
      "O marco que inicia o prazo. O executivo traz medidas, cores, acabamentos, puxadores, distâncias, data de aprovação, prazo de entrega e previsão de montagem.",
    marco: true,
  },
  {
    titulo: "Produção",
    texto: "Até 45 dias úteis, contados da assinatura. Feito na nossa fábrica, em Guarulhos.",
  },
  {
    titulo: "Entrega",
    texto: "Data combinada com antecedência por WhatsApp ou ligação.",
  },
  {
    titulo: "Montagem",
    texto:
      "Começa de 1 a 15 dias úteis depois da entrega. Nossa logística trabalha para deixar entrega e montagem o mais perto uma da outra.",
  },
] as const;

/* --- Os quatro estágios ----------------------------------------------------
   Agrupam as onze etapas acima para a home. O array `etapas` continua sendo a
   fonte completa.

   OS TEXTOS DE 01, 02 e 03 SÃO DO CLIENTE, e não mais a condensação literal
   que a agência tinha escrito. O que não mudou é a regra: NENHUM FATO NOVO
   entra aqui. Cada afirmação continua tendo origem numa etapa —
   prumo/esquadro/água/luz vêm da "Medição no local", o 3D antes do orçamento
   vem da "Apresentação", o orçamento módulo a módulo vem do "Orçamento
   completo", e o cronômetro que começa na assinatura é o marco do "projeto
   executivo".

   O 04 continua com o texto anterior, de propósito: ele carrega os dois
   números duros da operação — 45 dias úteis e 1 a 15 dias — e número não se
   reescreve por tom. */

export const estagios = [
  {
    n: "01",
    titulo: "Entender o ambiente",
    texto:
      "Sua planta inicia a conversa. Mas é a nossa medição no local que decide o jogo. Prumo, esquadro, água e luz: conferimos tudo para garantir perfeição milimétrica.",
    etapas: ["Contato inicial", "Planta ou medidas", "Medição no local"],
  },
  {
    n: "02",
    titulo: "Desenhar",
    texto:
      "Desenhamos o móvel no seu ambiente exato. Você visualiza o projeto em 3D antes de receber o orçamento, com liberdade para ajustar o que quiser.",
    etapas: ["Projeto 3D", "Apresentação", "Aprovação"],
  },
  {
    n: "03",
    titulo: "Fechar",
    texto:
      "Orçamento detalhado por módulo, sem estimativas vagas. Assinou o projeto executivo? O cronômetro da nossa fábrica começa a rodar.",
    etapas: ["Orçamento completo", "Assinatura do projeto executivo"],
    marco: true,
  },
  {
    n: "04",
    titulo: "Fabricar e montar",
    texto:
      "Até 45 dias úteis de produção na nossa fábrica em Guarulhos, entrega em data combinada e montagem começando de 1 a 15 dias úteis depois.",
    etapas: ["Produção", "Entrega", "Montagem"],
  },
] as const;

/* --- Ficha técnica --------------------------------------------------------
   Mantido fora da home. Os números (garantia de ferragens, prazo de produção,
   início da montagem) serão reaproveitados na página de contato ou em
   /ambientes. */

export const ficha = [
  {
    chave: "Garantia · madeiras",
    valor: "5",
    unidade: "anos",
    detalhe: "Inclui as assistências técnicas no período.",
  },
  {
    chave: "Garantia · ferragens",
    valor: "1",
    unidade: "ano",
    detalhe: "Corrediças, dobradiças e amortecedores.",
  },
  {
    chave: "Produção",
    valor: "45",
    unidade: "dias úteis",
    detalhe: "Prazo máximo, a partir da assinatura do projeto executivo.",
  },
  {
    chave: "Início da montagem",
    valor: "1–15",
    unidade: "dias úteis",
    detalhe: "Contados a partir da entrega dos móveis.",
  },
] as const;

/* --- Prova social: slots honestos — SAÍRAM ---------------------------------

   Eram três lacunas declaradas em tela — fotos de ambientes, depoimentos,
   fotos da fábrica —, mostradas pelo <Prova />, que a home parou de montar.

   AS TRÊS FORAM PREENCHIDAS DESDE ENTÃO, e é por isso que sair não custa
   nada: as obras estão em `obras`, logo abaixo, com foto local; a fábrica tem
   vídeo próprio na home; e as avaliações do Google estão em lib/avaliacoes.ts,
   na faixa antes do CTA. Uma lista de pendências que lista o que já está no ar
   não diz mais a verdade — e essa lista existia só para dizer a verdade.

   O que continua pendente são os DEPOIMENTOS assinados. Isso é registro de
   PRODUCT.md, não de tela: enquanto não chegam, o site não os menciona. */

/* --- Obras entregues -------------------------------------------------------

   ══ AS FOTOS SAÍRAM DO UNSPLASH E VIRARAM ARQUIVO LOCAL ══

   Até esta rodada os oito `img` eram URL de `images.unsplash.com`. O carrossel
   renderiza a lista em DUAS metades para fechar o laço, então eram dezesseis
   requisições a um servidor de terceiro em toda visita à home.

   O MOTIVO DE TIRAR NÃO É PESO — É O QUE A POLÍTICA PROMETE. A seção "Cookies:
   este site não usa", em /politica-de-privacidade, afirma com todas as letras
   que as fontes são servidas do nosso próprio domínio "então nem o Google
   Fonts recebe uma requisição sua ao abrir estas páginas". Enquanto estas oito
   vinham de fora, cada abertura da home mandava IP, User-Agent e Referer do
   visitante para um servidor nos Estados Unidos. Não gravava cookie, então a
   frase não era falsa — mas um site que se orgulha de não deixar ninguém
   receber nada estava deixando alguém receber dezesseis vezes. Agora são zero
   requisições externas, em qualquer rota.

   SÃO OS MESMOS BYTES QUE JÁ ESTAVAM NO AR. Cada URL foi baixada com os
   parâmetros exatos que estavam aqui — `w`, `h` e `crop` inclusive — e
   reencodada em WebP q82 só para tirar EXIF e normalizar qualidade. Nada foi
   reenquadrado: mexer no `crop` durante a migração mudaria o que oito cards
   mostram sem ninguém ter pedido. 886 kB de origem viraram 503 kB.

   ⚠ "COZINHA PLANEJADA" E "LAVANDERIA" SÃO A MESMA FOTO. Medido na migração:
   0,8 de 255 de diferença média por canal, ou seja, ruído de reencode. O
   `crop=top` da lavanderia não recortou nada porque o original já é 3:4, e o
   pedido devolveu o quadro inteiro — o comentário que morava aqui afirmava que
   os dois últimos itens tinham "recorte diferente", e para este não tinha. Os
   outros dois pares reusados são recortes de verdade: o banheiro difere 13,7
   do dormitório, e a sala difere 28,8 do home office.

   OS DOIS ARQUIVOS FICAM SEPARADOS mesmo sendo iguais hoje. Apontar as duas
   entradas para um caminho só economizaria 47 kB e criaria uma armadilha:
   quando a foto real de lavanderia chegar, ela trocaria os DOIS cards.

   ══ A LISTA HOJE É MISTA: 2 OBRAS REAIS E 7 DE BANCO ══

   As duas últimas entradas são obras da LDF, fotografadas e enviadas pelo
   cliente. As sete primeiras continuam sendo banco de imagem, e a seção que as
   exibe se chama "Trabalho que fala por nós", com aria-label "Obras
   entregues" — ou seja, sete dos nove cards ainda afirmam na tela algo que não
   é verdade. Tirar a requisição externa resolveu a privacidade; a veracidade
   só se resolve trocando foto.

   ══ ERA OITO, E UMA SAIU: A FOTO ESTAVA REPETIDA ══

   "Cozinha planejada" e "Lavanderia" apontavam para arquivos DIFERENTES com o
   MESMO conteúdo — 0,8 de 255 de diferença média por canal, medido. As duas
   URLs do Unsplash usavam o mesmo id e o `crop=top` de uma delas não recortou
   nada, porque o original já era 3:4. A entrada "Cozinha planejada" saiu, e
   com ela o arquivo `obra-cozinha-planejada.webp`. Ficou a Lavanderia, para a
   única "Cozinha" do carrossel ser a real.

   ⚠ E A FOTO QUE SOBROU É UM QUARTO. Cama, espelho de corpo inteiro, criado-
   mudo e um quadro na parede — nada de lavanderia, e nada de marcenaria além
   do criado-mudo, que é móvel solto. O `nome` é oculto-visual, então ninguém
   LÊ "Lavanderia" na tela; quem recebe a informação errada é leitor de tela,
   pelo `alt`. Entra na conta das sete que precisam trocar.

   Não coloquei nada no lugar: o carrossel é gerado por `obras.map()`, então a
   lista mais curta não deixa buraco — os nove cards se redistribuem e o laço
   continua fechando, porque a metade é `max-content`.

   ⚠ A ORDEM IMPORTA E É PROVISÓRIA. As reais entraram no FIM porque o
   carrossel corre em laço e não tem começo visível — não há posição de honra
   a disputar. Quando as de banco saírem, a ordem passa a ser escolha de
   edição, e não resto de migração.

   Nos oito de banco, os nomes são tipos de ambiente e não obras específicas —
   nenhum cliente, endereço ou condomínio é citado, porque nenhum foi
   informado. Nas duas reais o nome descreve o ambiente executado.

   TODO: substituir img, nome e alt das SETE PRIMEIRAS por obras da LDF. */

export const obras = [
  {
    nome: "Dormitório",
    sigla: "DR",
    img: "/obras/obra-dormitorio.webp",
    alt: "Quarto com cabeceira planejada e luminária de apoio.",
  },
  {
    nome: "Sala e living",
    sigla: "SL",
    img: "/obras/obra-sala-living.webp",
    alt: "Sala de estar com painel e estante planejados.",
  },
  {
    nome: "Home office",
    sigla: "HO",
    img: "/obras/obra-home-office.webp",
    alt: "Bancada de trabalho integrada à marcenaria do ambiente.",
  },
  {
    nome: "Closet",
    sigla: "CL",
    img: "/obras/obra-closet.webp",
    alt: "Módulos abertos de closet com prateleiras e gaveteiro.",
  },
  {
    nome: "Área gourmet",
    sigla: "AG",
    img: "/obras/obra-area-gourmet.webp",
    alt: "Área gourmet com bancada de apoio e armários inferiores.",
  },
  {
    nome: "Lavanderia",
    sigla: "LV",
    img: "/obras/obra-lavanderia.webp",
    alt: "Armário alto de lavanderia com portas lisas.",
  },
  {
    nome: "Banheiro",
    sigla: "BN",
    img: "/obras/obra-banheiro.webp",
    alt: "Gabinete de banheiro com espelheira e nicho.",
  },
  /* ══ AS DUAS PRIMEIRAS OBRAS DE VERDADE ══

     Estas duas são LDF: fotografadas em obra entregue, enviadas pelo cliente.
     As oito acima continuam sendo banco de imagem — a seção segue mista até o
     resto do material chegar, e é por isso que o TODO no topo deste bloco não
     foi fechado.

     Vêm em 900×1661, que é 0,5418 contra os 0,5419 do quadro 291:537. Recorte
     nenhum foi preciso: o `object-fit: cover` do `.obra__quadro img` não tem o
     que descartar nesta proporção.

     O `alt` descreve o que se vê, e não o que se vende. Quem chega por leitor
     de tela recebe a mesma informação que quem olha: peças, cores, materiais. */
  {
    nome: "Quarto com escritório",
    sigla: "QE",
    img: "/obras/obra-quarto-escritorio.webp",
    alt: "Quarto com guarda-roupa de portas cinzas e escrivaninha integrada sob nicho de madeira.",
  },
  {
    nome: "Cozinha corredor",
    sigla: "CC",
    img: "/obras/obra-cozinha-corredor.webp",
    alt: "Cozinha em corredor com armários de madeira clara, ilha central verde-oliva e coifa embutida.",
  },
] as const;

/* --- Slides da capa --------------------------------------------------------
   MOCKUP — imagens de terceiros, uso interno para aprovação de layout.
   NÃO PUBLICAR. Substituir por fotos da LDF antes do deploy.

   Os arquivos vivem em public/hero/originais/{1,2,3}.jpg. Para trocar:
   substitua os três e rode `node scripts/hero-imagens.mjs`. */

/* ══ `destaque`: A PALAVRA QUE RECEBE O FUNDO VERMELHO ══

   É DADO, e não uma string procurada dentro do JSX. A diferença importa: o
   componente não sabe nada sobre "qual é a palavra forte de um slide", e
   trocar o título aqui — como a rodada de copy vai fazer — não obriga a mexer
   no <Hero />.

   A BUSCA É INSENSÍVEL A CAIXA, de propósito. "Planejados" acha "planejados"
   em "Móveis planejados". Sem isso, capitalizar os títulos quebraria o
   destaque em silêncio: o fundo simplesmente não apareceria, sem erro nenhum.

   E ela é TOLERANTE À AUSÊNCIA: palavra que não existe no título rende o
   título inteiro sem destaque, em vez de estourar. Foi o que segurou o slide 3
   enquanto o texto dele ainda era "Sem revenda / no meio"; hoje as três
   palavras existem nos três títulos.

   ══ A CAIXA ALTA É DESTA SEÇÃO, E NÃO DO SITE ══

   Os três títulos capitalizam TODAS as palavras, inclusive as curtas — "De
   Fábrica", "Antes Do Orçamento", "Que Começam Na Chapa". Não é a norma do
   projeto: nenhuma outra manchete faz isso, e a `.h2` de toda seção continua
   em caixa de frase. É decisão de desenho da CAPA, onde o título é objeto
   gráfico antes de ser frase.

   ⚠ NÃO PROPAGUE. Se um título de seção aparecer capitalizado assim, é erro
   de cópia daqui, não coerência. */

export const heroSlides = [
  {
    titulo: ["Móveis Planejados", "De Fábrica"],
    destaque: "Planejados",
    img: "/hero/1",
    alt: "Sala de estar com marcenaria planejada, painel ripado e iluminação embutida.",
  },
  {
    titulo: ["Projeto 3D", "Antes Do Orçamento"],
    destaque: "3D",
    img: "/hero/2",
    alt: "Ambiente integrado com armários planejados e bancada em tom claro.",
  },
  {
    /* ⚠ A QUEBRA É DECISÃO, E NÃO SOBRA DO NAVEGADOR.

       "Excelência Em Cada Detalhe" tem 26 caracteres e o `.hero__titulo` tem
       `max-width: 22ch` com `text-wrap: balance` — solto numa linha só, ele
       quebraria de qualquer jeito, e o ponto da quebra mudaria com a largura
       da tela. Em duas entradas do array a quebra é sempre a mesma.

       E É NESTE PONTO, com a palavra vermelha sozinha em cima. É o uso mais
       forte do destaque, e repete a estrutura do slide 1: nome na primeira
       linha, qualificador na segunda ("Móveis Planejados" / "De Fábrica").

       A CAIXA ALTA EM "Em" NÃO É ERRO — é a convenção da capa, documentada no
       comentário acima deste array: os três títulos capitalizam todas as
       palavras, inclusive as curtas, como "De Fábrica" e "Antes Do Orçamento".
       Este slide ficaria sozinho em caixa de frase se fosse escrito como se
       fala. */
    titulo: ["Excelência", "Em Cada Detalhe"],
    destaque: "Excelência",
    img: "/hero/3",
    alt: "Detalhe de marcenaria sob medida, com prateleiras e nichos em madeira.",
  },
] as const;

export const heroLarguras = [2048, 1920, 1280, 768] as const;

/* --- História --------------------------------------------------------------
   TEXTO FINAL DO CLIENTE. Substituiu os três parágrafos que a agência havia
   escrito a partir dos fatos deste arquivo — fábrica própria, ausência de
   revenda, projeto 3D antes do orçamento, 45 dias úteis, 5 anos de garantia.
   Nenhum desses fatos sumiu do site: eles são o argumento da .fabrica e do
   .processo, que é onde pertencem. Aqui a seção passa a ser sobre POR QUE a
   LDF faz, e não sobre COMO.

   SÃO TRÊS PARÁGRAFOS QUE VIRARAM UM. `paragrafos` continua sendo uma lista, e
   o <Historia /> continua percorrendo com `.map()` — um item é caso válido, e
   voltar a ter dois ou três não pede mudança nenhuma no componente.

   ⚠ "há 15 anos" É AFIRMAÇÃO DE TEMPO, e é a primeira deste arquivo. Ela bate
   com `numeros`, que traz "+15 anos de história" confirmado pelo cliente. As
   duas têm de andar juntas: mudar uma sem a outra põe o site contando duas
   idades diferentes na mesma rolagem. */

export const historia = {
  titulo: ["Muito mais que madeira", "e ferragens."],
  paragrafos: [
    "Acreditamos que um móvel não serve apenas para guardar objetos. Ele é o cenário onde a vida acontece. Nossa história começou há 15 anos, com o desejo de transformar espaços vazios em lares de verdade. Cada projeto carrega o compromisso de tornar o seu dia a dia mais prático e inesquecível.",
  ],
  /* A ASSINATURA É UMA IMAGEM, e `nome` é o TEXTO ALTERNATIVO dela — não um
     texto renderizado. Quem editar essa string está editando o que o leitor de
     tela anuncia, e nada mais: na tela quem aparece é o manuscrito do SVG.

     O nome completo veio da própria assinatura que o cliente enviou.
     TODO: confirmar o CARGO com o cliente. Enquanto ele for "", a segunda
     linha do bloco não renderiza — ver components/Historia.tsx. */
  assinatura: {
    nome: "Renan Muniz Gedra",
    cargo: "",
    svg: "/assinatura-renan.svg",
  },
  /* MOCKUP — substituir por foto da fábrica da LDF. */
  img: "/historia/fabrica.webp",
  alt: "Marcenaria em produção, com chapas e bancada de trabalho.",
} as const;

/* --- Marcas atendidas ------------------------------------------------------
   AS CINCO SÃO CLIENTES REAIS, e o uso das marcas está autorizado. Saiu daqui
   o bloco PLACEHOLDER que dizia que as empresas não existiam — ele passou a
   ser falso no momento em que estes nomes entraram.

   UMA ENTRA SÓ COM O NOME, e é decisão de desenho, não descuido. O porquê está
   ao lado dela, logo abaixo — é específico daquela marca, e não uma regra
   geral sobre marca de terceiro. */
export type Marca = {
  readonly nome: string;
  /* ⚠ CONTINUA OPCIONAL, e hoje NENHUMA marca usa a opção.

     Ela existia por causa do Espaço Harmony, a única que entrava só com o
     nome: a marca dele é um rosto de uma linha contínua de 0,33% da altura,
     que a 40px dá 0,13px e desaparece — engrossar foi tentado e as voltas da
     linha se colaram umas nas outras. A empresa saiu da lista por decisão do
     cliente, e o caso foi junto.

     O `?` fica porque o <CarrosselMarcas /> ainda sabe desenhar uma peça sem
     símbolo: a `carregar()` devolve null e a `montarPeca()` não reserva o vão.
     É capacidade testada, e apagá-la agora é trabalho a refazer no dia em que
     entrar um cliente sem ícone utilizável — que foi o caso de um em cinco.

     Quem for tornar `arquivo` obrigatório precisa tirar esse ramo do
     componente no mesmo commit; deixar um sem o outro é código morto de um
     lado ou erro de tipo do outro. */
  readonly arquivo?: string;
};

export const marcas: readonly Marca[] = [
  { nome: "Bradesco Prime", arquivo: "/marcas/bradesco-prime.svg" },
  { nome: "Boali", arquivo: "/marcas/boali.svg" },
  { nome: "Farmaciano", arquivo: "/marcas/farmaciano.svg" },

  /* ⚠ O SÍMBOLO DA TESLA É UMA RELEITURA ENGROSSADA, NÃO A MARCA ORIGINAL.
     Quem abrir o site ao lado do logotipo real vai ver diferença — o registro
     está aqui para essa pessoa não concluir que o arquivo está errado e
     "consertar".

     O traço foi de 2,23% para 5% da altura do desenho. A 40px de símbolo, os
     2,23% originais davam 0,89px de espessura: abaixo de um pixel inteiro o
     navegador espalha a tinta em cinza, e a forma para de ser forma — vira
     sujeira. Com o engrossamento os dentes da engrenagem fundiram num anel
     sólido e as ferramentas engordaram. É RECONHECÍVEL, NÃO É IDÊNTICA.

     TODO: pedir ao cliente a versão ícone ou horizontal oficial da Tesla e
     substituir. Releitura automática é solução de contorno, não o certo. */
  { nome: "Tesla Soluções", arquivo: "/marcas/tesla-solucoes.svg" },
];

/* --- Projeto comercial -----------------------------------------------------
   A seção comercial mostra UM projeto, não um portfólio.

   As quatro fotos são da mesma unidade, e o texto diz isso. "Nossos projetos
   comerciais" no plural afirmaria uma variedade que estas fotos não mostram —
   mesmo exagero que fez closet e home office saírem da lista residencial por
   falta de foto própria.

   Assumido, fica mais forte: em vez de quatro trabalhos soltos, uma operação
   inteira equipada e funcionando. As legendas são as PARTES do mesmo trabalho,
   não clientes.

   O cliente NÃO é nomeado no texto. A marca aparece nas fotos porque está no
   letreiro da loja — é o que a foto mostra, não uma afirmação nossa. Ela
   também está na faixa de marcas, ali sim nomeada e autorizada; aqui o texto
   se cala de propósito.

   TODO: quando houver obra comercial de outro cliente fotografada, esta seção
   pode virar plural de verdade.

   ══ A ORDEM DAS FOTOS NÃO É ARBITRÁRIA ══

   `fachada` e `noite` são as duas vistas mais parecidas entre si — as duas de
   fora, de frente, com o letreiro e o expositor no quadro. Estão em 1 e 3
   justamente para NÃO caírem lado a lado na fileira de quatro; entre elas
   entra o interior, que muda o ponto de vista. Reordenar por gosto devolve a
   repetição que este arranjo desfaz.

   O tamanho do arquivo é o mesmo para as quatro (900×1200) e está no
   componente, não aqui: é dado de arquivo, não de conteúdo — a foto que um dia
   substituir uma destas continua entrando pelo mesmo campo. */
export const projetoComercial = {
  titulo: "Operação completa: da fachada à linha de serviço.",
  lede: "Ambiente comercial tem outra conta: uso intenso, muitos ciclos de abertura por dia, e uma obra que não pode parar esperando móvel.",
  fotos: [
    {
      arquivo: "/comercial/boali-fachada.webp",
      legenda: "Fachada e balcão",
      alt: "Fachada de loja em shopping, com letreiro iluminado, balcão de atendimento em madeira clara e expositor refrigerado.",
    },
    {
      arquivo: "/comercial/boali-salao.webp",
      legenda: "Linha de serviço",
      alt: "Interior da loja: linha de serviço com vitrine refrigerada, coifa e parede de tijolo com painel escrito à mão.",
    },
    {
      arquivo: "/comercial/boali-noite.webp",
      legenda: "Vitrine e painel",
      alt: "Vista frontal da loja à noite, com o painel decorativo e o expositor refrigerado visíveis pela vitrine.",
    },
    {
      arquivo: "/comercial/boali-vitrine.webp",
      legenda: "Balcão de atendimento",
      alt: "Balcão de atendimento e caixa vistos pela vitrine, com a linha de serviço ao fundo.",
    },
  ],
} as const;

/* Proporção nativa das fotos comerciais: em pé, 3:4 — o inverso das de
   ambiente. Mesmo papel dos dois constantes acima: vão nos atributos width e
   height do <img> para o navegador reservar a caixa antes do arquivo chegar, e
   o CSS repete a proporção por aspect-ratio. Uma vale sem CSS, a outra sem os
   atributos.

   São o TAMANHO DO ARQUIVO, e não o tamanho na tela. Quem dimensiona a foto na
   página é a grade. */
export const COMERCIAL_LARGURA = 900;
export const COMERCIAL_ALTURA = 1200;

/* --- Formulário de contato -------------------------------------------------
   As opções dos dois grupos de escolha vivem AQUI, e não no JSX, pelo mesmo
   motivo que todo o resto deste arquivo: um lugar só para editar. A action do
   servidor também lê daqui, e é isso que faz a validação e a interface nunca
   discordarem sobre o que é uma opção válida. */

/* O vocabulário é o MESMO da lista de ambientes do site — derivado dela, e não
   redigitado. Se um ambiente entrar, sair ou for renomeado em `ambientes`, o
   formulário acompanha sozinho.

   "Comercial" entra à parte porque não é um ambiente da lista residencial: é a
   seção comercial de /ambientes, que tem obra entregue mas não tem verbete em
   `ambientes`.

   ══ "OUTRO" É A ÚLTIMA, E ESTAR NESTA LISTA É O QUE O FAZ FUNCIONAR ══

   A action valida REJEITANDO valor fora da lista conhecida — está escrito no
   `validar()` de app/contato/estado.ts, e é regra deliberada: entrada
   desconhecida vira erro, não é "ajustada" para o mais parecido. Consequência
   direta: uma opção que aparece na tela e NÃO está aqui é aceita pelo
   navegador e recusada pelo servidor. A pessoa marca, envia, e leva "Escolha
   ao menos um ambiente" sem entender por quê.

   Por isso "Outro" entra no DADO, e não no JSX. As duas pontas — as pastilhas
   e a validação — leem desta mesma lista, então não há como divergirem.

   Fica no FIM, depois de "Comercial": a ordem é do mais específico para o mais
   aberto, e "Outro" é a saída de quem não se reconheceu em nenhuma. Posta no
   meio, ela encerra a leitura antes da hora. */
export const opcoesAmbiente = [
  ...ambientes.map((a) => a.nome),
  "Comercial",
  "Outro",
] as const;

/* Escolha única. Os quatro primeiros cobrem o funil que a LDF atende, e a
   ordem é cronológica — de quem ainda não tem parede a quem já tem móvel e
   quer trocar.

   "Outro" fecha a lista, e vale aqui a mesma regra do grupo de ambiente: ele
   está no DADO porque a action recusa valor fora desta lista. Ver a nota
   acima, em `opcoesAmbiente`.

   ⚠ NUM GRUPO DE ESCOLHA ÚNICA "Outro" pesa mais que numa múltipla. Quem marca
   "Outro" aqui está dizendo que o estágio dele não é nenhum dos quatro — e o
   formulário não pergunta qual é. A informação chega ao WhatsApp como
   "*Estágio da obra:* Outro", que é honesto mas mudo. Se isso começar a
   aparecer muito, o conserto é um campo de texto condicional, não um quinto
   estágio inventado. */
export const opcoesEstagio = [
  "Na planta",
  "Em obra",
  "Pronto para medir",
  "Trocando móveis",
  "Outro",
] as const;

/* --- Consentimento (LGPD) --------------------------------------------------
   A POLÍTICA EXISTE, e o TODO que morava aqui está fechado. Ele dizia que o
   texto ficaria sem link enquanto /politica-de-privacidade não nascesse, porque
   link para rota inexistente dá 404 no exato momento em que a pessoa foi
   conferir o que está aceitando. A rota nasceu; os dois lugares que o TODO
   nomeava foram ligados:

     1. components/FormularioContato.tsx — uma linha abaixo da caixa leva à
        política. O TEXTO DO CONSENTIMENTO NÃO MUDOU, e é de propósito: ele é a
        declaração que a pessoa assina, e enfiar um link no meio dela mistura o
        que se aceita com onde se lê sobre isso.
     2. components/Footer.tsx — a coluna Legal, que antes era um <span> morto.

   O TEXTO É ESPECÍFICO DE PROPÓSITO. "Concordo com o tratamento dos meus
   dados" não é consentimento informado: não diz quais dados, para quê, nem
   por quem. Este diz os três. */
export const consentimento = {
  texto:
    "Autorizo a LDF Planejados a usar meu nome, telefone e e-mail para responder a este pedido e para contato comercial sobre o projeto.",
} as const;

/* --- Política de privacidade -----------------------------------------------
   Os NÚMEROS da política moram aqui pelo mesmo motivo que o resto do arquivo:
   um lugar só para editar. O texto corrido vive na rota, em
   app/politica-de-privacidade/page.tsx — o que não pode viver lá é dado.

   ⚠⚠⚠ TODO GRANDE — GOOGLE ANALYTICS ⚠⚠⚠

   HOJE O SITE NÃO GRAVA COOKIE NENHUM, e a política afirma isso com todas as
   letras. A afirmação foi verificada, não suposta: não há analytics, tag
   manager, pixel nem terceiro em nenhuma rota, e as fontes entram por
   next/font/google, que BAIXA os arquivos no build e os serve do próprio
   domínio — nenhuma requisição ao Google em execução.

   O CLIENTE VAI INSTALAR GOOGLE ANALYTICS depois da revisão do site. No dia em
   que isso acontecer, TRÊS COISAS ENTRAM NO MESMO COMMIT:

     1. o banner de consentimento de cookies, com recusa tão fácil quanto o
        aceite, e o script do GA só disparando depois do aceite;
     2. a seção de cookies da política, dizendo quais cookies, de quem, para
        quê e por quanto tempo;
     3. a CORREÇÃO da afirmação "este site não usa cookies", que passa a ser
        falsa no segundo em que o script subir.

   GA NO AR COM ESTA PÁGINA DIZENDO "NÃO USAMOS COOKIES" É DECLARAÇÃO FALSA EM
   DOCUMENTO LEGAL. Não é dívida técnica, não é detalhe de rodada seguinte, e
   não se resolve depois: ou os três entram juntos, ou o GA não sobe. */
export const politica = {
  /* ISO, e uma só. A exibição em português é DERIVADA desta string na rota —
     escrever "2 de setembro de 2026" num segundo campo criaria duas fontes
     para a mesma data, e a que ninguém olha é a que envelhece. */
  atualizadaEm: "2026-09-02",

  /* Retenção, em unidades de tempo cheias.

     24 MESES para quem pediu orçamento e não fechou, contados do último
     contato — é o horizonte em que uma reforma adiada volta, e depois disso o
     dado deixa de servir a quem o entregou.

     5 ANOS para quem virou cliente, contados da entrega. O número NÃO é
     redondo por gosto: é o mesmo prazo da garantia das madeiras que a LDF
     anuncia (ver `ficha` e `numeros`, os dois com 5 anos). A empresa precisa
     conseguir dizer de quem era o projeto durante todo o período em que pode
     ser acionada por ele — guardar menos que a garantia é não conseguir honrar
     a garantia. SE A GARANTIA MUDAR, ESTE NÚMERO MUDA JUNTO. */
  retencaoLeadMeses: 24,
  retencaoClienteAnos: 5,
} as const;

/* --- Mapa da fábrica -------------------------------------------------------
   URL de BUSCA do Google Maps, montada a partir do endereço acima. Nada de
   coordenada escrita à mão: latitude e longitude digitadas envelhecem sem
   avisar, e ninguém confere. Aqui o endereço é a fonte, e mudar `contato.
   endereco` muda o destino do mapa junto.

   `/maps/search/?api=1&query=` é a URL universal documentada pelo Google. Em
   celular ela é interceptada pelo app nativo nos dois sistemas; no desktop
   abre o mapa no navegador. Waze e Apple Maps ficam de fora por ora — cada um
   pediria outro esquema e outro botão, e um botão só é o que a página precisa.

   O `encodeURIComponent` é obrigatório: o endereço tem vírgulas, espaços e
   acentos, e sem ele a query quebra no primeiro "Jardim Cocaia". */
export const mapaUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${contato.endereco.rua}, ${contato.endereco.bairro}, ${contato.endereco.cep}`,
)}`;
