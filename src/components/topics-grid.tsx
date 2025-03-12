"use client";

import Card from "./animation/card";

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
    backend: "#E6E6E6",      // Verde vibrante
    borderColor: "#000000",  // Verde oscuro coordinado
    frontend: "#E6E6E6",
  },
  {
    id: 2,
    title: "Educación",
    imageUrl: "/modulos/mod2.png",
    linkUrl: "/tematica/educacion",
    description:
      "Recursos y actualizaciones en el ámbito educativo para todos los niveles.",
    backend: "#e67e22",      // Azul vibrante
    borderColor: "#d35400",  // Azul oscuro coordinado
    frontend: "#FBCB0E",
  },
  {
    id: 3,
    title: "Protección social",
    imageUrl: "/modulos/mod3.png",
    linkUrl: "/tematica/proteccion",
    description:
      "Información sobre programas y políticas de protección social.",
    backend: "#9b59b6",      // Naranja vibrante
    borderColor: "#8e44ad",  // Naranja oscuro coordinado
    frontend: "#B39FBB",
  },
  {
    id: 4,
    title: "Accesos servicios básicos",
    imageUrl: "/modulos/mod4.png",
    linkUrl: "/tematica/servicios",
    description:
      "Acceso a información de servicios básicos y su disponibilidad.",
    backend: "#006995",      // Púrpura vibrante
    borderColor: "#0000FE",  // Púrpura oscuro coordinado
    frontend: "#B39FBB",
  },
  {
    id: 5,
    title: "Desarrollo Económico",
    imageUrl: "/modulos/mod5.png",
    linkUrl: "/tematica/desarrollo",
    description:
      "Análisis y noticias sobre el crecimiento y desarrollo económico.",
    backend: "#e74c3c",      // Rojo vibrante
    borderColor: "#c0392b",  // Rojo oscuro coordinado
    frontend: "#E6E6E6",
  },
  {
    id: 6,
    title: "Política Incluir para crecer",
    imageUrl: "/modulos/mod6.png",
    linkUrl: "/tematica/politica",
    description:
      "Debates y propuestas para una política inclusiva que fomente el crecimiento.",
    backend: "#e91e63",      // Magenta vibrante
    borderColor: "#d81b60",  // Magenta oscuro coordinado
    frontend: "#E6E6E6",
  },
  {
    id: 7,
    title: "Normas e informes",
    imageUrl: "/modulos/mod7.png",
    linkUrl: "/tematica/normas",
    description:
      "Normativas, informes y análisis críticos sobre el contexto actual.",
    backend: "#1abc9c",      // Turquesa vibrante
    borderColor: "#16a085",  // Turquesa oscuro coordinado
    frontend: "#E6E6E6",
  },
  {
    id: 8,
    title: "Notas de actualidad",
    imageUrl: "/modulos/mod8.png",
    linkUrl: "/tematica/notas",
    description:
      "Últimas noticias y notas de actualidad para mantenerte informado.",
    backend: "#3f51b5",      // Índigo vibrante
    borderColor: "#303f9f",  // Índigo oscuro coordinado
    frontend: "#E6E6E6",
  },
  {
    id: 9,
    title: "Participación ciudadana",
    imageUrl: "/modulos/mod9.png",
    linkUrl: "/dashboard/participacion-ciudadana",
    description:
      "Espacio para la participación y el diálogo ciudadano sobre temas relevantes.",
    backend: "#8bc34a",      // Verde lima vibrante
    borderColor: "#689f38",  // Verde lima oscuro coordinado
    frontend: "#E6E6E6",
  },
];

export default function TopicsGrid() {
  return (
    <div className="w-full h-full py-8">
      <div className="flex flex-col space-y-4 max-w-7xl mx-auto">
        <h2 className="mb-8 sm:mb-10 text-center text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-200">
          Temáticas
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6  justify-items-center">
          {topics.map((topic) => (
            <div key={topic.id} className="h-full w-full p-4">
              <Card
                title={topic.title}
                imageUrl={topic.imageUrl}
                linkUrl={topic.linkUrl}
                description={topic.description}
                backend={topic.backend}
                borderColor={topic.borderColor}
                frontend={topic.frontend}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
