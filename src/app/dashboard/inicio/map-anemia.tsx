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

export default function MapAnemia() {
  const [provincia, setProvincia] = useState<string>("");
  const [distrito, setDistrito] = useState<string>("");

  // Usar useMemo para evitar recrear el array en cada renderizado
  const all = useMemo(
    () => [
      {
        departamento: "Ayacucho",
        provincia: "CANGALLO",
        distrito: "CANGALLO",
        puntuacion: 2749,
      },
      {
        departamento: "Ayacucho",
        provincia: "CANGALLO",
        distrito: "CHUSCHI",
        puntuacion: 1321,
      },
      {
        departamento: "Ayacucho",
        provincia: "CANGALLO",
        distrito: "LOS MOROCHUCOS",
        puntuacion: 1928,
      },
      {
        departamento: "Ayacucho",
        provincia: "CANGALLO",
        distrito: "MARIA PARADO DE BELLIDO",
        puntuacion: 1467,
      },
      {
        departamento: "Ayacucho",
        provincia: "CANGALLO",
        distrito: "PARAS",
        puntuacion: 2203,
      },
      {
        departamento: "Ayacucho",
        provincia: "CANGALLO",
        distrito: "TOTOS",
        puntuacion: 2678,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUAMANGA",
        distrito: "ACOCRO",
        puntuacion: 1493,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUAMANGA",
        distrito: "ACOS VINCHOS",
        puntuacion: 1200,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUAMANGA",
        distrito: "ANDRES AVELINO CACERES DORREGARAY",
        puntuacion: 302,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUAMANGA",
        distrito: "AYACUCHO",
        puntuacion: 2314,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUAMANGA",
        distrito: "CARMEN ALTO",
        puntuacion: 1746,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUAMANGA",
        distrito: "CHIARA",
        puntuacion: 813,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUAMANGA",
        distrito: "JESUS NAZARENO",
        puntuacion: 1985,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUAMANGA",
        distrito: "OCROS",
        puntuacion: 2557,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUAMANGA",
        distrito: "PACAYCASA",
        puntuacion: 1758,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUAMANGA",
        distrito: "QUINUA",
        puntuacion: 1001,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUAMANGA",
        distrito: "SAN JOSE DE TICLLAS",
        puntuacion: 3019,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUAMANGA",
        distrito: "SAN JUAN BAUTISTA",
        puntuacion: 1109,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUAMANGA",
        distrito: "SANTIAGO DE PISCHA",
        puntuacion: 2683,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUAMANGA",
        distrito: "SOCOS",
        puntuacion: 2957,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUAMANGA",
        distrito: "TAMBILLO",
        puntuacion: 2443,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUAMANGA",
        distrito: "VINCHOS",
        puntuacion: 1920,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUANCA SANCOS",
        distrito: "CARAPO",
        puntuacion: 255,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUANCA SANCOS",
        distrito: "SACSAMARCA",
        puntuacion: 2906,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUANCA SANCOS",
        distrito: "SANCOS",
        puntuacion: 1794,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUANCA SANCOS",
        distrito: "SANTIAGO DE LUCANAMARCA",
        puntuacion: 1987,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUANTA",
        distrito: "AYAHUANCO",
        puntuacion: 937,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUANTA",
        distrito: "CANAYRE",
        puntuacion: 1561,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUANTA",
        distrito: "CHACA",
        puntuacion: 2024,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUANTA",
        distrito: "HUAMANGUILLA",
        puntuacion: 1202,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUANTA",
        distrito: "HUANTA",
        puntuacion: 2463,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUANTA",
        distrito: "IGUAIN",
        puntuacion: 1519,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUANTA",
        distrito: "LLOCHEGUA",
        puntuacion: 679,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUANTA",
        distrito: "LURICOCHA",
        puntuacion: 1578,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUANTA",
        distrito: "PUCACOLPA",
        puntuacion: 730,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUANTA",
        distrito: "SANTILLANA",
        puntuacion: 2447,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUANTA",
        distrito: "SIVIA",
        puntuacion: 2895,
      },
      {
        departamento: "Ayacucho",
        provincia: "HUANTA",
        distrito: "UCHURACCAY",
        puntuacion: 2513,
      },
      {
        departamento: "Ayacucho",
        provincia: "LA MAR",
        distrito: "ANCHIHUAY",
        puntuacion: 1702,
      },
      {
        departamento: "Ayacucho",
        provincia: "LA MAR",
        distrito: "ANCO",
        puntuacion: 2935,
      },
      {
        departamento: "Ayacucho",
        provincia: "LA MAR",
        distrito: "AYNA",
        puntuacion: 1010,
      },
      {
        departamento: "Ayacucho",
        provincia: "LA MAR",
        distrito: "CHILCAS",
        puntuacion: 688,
      },
      {
        departamento: "Ayacucho",
        provincia: "LA MAR",
        distrito: "CHUNGUI",
        puntuacion: 1596,
      },
      {
        departamento: "Ayacucho",
        provincia: "LA MAR",
        distrito: "LUIS CARRANZA",
        puntuacion: 2093,
      },
      {
        departamento: "Ayacucho",
        provincia: "LA MAR",
        distrito: "ORONCCOY",
        puntuacion: 2672,
      },
      {
        departamento: "Ayacucho",
        provincia: "LA MAR",
        distrito: "SAMUGARI",
        puntuacion: 2025,
      },
      {
        departamento: "Ayacucho",
        provincia: "LA MAR",
        distrito: "SAN MIGUEL",
        puntuacion: 3018,
      },
      {
        departamento: "Ayacucho",
        provincia: "LA MAR",
        distrito: "SANTA ROSA",
        puntuacion: 1319,
      },
      {
        departamento: "Ayacucho",
        provincia: "LA MAR",
        distrito: "TAMBO",
        puntuacion: 303,
      },
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "AUCARA",
        puntuacion: 2712,
      },
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "CABANA",
        puntuacion: 2309,
      },
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "CARMEN SALCEDO",
        puntuacion: 957,
      },
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "CHAVIÑA",
        puntuacion: 2454,
      },
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "CHIPAO",
        puntuacion: 810,
      },
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "HUAC-HUAS",
        puntuacion: 2491,
      },
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "LARAMATE",
        puntuacion: 2581,
      },
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "LEONCIO PRADO",
        puntuacion: 1067,
      },
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "LLAUTA",
        puntuacion: 2993,
      },
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "LUCANAS",
        puntuacion: 2663,
      },
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "OCAÑA",
        puntuacion: 1056,
      },
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "OTOCA",
        puntuacion: 1512,
      },
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "PUQUIO",
        puntuacion: 1164,
      },
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "SAISA",
        puntuacion: 87,
      },
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "SANCOS",
        puntuacion: 2954,
      },
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "SAN CRISTOBAL",
        puntuacion: 2762,
      },
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "SAN JUAN",
        puntuacion: 1213,
      },
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "SAN PEDRO",
        puntuacion: 2316,
      },
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "SAN PEDRO DE PALCO",
        puntuacion: 997,
      },
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "SANTA ANA DE HUAYCAHUACHO",
        puntuacion: 2028,
      },
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "SANTA LUCIA",
        puntuacion: 2548,
      },
      {
        departamento: "Ayacucho",
        provincia: "PARINACOCHAS",
        distrito: "CHUMPI",
        puntuacion: 1269,
      },
      {
        departamento: "Ayacucho",
        provincia: "PARINACOCHAS",
        distrito: "CORACORA",
        puntuacion: 1151,
      },
      {
        departamento: "Ayacucho",
        provincia: "PARINACOCHAS",
        distrito: "CORONEL CASTAÑEDA",
        puntuacion: 671,
      },
      {
        departamento: "Ayacucho",
        provincia: "PARINACOCHAS",
        distrito: "PACAPAUSA",
        puntuacion: 1364,
      },
      {
        departamento: "Ayacucho",
        provincia: "PARINACOCHAS",
        distrito: "PULLO",
        puntuacion: 2478,
      },
      {
        departamento: "Ayacucho",
        provincia: "PARINACOCHAS",
        distrito: "PUYUSCA",
        puntuacion: 1104,
      },
      {
        departamento: "Ayacucho",
        provincia: "PARINACOCHAS",
        distrito: "SAN FRANCISCO DE RAVACAYCO",
        puntuacion: 2713,
      },
      {
        departamento: "Ayacucho",
        provincia: "PARINACOCHAS",
        distrito: "UPAHUACHO",
        puntuacion: 2551,
      },
      {
        departamento: "Ayacucho",
        provincia: "PAUCAR DEL SARA SARA",
        distrito: "COLTA",
        puntuacion: 2958,
      },
      {
        departamento: "Ayacucho",
        provincia: "PAUCAR DEL SARA SARA",
        distrito: "CORCULLA",
        puntuacion: 1956,
      },
      {
        departamento: "Ayacucho",
        provincia: "PAUCAR DEL SARA SARA",
        distrito: "LAMPA",
        puntuacion: 1483,
      },
      {
        departamento: "Ayacucho",
        provincia: "PAUCAR DEL SARA SARA",
        distrito: "MARCABAMBA",
        puntuacion: 2757,
      },
      {
        departamento: "Ayacucho",
        provincia: "PAUCAR DEL SARA SARA",
        distrito: "OYOLO",
        puntuacion: 1564,
      },
      {
        departamento: "Ayacucho",
        provincia: "PAUCAR DEL SARA SARA",
        distrito: "PARARCA",
        puntuacion: 2198,
      },
      {
        departamento: "Ayacucho",
        provincia: "PAUCAR DEL SARA SARA",
        distrito: "PAUSA",
        puntuacion: 3016,
      },
      {
        departamento: "Ayacucho",
        provincia: "PAUCAR DEL SARA SARA",
        distrito: "SAN JAVIER DE ALPABAMBA",
        puntuacion: 1157,
      },
      {
        departamento: "Ayacucho",
        provincia: "PAUCAR DEL SARA SARA",
        distrito: "SAN JOSE DE USHUA",
        puntuacion: 689,
      },
      {
        departamento: "Ayacucho",
        provincia: "PAUCAR DEL SARA SARA",
        distrito: "SARA SARA",
        puntuacion: 1632,
      },
      {
        departamento: "Ayacucho",
        provincia: "SUCRE",
        distrito: "BELEN",
        puntuacion: 1285,
      },
      {
        departamento: "Ayacucho",
        provincia: "SUCRE",
        distrito: "CHALCOS",
        puntuacion: 2731,
      },
      {
        departamento: "Ayacucho",
        provincia: "SUCRE",
        distrito: "CHILCAYOC",
        puntuacion: 2148,
      },
      {
        departamento: "Ayacucho",
        provincia: "SUCRE",
        distrito: "HUACAÑA",
        puntuacion: 2432,
      },
      {
        departamento: "Ayacucho",
        provincia: "SUCRE",
        distrito: "MORCOLLA",
        puntuacion: 2077,
      },
      {
        departamento: "Ayacucho",
        provincia: "SUCRE",
        distrito: "PAICO",
        puntuacion: 1923,
      },
      {
        departamento: "Ayacucho",
        provincia: "SUCRE",
        distrito: "QUEROBAMBA",
        puntuacion: 2450,
      },
      {
        departamento: "Ayacucho",
        provincia: "SUCRE",
        distrito: "SAN PEDRO DE LARCAY",
        puntuacion: 1068,
      },
      {
        departamento: "Ayacucho",
        provincia: "SUCRE",
        distrito: "SAN SALVADOR DE QUIJE",
        puntuacion: 2302,
      },
      {
        departamento: "Ayacucho",
        provincia: "SUCRE",
        distrito: "SANTIAGO DE PAUCARAY",
        puntuacion: 2687,
      },
      {
        departamento: "Ayacucho",
        provincia: "SUCRE",
        distrito: "SORAS",
        puntuacion: 2582,
      },
      {
        departamento: "Ayacucho",
        provincia: "VICTOR FAJARDO",
        distrito: "ALCAMENCA",
        puntuacion: 2211,
      },
      {
        departamento: "Ayacucho",
        provincia: "VICTOR FAJARDO",
        distrito: "APONGO",
        puntuacion: 1023,
      },
      {
        departamento: "Ayacucho",
        provincia: "VICTOR FAJARDO",
        distrito: "ASQUIPATA",
        puntuacion: 2992,
      },
      {
        departamento: "Ayacucho",
        provincia: "VICTOR FAJARDO",
        distrito: "CANARIA",
        puntuacion: 2170,
      },
      {
        departamento: "Ayacucho",
        provincia: "VICTOR FAJARDO",
        distrito: "CAYARA",
        puntuacion: 1093,
      },
      {
        departamento: "Ayacucho",
        provincia: "VICTOR FAJARDO",
        distrito: "COLCA",
        puntuacion: 2104,
      },
      {
        departamento: "Ayacucho",
        provincia: "VICTOR FAJARDO",
        distrito: "HUAMANQUIQUIA",
        puntuacion: 2855,
      },
      {
        departamento: "Ayacucho",
        provincia: "VICTOR FAJARDO",
        distrito: "HUANCAPI",
        puntuacion: 2241,
      },
      {
        departamento: "Ayacucho",
        provincia: "VICTOR FAJARDO",
        distrito: "HUANCARAYLLA",
        puntuacion: 1557,
      },
      {
        departamento: "Ayacucho",
        provincia: "VICTOR FAJARDO",
        distrito: "HUAYA",
        puntuacion: 1235,
      },
      {
        departamento: "Ayacucho",
        provincia: "VICTOR FAJARDO",
        distrito: "SARHUA",
        puntuacion: 2827,
      },
      {
        departamento: "Ayacucho",
        provincia: "VICTOR FAJARDO",
        distrito: "VILCANCHOS",
        puntuacion: 1117,
      },
      {
        departamento: "Ayacucho",
        provincia: "VILCAS HUAMAN",
        distrito: "ACCOMARCA",
        puntuacion: 2375,
      },
      {
        departamento: "Ayacucho",
        provincia: "VILCAS HUAMAN",
        distrito: "CARHUANCA",
        puntuacion: 1192,
      },
      {
        departamento: "Ayacucho",
        provincia: "VILCAS HUAMAN",
        distrito: "CONCEPCION",
        puntuacion: 832,
      },
      {
        departamento: "Ayacucho",
        provincia: "VILCAS HUAMAN",
        distrito: "HUAMBALPA",
        puntuacion: 1279,
      },
      {
        departamento: "Ayacucho",
        provincia: "VILCAS HUAMAN",
        distrito: "INDEPENDENCIA",
        puntuacion: 2016,
      },
      {
        departamento: "Ayacucho",
        provincia: "VILCAS HUAMAN",
        distrito: "SAURAMA",
        puntuacion: 2814,
      },
      {
        departamento: "Ayacucho",
        provincia: "VILCAS HUAMAN",
        distrito: "VILCAS HUAMAN",
        puntuacion: 1563,
      },
      {
        departamento: "Ayacucho",
        provincia: "VILCAS HUAMAN",
        distrito: "VISCHONGO",
        puntuacion: 2097,
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
    if (provincia === "") return "ANEMIA POR PROVINCIAS";
    if (distrito === "") return `ANEMIA EN ${provincia}`;
    return `ANEMIA EN ${distrito}`;
  };

  const getSubtituloGrafico = () => {
    if (provincia === "") return "VALORES DEL 2024";
    if (distrito === "") return "CANTIDAD POR DISTRITOS";
    return "DATOS DEL DISTRITO";
  };

  return (
    <div className="flex flex-col w-full h-full mx-auto overflow-hidden max-w-[95rem] gap-8 p-6 sm:py-10">
      <h2 className="mb-8 sm:mb-10 text-center text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
        La Anemia en Ayacucho
      </h2>
      <div className="flex flex-col lg:flex-row w-full h-full mx-auto gap-8 p-6">
        <div className="w-full h-full max-w-4xl">
          <GeoJsonSvg
            provincia={provincia}
            distrito={distrito}
            setProvincia={setProvincia}
            setDistrito={setDistrito}
            data={all}
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
