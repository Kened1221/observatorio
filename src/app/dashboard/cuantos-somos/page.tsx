/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
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
import { getData, getMap } from "@/actions/cuantos-somos-actions";

interface PoblacionProps {
  hombres?: number;
  mujeres?: number;
  rural?: number;
  urbano?: number;
  total: number;
}

export default function Page() {
  const [all, setAll] = useState<PoblacionProps>({
    hombres: 0,
    mujeres: 0,
    rural: 0,
    urbano: 0,
    total: 0,
  });
  const [map, setMap] = useState<any>(null);
  const [provincia, setProvincia] = useState<string>("");
  const [distrito, setDistrito] = useState<string>("");
  const [pAselect, setPAselect] = useState<string>("poblacion");
  const [rangoEdad, setRangoEdad] = useState<string>("Menores de 1 año");

  // Fetch de datos al montar el componente
  const fetchData = async () => {
    const data = await getData(
      "Ayacucho",
      provincia,
      pAselect,
      distrito,
      rangoEdad
    );
    setAll(data);
  };

  useEffect(() => {
    fetchData();
  }, [provincia, distrito, pAselect, rangoEdad]);

  useEffect(() => {
    const fetchMapData = async () => {
      const map = await getMap("Ayacucho", pAselect);
      setMap(map);
    };

    fetchMapData();
  }, [pAselect]);

  const value = [
    "Menores de 1 año",
    "De 1 a 4 años",
    "De 5 a 9 años",
    "De 10 a 14 años",
    "De 15 a 19 años",
    "De 20 a 24 años",
    "De 25 a 29 años",
    "De 30 a 34 años",
    "De 35 a 39 años",
    "De 40 a 44 años",
    "De 45 a 49 años",
    "De 50 a 54 años",
    "De 55 a 59 años",
    "De 60 a 64 años",
    "De 65 y más años",
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
            data={map} // Pasamos todo el array al componente
            big={true}
          />
        </div>

        <div className="flex flex-col items-center space-y-8 justify-center">
          <div className="flex flex-col items-center">
            <Button setPAselect={setPAselect} />
            <MdPeopleAlt className="text-9xl text-stone-600" />
            <p className="text-7xl font-bold">{all.total}</p>
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
          {pAselect === "poblacion" ? (
            <div className="flex justify-center gap-20 w-full">
              {/* Hombres */}
              <div className="flex flex-col items-center">
                <p className="text-xl font-bold">Hombres</p>
                <FaChild className="text-9xl text-blue-500" />
                <p className="text-6xl font-bold">{all.hombres}</p>
              </div>
              {/* Mujeres */}
              <div className="flex flex-col items-center">
                <p className="text-xl font-bold">Mujeres</p>
                <FaChildDress className="text-9xl text-red-500" />
                <p className="text-6xl font-bold">{all.mujeres}</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center gap-20 w-full">
              {/* Rural */}
              <div className="flex flex-col items-center">
                <p className="text-xl font-bold">Rural</p>
                <FaChild className="text-9xl text-emerald-500" />
                <p className="text-6xl font-bold">{all.rural}</p>
              </div>
              {/* Urbano */}
              <div className="flex flex-col items-center">
                <p className="text-xl font-bold">Urbano</p>
                <FaChild className="text-9xl text-violet-500" />
                <p className="text-6xl font-bold">{all.urbano}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
