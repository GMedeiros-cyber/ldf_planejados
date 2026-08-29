import Link from "next/link";

import { SetaDiagonal } from "./Icones";
import { ambientes } from "@/lib/dados";

/* Pilha empilhada: cada card gruda no topo e é coberto pelo seguinte.
   O efeito é CSS puro (position: sticky + altura por item) — ver .pilha em
   globals.css. NENHUM ancestral pode ter overflow hidden, clip ou auto:
   qualquer um deles desliga o sticky sem avisar. Hoje a cadeia até o <html>
   está limpa; quem mexer no layout de /ambientes precisa manter assim.

   O cabeçalho da seção não mora aqui — vive em app/ambientes/page.tsx, que é
   quem dá o <h1> ao qual esta lista se refere.

   Só a Cozinha tem página. Os outros sete não viram link: sem <a>, sem a
   seta diagonal, e com um rótulo dizendo que a página ainda não existe. É
   preferível a mandar quem clicou num ambiente para o formulário de contato. */

export default function Ambientes() {
  return (
    <ul className="pilha">
      {ambientes.map((amb) => (
        <li key={amb.nome} className="pilha__item">
          <article className="pilha__card" data-fin={amb.fin}>
            <span className="pilha__plate" aria-hidden="true">
              <span className="mat" />
              <span className="mat" />
              <span className="mat" />
            </span>

            {amb.href ? <SetaDiagonal className="pilha__go" /> : null}

            <h3>
              {amb.href ? (
                <Link className="pilha__nome" href={amb.href}>
                  {amb.nome}
                </Link>
              ) : (
                <span className="pilha__nome pilha__nome--inerte">{amb.nome}</span>
              )}
            </h3>
            <p className="pilha__meta">{amb.meta}</p>

            {amb.href ? null : <span className="pilha__breve">Página em breve</span>}
          </article>
        </li>
      ))}
    </ul>
  );
}
