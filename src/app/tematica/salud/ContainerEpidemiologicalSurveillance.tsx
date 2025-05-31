"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GeoJsonSvg from "@/components/map/GeoJsonSvgEpidemiologica";
import { getEpidemiologicalData } from "@/actions/salud-nutricion-actions";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface EpidemiologicalData {
  id: number;
  anio: number;
  ubicacionId: number;
  numeroCasos: number;
  evaluados: number;
  porcentaje: number;
  ubicacion: {
    id: number;
    departamentoId: number;
    provinciaId: number;
    distritoId: number;
    provincia: { nombre: string };
    distrito: { nombre: string };
  };
}

type Category = "poblacion_curso_vida" | "anemia" | "desnutricion" | "dengue";

interface BarData {
  distrito: string;
  provincia: string;
  porcentaje: number;
  numeroCasos?: number;
  evaluados?: number;
}

export default function ContainerEpidemiologicalSurveillance() {
  const [category, setCategory] = useState<Category>("poblacion_curso_vida");
  const [provincia, setProvincia] = useState<string>("");
  const [distrito, setDistrito] = useState<string>("");
  const [data, setData] = useState<EpidemiologicalData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getEpidemiologicalData(category, "", "");
        setData(result);
      } catch {
        setData([]);
      }
    };
    fetchData();
  }, [category]);

  const chartConfig = {
    porcentaje: {
      label: "Porcentaje",
      color: "#10b981",
    },
  };

  const isProvinceView = !provincia;

  const groupedData: BarData[] = Object.values(
    data.reduce((acc: Record<string, { provincia: string; porcentajes: number[] }>, item) => {
      const prov = item.ubicacion.provincia.nombre;
      if (!acc[prov]) {
        acc[prov] = { provincia: prov, porcentajes: [] };
      }
      acc[prov].porcentajes.push(item.porcentaje * 100);
      return acc;
    }, {})
  ).map((group) => ({
    distrito: "",
    provincia: group.provincia,
    porcentaje:
      group.porcentajes.reduce((sum, val) => sum + val, 0) / group.porcentajes.length,
  }));

  const districtData: BarData[] = data
    .filter((item) => item.ubicacion.provincia.nombre === provincia)
    .map((item) => ({
      distrito: item.ubicacion.distrito.nombre,
      provincia: item.ubicacion.provincia.nombre,
      porcentaje: item.porcentaje * 100,
      numeroCasos: item.numeroCasos,
      evaluados: item.evaluados,
    }));

  const barChartData: BarData[] = isProvinceView ? groupedData : districtData;

  const handleBarClick = (entry: BarData | undefined) => {
    if (!entry) return;
    if (isProvinceView) {
      setProvincia(entry.provincia);
    }
  };

  const renderChart = (label: string) => (
    <ChartContainer
      config={chartConfig}
      className="h-[600px] w-full flex flex-col items-center justify-center"
      aria-label={`Gráfico de barras de ${label.toLowerCase()}`}
    >
      <div className="w-full h-full flex flex-col items-center">
        <div className="w-full max-w-2xl mb-20 p-4 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-sm text-center shadow-sm">
          <strong className="block text-base font-medium mb-1">
            {isProvinceView ? "Vista por Provincias" : "Vista por Distritos"}
          </strong>
          {isProvinceView ? (
            <span>Se muestra el <strong>promedio de porcentaje</strong> de los distritos en cada provincia.</span>
          ) : (
            <span>Se muestra el <strong>porcentaje individual</strong> de cada distrito en la provincia de <strong>{provincia}</strong>.</span>
          )}
        </div>

        <ResponsiveContainer width="95%" height="100%">
          <BarChart
            data={barChartData}
            margin={{ top: 20, right: 20, left: 20, bottom: 60 }}
          >
            <XAxis
              dataKey={isProvinceView ? "provincia" : "distrito"}
              angle={-45}
              textAnchor="end"
              height={60}
              interval="preserveStartEnd"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) =>
                value.length > 10 ? `${value.slice(0, 10)}...` : value
              }
            />
            <YAxis tickFormatter={(value) => `${value}%`} domain={[0, 100]} />
            <ChartTooltip
              content={<ChartTooltipContent />}
              formatter={(value, name) => {
                if (name === "porcentaje") {
                  const numericValue = Number(value);
                  return [
                    isNaN(numericValue) ? value : `${numericValue.toFixed(1)}%`,
                    "Porcentaje",
                  ];
                }
                return [value, name];
              }}
            />
            <Bar
              dataKey="porcentaje"
              fill={chartConfig.porcentaje.color}
              radius={[4, 4, 0, 0]}
              name={chartConfig.porcentaje.label}
              cursor={isProvinceView ? "pointer" : "default"}
              onClick={(data, index) =>
                isProvinceView && handleBarClick(barChartData[index])
              }
            >
              {barChartData.map((entry, index) => (
                <Cell
                  key={`porcentaje-${index}`}
                  fill={
                    entry.porcentaje <= 50
                      ? "hsl(0, 100%, 50%)"
                      : entry.porcentaje <= 80
                        ? "hsl(60, 100%, 50%)"
                        : "hsl(120, 100%, 50%)"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>

  );

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-red-900">
          Vigilancia Epidemiológica
        </CardTitle>
        <p className="text-sm text-red-700">
          Explora datos sobre población por curso de vida, anemia, desnutrición y dengue por provincia y distrito.
        </p>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs
          value={category}
          onValueChange={(value) => {
            setCategory(value as Category);
            setProvincia("");
            setDistrito("");
          }}
          className="mb-6"
        >
          <TabsList className="grid w-full grid-cols-4 gap-2 bg-gray-100 rounded-lg p-1">
            <TabsTrigger value="poblacion_curso_vida">Población por Curso de Vida</TabsTrigger>
            <TabsTrigger value="anemia">Anemia</TabsTrigger>
            <TabsTrigger value="desnutricion">Desnutrición</TabsTrigger>
            <TabsTrigger value="dengue">Dengue</TabsTrigger>
          </TabsList>

          <div className="font-extrabold text-red-500 text-center p-8 max-w-7xl mx-auto">
            <h1 className="text-4xl">
              {category === "poblacion_curso_vida" ? (
                `POBLACIÓN POR CURSO DE VIDA QUE ACCEDEN AL ESTABLECIMIENTO DE SALUD DIRESA AYACUCHO`
              ) : category === "anemia" ? (
                `ANEMIA EN NIÑOS DE 6 A 35 MESES QUE ACCEDEN AL ESTABLECIMIENTO DE SALUD DIRESA AYACUCHO`
              ) : category === "desnutricion" ? (
                `DESNUTRICION CRONICA EN NIÑOS MENORES DE 5 AÑOS  QUE ACCEDEN A ESTABLECIMIENTOS DE SALUD DIRESA AYACUCHO`
              ) : (
                ` DENGUE NIÑOS MENORES QUE ACCEDEN A ESTABLECIMIENTOS DE SALUD DIRESA AYACUCHO ANUAL`
              )}
            </h1>
          </div>

          {["poblacion_curso_vida", "anemia", "desnutricion", "dengue"].map((tab) => (
            <TabsContent key={tab} value={tab}>
              <div className="flex flex-col lg:flex-row gap-6 pt-8">
                <div className="w-full lg:w-1/3">
                  <GeoJsonSvg
                    provincia={provincia}
                    distrito={distrito}
                    setProvincia={setProvincia}
                    setDistrito={setDistrito}
                    data={data}
                  />
                </div>
                <div className="w-full lg:w-2/3 flex items-center justify-center">
                  {renderChart(
                    tab === "poblacion_curso_vida"
                      ? "Población por Curso de Vida"
                      : tab === "anemia"
                        ? "Prevalencia de Anemia"
                        : tab === "desnutricion"
                          ? "Prevalencia de Desnutrición"
                          : "Incidencia de Dengue"
                  )}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card >
  );
}
