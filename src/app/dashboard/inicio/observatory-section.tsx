import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ObservatorySection() {
  return (
    <section
      className="bg-white py-16 flex items-center"
      aria-labelledby="observatory-heading"
    >
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <span className="mb-2 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            ACERCA DEL
          </span>
          <h2
            id="observatory-heading"
            className="mb-6 text-3xl font-bold md:text-4xl"
          >
            Observatorio Regional INCLUIR PARA CRECER AYACUCHO
          </h2>
          <div className="mx-auto mb-8 h-1 w-24 bg-primary"></div>
          <p className="mb-8 text-gray-600 leading-relaxed">
            Es un sistema de información que se encarga de producir,
            sistematizar y proveer conocimientos sobre las políticas públicas de
            protección de la niñez y adolescencia, que aseguren el bienestar,
            las condiciones de vida y el ejercicio de sus derechos. Un
            Observatorio de la niñez y adolescencia nos permitiría trabajar en
            red, desde una perspectiva colaborativa y de coordinación
            intersectorial de todas las instituciones públicas y privadas,
            destinadas a la defensa y promoción de los derechos de las niñas,
            niños y adolescentes.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              className="bg-black hover:bg-neutral-800"
              aria-label="Conocer más sobre el observatorio"
            >
              <Link
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-row items-center"
              >
                Conocer más
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              variant="outline"
              aria-label="Descargar informes del observatorio"
            >
              Descargar informes
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
