"use client";

import { useState } from "react";
import Image from "next/image";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface NewsItem {
  id: number;
  description: string;
  detalles: string;
  imagenUrl: string;
  date: Date;
}

const news: NewsItem[] = [
  {
    id: 1,
    description:
      "GOBERNADOR ANUNCIÓ CREACIÓN DEL ÁREA DE CONSERVACIÓN DE RAZUHUILLCA",
    detalles:
      "El jefe de la Autoridad Nacional del Agua (ANA) entregó al gobernador regional de Ayacucho la Resolución Directoral que aprueba el estudio para identificar y delimitar la Cuenca del Mantaro, sector Razuhuillca. Oscorima Núñez anunció la creación del área de conservación, priorizando el agua sobre las actividades mineras.",
    imagenUrl: "/modulos/noticias/95e534f3665f78656ff3e024d8af694e.png",
    date: new Date("2024-08-21"),
  },
  {
    id: 2,
    description: "GOBERNADOR REGIONAL PRESIDIÓ REUNIÓN DEL CORESEC",
    detalles:
      "El gobernador regional de Ayacucho presidió la sesión ordinaria del Comité Regional de Seguridad Ciudadana (Coresec), informando sobre gestiones para aumentar la presencia policial en la región y mejorar la seguridad ciudadana.",
    imagenUrl:
      "/modulos/noticias/456663585_925409842956686_4941239586156668905_n.jpg",
    date: new Date("2024-08-21"),
  },
  {
    id: 3,
    description:
      "GOBIERNO REGIONAL ASIGNARÁ PRESUPUESTO Y GARANTIZA CONTINUIDAD DE PROYECTO ANCASCOCHA",
    detalles:
      "El gerente general del Gobierno Regional de Ayacucho garantizó el presupuesto y la continuidad del proyecto de ampliación de la presa Ancascocha, tras reunirse con dirigentes y representantes de comités de regantes.",
    imagenUrl:
      "/modulos/noticias/Opera_Captura_de_pantalla_2024-08-21_142606_www.facebook.com.png",
    date: new Date("2024-08-20"),
  },
  {
    id: 4,
    description: "GOBERNADOR REGIONAL PRESIDIÓ REUNIÓN DEL CORESEC",
    detalles:
      "El gobernador regional de Ayacucho presidió la sesión ordinaria del Coresec, dando a conocer gestiones para incrementar la presencia policial en la región y mejorar la seguridad.",
    imagenUrl: "/modulos/noticias/95e534f3665f78656ff3e024d8af694e.png",
    date: new Date("2024-08-20"),
  },
  {
    id: 5,
    description:
      "GOBIERNO REGIONAL ASIGNARÁ PRESUPUESTO Y GARANTIZA CONTINUIDAD DE PROYECTO ANCASCOCHA",
    detalles:
      "El gerente general aseguró la asignación de presupuesto y la continuidad del proyecto de ampliación de la presa Ancascocha, reafirmando el compromiso con el desarrollo regional.",
    imagenUrl:
      "/modulos/noticias/Opera_Captura_de_pantalla_2024-08-21_142606_www.facebook.com.png",
    date: new Date("2024-08-19"),
  },
  {
    id: 6,
    description:
      "GOBIERNO REGIONAL ASIGNARÁ PRESUPUESTO Y GARANTIZA CONTINUIDAD DE PROYECTO ANCASCOCHA",
    detalles:
      "El gerente general aseguró la asignación de presupuesto y la continuidad del proyecto de ampliación de la presa Ancascocha, reafirmando el compromiso con el desarrollo regional.",
    imagenUrl:
      "/modulos/noticias/456663585_925409842956686_4941239586156668905_n.jpg",
    date: new Date("2024-08-19"),
  },
];

export default function Home() {
  const [selectedNews, setSelectedNews] = useState<NewsItem>(news[0]);

  const handleNewsClick = (item: NewsItem) => {
    setSelectedNews(item);
  };

  return (
    <div className="flex h-full pt-12 bg-white items-center justify-center p-4">
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 gap-8 items-start">
        <p className="text-gray-600  tracking-wider text-xl md:text-3xl mb-2 text-center sm:text-start">
          Noticias
        </p>
        <p className="text-gray-500 text-base md:text-lg leading-relaxed text-justify">
          En esta sección se muestran las noticias del Gobierno Regional de
          Ayacucho, manteniendo a la ciudadanía informada sobre los últimos
          avances, proyectos y decisiones que impactan la vida en la región.
        </p>

        <div className="w-full flex justify-center px-10">
          <Carousel className="w-full max-w-7xl">
            <CarouselContent className="flex">
              {news.map((item) => (
                <CarouselItem
                  key={item.id}
                  className="md:basis-1/2 lg:basis-1/4"
                  onClick={() => handleNewsClick(item)}
                >
                  <Card
                    className={`cursor-grabbing ${
                      selectedNews.id === item.id
                        ? "border-4 border-blue-500"
                        : ""
                    }`}
                  >
                    <CardContent className="flex flex-col items-center p-3 h-[300px]">
                      <div className="relative w-full h-40 rounded-lg overflow-hidden">
                        <Image
                          src={item.imagenUrl}
                          alt={item.description}
                          layout="fill"
                          className="object-cover"
                        />
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-semibold mt-2 text-justify">
                          {item.description}
                        </p>
                        <p className="text-xs text-gray-500 items-end justify-end">
                          {item.date.toLocaleDateString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mt-4 w-full rounded-2xl px-6 py-8 bg-white shadow-2xl">
          <div className="relative w-full lg:w-2/3 h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-xl">
            <Image
              src={selectedNews.imagenUrl}
              alt={selectedNews.description}
              fill
              className="object-cover rounded-2xl"
              sizes="(max-width: 768px) 100vw, 100vw"
            />
          </div>
          <div className="flex flex-col lg:w-1/3 p-2 text-justify">
            <p className="text-gray-800 font-semibold text-2xl mb-2">
              {selectedNews.description}
            </p>
            <p className="text-gray-400 text-sm">
              {selectedNews.date.toLocaleDateString()}
            </p>
            <div className="border-t border-gray-200 my-4"></div>
            <p className="text-gray-700 text-lg">{selectedNews.detalles}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
