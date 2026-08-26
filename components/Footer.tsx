import Link from "next/link";
import { ambientes, contato, empresa, whatsappUrl } from "@/lib/dados";

const institucional = [
  { href: "/#fabrica", texto: "A LDF" },
  { href: "/#processo", texto: "Como funciona" },
  { href: "/#comercial", texto: "Espaços comerciais" },
  { href: "/#contato", texto: "Contato" },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer__grid">
        <div>
          <h3 className="label">Fábrica e loja</h3>
          <address>
            {contato.endereco.rua}
            <br />
            {contato.endereco.bairro}
            <br />
            {contato.endereco.cep}
            <br />
            <br />
            <a href={whatsappUrl}>{contato.whatsappExibicao}</a>
            <br />
            <a href={`mailto:${contato.email}`}>{contato.email}</a>
            <br />
            <br />
            {contato.horario}
          </address>
        </div>

        <div>
          <h3 className="label">Ambientes</h3>
          <ul>
            {ambientes.map((a) => (
              <li key={a.nome}>
                <Link href={a.href.startsWith("#") ? `/${a.href}` : a.href}>{a.nome}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="label">Institucional</h3>
          <ul>
            {institucional.map((i) => (
              <li key={i.href}>
                <Link href={i.href}>{i.texto}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="label">Onde nos encontrar</h3>
          <ul>
            <li>
              <a href={contato.instagram} target="_blank" rel="noopener">
                Instagram
              </a>
            </li>
            <li>
              <a href={contato.facebook} target="_blank" rel="noopener">
                Facebook
              </a>
            </li>
            <li>
              <a href={contato.google} target="_blank" rel="noopener">
                Google
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="wrap footer__legal">
        <span>{empresa.razaoSocial}</span>
        <span className="num">CNPJ {empresa.cnpj}</span>
        <span className="footer__legal-fim">Política de privacidade</span>
      </div>
    </footer>
  );
}
