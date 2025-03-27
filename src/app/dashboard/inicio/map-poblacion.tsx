/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Bar, BarChart, XAxis, YAxis, Cell } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { useState, useMemo } from "react";
import GeoJsonSvg from "@/components/map/GeoJsonSvg";

// Definir tipo para las provincias agrupadas
interface ProvinciaAgrupada {
  nombre: string;
  cantidad: number;
}

export default function MapPoblacion() {
  const [provincia, setProvincia] = useState<string>("");
  const [distrito, setDistrito] = useState<string>("");

  // Usar useMemo para evitar recrear el array en cada renderizado
  const all = useMemo(
    () => [
      {
        departamento: "Ayacucho",
        provincia: "CANGALLO",
        distrito: "CANGALLO",
        puntuacion: 5088,
      },
      {
        departamento: "Ayacucho",
        provincia: "CANGALLO",
        distrito: "CHUSCHI",
        puntuacion: 2587,
      },
      {
        departamento: "Ayacucho",
        provincia: "CANGALLO",
        distrito: "LOS MOROCHUCOS",
        puntuacion: 1977,
      },
      {
        departamento: "Ayacucho",
        provincia: "CANGALLO",
        distrito: "MARIA PARADO DE BELLIDO",
        puntuacion: 1468,
      },
      {
        departamento: "Ayacucho",
        provincia: "CANGALLO",
        distrito: "PARAS",
        puntuacion: 2258,
      },
      {
        departamento: "Ayacucho",
        provincia: "CANGALLO",
        distrito: "TOTOS",
        puntuacion: 1655,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUAMANGA",
        distrito: "ACOCRO",
        puntuacion: 2315,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUAMANGA",
        distrito: "ACOS VINCHOS",
        puntuacion: 2188,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUAMANGA",
        distrito: "ANDRES AVELINO CACERES DORREGARAY",
        puntuacion: 16323,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUAMANGA",
        distrito: "AYACUCHO",
        puntuacion: 162500,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUAMANGA",
        distrito: "CARMEN ALTO",
        puntuacion: 23417,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUAMANGA",
        distrito: "CHIARA",
        puntuacion: 1477,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUAMANGA",
        distrito: "JESUS NAZARENO",
        puntuacion: 20323,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUAMANGA",
        distrito: "OCROS",
        puntuacion: 1511,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUAMANGA",
        distrito: "PACAYCASA",
        puntuacion: 1332,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUAMANGA",
        distrito: "QUINUA",
        puntuacion: 3748,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUAMANGA",
        distrito: "SAN JOSE DE TICLLAS",
        puntuacion: 1676,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUAMANGA",
        distrito: "SAN JUAN BAUTISTA",
        puntuacion: 21445,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUAMANGA",
        distrito: "SANTIAGO DE PISCHA",
        puntuacion: 1402,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUAMANGA",
        distrito: "SOCOS",
        puntuacion: 3688,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUAMANGA",
        distrito: "TAMBILLO",
        puntuacion: 1755,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUAMANGA",
        distrito: "VINCHOS",
        puntuacion: 2459,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUANCA SANCOS",
        distrito: "CARAPO",
        puntuacion: 2438,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUANCA SANCOS",
        distrito: "SACSAMARCA",
        puntuacion: 1217,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUANCA SANCOS",
        distrito: "SANCOS",
        puntuacion: 4439,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUANCA SANCOS",
        distrito: "SANTIAGO DE LUCANAMARCA",
        puntuacion: 1548,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUANTA",
        distrito: "AYAHUANCO",
        puntuacion: 1599,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUANTA",
        distrito: "CANAYRE",
        puntuacion: 1755,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUANTA",
        distrito: "CHACA",
        puntuacion: 1547,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUANTA",
        distrito: "HUAMANGUILLA",
        puntuacion: 3448,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUANTA",
        distrito: "HUANTA",
        puntuacion: 49577,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUANTA",
        distrito: "IGUAIN",
        puntuacion: 6248,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUANTA",
        distrito: "LLOCHEGUA",
        puntuacion: 9887,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUANTA",
        distrito: "LURICOCHA",
        puntuacion: 5788,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUANTA",
        distrito: "PUCACOLPA",
        puntuacion: 1455,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUANTA",
        distrito: "SANTILLANA",
        puntuacion: 3847,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUANTA",
        distrito: "PUTIS",
        puntuacion: 788,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUANTA",
        distrito: "SIVIA",
        puntuacion: 6877,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUANTA",
        distrito: "UCHURACCAY",
        puntuacion: 788,
      },
      {
        departamento: "Ayacucho",
        provincia: "LA MAR",
        distrito: "ANCHIHUAY",
        puntuacion: 1455,
      },
      {
        departamento: "Ayacucho",
        provincia: "LA MAR",
        distrito: "ANCO",
        puntuacion: 1988,
      },
      {
        departamento: "Ayacucho",
        provincia: "LA MAR",
        distrito: "UNION PROGRESO",
        puntuacion: 1448,
      },
      {
        departamento: "Ayacucho",
        provincia: "LA MAR",
        distrito: "AYNA",
        puntuacion: 6788,
      },
      {
        departamento: "Ayacucho",
        provincia: "LA MAR",
        distrito: "CHILCAS",
        puntuacion: 1548,
      },
      {
        departamento: "Ayacucho",
        provincia: "LA MAR",
        distrito: "CHUNGUI",
        puntuacion: 3688,
      },
      {
        departamento: "Ayacucho",
        provincia: "LA MAR",
        distrito: "LUIS CARRANZA",
        puntuacion: 988,
      },
      {
        departamento: "Ayacucho",
        provincia: "LA MAR",
        distrito: "ORONCCOY",
        puntuacion: 1455,
      },
      {
        departamento: "Ayacucho",
        provincia: "LA MAR",
        distrito: "SAMUGARI",
        puntuacion: 1988,
      },
      {
        departamento: "Ayacucho",
        provincia: "LA MAR",
        distrito: "SAN MIGUEL",
        puntuacion: 9887,
      },
      {
        departamento: "Ayacucho",
        provincia: "LA MAR",
        distrito: "PATIBAMBA",
        puntuacion: 1455,
      },
      {
        departamento: "Ayacucho",
        provincia: "LA MAR",
        distrito: "NINABAMBA",
        puntuacion: 788,
      },
      {
        departamento: "Ayacucho",
        provincia: "LA MAR",
        distrito: "SANTA ROSA",
        puntuacion: 6788,
      },
      {
        departamento: "Ayacucho",
        provincia: "LA MAR",
        distrito: "TAMBO",
        puntuacion: 5887,
      },
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "AUCARA",
        puntuacion: 1988,
      },
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "CABANA",
        puntuacion: 2488,
      },
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "CARMEN SALCEDO",
        puntuacion: 1455,
      },
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "CHAVIÑA",
        puntuacion: 988,
      },
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "CHIPAO",
        puntuacion: 1988,
      },
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "HUAC-HUAS",
        puntuacion: 1455,
      },
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "LARAMATE",
        puntuacion: 2488,
      },
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "LEONCIO PRADO",
        puntuacion: 988,
      },
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "LLAUTA",
        puntuacion: 1455,
      },
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "LUCANAS",
        puntuacion: 1988,
      },
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "OCAÑA",
        puntuacion: 2488,
      },
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "OTOCA",
        puntuacion: 1455,
      },
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "PUQUIO",
        puntuacion: 12888,
      },
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "SAISA",
        puntuacion: 988,
      },
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "SANCOS",
        puntuacion: 1988,
      },
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "SAN CRISTOBAL",
        puntuacion: 1455,
      },
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "SAN JUAN",
        puntuacion: 2488,
      },
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "SAN PEDRO",
        puntuacion: 1455,
      },
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "SAN PEDRO DE PALCO",
        puntuacion: 988,
      },
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "SANTA ANA DE HUAYCAHUACHO",
        puntuacion: 1988,
      },
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "SANTA LUCIA",
        puntuacion: 2488,
      },
      {
        departamento: "Ayacucho",
        provincia: "PARINACOCHAS",
        distrito: "CHUMPI",
        puntuacion: 1455,
      },
      {
        departamento: "Ayacucho",
        provincia: "PARINACOCHAS",
        distrito: "CORACORA",
        puntuacion: 7887,
      },
      {
        departamento: "Ayacucho",
        provincia: "PARINACOCHAS",
        distrito: "CORONEL CASTAÑEDA",
        puntuacion: 1988,
      },
      {
        departamento: "Ayacucho",
        provincia: "PARINACOCHAS",
        distrito: "PACAPAUSA",
        puntuacion: 1455,
      },
      {
        departamento: "Ayacucho",
        provincia: "PARINACOCHAS",
        distrito: "PULLO",
        puntuacion: 2488,
      },
      {
        departamento: "Ayacucho",
        provincia: "PARINACOCHAS",
        distrito: "PUYUSCA",
        puntuacion: 1455,
      },
      {
        departamento: "Ayacucho",
        provincia: "PARINACOCHAS",
        distrito: "SAN FRANCISCO DE RAVACAYCO",
        puntuacion: 988,
      },
      {
        departamento: "Ayacucho",
        provincia: "PARINACOCHAS",
        distrito: "UPAHUACHO",
        puntuacion: 1988,
      },
      {
        departamento: "Ayacucho",
        provincia: "PAUCAR DEL SARA SARA",
        distrito: "COLTA",
        puntuacion: 1455,
      },
      {
        departamento: "Ayacucho",
        provincia: "PAUCAR DEL SARA SARA",
        distrito: "CORCULLA",
        puntuacion: 988,
      },
      {
        departamento: "Ayacucho",
        provincia: "PAUCAR DEL SARA SARA",
        distrito: "LAMPA",
        puntuacion: 1988,
      },
      {
        departamento: "Ayacucho",
        provincia: "PAUCAR DEL SARA SARA",
        distrito: "MARCABAMBA",
        puntuacion: 1455,
      },
      {
        departamento: "Ayacucho",
        provincia: "PAUCAR DEL SARA SARA",
        distrito: "OYOLO",
        puntuacion: 2488,
      },
      {
        departamento: "Ayacucho",
        provincia: "PAUCAR DEL SARA SARA",
        distrito: "PARARCA",
        puntuacion: 1455,
      },
      {
        departamento: "Ayacucho",
        provincia: "PAUCAR DEL SARA SARA",
        distrito: "PAUSA",
        puntuacion: 1988,
      },
      {
        departamento: "Ayacucho",
        provincia: "PAUCAR DEL SARA SARA",
        distrito: "SAN JAVIER DE ALPABAMBA",
        puntuacion: 988,
      },
      {
        departamento: "Ayacucho",
        provincia: "PAUCAR DEL SARA SARA",
        distrito: "SAN JOSE DE USHUA",
        puntuacion: 1455,
      },
      {
        departamento: "Ayacucho",
        provincia: "PAUCAR DEL SARA SARA",
        distrito: "SARA SARA",
        puntuacion: 1988,
      },
      {
        departamento: "Ayacucho",
        provincia: "SUCRE",
        distrito: "BELEN",
        puntuacion: 1455,
      },
      {
        departamento: "Ayacucho",
        provincia: "SUCRE",
        distrito: "CHALCOS",
        puntuacion: 988,
      },
      {
        departamento: "Ayacucho",
        provincia: "SUCRE",
        distrito: "CHILCAYOC",
        puntuacion: 1988,
      },
      {
        departamento: "Ayacucho",
        provincia: "SUCRE",
        distrito: "HUACAÑA",
        puntuacion: 1455,
      },
      {
        departamento: "Ayacucho",
        provincia: "SUCRE",
        distrito: "MORCOLLA",
        puntuacion: 2488,
      },
      {
        departamento: "Ayacucho",
        provincia: "SUCRE",
        distrito: "PAICO",
        puntuacion: 1455,
      },
      {
        departamento: "Ayacucho",
        provincia: "SUCRE",
        distrito: "QUEROBAMBA",
        puntuacion: 5887,
      },
      {
        departamento: "Ayacucho",
        provincia: "SUCRE",
        distrito: "SAN PEDRO DE LARCAY",
        puntuacion: 988,
      },
      {
        departamento: "Ayacucho",
        provincia: "SUCRE",
        distrito: "SAN SALVADOR DE QUIJE",
        puntuacion: 1455,
      },
      {
        departamento: "Ayacucho",
        provincia: "SUCRE",
        distrito: "SANTIAGO DE PAUCARAY",
        puntuacion: 1988,
      },
      {
        departamento: "Ayacucho",
        provincia: "SUCRE",
        distrito: "SORAS",
        puntuacion: 1455,
      },
      {
        departamento: "Ayacucho",
        provincia: "VICTOR FAJARDO",
        distrito: "ALCAMENCA",
        puntuacion: 988,
      },
      {
        departamento: "Ayacucho",
        provincia: "VICTOR FAJARDO",
        distrito: "APONGO",
        puntuacion: 1988,
      },
      {
        departamento: "Ayacucho",
        provincia: "VICTOR FAJARDO",
        distrito: "ASQUIPATA",
        puntuacion: 1455,
      },
      {
        departamento: "Ayacucho",
        provincia: "VICTOR FAJARDO",
        distrito: "CANARIA",
        puntuacion: 2488,
      },
      {
        departamento: "Ayacucho",
        provincia: "VICTOR FAJARDO",
        distrito: "CAYARA",
        puntuacion: 1455,
      },
      {
        departamento: "Ayacucho",
        provincia: "VICTOR FAJARDO",
        distrito: "COLCA",
        puntuacion: 988,
      },
      {
        departamento: "Ayacucho",
        provincia: "VICTOR FAJARDO",
        distrito: "HUAMANQUIQUIA",
        puntuacion: 1988,
      },
      {
        departamento: "Ayacucho",
        provincia: "VICTOR FAJARDO",
        distrito: "HUANCAPI",
        puntuacion: 3887,
      },
      {
        departamento: "Ayacucho",
        provincia: "VICTOR FAJARDO",
        distrito: "HUANCARAYLLA",
        puntuacion: 1455,
      },
      {
        departamento: "Ayacucho",
        provincia: "VICTOR FAJARDO",
        distrito: "HUAYA",
        puntuacion: 988,
      },
      {
        departamento: "Ayacucho",
        provincia: "VICTOR FAJARDO",
        distrito: "SARHUA",
        puntuacion: 1988,
      },
      {
        departamento: "Ayacucho",
        provincia: "VICTOR FAJARDO",
        distrito: "VILCANCHOS",
        puntuacion: 1455,
      },
      {
        departamento: "Ayacucho",
        provincia: "VILCAS HUAMAN",
        distrito: "ACCOMARCA",
        puntuacion: 988,
      },
      {
        departamento: "Ayacucho",
        provincia: "VILCAS HUAMAN",
        distrito: "CARHUANCA",
        puntuacion: 1988,
      },
      {
        departamento: "Ayacucho",
        provincia: "VILCAS HUAMAN",
        distrito: "CONCEPCION",
        puntuacion: 2488,
      },
      {
        departamento: "Ayacucho",
        provincia: "VILCAS HUAMAN",
        distrito: "HUAMBALPA",
        puntuacion: 1455,
      },
      {
        departamento: "Ayacucho",
        provincia: "VILCAS HUAMAN",
        distrito: "INDEPENDENCIA",
        puntuacion: 988,
      },
      {
        departamento: "Ayacucho",
        provincia: "VILCAS HUAMAN",
        distrito: "SAURAMA",
        puntuacion: 1988,
      },
      {
        departamento: "Ayacucho",
        provincia: "VILCAS HUAMAN",
        distrito: "VILCAS HUAMAN",
        puntuacion: 5887,
      },
      {
        departamento: "Ayacucho",
        provincia: "VILCAS HUAMAN",
        distrito: "VISCHONGO",
        puntuacion: 2488,
      },
    ],
    []
  );

  // Función para obtener el color según el valor de puntuación
  const getColor = (puntuacion: number): string => {
    if (puntuacion < 1000) return "#57D385 "; // Verde
    if (puntuacion < 2000) return "#F2CE5E"; // Amarillo
    return "#F26565"; // Rojo
  };

  // Función para manejar el clic en una barra
  const handleBarClick = (data: any) => {
    if (provincia === "") {
      // Si estamos en la vista general, navegar a la provincia seleccionada
      setProvincia(data.nombre);
    } else if (distrito === "") {
      // Si estamos en una provincia, navegar al distrito seleccionado
      setDistrito(data.nombre);
    }
    // Si ya estamos en un distrito, no hacer nada
  };

  // Calcular datos para la gráfica basado en la selección actual
  const chartData = useMemo(() => {
    if (provincia === "") {
      // Vista general de Ayacucho - Mostrar todas las provincias
      const provinciasAgrupadas = all.reduce<Record<string, ProvinciaAgrupada>>(
        (acc, item) => {
          if (!acc[item.provincia]) {
            acc[item.provincia] = {
              nombre: item.provincia,
              cantidad: 0,
            };
          }
          acc[item.provincia].cantidad += item.puntuacion;
          return acc;
        },
        {}
      );

      // Convertir a array y ordenar por nombre
      return Object.values(provinciasAgrupadas)
        .map((p) => ({
          nombre: p.nombre,
          puntuacion: p.cantidad,
          fill: "#2898EE",
          cursor: "pointer",
        }))
        .sort((a, b) => a.nombre.localeCompare(b.nombre));
    } else if (distrito !== "") {
      // Vista de distrito específico
      const distritoSeleccionado = all.find(
        (d) => d.distrito === distrito && d.provincia === provincia
      );

      if (distritoSeleccionado) {
        return [
          {
            nombre: distritoSeleccionado.distrito,
            puntuacion: distritoSeleccionado.puntuacion,
            fill: getColor(distritoSeleccionado.puntuacion),
            // No es clickeable en vista de distrito
            cursor: "default",
          },
        ];
      }
      return [];
    } else {
      // Vista de provincia - mostrar todos los distritos de esa provincia
      return all
        .filter((d) => d.provincia === provincia)
        .map((d) => ({
          nombre: d.distrito,
          puntuacion: d.puntuacion,
          fill: getColor(d.puntuacion),
          // Agregar propiedad de cursor para indicar que es clickeable
          cursor: "pointer",
        }))
        .sort((a, b) => a.nombre.localeCompare(b.nombre));
    }
  }, [all, provincia, distrito]);

  // Configuración del gráfico
  const chartConfig = useMemo(() => {
    // Definir tipo para la configuración del gráfico
    type ConfigType = {
      puntuacion: {
        label: string;
      };
      [key: string]: {
        label: string;
        color?: string;
      };
    };

    const config: ConfigType = {
      puntuacion: {
        label: "Puntuación",
      },
    };

    // Añadir cada provincia o distrito a la configuración
    chartData.forEach((item) => {
      config[item.nombre] = {
        label: item.nombre,
        color: item.fill,
      };
    });

    return config;
  }, [chartData]);

  // Determinar el título y subtítulo del gráfico
  const getTituloGrafico = () => {
    if (provincia === "") return "POBLACIÓN POR PROVINCIAS";
    if (distrito === "") return `POBLACIÓN EN ${provincia}`;
    return `POBLACIÓN EN ${distrito}`;
  };

  const getSubtituloGrafico = () => {
    if (provincia === "") return "VALORES DEL 2024";
    if (distrito === "") return "CANTIDAD POR DISTRITOS";
    return "DATOS DEL DISTRITO";
  };

  return (
    <div className="flex flex-col w-full h-full mx-auto overflow-hidden max-w-[95rem] gap-8 p-6 sm:py-10">
      <h2 className="mb-8 sm:mb-10 text-center text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
        POBLACION EN AYACUCHO
      </h2>
      <div className="flex flex-col lg:flex-row w-full h-full mx-auto gap-8 p-6">
        <div className="w-full h-full max-w-4xl">
          <GeoJsonSvg
            provincia={provincia}
            distrito={distrito}
            setProvincia={setProvincia}
            setDistrito={setDistrito}
            data={all}
            big={true}
          />
        </div>
        <div className="w-full h-full my-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-lg sm:text-xl">
                {getTituloGrafico()}
              </CardTitle>
              <CardDescription className="text-sm">
                {getSubtituloGrafico()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full overflow-x-auto">
                {chartData.length > 0 ? (
                  <ChartContainer
                    config={chartConfig}
                    className="min-w-[400px] h-[300px] sm:h-auto"
                  >
                    <BarChart
                      accessibilityLayer
                      data={chartData}
                      layout="vertical"
                      margin={{
                        left: 8,
                        right: 8,
                        top: 8,
                        bottom: 8,
                      }}
                      barSize={20}
                      className="w-full"
                      onClick={(data) => {
                        if (
                          data &&
                          data.activePayload &&
                          data.activePayload.length > 0
                        ) {
                          const clickedData = data.activePayload[0].payload;

                          handleBarClick(clickedData);
                        }
                      }}
                    >
                      <YAxis
                        dataKey="nombre"
                        type="category"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        width={120}
                        tick={{
                          fontSize: 10,
                          transform: "translate(-5, 0)",
                        }}
                        interval={0}
                        className="text-xs sm:text-sm"
                      />
                      <XAxis
                        dataKey="puntuacion"
                        type="number"
                        axisLine={true}
                        tickLine={true}
                        className="text-xs sm:text-sm"
                      />
                      <ChartTooltip
                        cursor={false}
                        content={
                          <ChartTooltipContent
                            labelFormatter={(label) => label}
                            formatter={(value) => ["Cantidad: ", value]}
                            className="text-xs sm:text-sm"
                          />
                        }
                      />
                      <Bar
                        dataKey="puntuacion"
                        radius={[6, 6, 6, 6]}
                        className={distrito === "" ? "cursor-pointer" : ""}
                      >
                        {chartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.fill}
                            style={{ cursor: entry.cursor }}
                            onClick={() =>
                              distrito === "" ? handleBarClick(entry) : null
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ChartContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px]">
                    <p className="text-gray-500">No hay datos disponibles</p>
                  </div>
                )}
              </div>
            </CardContent>
            {(provincia !== "" || distrito !== "") && (
              <CardFooter className="flex-col items-center gap-2 text-xs sm:text-sm">
                <div className="flex flex-wrap items-center gap-2 font-medium leading-none">
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded-full bg-[#57D385]"></div>
                    <span>Menor a 1000</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded-full bg-[#F2CE5E]"></div>
                    <span>Entre 1000 y 2000</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded-full bg-[#F26565]"></div>
                    <span>Mayor a 2000</span>
                  </div>
                </div>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
