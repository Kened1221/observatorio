"use client";

import { useState } from "react";
import ContainerGestantes from "./gestantes/page";
import ContainerNino from "./ninos/page";
import ContainerAdolescentes from "./adolescentes/page";
import ContainerJovenes from "./jovenes/page";
import ContainerAdultos from "./adultos/page";
import ContainerAdultosMayores from "./adultos-mayores/page";

const categorias = [
  { nombre: "Gestantes", color: "#ec4899", component: ContainerGestantes },
  { nombre: "Ninos", color: "#f59e0b", component: ContainerNino },
  { nombre: "Adolescentes", color: "#8b5cf6", component: ContainerAdolescentes },
  { nombre: "Jovenes", color: "#06b6d4", component: ContainerJovenes },
  { nombre: "Adultos", color: "#10b981", component: ContainerAdultos },
  { nombre: "Adultos-Mayores", color: "#ef4444", component: ContainerAdultosMayores },
];

export default function Page() {
  const [categoria, setCategoria] = useState(categorias[0].nombre);

  const categoriaActual = categorias.find((c) => c.nombre === categoria);

  // Asegurar siempre un componente válido por defecto
  const ComponenteActual = categoriaActual?.component || (() => <div>Selecciona una categoría</div>);

  return (
    <div className="w-full h-full flex flex-col lg:flex-row pt-16 max-w-7xl mx-auto gap-8 p-4">
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
              backgroundColor: categoria === item.nombre ? item.color : undefined,
            }}
            onClick={() => setCategoria(item.nombre)}
          >
            {item.nombre}
          </div>
        ))}
      </div>

      <div
        className="h-full flex-1 p-6 rounded-xl shadow-lg text-white"
        style={{ backgroundColor: categoriaActual?.color || "#cccccc" }}
      >
        <ComponenteActual />
      </div>
    </div>
  );
}
