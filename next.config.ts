import type { NextConfig } from "next";

/* ══ CABEÇALHOS DE SEGURANÇA, EM TODAS AS ROTAS ══

   Os quatro abaixo não dependem de nada que o site carrega — por isso entram
   sem lista de exceções:

     X-Content-Type-Options  o navegador não "adivinha" o tipo de um arquivo:
                             um .txt nunca é executado como script.
     Referrer-Policy         ao sair para outro site (WhatsApp, Instagram,
                             Google Maps), vai só a origem, não o caminho.
     X-Frame-Options         ninguém embute o site num <iframe> alheio para
                             enganar o clique (clickjacking).
     Permissions-Policy      câmera, microfone e localização desligados: o
                             site não usa nenhum dos três, e um script de
                             terceiro também não pode pedir.

   ⚠ NÃO HÁ Content-Security-Policy, E É DELIBERADO. Com o Google Tag Manager
   no ar, a CSP precisa listar cada domínio do Google que o container chama — e
   o container muda pelo painel do GTM, sem passar por este arquivo. Faltou um
   domínio, a medição quebra em silêncio. A CSP entra quando houver a lista
   fechada e um jeito de testá-la contra o container real.

   ⚠ NÃO HÁ Strict-Transport-Security: a Vercel já o aplica no domínio de
   produção — conferido com `curl -I` em www.ldfplanejados.com.br, que
   responde `Strict-Transport-Security: max-age=63072000` (dois anos). */
const cabecalhosDeSeguranca = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,

  /* Sem "X-Powered-By: Next.js" na resposta: anunciar o framework e a versão
     não serve a quem visita, só a quem procura alvo. */
  poweredByHeader: false,

  async headers() {
    return [{ source: "/:path*", headers: cabecalhosDeSeguranca }];
  },
};

export default nextConfig;
