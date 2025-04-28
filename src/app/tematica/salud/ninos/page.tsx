/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BarChart, Bar, Cell, YAxis, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import GeoJsonSvg from "@/components/map/GeoJsonSvg";
import { useEffect, useState } from "react";
import { desnutricionNinos, AnemiaNinos } from "@/actions/ninos-actions";

// Definir el tipo para ChartConfig si no está importado
interface ChartConfig {
  [key: string]: {
    label?: React.ReactNode;
    color?: string;
    theme?: Record<"light" | "dark", string>;
  };
}

export default function ContainerNino() {
  const [provincia, setProvincia] = useState<string>("");
  const [distrito, setDistrito] = useState<string>("");
  const [res, setRes] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>("desnutricion");

  // Fetch data based on active tab
  const fetchData = async () => {
    try {
      let data;
      if (activeTab === "anemia") {
        data = await AnemiaNinos();
      } else {
        data = await desnutricionNinos();
      }
      setRes(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, provincia, distrito]);

  const getTituloGrafico = () => {
    if (distrito !== "") return `Estadísticas de ${distrito}`;
    if (provincia !== "") return `Estadísticas de ${provincia}`;
    return `Estadísticas de ${activeTab === "anemia" ? "Anemia" : "Desnutrición"} en Niños`;
  };

  const getSubtituloGrafico = () => {
    if (distrito !== "") return "Detalle por localidad";
    if (provincia !== "") return "Detalle por distrito";
    return "Detalle por provincia";
  };

  const handleBarClick = (data: any) => {
    if (provincia === "" && data.nombre) {
      setProvincia(data.nombre);
    } else if (distrito === "" && data.nombre) {
      setDistrito(data.nombre);
    }
  };

  const getChartData = () => {
    if (distrito !== "") {
      const districtData = res.find(
        (item) => item.provincia === provincia && item.distrito === distrito
      );
      return districtData
        ? [
            {
              nombre: districtData.distrito,
              puntuacion: districtData.puntuacion,
              fill: getColorForValue(districtData.puntuacion),
              cursor: "default",
            },
          ]
        : [];
    }

    if (provincia !== "") {
      const districtsInProvince = res.filter(
        (item) => item.provincia === provincia
      );
      return districtsInProvince.map((item) => ({
        nombre: item.distrito,
        puntuacion: item.puntuacion,
        fill: getColorForValue(item.puntuacion),
        cursor: "pointer",
      }));
    }

    const provinceData: { [key: string]: { total: number; count: number } } = {};
    res.forEach((item) => {
      if (!provinceData[item.provincia]) {
        provinceData[item.provincia] = { total: 0, count: 0 };
      }
      provinceData[item.provincia].total += item.puntuacion;
      provinceData[item.provincia].count++;
    });

    return Object.keys(provinceData).map((province) => ({
      nombre: province,
      puntuacion: Math.round(
        provinceData[province].total / provinceData[province].count
      ),
      fill: getColorForValue(
        provinceData[province].total / provinceData[province].count
      ),
      cursor: "pointer",
    }));
  };

  const getColorForValue = (value: number) => {
    if (value < 1000) return "#57D385"; // Green
    if (value < 2000) return "#F2CE5E"; // Yellow
    return "#F26565"; // Red
  };

  const chartConfig = {
    puntuacion: {
      label: "Puntuación",
      color: "#57D385",
    },
  } satisfies ChartConfig;

  const chartData = getChartData();

  return (
    <div className="flex flex-row gap-4 w-full h-full">
      <div className="w-1/2 h-full">
        <GeoJsonSvg
          provincia={provincia}
          distrito={distrito}
          setProvincia={setProvincia}
          setDistrito={setDistrito}
          data={res}
        />
      </div>
      <div className="w-1/2 h-full flex flex-col gap-2">
        <Tabs
          defaultValue="desnutricion"
          className="w-full h-full flex flex-col"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-5 gap-10">
            <TabsTrigger value="desnutricion">Anemia Niños</TabsTrigger>
            <TabsTrigger value="anemia">ANEMIA</TabsTrigger>
            <TabsTrigger value="vacunados">VACUNADOS</TabsTrigger>
            <TabsTrigger value="educacion">EDUCACIÓN</TabsTrigger>
            <TabsTrigger value="consejeria">CONSEJERÍA</TabsTrigger>
          </TabsList>
          <TabsContent value="desnutricion" className="flex-1">
            <Card className="h-full flex flex-col">
              <CardHeader className="text-center">
                <CardTitle className="text-lg sm:text-xl">
                  {getTituloGrafico()}
                </CardTitle>
                <CardDescription className="text-sm">
                  {getSubtituloGrafico()}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 w-full">
                <div className="w-full h-full">
                  {chartData.length > 0 ? (
                    <ChartContainer
                      config={chartConfig}
                      className="w-full h-full min-h-[400px]"
                    >
                      <BarChart
                        accessibilityLayer
                        data={chartData}
                        layout="vertical"
                        margin={{ left: 8, right: 8, top: 8, bottom: 8 }}
                        barSize={20}
                        className="w-full h-full"
                        onClick={(data) => {
                          if (
                            data &&
                            data.activePayload &&
                            data.activePayload.length > 0
                          ) {
                            const clickedData = data.activePayload[0].payload;
                            if (distrito === "") handleBarClick(clickedData);
                          }
                        }}
                      >
                        <YAxis
                          dataKey="nombre"
                          type="category"
                          tickLine={false}
                          tickMargin={10}
                          axisLine={false}
                          width={150}
                          tick={{ fontSize: 10, transform: "translate(-5, 0)" }}
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
                          content={<ChartTooltipContent />}
                        />
                        <Bar dataKey="puntuacion" radius={[6, 6, 6, 6]}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ChartContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500">No hay datos disponibles</p>
                    </div>
                  )}
                </div>
              </CardContent>
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
            </Card>
          </TabsContent>
          <TabsContent value="anemia" className="flex-1">
            <Card className="h-full flex flex-col">
              <CardHeader className="text-center">
                <CardTitle className="text-lg sm:text-xl">
                  {getTituloGrafico()}
                </CardTitle>
                <CardDescription className="text-sm">
                  {getSubtituloGrafico()}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 w-full">
                <div className="w-full h-full">
                  {chartData.length > 0 ? (
                    <ChartContainer
                      config={chartConfig}
                      className="w-full h-full min-h-[400px]"
                    >
                      <BarChart
                        accessibilityLayer
                        data={chartData}
                        layout="vertical"
                        margin={{ left: 8, right: 8, top: 8, bottom: 8 }}
                        barSize={20}
                        className="w-full h-full"
                        onClick={(data) => {
                          if (
                            data &&
                            data.activePayload &&
                            data.activePayload.length > 0
                          ) {
                            const clickedData = data.activePayload[0].payload;
                            if (distrito === "") handleBarClick(clickedData);
                          }
                        }}
                      >
                        <YAxis
                          dataKey="nombre"
                          type="category"
                          tickLine={false}
                          tickMargin={10}
                          axisLine={false}
                          width={150}
                          tick={{ fontSize: 10, transform: "translate(-5, 0)" }}
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
                          content={<ChartTooltipContent />}
                        />
                        <Bar dataKey="puntuacion" radius={[6, 6, 6, 6]}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ChartContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500">No hay datos disponibles</p>
                    </div>
                  )}
                </div>
              </CardContent>
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
            </Card>
          </TabsContent>
          <TabsContent value="vacunados" className="flex-1">
            <Card className="h-full flex flex-col">
              <CardHeader className="text-center">
                <CardTitle className="text-lg sm:text-xl">
                  {getTituloGrafico()}
                </CardTitle>
                <CardDescription className="text-sm">
                  {getSubtituloGrafico()}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">Datos de vacunados no disponibles</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="educacion" className="flex-1">
            <Card className="h-full flex flex-col">
              <CardHeader className="text-center">
                <CardTitle className="text-lg sm:text-xl">
                  {getTituloGrafico()}
                </CardTitle>
                <CardDescription className="text-sm">
                  {getSubtituloGrafico()}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">Datos de educación no disponibles</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="consejeria" className="flex-1">
            <Card className="h-full flex flex-col">
              <CardHeader className="text-center">
                <CardTitle className="text-lg sm:text-xl">
                  {getTituloGrafico()}
                </CardTitle>
                <CardDescription className="text-sm">
                  {getSubtituloGrafico()}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">Datos de consejería no disponibles</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}