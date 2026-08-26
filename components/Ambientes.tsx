import { ImageGallery } from "./ui/image-gallery";

export default function Ambientes() {
  return (
    <section className="section wrap overflow-hidden" id="ambientes" aria-labelledby="t-amb">
      <div className="section__head rise">
        <h2 className="h2" id="t-amb">
          Cada ambiente tem a sua régua.
        </h2>
        <p className="lede">
          Uma cozinha se resolve por circulação e altura de bancada. Um closet, por volumetria e
          iluminação interna. São projetos diferentes, e o site trata cada um no seu próprio
          capítulo.
        </p>
      </div>

      <ImageGallery />
    </section>
  );
}
