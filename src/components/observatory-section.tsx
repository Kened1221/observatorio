import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ObservatorySection() {
  return (
    <section className="bg-gradient-to-r from-gray-50 to-gray-100 py-16">
      <div className="container">
        <div className="mx-auto max-w-4xl text-center">
          <span className="mb-2 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            ACERCA DEL
          </span>
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">
            Observatorio Regional INCLUIR PARA CRECER AYACUCHO
          </h2>

          <div className="mb-8 h-1 w-24 bg-primary mx-auto"></div>

          <p className="mb-8 text-gray-600 leading-relaxed">
            Es un sistema de información que se encarga de producir,
            sistematizar y proveer conocimientos, sobre las políticas públicas
            de protección de la niñez y adolescencia, que aseguren el bienestar,
            las condiciones de vida y el ejercicio de sus derechos. Un
            Observatorio de la niñez y adolescencia nos permitiría trabajar en
            red, desde una perspectiva colaborativa y de coordinación
            intersectorial de todas las instituciones públicas y privadas,
            destinadas a la defensa y promoción de los derechos de las niñas,
            niños y adolescentes.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button className="group">
              Conocer más
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="outline">Descargar informes</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
