/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getNews } from "@/actions/notar-actualidad";

interface NewsItem {
  id: string; // Changed from number to string to match Image.id (cuid)
  description: string;
  detalles: string;
  imagenUrl: string;
  date: Date;
}

export default function Home() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNews() {
      try {
        setLoading(true);
        const response = await getNews();
        console.log(response);

        if (response.status === 200 && response.data.length > 0) {
          setNews(response.data);
          setSelectedNews(response.data[0]);
        } else {
          setError(response.message || "No se encontraron noticias");
        }
      } catch {
        setError("Error al cargar las noticias");
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  const handleNewsClick = (item: NewsItem) => {
    setSelectedNews(item);
  };

  return (
    <div className="flex h-full pt-12 bg-white items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 gap-8 items-start">
        <p className="text-gray-600 tracking-wider text-xl md:text-3xl mb-2 text-center sm:text-start">
          Noticias
        </p>
        <p className="text-gray-500 text-base md:text-lg leading-relaxed text-justify">
          En esta sección se muestran las noticias del Gobierno Regional de
          Ayacucho, manteniendo a la ciudadanía informada sobre los últimos
          avances, proyectos y decisiones que impactan la vida en la región.
        </p>

        {loading ? (
          <div className="text-center text-gray-600">Cargando noticias...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : news.length === 0 ? (
          <div className="text-center text-gray-600">
            No hay noticias disponibles
          </div>
        ) : (
          <>
            <div className="w-full flex justify-center px-4 sm:px-10">
              <Carousel className="w-full max-w-7xl">
                <CarouselContent className="flex">
                  {news.map((item) => (
                    <CarouselItem
                      key={item.id}
                      className="md:basis-1/2 lg:basis-1/4"
                      onClick={() => handleNewsClick(item)}
                    >
                      <Card
                        className={`cursor-pointer ${selectedNews?.id === item.id
                          ? "border-4 border-blue-500"
                          : ""
                          }`}
                      >
                        <CardContent className="flex flex-col items-center p-3 h-[300px]">
                          <div className="relative w-full h-40 rounded-lg overflow-hidden">
                            <img
                              src={item.imagenUrl || ""}
                              alt={item.description}
                              className="w-full h-full object-cover"
                              width={500}
                              height={500}
                            />
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm font-semibold mt-2 text-justify">
                              {item.description}
                            </p>
                            <p className="text-xs text-gray-500 text-right">
                              {item.date.toLocaleDateString("es-ES", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
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

            {selectedNews && (
              <div className="flex flex-col lg:flex-row gap-6 mt-4 w-full rounded-2xl px-6 py-8 bg-white shadow-2xl">
                <div className="relative w-full lg:w-2/3 h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src={selectedNews.imagenUrl}
                    alt={selectedNews.description}
                    className="w-full h-full object-cover"
                    width={500}
                    height={500}
                  />
                </div>
                <div className="flex flex-col lg:w-1/3 p-2 text-justify">
                  <p className="text-gray-800 font-semibold text-xl sm:text-2xl mb-2">
                    {selectedNews.description}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {selectedNews.date.toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <div className="border-t border-gray-200 my-4"></div>
                  <p className="text-gray-700 text-base sm:text-lg">
                    {selectedNews.detalles}
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
