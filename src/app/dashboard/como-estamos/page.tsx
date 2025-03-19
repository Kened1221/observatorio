"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const dashboards = [
  {
    id: 1,
    title: "Salud y Nutrición",
    imageUrl: "/modulos/mod1.png",
    linkUrl: "/tematica/salud",
    description:
      "Descubre información esencial sobre salud, nutrición y bienestar integral.",
    borderColor: "border-green-500",
  },
  {
    id: 2,
    title: "Educación",
    imageUrl: "/modulos/mod2.png",
    linkUrl: "/tematica/educacion",
    description:
      "Explora programas educativos y políticas de desarrollo académico.",
    borderColor: "border-blue-500",
  },
  {
    id: 3,
    title: "Protección Social",
    imageUrl: "/modulos/mod3.png",
    linkUrl: "/tematica/proteccion",
    description:
      "Descubre iniciativas de protección social para sectores vulnerables.",
    borderColor: "border-purple-500",
  },
  {
    id: 4,
    title: "Servicios Básicos",
    imageUrl: "/modulos/mod4.png",
    linkUrl: "/tematica/servicios",
    description:
      "Información sobre acceso y mejoras en servicios públicos esenciales.",
    borderColor: "border-teal-500",
  },
  {
    id: 5,
    title: "Desarrollo Económico",
    imageUrl: "/modulos/mod5.png",
    linkUrl: "/tematica/desarrollo",
    description:
      "Análisis y datos sobre crecimiento económico y sostenibilidad.",
    borderColor: "border-amber-500",
  },
];

export default function CarouselDemo() {
  return (
    <div className="bg-white py-16 px-4">
      <div className="mx-auto mb-12 text-center px-4">
        <h2 className="text-4xl font-bold text-gray-800">Módulos Temáticos</h2>
        <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
          Descubre información clave organizada en módulos temáticos
          específicos.
        </p>
      </div>

      <Carousel
        opts={{
          align: "center",
          loop: true,
        }}
        className="w-full max-w-6xl mx-auto"
      >
        <CarouselContent>
          {dashboards.map((dashboard) => (
            <CarouselItem
              key={dashboard.id}
              className="sm:basis-1/2 md:basis-1/3 lg:basis-1/3 p-2"
            >
              <Link href={dashboard.linkUrl} className="h-full">
                <Card
                  className={`overflow-hidden transition-transform duration-300 group-hover:-translate-y-1 border-t-4 ${dashboard.borderColor} cursor-grabbing`}
                >
                  <div className="relative aspect-video w-full rounded-t-xl overflow-hidden">
                    <Image
                      src={dashboard.imageUrl}
                      alt={dashboard.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {dashboard.title}
                    </h3>
                    <p className="text-gray-600 text-sm mt-2">
                      {dashboard.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="bg-white/70 backdrop-blur-md" />
        <CarouselNext className="bg-white/70 backdrop-blur-md" />
      </Carousel>
    </div>
  );
}
