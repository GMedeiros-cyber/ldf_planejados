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
  email: "ldfmoveisplanejados@gmail.com",
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

/* Quem assinou o desenho e o código. Fica aqui, e não solto no JSX, pela
   mesma razão que o resto: um lugar só para editar. */
export const creditos = {
  autor: "Tribus Labs",
  url: "https://tribuslabs.com.br",
} as const;

/* --- Números da casa -------------------------------------------------------
   Confirmados pelo cliente. Não são estimativa nem arredondamento nosso. */

export const numeros = [
  { alvo: 1200, prefixo: "+", sufixo: "", rotulo: "Projetos entregues e montados" },
  { alvo: 15,   prefixo: "+", sufixo: "", rotulo: "Anos de história" },
  { alvo: 5,    prefixo: "",  sufixo: "", rotulo: "Anos de garantia" },
] as const;

/* --- Acabamentos -----------------------------------------------------------
   PROVISÓRIO: são exemplos de referência. A cartela real da LDF entra aqui
   quando o cliente informar as opções e os códigos. */

export type ChaveAcabamento =
  | "nogueira"
  | "freijo"
  | "carvalho"
  | "cinza"
  | "laca-branca"
  | "laca-grafite";

export const acabamentos: { chave: ChaveAcabamento; nome: string; tipo: string }[] = [
  { chave: "nogueira", nome: "Nogueira", tipo: "Madeirado · veio vertical" },
  { chave: "freijo", nome: "Freijó", tipo: "Madeirado · veio vertical" },
  { chave: "carvalho", nome: "Carvalho", tipo: "Madeirado · veio vertical" },
  { chave: "cinza", nome: "Cinza", tipo: "Madeirado · veio suave" },
  { chave: "laca-branca", nome: "Laca branca", tipo: "Laca · acabamento fosco" },
  { chave: "laca-grafite", nome: "Laca grafite", tipo: "Laca · acabamento fosco" },
];

export const acabamentoInicial: ChaveAcabamento = "nogueira";

/* --- Ambientes ------------------------------------------------------------ */

/* Quatro ambientes, não oito. Closet, home office, área gourmet e lavanderia
   continuam sendo executados pela LDF — só não têm foto própria à altura, e
   por isso são citados dentro do ambiente vizinho em vez de ganharem um bloco
   com imagem aproximada.

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
      "A cozinha se resolve por circulação e altura de bancada, não por metro linear de armário. Torre quente na altura de tirar a assadeira sem se abaixar, gaveta funda para panela, despensa em coluna quando o espaço permite — e quando não permite, o projeto diz isso em vez de vender o módulo. A lavanderia entra no mesmo desenho: torre de máquinas, tanque e armário alto.",
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
      "Guarda-roupa, cabeceira e criado suspenso definem o quarto. O closet é o mesmo projeto sem porta: módulos abertos, gaveteiro e sapateira, com volumetria e iluminação interna resolvidas junto. Quando o quarto também é escritório, a bancada e o painel com passagem de cabos entram no desenho — não como móvel avulso encostado na parede depois.",
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
      "Painel, rack e estante são um bloco só, e quem decide o resultado é o que fica escondido: profundidade para o equipamento, ventilação e por onde os cabos passam. A área gourmet segue a mesma lógica na varanda — churrasqueira, adega e bancada de apoio dimensionadas pela circulação e pelo calor, não pelo espaço que sobrou.",
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
   Agrupam as onze etapas acima para a home. As frases são condensação dos
   textos de `etapas` — nenhuma informação nova entra aqui. O array `etapas`
   continua sendo a fonte completa. */

export const estagios = [
  {
    n: "01",
    titulo: "Entender o ambiente",
    texto:
      "A planta que você tiver já começa a conversa, mas é a medição no local — prumo, esquadro, ponto de água e altura de forro — que decide o que é possível de verdade.",
    etapas: ["Contato inicial", "Planta ou medidas", "Medição no local"],
  },
  {
    n: "02",
    titulo: "Desenhar",
    texto:
      "O móvel desenhado no seu ambiente, não em um genérico: você vê o projeto antes de ver qualquer valor, e ajusta até ficar do jeito que quer.",
    etapas: ["Projeto 3D", "Apresentação", "Aprovação"],
  },
  {
    n: "03",
    titulo: "Fechar",
    texto:
      "O orçamento sai módulo por módulo, sem valor por metro solto, e a assinatura do projeto executivo é o marco que inicia o prazo.",
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

/* --- Prova social: slots honestos ------------------------------------------
   Nada aqui pode ser inventado. Ver PRODUCT.md, Evidence on Hand.

   "Avaliações no Google" SAIU desta lista: foi entregue. A nota, o total e
   oito trechos literais estão em lib/avaliacoes.ts, na faixa que a home
   mostra antes do CTA. Continuar listando como pendente o que já está no ar
   é a única coisa que esta lista não pode fazer — ela existe para dizer o
   que falta, e um item falso aqui contamina os outros três. */

export const slotsProva = [
  {
    o: "Fotos de ambientes executados",
    porque:
      "Cozinha, dormitório, closet e comercial, na resolução original, não reenviadas por WhatsApp.",
  },
  {
    o: "Depoimentos de clientes",
    porque: "Nome, ambiente e o que foi dito. Texto, áudio ou vídeo. Nada aqui é escrito por nós.",
  },
  {
    o: "Fotos da fábrica e da montagem",
    porque:
      'É o que prova a frase principal do site. Sem elas, "fábrica própria" é só uma alegação.',
  },
] as const;

/* --- Obras entregues -------------------------------------------------------
   PLACEHOLDER: fotos genéricas do Unsplash até o cliente enviar as reais.
   Os nomes são tipos de ambiente, não obras específicas — nenhum cliente,
   endereço ou condomínio é citado, porque nenhum foi informado. Os dois
   últimos itens reusam fotos anteriores com recorte diferente: só seis ids
   do Unsplash foram verificados, e id inventado devolve 404.
   TODO: substituir img, nome e alt por obras executadas pela LDF. */

export const obras = [
  {
    nome: "Cozinha planejada",
    sigla: "CZ",
    img: "https://images.unsplash.com/photo-1719368472026-dc26f70a9b76?q=80&w=900&auto=format&fit=crop",
    alt: "Ambiente residencial com marcenaria planejada e iluminação embutida.",
  },
  {
    nome: "Dormitório",
    sigla: "DR",
    img: "https://images.unsplash.com/photo-1649265825072-f7dd6942baed?q=80&w=900&auto=format&fit=crop",
    alt: "Quarto com cabeceira planejada e luminária de apoio.",
  },
  {
    nome: "Sala e living",
    sigla: "SL",
    img: "https://images.unsplash.com/photo-1729086046027-09979ade13fd?q=80&w=900&h=1200&auto=format&fit=crop&crop=right",
    alt: "Sala de estar com painel e estante planejados.",
  },
  {
    nome: "Home office",
    sigla: "HO",
    img: "https://images.unsplash.com/photo-1729086046027-09979ade13fd?q=80&w=900&auto=format&fit=crop",
    alt: "Bancada de trabalho integrada à marcenaria do ambiente.",
  },
  {
    nome: "Closet",
    sigla: "CL",
    img: "https://images.unsplash.com/photo-1601568494843-772eb04aca5d?q=80&w=900&auto=format&fit=crop",
    alt: "Módulos abertos de closet com prateleiras e gaveteiro.",
  },
  {
    nome: "Área gourmet",
    sigla: "AG",
    img: "https://images.unsplash.com/photo-1585687501004-615dfdfde7f1?q=80&w=900&auto=format&fit=crop",
    alt: "Área gourmet com bancada de apoio e armários inferiores.",
  },
  {
    nome: "Lavanderia",
    sigla: "LV",
    img: "https://images.unsplash.com/photo-1719368472026-dc26f70a9b76?q=80&w=900&h=1200&auto=format&fit=crop&crop=top",
    alt: "Armário alto de lavanderia com portas lisas.",
  },
  {
    nome: "Banheiro",
    sigla: "BN",
    img: "https://images.unsplash.com/photo-1649265825072-f7dd6942baed?q=80&w=900&h=1200&auto=format&fit=crop&crop=bottom",
    alt: "Gabinete de banheiro com espelheira e nicho.",
  },
] as const;

/* --- Slides da capa --------------------------------------------------------
   MOCKUP — imagens de terceiros, uso interno para aprovação de layout.
   NÃO PUBLICAR. Substituir por fotos da LDF antes do deploy.

   Os arquivos vivem em public/hero/originais/{1,2,3}.jpg. Para trocar:
   substitua os três e rode `node scripts/hero-imagens.mjs`. */

export const heroSlides = [
  {
    titulo: ["Móveis planejados", "de fábrica"],
    img: "/hero/1",
    alt: "Sala de estar com marcenaria planejada, painel ripado e iluminação embutida.",
  },
  {
    titulo: ["Projeto 3D", "antes do orçamento"],
    img: "/hero/2",
    alt: "Ambiente integrado com armários planejados e bancada em tom claro.",
  },
  {
    titulo: ["Sem revenda", "no meio"],
    img: "/hero/3",
    alt: "Detalhe de marcenaria sob medida, com prateleiras e nichos em madeira.",
  },
] as const;

export const heroLarguras = [2048, 1920, 1280, 768] as const;

/* --- História --------------------------------------------------------------
   Texto original da LDF, escrito a partir dos fatos já registrados aqui:
   fábrica própria em Guarulhos, ausência de revenda, projeto 3D antes do
   orçamento, 45 dias úteis de produção, 5 anos de garantia em madeiras.
   Nada de ano de fundação, número de funcionários ou cargo — não temos. */

export const historia = {
  titulo: ["De Guarulhos,", "direto da fábrica"],
  paragrafos: [
    "Entre quem desenha o seu móvel e quem corta a chapa não existe ninguém. A fábrica é nossa, fica em Guarulhos, e é de lá que sai cada peça.",
    "O projeto 3D vem antes do orçamento. Você aprova o móvel desenhado no seu ambiente — não um número solto numa planilha.",
    "Da assinatura à entrega são até 45 dias úteis, e a garantia das madeiras é de cinco anos. Prazo e garantia são nossos, não de um fornecedor distante.",
  ],
  /* TODO: confirmar nome completo e cargo com o cliente. */
  assinatura: { nome: "Renan", cargo: "" },
  /* MOCKUP — substituir por foto da fábrica da LDF. */
  img: "/historia/fabrica.webp",
  alt: "Marcenaria em produção, com chapas e bancada de trabalho.",
} as const;

/* PLACEHOLDER — marcas fictícias. Nenhuma dessas empresas existe.
   TODO: substituir pelos clientes comerciais reais quando o cliente enviar
   os nomes e autorizar o uso das marcas. */
export const marcas = [
  { nome: "Clínica Vértice", arquivo: "/marcas/vertice.svg" },
  { nome: "Colégio Aurora", arquivo: "/marcas/aurora.svg" },
  { nome: "Studio Lume", arquivo: "/marcas/lume.svg" },
  { nome: "Grupo Pilar", arquivo: "/marcas/pilar.svg" },
  { nome: "Traço Escritórios", arquivo: "/marcas/traco.svg" },
] as const;
