"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, MapPin, Heart, Info, Newspaper, Vote } from "lucide-react";

const objetivos = [
  {
    id: "objetivo1",
    titulo: "Objetivo prioritario N° 1",
    describe:
      "Gestión Territorial Estilos de Vida y las Condiciones del Entorno",
    images: [
      { id: 1, image: "/imgs/objetivo1/obj1.jpg" },
      { id: 2, image: "/imgs/objetivo1/obj2.jpg" },
      { id: 3, image: "/imgs/objetivo1/obj3.jpg" },
      { id: 4, image: "/imgs/objetivo1/obj4.jpg" },
    ],
  },
  {
    id: "objetivo2",
    titulo: "Objetivo prioritario N° 2",
    describe:
      "Salud Materno Neonatal. Desarrollo Infantil Temprano para asegurar su Inclusión Social",
    images: [
      { id: 1, image: "/imgs/objetivo2/obj5.jpg" },
      { id: 2, image: "/imgs/objetivo2/obj6.jpg" },
      { id: 3, image: "/imgs/objetivo2/obj7.jpg" },
      { id: 4, image: "/imgs/objetivo2/obj8.jpg" },
      { id: 5, image: "/imgs/objetivo2/obj9.jpg" },
    ],
  },
  {
    id: "objetivo3",
    titulo: "Objetivo prioritario N° 3",
    describe:
      "Garantizar el Desarrollo Físico Cognitivo y Socioemocional para la Protección y Participación de Niñas, Niños, Adolescentes y Jóvenes",
    images: [
      { id: 1, image: "/imgs/objetivo3/obj10.jpg" },
      { id: 2, image: "/imgs/objetivo3/obj11.jpg" },
      { id: 3, image: "/imgs/objetivo3/obj12.jpg" },
      { id: 4, image: "/imgs/objetivo3/obj13.jpg" },
      { id: 5, image: "/imgs/objetivo3/obj14.jpg" },
    ],
  },
  {
    id: "objetivo4",
    titulo: "Objetivo prioritario N° 4",
    describe:
      "Inclusión Económica para Mejorar la Seguridad Alimentaria Nutricional y Calidad de Vida de las Familias",
    images: [
      { id: 1, image: "/imgs/objetivo4/obj15.jpeg" },
      { id: 2, image: "/imgs/objetivo4/obj16.jpeg" },
      { id: 3, image: "/imgs/objetivo4/obj17.jpeg" },
      { id: 4, image: "/imgs/objetivo4/obj18.jpeg" },
      { id: 5, image: "/imgs/objetivo4/obj19.jpg" },
    ],
  },
  {
    id: "objetivo5",
    titulo: "Objetivo prioritario N° 5",
    describe:
      "Protección Social a Poblaciones Vulnerables y la Prevención de la Violencia contra la Mujer y los Integrantes del Grupo Familiar",
    images: [
      { id: 1, image: "/imgs/objetivo5/obj20.jpeg" },
      { id: 2, image: "/imgs/objetivo5/obj21.jpeg" },
      { id: 3, image: "/imgs/objetivo5/obj22.jpeg" },
      { id: 4, image: "/imgs/objetivo5/obj23.jpeg" },
      { id: 5, image: "/imgs/objetivo5/obj24.jpeg" },
      { id: 6, image: "/imgs/objetivo5/obj25.jpeg" },
      { id: 7, image: "/imgs/objetivo5/obj26.jpeg" },
    ],
  },
];

export default function HeroSection() {
  const [currentObjective, setCurrentObjective] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const currentObj = objetivos[currentObjective];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === currentObj.images.length - 1 ? 0 : prev + 1
      );
    }, 2000);
    return () => clearInterval(timer);
  }, [currentObjective, currentSlide, currentObj.images.length]);

  const prevObjective = () => {
    setCurrentObjective((prev) =>
      prev === 0 ? objetivos.length - 1 : prev - 1
    );
    setCurrentSlide(0);
  };

  const nextObjective = () => {
    setCurrentObjective((prev) =>
      prev === objetivos.length - 1 ? 0 : prev + 1
    );
    setCurrentSlide(0);
  };

  return (
    <div className="relative overflow-hidden w-full bg-red-600">
      <div className="flex flex-col md:flex-col lg:flex-row w-full h-auto md:h-[600px] lg:h-[700px]">
        {/* Lado Izquierdo: Imágenes e Indicadores */}
        <div className="relative w-full md:w-full lg:w-1/2 h-64 md:h-80 lg:h-full">
          {currentObj.images.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={slide.image}
                alt={`${currentObj.titulo} - Imagen ${slide.id}`}
                fill
                className="object-cover rounded-br-[8rem] lg:rounded-br-[16rem]"
                priority={index === 0 && currentObjective === 0}
              />
            </div>
          ))}
          {/* Indicadores de Slide */}
          <div className="absolute bottom-2 lg:bottom-4 left-1/2 z-10 flex -translate-x-1/2 space-x-2">
            {currentObj.images.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-6 lg:h-2 lg:w-8 rounded-full transition-colors ${
                  index === currentSlide ? "bg-white" : "bg-white/50"
                }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>

        {/* Lado Derecho: Contenedor para Tarjeta y Menú */}
        <div className="w-full md:w-full lg:w-1/2 flex flex-col justify-center p-4 md:p-6 text-white gap-6">
          {/* Tarjeta de Información - en dispositivos pequeños se muestra primero */}
          <Card className="order-1 md:order-2 border-none bg-primary/80 backdrop-blur-sm w-full">
            <CardContent className="p-4 lg:p-6">
              <h2 className="mb-2 text-lg md:text-xl lg:text-3xl font-bold text-white">
                {currentObj.titulo}
              </h2>
              <p className="mb-4 text-xs md:text-sm lg:text-lg text-blue-100">
                {currentObj.describe}
              </p>
              <div className="flex gap-4">
                <Button
                  variant="secondary"
                  className="group bg-gray-200 hover:bg-white text-sm md:text-base"
                >
                  Conocer más
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Menú - en dispositivos pequeños se muestra debajo */}
          <div className="order-2 md:order-1 flex flex-col md:flex-row bg-white rounded-2xl justify-center p-4 gap-4">
            <div className="flex items-center justify-center md:justify-start mb-4 md:mb-0">
              <Image
                src="/logos/barra_claro.png"
                alt="Logo Barra"
                width={200}
                height={26}
                className="cursor-pointer dark:hidden"
              />
            </div>
            <div className="flex flex-col md:flex-row w-full items-center justify-center space-y-4 md:space-y-0 md:space-x-4 gap-4">
              {/* Primera Columna */}
              <div className="flex w-full md:w-1/2 flex-col space-y-4">
                <div className="flex items-center justify-center text-black w-full h-16 md:h-20 text-center bg-amber-200 rounded-3xl p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <Users className="w-5 h-5 md:w-6 md:h-6 mr-2 text-amber-700" />
                  <span className="font-medium text-sm md:text-base">
                    ¿Cuántos Somos?
                  </span>
                </div>
                <div className="flex items-center justify-center text-black w-full h-16 md:h-20 text-center bg-emerald-200 rounded-3xl p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <MapPin className="w-5 h-5 md:w-6 md:h-6 mr-2 text-emerald-700" />
                  <span className="font-medium text-sm md:text-base">
                    ¿Dónde Estamos?
                  </span>
                </div>
                <div className="flex items-center justify-center text-black w-full h-16 md:h-20 text-center bg-fuchsia-200 rounded-3xl p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <Heart className="w-5 h-5 md:w-6 md:h-6 mr-2 text-fuchsia-700" />
                  <span className="font-medium text-sm md:text-base">
                    ¿Cómo Estamos?
                  </span>
                </div>
              </div>

              {/* Segunda Columna */}
              <div className="flex w-full md:w-1/2 flex-col space-y-4">
                <div className="flex items-center justify-center text-black w-full h-16 md:h-20 text-center bg-blue-200 rounded-3xl p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <Info className="w-5 h-5 md:w-6 md:h-6 mr-2 text-blue-700" />
                  <span className="font-medium text-sm md:text-base">
                    Normas e Información
                  </span>
                </div>
                <div className="flex items-center justify-center text-black w-full h-16 md:h-20 text-center bg-orange-200 rounded-3xl p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <Newspaper className="w-5 h-5 md:w-6 md:h-6 mr-2 text-orange-700" />
                  <span className="font-medium text-sm md:text-base">
                    Notas de Actualidad
                  </span>
                </div>
                <div className="flex items-center justify-center text-black w-full h-16 md:h-20 text-center bg-pink-200 rounded-3xl p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <Vote className="w-5 h-5 md:w-6 md:h-6 mr-2 text-pink-700" />
                  <span className="font-medium text-sm md:text-base">
                    Participación Ciudadana
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de Navegación */}
      <Button
        variant="outline"
        size="largeIcon"
        className="absolute left-2 md:left-3 lg:left-4 top-1/2 z-10 -translate-y-1/2 rounded-full border-none bg-primary/70 hover:bg-primary/90 text-primary"
        onClick={prevObjective}
      >
        <ChevronLeft className="text-white" />
      </Button>
      <Button
        variant="outline"
        size="largeIcon"
        className="absolute right-2 md:right-3 lg:right-4 top-1/2 z-10 -translate-y-1/2 rounded-full border-none bg-primary/70 hover:bg-primary/90 text-primary"
        onClick={nextObjective}
      >
        <ChevronRight className="text-white" />
      </Button>
    </div>
  );
}
