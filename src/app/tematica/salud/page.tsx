/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ContainerGestantes from "./gestantes/page";
import ContainerNino from "./ninos/page";
import { useState } from "react";

const categorias = [
  {
    nombre: "Indicadores de acceso, cobertura de calidad",
    color: "#0A7BBA",
    component: ContainerGestantes,
  },
  {
    nombre: "Vigilancia Epidemiológica",
    color: "#f59e0b",
    component: ContainerNino,
  },
];

export default function Page() {
  const [categoria, setCategoria] = useState(categorias[0].nombre);

  const categoriaActual = categorias.find((c) => c.nombre === categoria);
  // ComponenteActual should always be a valid component
  const ComponenteActual =
    categoriaActual?.component || (() => <div>Selecciona una categoría</div>);

  return (
    <div className="w-full h-full flex flex-col lg:flex-row pt-16 max-w-[80%] mx-auto gap-8 p-4">
      {/* Menú lateral */}
      <div className="flex flex-col h-full w-full lg:w-1/5 gap-4">
        {categorias.map((item) => (
          <div
            key={item.nombre}
            className={`rounded-xl p-2 text-center cursor-pointer transition ${
              categoria === item.nombre
                ? "text-white shadow-lg"
                : "bg-gray-200 text-gray-700"
            }`}
            style={{
              backgroundColor:
                categoria === item.nombre ? item.color : undefined,
            }}
            onClick={() => setCategoria(item.nombre)}
          >
            {item.nombre}
          </div>
        ))}
      </div>

      <div className="h-full w-full flex flex-col md:flex-row gap-2">
        <div
          className="h-full flex-1 p-6 rounded-xl shadow-lg text-white"
          style={{ backgroundColor: categoriaActual?.color || "#cccccc" }}
        >
          <ComponenteActual />
        </div>
      </div>
    </div>
  );
}
