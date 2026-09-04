import { whatsappUrl } from "@/lib/dados";
import { IconeWhatsApp } from "./Icones";

/* WhatsApp fixo no canto. É o canal de conversão do negócio — fica sempre à
   mão, em todas as rotas.

   ══ ESTE ARQUIVO JÁ EXISTIU E FOI APAGADO ══

   Saiu no d8632fb, junto com a seção 18 do globals.css. Voltou igual: o
   destino é `whatsappUrl`, o mesmo endereço do rodapé, do cartão de /contato e
   do formulário, derivado de `contato.whatsapp` — não há segundo número
   escrito em lugar nenhum, e trocar o da empresa troca este junto.

   ══ POR QUE ELE MORA NO LAYOUT, E NÃO EM CADA PÁGINA ══

   Era montado à mão em duas páginas antes de sair, e foi por isso que apagá-lo
   quebrou o build em dois lugares. No layout ele entra uma vez e vale para as
   quatro rotas — não há como uma rota nova nascer sem ele, nem como duas
   cópias aparecerem na mesma tela.

   ⚠ FICA DEPOIS DO {children}, E ISSO É ACESSIBILIDADE, NÃO ARRUMAÇÃO. A ordem
   do Tab é a ordem do DOM, e um elemento fixo no fim do documento é a ÚLTIMA
   parada — não a primeira. Movido para antes do conteúdo, ele viraria o
   primeiro Tab de todas as páginas do site, à frente do menu.

   ══ SERVER COMPONENT, SEM UMA LINHA DE JAVASCRIPT ══

   É um <a> com href. Funciona com script desligado, não hidrata nada e não
   entra no grafo do cliente. A posição dele sobre a capa é resolvida no CSS
   (seção 17b), inclusive o desvio da fila de ícones — ver lá. */

export default function Zap() {
  return (
    <a
      className="zap"
      href={whatsappUrl}
      target="_blank"
      rel="noopener"
      aria-label="Falar com a LDF no WhatsApp"
    >
      <IconeWhatsApp />
      <span className="zap__rotulo">WhatsApp</span>
    </a>
  );
}
