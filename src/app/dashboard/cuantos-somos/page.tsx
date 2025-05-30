/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import GeoJsonSvg from "@/components/map/GeoJsonSvg";
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
import { Button as ShadcnButton } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Download } from "lucide-react";
import * as XLSX from "xlsx";
import {
  getPoblacion,
  getMap,
  getAvailableYears,
  downloadPoblacionData,
  getProvincias,
  getDistritos,
} from "@/actions/inicio-actions";

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
  const [provincias, setProvincias] = useState<
    { id: number; nombre: string }[]
  >([]);
  const [distritos, setDistritos] = useState<{ id: number; nombre: string }[]>(
    []
  );
  const [pAselect, setPAselect] = useState<string>("poblacion");
  const [provincia, setProvincia] = useState<string>("all");
  const [distrito, setDistrito] = useState<string>("all");
  const [genero, setGenero] = useState<string>("all");
  const [ambito, setAmbito] = useState<string>("all");
  const [rangoEdad, setRangoEdad] = useState<string>("Todos");
  const [anio, setAnio] = useState<number>(new Date().getFullYear());
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchYears = async () => {
      const years = await getAvailableYears();
      setAvailableYears(years);
      if (years.length > 0 && !years.includes(anio)) {
        setAnio(years[0]);
      }
    };
    fetchYears();
  }, []);

  useEffect(() => {
    const fetchProvincias = async () => {
      const provs = await getProvincias("AYACUCHO");
      setProvincias(provs);
    };
    fetchProvincias();
  }, []);

  useEffect(() => {
    const fetchDistritos = async () => {
      if (provincia !== "all") {
        const dists = await getDistritos(provincia);
        setDistritos(dists);
        setDistrito("all"); // Reset distrito when provincia changes
      } else {
        setDistritos([]);
        setDistrito("all");
      }
    };
    fetchDistritos();
  }, [provincia]);

  const fetchData = async () => {
    const data = await getPoblacion(
      "AYACUCHO",
      provincia === "all" ? "" : provincia,
      pAselect,
      distrito === "all" ? "" : distrito,
      rangoEdad,
      anio
    );
    setPoblacionA(data);
  };

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

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const result = await downloadPoblacionData(anio);
      if (result.success && result.data) {
        let filteredData = result.data;

        filteredData = filteredData.filter((record) => {
          let matches = true;
          if (provincia !== "all") {
            matches = matches && record.PROVINCIA === provincia;
          }
          if (distrito !== "all") {
            matches = matches && record.DISTRITO === distrito;
          }
          if (rangoEdad !== "Todos") {
            matches = matches && record["INTERVALO EDAD"] === rangoEdad;
          }
          if (genero !== "all") {
            matches = matches && record.GENERO.toLowerCase() === genero.toLowerCase();
          }
          if (ambito !== "all") {
            matches = matches && record.AMBITO.toLowerCase() === ambito.toLowerCase();
          }
          return matches;
        });

        if (filteredData.length === 0) {
          console.warn("No data available for the selected filters");
          return;
        }

        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Poblacion");
        const excelBuffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });
        const blob = new Blob([excelBuffer], {
          type: "application/octet-stream",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Poblacion_${anio}_${provincia === "all" ? "all" : provincia
          }_${distrito === "all" ? "all" : distrito}_${rangoEdad.replace(/ /g, "_") || "all"
          }.xlsx`;
        link.click();
        URL.revokeObjectURL(url);
      } else {
        console.error("No data returned from server");
      }
    } catch (error: any) {
      console.error("Error downloading file:", error);
    } finally {
      setDownloading(false);
    }
  };

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
    <div className="flex flex-col w-full h-full mx-auto overflow-hidden max-w-[95rem] gap-8 p-6 sm:py-12">
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
      <div className="flex flex-col lg:flex-row w-full h-full mx-auto gap-8 p-6 items-center justify-center">
        <Card className="shadow-lg w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-900">
              Datos de Población
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-4 mt-4 items-end flex-wrap">
              <div>
                <h3 className="text-sm font-medium">Provincia</h3>
                <Select value={provincia} onValueChange={setProvincia}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Selecciona provincia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {provincias.map((prov) => (
                      <SelectItem key={prov.id} value={prov.nombre}>
                        {prov.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <h3 className="text-sm font-medium">Distrito</h3>
                <Select value={distrito} onValueChange={setDistrito}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Selecciona distrito" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {distritos.map((dist) => (
                      <SelectItem key={dist.id} value={dist.nombre}>
                        {dist.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <h3 className="text-sm font-medium">Género</h3>
                <Select value={genero} onValueChange={setGenero}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Selecciona género" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="femenino">Femenino</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <h3 className="text-sm font-medium">Ámbito</h3>
                <Select value={ambito} onValueChange={setAmbito}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Selecciona ámbito" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="rural">Rural</SelectItem>
                    <SelectItem value="urbano">Urbano</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <h3 className="text-sm font-medium">Rango de Edad</h3>
                <Select value={rangoEdad} onValueChange={setRangoEdad}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Selecciona rango de edad" />
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
              <ShadcnButton
                onClick={handleDownload}
                disabled={downloading}
                className="w-[150px] bg-primary hover:bg-primary/90 text-white font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-100"
              >
                {downloading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                {downloading ? "Descargando..." : "Descargar Excel"}
              </ShadcnButton>
            </div>
          </CardHeader>
        </Card>
      </div>
      <div className="flex flex-col lg:flex-row w-full h-full mx-auto gap-8 p-6">
        <div className="w-full h-full max-w-4xl">
          <GeoJsonSvg
            provincia={provincia === "all" ? "" : provincia}
            distrito={distrito === "all" ? "" : distrito}
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
              <div className="flex flex-col items-center">
                <p className="text-xl font-bold">Masculino</p>
                <FaChild className="text-9xl text-blue-500" />
                <p className="text-6xl font-bold">{poblacionA.masculino}</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-xl font-bold">Femenino</p>
                <FaChildDress className="text-9xl text-red-500" />
                <p className="text-6xl font-bold">{poblacionA.femenino}</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center gap-20 w-full">
              <div className="flex flex-col items-center">
                <p className="text-xl font-bold">Rural</p>
                <FaChild className="text-9xl text-emerald-500" />
                <p className="text-6xl font-bold">{poblacionA.rural}</p>
              </div>
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