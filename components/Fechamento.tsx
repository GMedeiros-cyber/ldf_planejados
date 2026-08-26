import { contato, whatsappUrl } from "@/lib/dados";
import { Seta } from "./Icones";

export default function Fechamento() {
  return (
    <section className="section fechamento wrap" id="contato" aria-labelledby="t-cta">
      <h2 className="display" id="t-cta">
        Manda a planta.
        <br />A gente desenha.
      </h2>
      <p className="lede">
        Sem compromisso e sem valor na primeira conversa, porque valor honesto só existe depois do
        projeto. {contato.horario}, com horário estendido mediante agendamento.
      </p>
      <div className="hero__actions">
        <a className="btn" href={whatsappUrl} target="_blank" rel="noopener">
          Falar no WhatsApp
          <Seta />
        </a>
        <a className="btn btn--ghost" href={`mailto:${contato.email}`}>
          Enviar e-mail
        </a>
      </div>
    </section>
  );
}
