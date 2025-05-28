"use client"
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

const images = [
  {
    src: "/mujer/1.jpg",
    alt: "Equipo del Observatorio trabajando",
    caption: "Nuestro equipo analizando datos sobre violencia de género"
  },
  {
    src: "/mujer/2.jpg",
    alt: "Taller de capacitación",
    caption: "Coordinación con autoridades para políticas públicas efectivas"
  },
  {
    src: "/mujer/3.jpg",
    alt: "Reunión con autoridades",
    caption: "Talleres de capacitación para prevenir la violencia contra la mujer"
  }
];

export default function ObservatorySection() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000); // Cambia cada 5 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-white py-16 md:py-20" aria-labelledby="observatory-heading">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <span className="mb-2 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              ACERCA DEL OBSERVATORIO
            </span>
            <h2
              id="observatory-heading"
              className="mb-6 text-3xl font-bold md:text-4xl lg:text-5xl"
            >
              Observatorio Regional de la Mujer Ayacucho
            </h2>
            <div className="mx-auto mb-8 h-1 w-24 bg-primary"></div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
            <div className="w-full lg:w-1/2">
              <div className="relative h-80 md:h-96 rounded-xl overflow-hidden shadow-xl border-4 border-white">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentImage ? 'opacity-100' : 'opacity-0'}`}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={index === 0}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-6">
                      <p className="text-sm md:text-base font-medium">{image.caption}</p>
                    </div>
                  </div>
                ))}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImage(index)}
                      className={`w-3 h-3 rounded-full transition-all ${index === currentImage ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/70'}`}
                      aria-label={`Mostrar imagen ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/2 space-y-6">
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed md:text-lg text-justify">
                  <span className="font-semibold text-primary">El Observatorio Regional de la Mujer</span> es un sistema
                  especializado en el monitoreo y análisis de datos sobre la situación
                  de las mujeres en nuestra región, con enfoque en la erradicación de
                  la violencia de género.
                </p>
                <p className="text-gray-700 leading-relaxed md:text-lg text-justify">
                  Generamos <span className="font-semibold">evidencia estadística</span> que sustenta políticas públicas
                  efectivas para prevenir y atender la violencia contra la mujer,
                  promoviendo la igualdad de género y el ejercicio pleno de sus derechos.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button
                  className="bg-black hover:bg-neutral-700 text-white group transition-all hover:shadow-lg"
                  asChild
                >
                  <Link
                    href="https://observatorioayacucho.pe/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-row items-center px-6 py-3"
                  >
                    <span className="mr-2 font-medium">Visitar Observatorio</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10 group transition-all hover:shadow-lg"
                  asChild
                >
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}