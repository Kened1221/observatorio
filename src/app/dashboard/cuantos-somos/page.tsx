"use client";
import GeoJsonSvg from "@/components/map/GeoJsonSvg";
import { useState, useEffect } from "react";
import { MdPeopleAlt } from "react-icons/md";
import { FaChild, FaChildDress } from "react-icons/fa6";
import Button from "@/components/animation/button-animation2";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import getPoblacion from "@/app/actions/como-estamos-actions-";

// Ajustar la interfaz para que coincida con los datos de getPoblacion
interface PoblacionProps {
  departamento: string;
  provincia: string;
  distrito: string;
  puntuacion: number;
  hombres: number;
  mujeres: number;
  rural: number;
  urbano: number;
}

export default function Page() {
  const [all, setAll] = useState<PoblacionProps[]>([]);
  const [provincia, setProvincia] = useState<string>("");
  const [distrito, setDistrito] = useState<string>("");
  const [pAselect, setPAselect] = useState<string>("Población");
  const [rangoEdad, setRangoEdad] = useState<string>("0 a 1 año");

  // Fetch de datos al montar el componente
  const fetchData = async () => {
    const res = await getPoblacion();
    setAll(res);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (provincia === "") {
    console.log(provincia);
  }
  // Filtrar el distrito seleccionado
  const selectedDistrict = all.find(
    (item) => item.provincia === provincia && item.distrito === distrito
  ) || {
    puntuacion: 0,
    hombres: 0,
    mujeres: 0,
    rural: 0,
    urbano: 0,
  };

  // Opciones para el select de rango de edad
  const value = [
    "0 a 1 año",
    "2 a 5 años",
    "6 a 11 años",
    "12 a 17 años",
    "18 a 24 años",
    "25 a 39 años",
    "40 a 59 años",
    "60 años o más",
  ];

  return (
    <div className="flex flex-col w-full h-full mx-auto overflow-hidden max-w-[95rem] gap-8 p-6 sm:py-10">
      <h2 className="mb-8 sm:mb-10 text-center text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
        Población en Ayacucho
      </h2>
      <div className="flex flex-col lg:flex-row w-full h-full mx-auto gap-8 p-6">
        <div className="w-full h-full max-w-4xl">
          <GeoJsonSvg
            provincia={provincia}
            distrito={distrito}
            setProvincia={setProvincia}
            setDistrito={setDistrito}
            data={all} // Pasamos todo el array al componente
            big={true}
          />
        </div>

        <div className="flex flex-col items-center space-y-8">
          <div className="flex flex-col items-center">
            <Button setPAselect={setPAselect} />
            <MdPeopleAlt className="text-9xl" />
            <p className="text-7xl font-bold">{selectedDistrict.puntuacion}</p>
          </div>
          <div className="flex w-full justify-center">
            <Select value={rangoEdad} onValueChange={setRangoEdad}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecciona un rango de edad" />
              </SelectTrigger>
              <SelectContent>
                {value.map((edad) => (
                  <SelectItem key={edad} value={edad}>
                    {edad}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {pAselect === "Población" ? (
            <div className="flex justify-center gap-20 w-full">
              {/* Hombres */}
              <div className="flex flex-col items-center">
                <p className="text-xl font-bold">Hombres</p>
                <FaChild className="text-9xl text-blue-500" />
                <p className="text-6xl font-bold">{selectedDistrict.hombres}</p>
              </div>
              {/* Mujeres */}
              <div className="flex flex-col items-center">
                <p className="text-xl font-bold">Mujeres</p>
                <FaChildDress className="text-9xl text-red-500" />
                <p className="text-6xl font-bold">{selectedDistrict.mujeres}</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center gap-20 w-full">
              {/* Rural */}
              <div className="flex flex-col items-center">
                <p className="text-xl font-bold">Rural</p>
                <FaChild className="text-9xl text-amber-800" />
                <p className="text-6xl font-bold">{selectedDistrict.rural}</p>
              </div>
              {/* Urbano */}
              <div className="flex flex-col items-center">
                <p className="text-xl font-bold">Urbano</p>
                <FaChild className="text-9xl text-red-200" />
                <p className="text-6xl font-bold">{selectedDistrict.urbano}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
