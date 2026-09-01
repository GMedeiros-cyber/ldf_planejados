import Link from "next/link";
import { ambientes, contato, creditos, empresa, whatsappUrl } from "@/lib/dados";

const institucional = [
  { href: "/#fabrica", texto: "A LDF" },
  { href: "/#processo", texto: "Como funciona" },
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
                {/* Nenhum ambiente tem página própria: todos levam à listagem.
                    Já foi `a.href ?? "/ambientes"`, quando a Cozinha tinha a
                    dela; o cliente deixou de querer página por ambiente e a
                    rota foi apagada. O destino nunca foi o formulário de
                    contato, que era o de antes disso. */}
                <Link href="/ambientes">{a.nome}</Link>
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

      {/* Ornamento, não conteúdo: o nome da empresa está na barra legal logo
          abaixo. Fica fora da árvore de acessibilidade e fora do ponteiro. */}
      <img
        className="footer__assinatura"
        src="/assinatura-ldf.png"
        width={2630}
        height={607}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
      />

      <div className="wrap footer__legal">
        <div className="footer__legal-grupo">
          <span>{empresa.razaoSocial}</span>
          <span className="num">CNPJ {empresa.cnpj}</span>
        </div>
        <div className="footer__legal-grupo">
          <span>Política de privacidade</span>
          <a href={creditos.url} target="_blank" rel="noopener">
            Design e site por {creditos.autor}
          </a>
        </div>
      </div>
    </footer>
  );
}
