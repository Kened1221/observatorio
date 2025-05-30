"use client";
import { useState } from "react";
import { Download, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const resoluciones = [
  {
    title:
      "Desarrollo Infantil Temprano en niñas y niños menores de 6 años de edad 2023",
    description: "ENDES 2023",
    link: "#",
  },
  {
    title: "Encuesta Demográfica y de Salud Familiar 2023",
    description: "ENDES 2023 - Nacional y Departamental",
    link: "#",
  },
  {
    title:
      "Desarrollo Infantil Temprano en niñas y niños menores de 6 años de edad 2022",
    description: "ENDES 2022",
    link: "#",
  },
  {
    title:
      "Desarrollo Infantil Temprano en niñas y niños menores de 6 años de edad 2021",
    description: "ENDES 2021",
    link: "#",
  },
  {
    title:
      "Desarrollo Infantil Temprano en niñas y niños menores de 6 años de edad 2023",
    description: "ENDES 2023",
    link: "#",
  },
  {
    title: "Encuesta Demográfica y de Salud Familiar 2023",
    description: "ENDES 2023 - Nacional y Departamental",
    link: "#",
  },
  {
    title:
      "Desarrollo Infantil Temprano en niñas y niños menores de 6 años de edad 2022",
    description: "ENDES 2022",
    link: "#",
  },
  {
    title:
      "Desarrollo Infantil Temprano en niñas y niños menores de 6 años de edad 2021",
    description: "ENDES 2021",
    link: "#",
  },
  {
    title:
      "Desarrollo Infantil Temprano en niñas y niños menores de 6 años de edad 2023",
    description: "ENDES 2023",
    link: "#",
  },
  {
    title: "Encuesta Demográfica y de Salud Familiar 2023",
    description: "ENDES 2023 - Nacional y Departamental",
    link: "#",
  },
  {
    title:
      "Desarrollo Infantil Temprano en niñas y niños menores de 6 años de edad 2022",
    description: "ENDES 2022",
    link: "#",
  },
  {
    title:
      "Desarrollo Infantil Temprano en niñas y niños menores de 6 años de edad 2021",
    description: "ENDES 2021",
    link: "#",
  },
];

export default function ContainerInformes() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = resoluciones.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(resoluciones.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="max-w-5xl mx-auto px-2 lg:px-4 py-2">
      {currentItems.map((resolucion, index) => (
        <div
          key={index}
          className={`mb-6 p-6 rounded-lg shadow-md ${
            index % 2 === 0 ? "bg-white" : "bg-gray-50"
          }`}
        >
          <h2 className="text-2xl font-medium text-sky-600 mb-4">
            {resolucion.title}
          </h2>
          <p className="text-gray-700 mb-4">{resolucion.description}</p>
          <div className="flex justify-end">
            <Button className="bg-sky-600 hover:bg-sky-700">
              <Download className="mr-2 h-4 w-4" />
              Descargar
            </Button>
          </div>
        </div>
      ))}

      <div className="flex justify-center mt-10 items-center gap-2">
        <Button
          variant="outline"
          className="px-3 py-2"
          disabled={currentPage === 1}
          onClick={prevPage}
        >
          <ChevronLeft className="w-5 h-5 text-black" />
        </Button>

        <span className="px-4 py-2 bg-sky-600 text-white rounded-md">
          {currentPage} de {totalPages}
        </span>

        <Button
          variant="outline"
          className="px-3 py-2"
          disabled={currentPage === totalPages}
          onClick={nextPage}
        >
          <ChevronRight className="w-5 h-5 text-black" />
        </Button>
      </div>
    </div>
  );
}
