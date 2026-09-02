import BotaoMapa from "./BotaoMapa";
import { contato, whatsappUrl } from "@/lib/dados";

/* O cartão de endereço da coluna esquerda de /contato.

   SUBSTITUI A FAIXA "Onde nos achar", que era uma seção própria empilhada
   abaixo do formulário. O conteúdo é o mesmo — endereço, e-mail e WhatsApp,
   todos de `contato` em lib/dados.ts — e agora mora num lugar só na rota. Não
   existe mais endereço duplicado em /contato.

   ⚠ A FOTO DA FACHADA NÃO EXISTE, e a caixa está reservada esperando por ela.

   TODO: entra aqui a foto da FACHADA DA FÁBRICA, em Guarulhos. Não é a mesma
   de `historia.img`, que continua sendo mockup declarado no dados.ts, e não é
   foto de ambiente — o que este quadro promete é "onde a gente fica", e uma
   cozinha entregue no lugar disso seria uma promessa trocada.

   Enquanto ela não chega: `aspect-ratio` reserva a proporção e `--ground-lift`
   pinta o vazio. NÃO ponha foto de banco de imagem nem de outro ambiente. Um
   quadro vazio e honesto é melhor que uma fachada que não é a nossa — a mesma
   régua que fez o banheiro sair da lista de /ambientes por não ter foto
   própria.

   Quando a foto entrar, ela precisa de `width`, `height`, `alt` e
   `loading="lazy"` — o quadro já reserva a caixa, então o CLS continua zero. */

export default function CartaoEndereco() {
  return (
    <div className="cartao">
      <div className="cartao__foto" aria-hidden="true" />

      <div className="cartao__miolo">
        <h3 className="label">Fábrica e loja</h3>

        {/* <address> é o elemento certo para o endereço de contato de quem
            publica a página. O itálico e a margem do UA saem no CSS. */}
        <address className="cartao__endereco">
          {contato.endereco.rua}
          <br />
          {contato.endereco.bairro}
          <br />
          {contato.endereco.cep}
        </address>

        <p className="cartao__horario">{contato.horario}</p>

        <ul className="cartao__canais">
          <li>
            <a className="cartao__link" href={`mailto:${contato.email}`}>
              {contato.email}
            </a>
          </li>
          <li>
            <a className="cartao__link" href={whatsappUrl} target="_blank" rel="noopener">
              {contato.whatsappExibicao}
            </a>
          </li>
        </ul>

        <BotaoMapa />
      </div>
    </div>
  );
}
