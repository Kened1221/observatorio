"use client"
import GeoJsonSvg from "@/components/map/GeoJsonSvg";
import { useState } from "react";

const Page: React.FC = () => {
  const [provincia, setProvincias] = useState("all")
  const distritos = [
    { nombre: "ANDRES AVELINO CACERES DORREGARAY", puntuacion: 259 },
    { nombre: "SOCOS", puntuacion: 1921 },
    { nombre: "OCROS", puntuacion: 34 },
    { nombre: "CHIARA", puntuacion: 12 },
    { nombre: "SAN JUAN BAUTISTA", puntuacion: 56 },
    { nombre: "ACOS VINCHOS", puntuacion: 12 },
    { nombre: "CARMEN ALTO", puntuacion: 89 },
    { nombre: "ACOCRO", puntuacion: 68 },
    { nombre: "TAMBILLO", puntuacion: 1141 },
    { nombre: "SANTIAGO DE PISCHA", puntuacion: 2285 },
    { nombre: "VINCHOS", puntuacion: 100 },
    { nombre: "AYACUCHO", puntuacion: 99 },
    { nombre: "JESUS NAZARENO", puntuacion: 61 },
    { nombre: "SAN JOSE DE TICLLAS", puntuacion: 47 },
    { nombre: "QUINUA", puntuacion: 78 },
    { nombre: "PACAYCASA", puntuacion: 165 },
  ];
  return (
    <div className="h-full w-full flex items-center justify-center bg-gray-100 pt-12">
      <GeoJsonSvg type={provincia} distritos={distritos} setProvincias={setProvincias}/>
    </div>
  );
};

export default Page;
