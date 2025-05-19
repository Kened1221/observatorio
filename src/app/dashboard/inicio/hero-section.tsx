"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface Objective {
  id: string;
  titulo: string;
  describe: string;
  url: string;
  images: { id: number; image: string }[];
  logo: string;
}

const objetivos: Objective[] = [
  {
    id: "objetivo1",
    titulo: "Objetivo prioritario N° 1",
    describe:
      "Gestión Territorial Estilos de Vida y las Condiciones del Entorno",
    url: "/objetivos/objetivo1",
    images: [
      { id: 1, image: "/imgs/objetivo1/obj1.jpg" },
      { id: 2, image: "/imgs/objetivo1/obj2.jpg" },
      { id: 3, image: "/imgs/objetivo1/obj3.jpg" },
      { id: 4, image: "/imgs/objetivo1/obj4.jpg" },
    ],
    logo: "/imgs/jaguar.png",
  },
  {
    id: "objetivo2",
    titulo: "Objetivo prioritario N° 2",
    describe:
      "Salud Materno Neonatal. Desarrollo Infantil Temprano para asegurar su Inclusión Social",
    url: "/objetivos/objetivo2",
    images: [
      { id: 1, image: "/imgs/objetivo2/obj5.jpg" },
      { id: 2, image: "/imgs/objetivo2/obj6.jpg" },
      { id: 3, image: "/imgs/objetivo2/obj7.jpg" },
      { id: 4, image: "/imgs/objetivo2/obj8.jpg" },
      { id: 5, image: "/imgs/objetivo2/obj9.jpg" },
    ],
    logo: "/imgs/vicuna.png",
  },
  {
    id: "objetivo3",
    titulo: "Objetivo prioritario N° 3",
    describe:
      "Garantizar el Desarrollo Físico Cognitivo y Socioemocional para la Protección y Participación de Niñas, Niños, Adolescentes y Jóvenes",
    url: "/objetivos/objetivo3",
    images: [
      { id: 1, image: "/imgs/objetivo3/obj10.jpg" },
      { id: 2, image: "/imgs/objetivo3/obj11.jpg" },
      { id: 3, image: "/imgs/objetivo3/obj12.jpg" },
      { id: 4, image: "/imgs/objetivo3/obj13.jpg" },
      { id: 5, image: "/imgs/objetivo3/obj14.jpg" },
    ],
    logo: "/imgs/perro.png",
  },
  {
    id: "objetivo4",
    titulo: "Objetivo prioritario N° 4",
    describe:
      "Inclusión Económica para Mejorar la Seguridad Alimentaria Nutricional y Calidad de Vida de las Familias",
    url: "/objetivos/objetivo4",
    images: [
      { id: 1, image: "/imgs/objetivo4/obj15.jpeg" },
      { id: 2, image: "/imgs/objetivo4/obj16.jpeg" },
      { id: 3, image: "/imgs/objetivo4/obj17.jpeg" },
      { id: 4, image: "/imgs/objetivo4/obj18.jpeg" },
      { id: 5, image: "/imgs/objetivo4/obj19.jpg" },
    ],
    logo: "/imgs/condor.png",
  },
  {
    id: "objetivo5",
    titulo: "Objetivo prioritario N° 5",
    describe:
      "Protección Social a Poblaciones Vulnerables y la Prevención de la Violencia contra la Femenino y los Integrantes del Grupo Familiar",
    url: "/objetivos/objetivo5",
    images: [
      { id: 1, image: "/imgs/objetivo5/obj20.jpeg" },
      { id: 2, image: "/imgs/objetivo5/obj21.jpeg" },
      { id: 3, image: "/imgs/objetivo5/obj22.jpeg" },
      { id: 4, image: "/imgs/objetivo5/obj23.jpeg" },
      { id: 5, image: "/imgs/objetivo5/obj24.jpeg" },
      { id: 6, image: "/imgs/objetivo5/obj25.jpeg" },
      { id: 7, image: "/imgs/objetivo5/obj26.jpeg" },
    ],
    logo: "/imgs/gallito.png",
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
  }, [currentObjective, currentObj.images.length]);

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
      <div className="flex flex-col md:flex-row w-full h-auto md:h-[600px] lg:h-[700px]">
        {/* Left Side: Images and Indicators */}
        <div className="relative w-full md:w-1/2 h-64 md:h-80 lg:h-full">
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

        {/* Right Side: Card and Menu */}
        <div className="relative w-full md:w-1/2 h-64 md:h-full flex justify-center items-center overflow-hidden">
          <Image
            src={currentObj.logo}
            alt={`${currentObj.titulo} Logo`}
            fill
            className="object-contain opacity-20 scale-110"
            priority
          />
          <Card className="absolute z-10 w-full bg-transparent shadow-none border-none flex items-start justify-center">
            <CardContent className="p-4 md:p-6 space-y-12 w-full">
              <h2 className="text-2xl md:text-5xl lg:text-7xl font-extrabold text-white tracking-tight text-left">
                {currentObj.titulo}
              </h2>
              <p className="text-xl md:text-base lg:text-2xl text-gray-100 text-justify leading-relaxed">
                {currentObj.describe}
              </p>
              <Button
                variant="default"
                className="group bg-white/90 hover:bg-white text-gray-900 font-semibold px-6 py-2 rounded-full shadow-md transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                <Link
                  href={currentObj.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm md:text-base"
                >
                  Conocer más
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Button
        variant="outline"
        size="icon"
        className="absolute left-2 md:left-3 lg:left-4 top-1/2 z-10 -translate-y-1/2 rounded-full border-none bg-background/70 hover:bg-background/90"
        onClick={prevObjective}
      >
        <ChevronLeft className="text-gray-900" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-2 md:right-3 lg:right-4 top-1/2 z-10 -translate-y-1/2 rounded-full border-none bg-background/70 hover:bg-background/90"
        onClick={nextObjective}
      >
        <ChevronRight className="text-gray-900" />
      </Button>
    </div>
  );
}
