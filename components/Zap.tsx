import { whatsappUrl } from "@/lib/dados";
import { IconeWhatsApp } from "./Icones";

/* WhatsApp fixo no canto. É o canal de conversão do negócio — fica sempre à mão. */

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
      <span>WhatsApp</span>
    </a>
  );
}
