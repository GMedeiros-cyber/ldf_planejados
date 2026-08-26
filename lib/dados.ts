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

export const ambientes = [
  {
    nome: "Cozinha",
    meta: "Torre quente, gaveteiro, coifa e despensa",
    href: "/ambientes/cozinha",
    fin: "nogueira",
  },
  {
    nome: "Dormitório",
    meta: "Guarda-roupa, cabeceira e criado suspenso",
    href: "#contato",
    fin: "carvalho",
  },
  {
    nome: "Closet",
    meta: "Módulos abertos, gaveteiro e sapateira",
    href: "#contato",
    fin: "laca-branca",
  },
  {
    nome: "Home office",
    meta: "Bancada, painel e passagem de cabos",
    href: "#contato",
    fin: "freijo",
  },
  {
    nome: "Área gourmet",
    meta: "Churrasqueira, adega e bancada de apoio",
    href: "#contato",
    fin: "laca-grafite",
  },
  {
    nome: "Banheiro",
    meta: "Gabinete, espelheira e nicho",
    href: "#contato",
    fin: "cinza",
  },
  {
    nome: "Sala e living",
    meta: "Painel de TV, rack e estante",
    href: "#contato",
    fin: "carvalho",
  },
  {
    nome: "Lavanderia",
    meta: "Torre de máquinas, tanque e armário alto",
    href: "#contato",
    fin: "laca-branca",
  },
] as const;

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

/* --- Ficha técnica -------------------------------------------------------- */

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
   Nada aqui pode ser inventado. Ver PRODUCT.md, Evidence on Hand. */

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
    o: "Avaliações no Google",
    porque: "Nota e volume, puxados do perfil da LDF.",
  },
  {
    o: "Fotos da fábrica e da montagem",
    porque:
      'É o que prova a frase principal do site. Sem elas, "fábrica própria" é só uma alegação.',
  },
] as const;
