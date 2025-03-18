"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";
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
  const [provincia, setProvincia] = useState<string>("all");

  // Usar useMemo para evitar recrear el array en cada renderizado
  const distritos = useMemo(
    () => [
      { provincia: "CANGALLO", distrito: "CANGALLO", puntuacion: 2749 },
      { provincia: "CANGALLO", distrito: "CHUSCHI", puntuacion: 1321 },
      { provincia: "CANGALLO", distrito: "LOS MOROCHUCOS", puntuacion: 1928 },
      {
        provincia: "CANGALLO",
        distrito: "MARIA PARADO DE BELLIDO",
        puntuacion: 1467,
      },
      { provincia: "CANGALLO", distrito: "PARAS", puntuacion: 2203 },
      { provincia: "CANGALLO", distrito: "TOTOS", puntuacion: 2678 },
      { provincia: "HUAMANGA", distrito: "ACOCRO", puntuacion: 1493 },
      { provincia: "HUAMANGA", distrito: "ACOS VINCHOS", puntuacion: 1200 },
      {
        provincia: "HUAMANGA",
        distrito: "ANDRES AVELINO CACERES DORREGARAY",
        puntuacion: 302,
      },
      { provincia: "HUAMANGA", distrito: "AYACUCHO", puntuacion: 2314 },
      { provincia: "HUAMANGA", distrito: "CARMEN ALTO", puntuacion: 1746 },
      { provincia: "HUAMANGA", distrito: "CHIARA", puntuacion: 813 },
      { provincia: "HUAMANGA", distrito: "JESUS NAZARENO", puntuacion: 1985 },
      { provincia: "HUAMANGA", distrito: "OCROS", puntuacion: 2557 },
      { provincia: "HUAMANGA", distrito: "PACAYCASA", puntuacion: 1758 },
      { provincia: "HUAMANGA", distrito: "QUINUA", puntuacion: 1001 },
      {
        provincia: "HUAMANGA",
        distrito: "SAN JOSE DE TICLLAS",
        puntuacion: 3019,
      },
      {
        provincia: "HUAMANGA",
        distrito: "SAN JUAN BAUTISTA",
        puntuacion: 1109,
      },
      {
        provincia: "HUAMANGA",
        distrito: "SANTIAGO DE PISCHA",
        puntuacion: 2683,
      },
      { provincia: "HUAMANGA", distrito: "SOCOS", puntuacion: 2957 },
      { provincia: "HUAMANGA", distrito: "TAMBILLO", puntuacion: 2443 },
      { provincia: "HUAMANGA", distrito: "VINCHOS", puntuacion: 1920 },
      { provincia: "HUANCA SANCOS", distrito: "CARAPO", puntuacion: 255 },
      { provincia: "HUANCA SANCOS", distrito: "SACSAMARCA", puntuacion: 2906 },
      { provincia: "HUANCA SANCOS", distrito: "SANCOS", puntuacion: 1794 },
      {
        provincia: "HUANCA SANCOS",
        distrito: "SANTIAGO DE LUCANAMARCA",
        puntuacion: 1987,
      },
      { provincia: "HUANTA", distrito: "AYAHUANCO", puntuacion: 937 },
      { provincia: "HUANTA", distrito: "CANAYRE", puntuacion: 1561 },
      { provincia: "HUANTA", distrito: "CHACA", puntuacion: 2024 },
      { provincia: "HUANTA", distrito: "HUAMANGUILLA", puntuacion: 1202 },
      { provincia: "HUANTA", distrito: "HUANTA", puntuacion: 2463 },
      { provincia: "HUANTA", distrito: "IGUAIN", puntuacion: 1519 },
      { provincia: "HUANTA", distrito: "LLOCHEGUA", puntuacion: 679 },
      { provincia: "HUANTA", distrito: "LURICOCHA", puntuacion: 1578 },
      { provincia: "HUANTA", distrito: "PUCACOLPA", puntuacion: 730 },
      { provincia: "HUANTA", distrito: "SANTILLANA", puntuacion: 2447 },
      { provincia: "HUANTA", distrito: "SIVIA", puntuacion: 2895 },
      { provincia: "HUANTA", distrito: "UCHURACCAY", puntuacion: 2513 },
      { provincia: "LA MAR", distrito: "ANCHIHUAY", puntuacion: 1702 },
      { provincia: "LA MAR", distrito: "ANCO", puntuacion: 2935 },
      { provincia: "LA MAR", distrito: "AYNA", puntuacion: 1010 },
      { provincia: "LA MAR", distrito: "CHILCAS", puntuacion: 688 },
      { provincia: "LA MAR", distrito: "CHUNGUI", puntuacion: 1596 },
      { provincia: "LA MAR", distrito: "LUIS CARRANZA", puntuacion: 2093 },
      { provincia: "LA MAR", distrito: "ORONCCOY", puntuacion: 2672 },
      { provincia: "LA MAR", distrito: "SAMUGARI", puntuacion: 2025 },
      { provincia: "LA MAR", distrito: "SAN MIGUEL", puntuacion: 3018 },
      { provincia: "LA MAR", distrito: "SANTA ROSA", puntuacion: 1319 },
      { provincia: "LA MAR", distrito: "TAMBO", puntuacion: 303 },
      { provincia: "LUCANAS", distrito: "AUCARA", puntuacion: 2712 },
      { provincia: "LUCANAS", distrito: "CABANA", puntuacion: 2309 },
      { provincia: "LUCANAS", distrito: "CARMEN SALCEDO", puntuacion: 957 },
      { provincia: "LUCANAS", distrito: "CHAVIÑA", puntuacion: 2454 },
      { provincia: "LUCANAS", distrito: "CHIPAO", puntuacion: 810 },
      { provincia: "LUCANAS", distrito: "HUAC-HUAS", puntuacion: 2491 },
      { provincia: "LUCANAS", distrito: "LARAMATE", puntuacion: 2581 },
      { provincia: "LUCANAS", distrito: "LEONCIO PRADO", puntuacion: 1067 },
      { provincia: "LUCANAS", distrito: "LLAUTA", puntuacion: 2993 },
      { provincia: "LUCANAS", distrito: "LUCANAS", puntuacion: 2663 },
      { provincia: "LUCANAS", distrito: "OCAÑA", puntuacion: 1056 },
      { provincia: "LUCANAS", distrito: "OTOCA", puntuacion: 1512 },
      { provincia: "LUCANAS", distrito: "PUQUIO", puntuacion: 1164 },
      { provincia: "LUCANAS", distrito: "SAISA", puntuacion: 87 },
      { provincia: "LUCANAS", distrito: "SANCOS", puntuacion: 2954 },
      { provincia: "LUCANAS", distrito: "SAN CRISTOBAL", puntuacion: 2762 },
      { provincia: "LUCANAS", distrito: "SAN JUAN", puntuacion: 1213 },
      { provincia: "LUCANAS", distrito: "SAN PEDRO", puntuacion: 2316 },
      { provincia: "LUCANAS", distrito: "SAN PEDRO DE PALCO", puntuacion: 997 },
      {
        provincia: "LUCANAS",
        distrito: "SANTA ANA DE HUAYCAHUACHO",
        puntuacion: 2028,
      },
      { provincia: "LUCANAS", distrito: "SANTA LUCIA", puntuacion: 2548 },
      { provincia: "PARINACOCHAS", distrito: "CHUMPI", puntuacion: 1269 },
      { provincia: "PARINACOCHAS", distrito: "CORACORA", puntuacion: 1151 },
      {
        provincia: "PARINACOCHAS",
        distrito: "CORONEL CASTAÑEDA",
        puntuacion: 671,
      },
      { provincia: "PARINACOCHAS", distrito: "PACAPAUSA", puntuacion: 1364 },
      { provincia: "PARINACOCHAS", distrito: "PULLO", puntuacion: 2478 },
      { provincia: "PARINACOCHAS", distrito: "PUYUSCA", puntuacion: 1104 },
      {
        provincia: "PARINACOCHAS",
        distrito: "SAN FRANCISCO DE RAVACAYCO",
        puntuacion: 2713,
      },
      { provincia: "PARINACOCHAS", distrito: "UPAHUACHO", puntuacion: 2551 },
      {
        provincia: "PAUCAR DEL SARA SARA",
        distrito: "COLTA",
        puntuacion: 2958,
      },
      {
        provincia: "PAUCAR DEL SARA SARA",
        distrito: "CORCULLA",
        puntuacion: 1956,
      },
      {
        provincia: "PAUCAR DEL SARA SARA",
        distrito: "LAMPA",
        puntuacion: 1483,
      },
      {
        provincia: "PAUCAR DEL SARA SARA",
        distrito: "MARCABAMBA",
        puntuacion: 2757,
      },
      {
        provincia: "PAUCAR DEL SARA SARA",
        distrito: "OYOLO",
        puntuacion: 1564,
      },
      {
        provincia: "PAUCAR DEL SARA SARA",
        distrito: "PARARCA",
        puntuacion: 2198,
      },
      {
        provincia: "PAUCAR DEL SARA SARA",
        distrito: "PAUSA",
        puntuacion: 3016,
      },
      {
        provincia: "PAUCAR DEL SARA SARA",
        distrito: "SAN JAVIER DE ALPABAMBA",
        puntuacion: 1157,
      },
      {
        provincia: "PAUCAR DEL SARA SARA",
        distrito: "SAN JOSE DE USHUA",
        puntuacion: 689,
      },
      {
        provincia: "PAUCAR DEL SARA SARA",
        distrito: "SARA SARA",
        puntuacion: 1632,
      },
      { provincia: "SUCRE", distrito: "BELEN", puntuacion: 1285 },
      { provincia: "SUCRE", distrito: "CHALCOS", puntuacion: 2731 },
      { provincia: "SUCRE", distrito: "CHILCAYOC", puntuacion: 2148 },
      { provincia: "SUCRE", distrito: "HUACAÑA", puntuacion: 2432 },
      { provincia: "SUCRE", distrito: "MORCOLLA", puntuacion: 2077 },
      { provincia: "SUCRE", distrito: "PAICO", puntuacion: 1923 },
      { provincia: "SUCRE", distrito: "QUEROBAMBA", puntuacion: 2450 },
      { provincia: "SUCRE", distrito: "SAN PEDRO DE LARCAY", puntuacion: 1068 },
      {
        provincia: "SUCRE",
        distrito: "SAN SALVADOR DE QUIJE",
        puntuacion: 2302,
      },
      {
        provincia: "SUCRE",
        distrito: "SANTIAGO DE PAUCARAY",
        puntuacion: 2687,
      },
      { provincia: "SUCRE", distrito: "SORAS", puntuacion: 2582 },
      { provincia: "VICTOR FAJARDO", distrito: "ALCAMENCA", puntuacion: 2211 },
      { provincia: "VICTOR FAJARDO", distrito: "APONGO", puntuacion: 1023 },
      { provincia: "VICTOR FAJARDO", distrito: "ASQUIPATA", puntuacion: 2992 },
      { provincia: "VICTOR FAJARDO", distrito: "CANARIA", puntuacion: 2170 },
      { provincia: "VICTOR FAJARDO", distrito: "CAYARA", puntuacion: 1093 },
      { provincia: "VICTOR FAJARDO", distrito: "COLCA", puntuacion: 2104 },
      {
        provincia: "VICTOR FAJARDO",
        distrito: "HUAMANQUIQUIA",
        puntuacion: 2855,
      },
      { provincia: "VICTOR FAJARDO", distrito: "HUANCAPI", puntuacion: 2241 },
      {
        provincia: "VICTOR FAJARDO",
        distrito: "HUANCARAYLLA",
        puntuacion: 1557,
      },
      { provincia: "VICTOR FAJARDO", distrito: "HUAYA", puntuacion: 1235 },
      { provincia: "VICTOR FAJARDO", distrito: "SARHUA", puntuacion: 2827 },
      { provincia: "VICTOR FAJARDO", distrito: "VILCANCHOS", puntuacion: 1117 },
      { provincia: "VILCAS HUAMAN", distrito: "ACCOMARCA", puntuacion: 2375 },
      { provincia: "VILCAS HUAMAN", distrito: "CARHUANCA", puntuacion: 1192 },
      { provincia: "VILCAS HUAMAN", distrito: "CONCEPCION", puntuacion: 832 },
      { provincia: "VILCAS HUAMAN", distrito: "HUAMBALPA", puntuacion: 1279 },
      {
        provincia: "VILCAS HUAMAN",
        distrito: "INDEPENDENCIA",
        puntuacion: 2016,
      },
      { provincia: "VILCAS HUAMAN", distrito: "SAURAMA", puntuacion: 2814 },
      {
        provincia: "VILCAS HUAMAN",
        distrito: "VILCAS HUAMAN",
        puntuacion: 1563,
      },
      { provincia: "VILCAS HUAMAN", distrito: "VISCHONGO", puntuacion: 2097 },
    ],
    []
  );

  // Función para obtener el color según el valor de puntuación
  const getColor = (puntuacion: number): string => {
    if (puntuacion < 1000) return "#22c55e"; // Verde
    if (puntuacion < 2000) return "#eab308"; // Amarillo
    return "#ef4444"; // Rojo
  };
  // Calcular datos para la gráfica basado en la provincia seleccionada
  const chartData = useMemo(() => {
    if (provincia === "all") {
      // Agrupar por provincia y sumar puntuaciones
      const provinciasAgrupadas = distritos.reduce<
        Record<string, ProvinciaAgrupada>
      >((acc, distrito) => {
        if (!acc[distrito.provincia]) {
          acc[distrito.provincia] = {
            nombre: distrito.provincia,
            cantidad: 0,
          };
        }
        acc[distrito.provincia].cantidad += distrito.puntuacion;
        return acc;
      }, {});

      // Convertir a array y ordenar por nombre
      return Object.values(provinciasAgrupadas)
        .map((p) => ({
          nombre: p.nombre,
          puntuacion: p.cantidad,
          fill: "#2898EE",
        }))
        .sort((a, b) => a.nombre.localeCompare(b.nombre));
    } else {
      // Filtrar distritos de la provincia seleccionada
      return distritos
        .filter((d) => d.provincia === provincia)
        .map((d) => ({
          nombre: d.distrito,
          puntuacion: d.puntuacion,
          fill: getColor(d.puntuacion),
        }))
        .sort((a, b) => a.nombre.localeCompare(b.nombre));
    }
  }, [provincia, distritos]);

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

  const titulo =
    provincia === "all" ? "ANEMIA POR PROVINCIAS" : `ANEMIA EN ${provincia}`;
  const subtitulo =
    provincia === "all" ? "VALORES DEL" : "CANTIDAD POR DISTRITOS";

  return (
    <div className="flex flex-col lg:flex-row w-full h-full mx-auto overflow-hidden max-w-[95rem] gap-8 p-6 sm:py-10">
      <div className="w-full h-full max-w-4xl">
        <GeoJsonSvg
          type={provincia}
          distritos={distritos}
          setProvincia={setProvincia}
        />
      </div>
      <div className="w-full h-full">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-lg sm:text-xl">{titulo}</CardTitle>
            <CardDescription className="text-sm">
              {subtitulo} 2024
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full overflow-x-auto">
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
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
          {provincia !== "all" && (
            <CardFooter className="flex-col items-center gap-2 text-xs sm:text-sm">
              <div className="flex flex-wrap items-center gap-2 font-medium leading-none">
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span>Menor a 1000</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <span>Entre 1000 y 2000</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <span>Mayor a 2000</span>
                </div>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
