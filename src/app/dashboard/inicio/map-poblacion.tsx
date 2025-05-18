/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import GeoJsonSvg from "@/components/map/GeoJsonSvg";
import { useState, useEffect } from "react";
import { PiUsersThreeFill } from "react-icons/pi";
import { FaChild, FaChildDress } from "react-icons/fa6";
import Button from "@/components/animation/button-animation2";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getPoblacion, getMap, getAvailableYears } from "@/actions/inicio-actions";

interface PoAmProps {
  masculino?: number;
  femenino?: number;
  rural?: number;
  urbano?: number;
  total: number;
}

export default function MapPoblacion() {
  const [map, setMap] = useState<any>(null);
  const [poblacionA, setPoblacionA] = useState<PoAmProps>({
    masculino: 0,
    femenino: 0,
    rural: 0,
    urbano: 0,
    total: 0,
  });
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  const [pAselect, setPAselect] = useState<string>("poblacion");
  const [provincia, setProvincia] = useState<string>("");
  const [distrito, setDistrito] = useState<string>("");
  const [rangoEdad, setRangoEdad] = useState<string>("Todos");
  const [anio, setAnio] = useState<number>(new Date().getFullYear()); // Año actual por defecto

  // Fetch de años disponibles al montar el componente
  useEffect(() => {
    const fetchYears = async () => {
      const years = await getAvailableYears();
      setAvailableYears(years);
      if (years.length > 0 && !years.includes(anio)) {
        setAnio(years[0]); // Establecer el año más reciente por defecto
      }
    };
    fetchYears();
  }, []);

  // Fetch de datos de población
  const fetchData = async () => {
    const data = await getPoblacion(
      "AYACUCHO",
      provincia,
      pAselect,
      distrito,
      rangoEdad,
      anio
    );
    setPoblacionA(data);
  };

  // Fetch de datos del mapa
  const fetchMapa = async () => {
    const data = await getMap(anio);
    setMap(data);
  };

  useEffect(() => {
    fetchData();
  }, [pAselect, provincia, distrito, rangoEdad, anio]);

  useEffect(() => {
    fetchMapa();
  }, [anio]);

  const rangosEdad = [
    "Todos",
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
      <div className="flex flex-row items-center justify-center mb-6 gap-4">
        <h2 className="text-center text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
          POBLACIÓN EN AYACUCHO EN EL AÑO
        </h2>
        <Select
          value={anio.toString()}
          onValueChange={(value) => setAnio(Number(value))}
        >
          <SelectTrigger className="w-[120px] text-3xl font-bold">
            <SelectValue placeholder="Selecciona un año" />
          </SelectTrigger>
          <SelectContent>
            {availableYears.length > 0 ? (
              availableYears.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))
            ) : (
              <SelectItem value={new Date().getFullYear().toString()}>
                {new Date().getFullYear()}
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col lg:flex-row w-full h-full mx-auto gap-20 p-6">
        <div className="w-full h-full max-w-4xl">
          <GeoJsonSvg
            provincia={provincia}
            distrito={distrito}
            setProvincia={setProvincia}
            setDistrito={setDistrito}
            data={map}
          />
        </div>

        <div className="flex flex-col items-center space-y-8 justify-center">
          <div className="flex flex-col items-center">
            <Button setPAselect={setPAselect} />
            <PiUsersThreeFill className="text-9xl text-stone-600" />
            <p className="text-7xl font-bold">{poblacionA.total}</p>
          </div>
          <div className="flex w-full justify-center">
            <Select value={rangoEdad} onValueChange={setRangoEdad}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecciona un rango de edad" />
              </SelectTrigger>
              <SelectContent>
                {rangosEdad.map((edad) => (
                  <SelectItem key={edad} value={edad}>
                    {edad}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {pAselect === "poblacion" ? (
            <div className="flex justify-center gap-20 w-full">
              {/* Masculino */}
              <div className="flex flex-col items-center">
                <p className="text-xl font-bold">Masculino</p>
                <FaChild className="text-9xl text-blue-500" />
                <p className="text-6xl font-bold">{poblacionA.masculino}</p>
              </div>
              {/* Femenino */}
              <div className="flex flex-col items-center">
                <p className="text-xl font-bold">Femenino</p>
                <FaChildDress className="text-9xl text-red-500" />
                <p className="text-6xl font-bold">{poblacionA.femenino}</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center gap-20 w-full">
              {/* Rural */}
              <div className="flex flex-col items-center">
                <p className="text-xl font-bold">Rural</p>
                <FaChild className="text-9xl text-emerald-500" />
                <p className="text-6xl font-bold">{poblacionA.rural}</p>
              </div>
              {/* Urbano */}
              <div className="flex flex-col items-center">
                <p className="text-xl font-bold">Urbano</p>
                <FaChild className="text-9xl text-violet-500" />
                <p className="text-6xl font-bold">{poblacionA.urbano}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}