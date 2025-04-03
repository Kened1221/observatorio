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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, Cell, YAxis, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Default props with TypeScript interface
interface ContainerNinoProps {
  provincia?: string;
  distrito?: string;
  handleBarClick?: (data: any) => void;
  chartData?: Array<{
    nombre: string;
    puntuacion: number;
    fill: string;
    cursor?: string;
  }>;
  chartConfig?: any;
}

export default function ContainerNino({
  provincia = "",
  distrito = "",
  handleBarClick = () => {},
  chartData = [],
  chartConfig = {},
}: ContainerNinoProps) {
  // Helper functions for title and subtitle
  const getTituloGrafico = () => {
    if (distrito !== "") return `Estadísticas de ${distrito}`;
    if (provincia !== "") return `Estadísticas de ${provincia}`;
    return "Estadísticas de Niños";
  };

  const getSubtituloGrafico = () => {
    if (distrito !== "") return "Detalle por localidad";
    if (provincia !== "") return "Detalle por distrito";
    return "Detalle por provincia";
  };

  return (
    <Tabs defaultValue="account" className="w-full">
      <TabsList className="grid w-full grid-cols-5 gap-10">
        <TabsTrigger value="account">ANEMIA</TabsTrigger>
        <TabsTrigger value="password">DESNUTRICIÓN</TabsTrigger>
        <TabsTrigger value="educacion">EDUCACIÓN</TabsTrigger>
        <TabsTrigger value="consejeria">CONSEJERÍA</TabsTrigger>
        <TabsTrigger value="riesgo">RIESGO</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
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
                    margin={{ left: 8, right: 8, top: 8, bottom: 8 }}
                    barSize={20}
                    className="w-full"
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
                      width={120}
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
                <div className="flex items-center justify-center h-[300px]">
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
      <TabsContent value="password">
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
                    margin={{ left: 8, right: 8, top: 8, bottom: 8 }}
                    barSize={20}
                    className="w-full"
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
                      width={120}
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
                <div className="flex items-center justify-center h-[300px]">
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
      <TabsContent value="educacion">
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
                    margin={{ left: 8, right: 8, top: 8, bottom: 8 }}
                    barSize={20}
                    className="w-full"
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
                      width={120}
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
                <div className="flex items-center justify-center h-[300px]">
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
      <TabsContent value="consejeria">
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
                    margin={{ left: 8, right: 8, top: 8, bottom: 8 }}
                    barSize={20}
                    className="w-full"
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
                      width={120}
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
                <div className="flex items-center justify-center h-[300px]">
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
      <TabsContent value="riesgo">
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
                    margin={{ left: 8, right: 8, top: 8, bottom: 8 }}
                    barSize={20}
                    className="w-full"
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
                      width={120}
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
                <div className="flex items-center justify-center h-[300px]">
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
    </Tabs>
  );
}