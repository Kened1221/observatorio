"use client";
import Card3 from "@/components/animation/card/card3";

interface Topic {
  id: number;
  title: string;
  imageUrl: string;
  linkUrl: string;
  description: string;
  backend: string;
  borderColor: string;
  frontend: string;
}

const topics: Topic[] = [
  {
    id: 1,
    title: "Salud y nutrición",
    imageUrl: "/modulos/mod1.png",
    linkUrl: "/tematica//salud",
    description:
      "Descubre consejos y noticias sobre salud y nutrición para mejorar tu calidad de vida.",
    backend: "#EF4444",
    borderColor: "#EF4444",
    frontend: "#fff",
  },
  {
    id: 2,
    title: "Educación",
    imageUrl: "/modulos/mod2.png",
    linkUrl: "/tematica/educacion",
    description:
      "Recursos y actualizaciones en el ámbito educativo para todos los niveles.",
    backend: "#e67e22",
    borderColor: "#e67e22",
    frontend: "#fff",
  },
  {
    id: 3,
    title: "Protección social",
    imageUrl: "/modulos/mod3.png",
    linkUrl: "/tematica/proteccion",
    description:
      "Información sobre programas y políticas de protección social.",
    backend: "#9b59b6",
    borderColor: "#8e44ad",
    frontend: "#fff",
  },
  {
    id: 4,
    title: "Accesos servicios básicos",
    imageUrl: "/modulos/mod4.png",
    linkUrl: "/tematica/servicios",
    description:
      "Acceso a información de servicios básicos y su disponibilidad.",
    backend: "#006995",
    borderColor: "#006995",
    frontend: "#fff",
  },
  {
    id: 5,
    title: "Desarrollo Económico y Empleo",
    imageUrl: "/modulos/mod5.png",
    linkUrl: "/tematica/desarrollo",
    description:
      "Análisis y noticias sobre el crecimiento y desarrollo económico.",
    backend: "#e74c3c",
    borderColor: "#e74c3c",
    frontend: "#fff",
  },
  {
    id: 6,
    title: "Política Incluir para crecer",
    imageUrl: "/modulos/mod6.png",
    linkUrl: "/tematica/politica",
    description:
      "Debates y propuestas para una política inclusiva que fomente el crecimiento.",
    backend: "#e91e63",
    borderColor: "#e91e63",
    frontend: "#fff",
  },
];

export default function TopicsGrid() {
  return (
    <div className="w-full h-full py-12">
      <div className="flex flex-col space-y-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Módulos Temáticos
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Explora información clave organizada en módulos temáticos diseñados
            para ofrecer datos relevantes y accionables.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6  justify-items-center">
          {topics.map((topic) => (
            <Card3 key={topic.id} topic={topic} />
          ))}
        </div>
      </div>
    </div>
  );
}
