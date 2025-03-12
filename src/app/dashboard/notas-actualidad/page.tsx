"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FaChevronCircleLeft, FaChevronCircleRight  } from "react-icons/fa";

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
    imagenUrl:
      "/modulos/noticias/456663585_925409842956686_4941239586156668905_n.jpg",
    date: new Date("2024-08-21"),
  },
  {
    id: 2,
    description: "GOBERNADOR REGIONAL PRESIDIÓ REUNIÓN DEL CORESEC",
    detalles:
      "El gobernador regional de Ayacucho presidió la sesión ordinaria del Comité Regional de Seguridad Ciudadana (Coresec), informando sobre gestiones para aumentar la presencia policial en la región y mejorar la seguridad ciudadana.",
    imagenUrl: "/modulos/noticias/95e534f3665f78656ff3e024d8af694e.png",
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
  // Agrega más noticias según necesites...
];

export default function Home() {
  // Estado para la noticia seleccionada
  const [selectedNews, setSelectedNews] = useState<NewsItem>(news[0]);
  // Estado para controlar si se muestran todas las noticias o solo las primeras 4
  const [showAll, setShowAll] = useState(false);

  // Función para alternar la vista completa del carrusel
  const toggleShowAll = () => {
    setShowAll((prev) => !prev);
  };

  // Noticias a mostrar: si showAll es false, se muestran las primeras 4; si no, todas.
  const newsToShow = showAll ? news : news.slice(0, 3);

  return (
    <main className="h-full pt-12 bg-white flex items-center justify-center p-4">
      {/* Fondo de imagen con overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm"
        style={{
          backgroundImage: "url(/placeholder.svg?height=1080&width=1920)",
          opacity: 0.3,
        }}
      />
      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Izquierda: Texto y carrusel de noticias */}
        <div className="space-y-6 pt-6">
          <p className="text-gray-600 uppercase tracking-wider text-xl md:text-3xl mb-2">
            Noticias
          </p>
          <p className="text-gray-500 text-base md:text-lg leading-relaxed text-justify">
            En esta sección se muestran las noticias del Gobierno Regional de
            Ayacucho, manteniendo a la ciudadanía informada sobre los últimos
            avances, proyectos y decisiones que impactan la vida en la región.
          </p>

          {/* Carrusel horizontal */}
          <div className="flex space-x-4 space-y-2 overflow-x-auto snap-x snap-mandatory custom-scrollbar">
            {newsToShow.map((item) => (
              <div
                key={item.id}
                className={`min-w-[300px] bg-white rounded-xl shadow-md p-4 snap-start cursor-pointer transition-all ${
                  item.id === selectedNews.id ? "border-4 border-blue-600" : ""
                }`}
                onClick={() => setSelectedNews(item)}
              >
                <div className="relative h-40 w-full mb-2">
                  <Image
                    src={item.imagenUrl}
                    alt={item.description}
                    fill
                    className="object-cover rounded-md"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <p className="text-gray-500 text-sm">{item.description}</p>
                <p className="text-gray-400 text-xs">
                  {item.date.toLocaleDateString()}
                </p>
              </div>
            ))}

            {/* Botón para ver más o menos noticias */}
            {news.length > 4 && (
              <Button
                onClick={toggleShowAll}
                className={`${
                  showAll
                    ? "bg-amber-600 text-sky-100 hover:bg-amber-400"
                    : "bg-blue-600 text-sky-100 hover:bg-blue-400"
                } rounded-full px-6 transition-colors my-auto`}
              >
                {showAll ? <FaChevronCircleLeft /> : <FaChevronCircleRight />}
              </Button>
            )}
          </div>
        </div>

        {/* Derecha: Detalles de la noticia seleccionada */}
        <div className="rounded-lg overflow-hidden shadow-2xl bg-white p-6">
          <div className="relative h-64 w-full mb-4">
            <Image
              src={selectedNews.imagenUrl}
              alt={selectedNews.description}
              fill
              className="object-cover rounded-md"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <p className="text-gray-600 text-base mb-2">
            {selectedNews.description}
          </p>
          <p className="text-gray-400 text-sm mb-4">
            {selectedNews.date.toLocaleDateString()}
          </p>
          <p className="text-gray-700 text-lg text-justify">
            {selectedNews.detalles}
          </p>
        </div>
      </div>
    </main>
  );
}
