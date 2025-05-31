// Page.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAvanceAverages } from "@/actions/incluir-crecer-actions";
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
import GeoJsonSvg from "@/components/map/GeoJsonSvgProcentaje";

interface AvanceData {
    ubicacionId: number;
    objetivo: string;
    provincia: string;
    distrito: string;
    total: number | null;
}

interface BarData {
    objetivo: string;
    totalAverage: number;
}

export default function Page() {
    const [data, setData] = useState<AvanceData[]>([]);
    const [provincia, setProvincia] = useState<string>("");
    const [distrito, setDistrito] = useState<string>("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const result = await getAvanceAverages(provincia, distrito);
                setData(result);
            } catch (error) {
                console.error("Error fetching data:", error);
                setData([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [provincia, distrito]);

    const chartConfig = {
        totalAverage: {
            label: "Promedio Total",
            color: "#10b981",
        },
    };

    const barChartData: BarData[] = [
        "objetivo 1",
        "objetivo 2",
        "objetivo 3",
        "objetivo 4",
        "objetivo 5",
    ].map((objetivo) => {
        const filteredData = data.filter((item) => item.objetivo === objetivo);
        const totalAverage =
            filteredData.length > 0
                ? filteredData.reduce((sum, item) => sum + (item.total ?? 0), 0) /
                filteredData.length
                : 0;
        return { objetivo, totalAverage };
    });

    const mapData = data.reduce((acc: Record<number, AvanceData[]>, item) => {
        if (!acc[item.ubicacionId]) {
            acc[item.ubicacionId] = [];
        }
        acc[item.ubicacionId].push(item);
        return acc;
    }, {});

    const mapDataArray = Object.values(mapData).map((items) => {
        const averagedTotal = items.reduce((sum, item) => sum + (item.total ?? 0), 0) / items.length;
        return {
            ubicacionId: items[0].ubicacionId,
            provincia: items[0].provincia,
            distrito: items[0].distrito,
            porcentaje: averagedTotal,
        };
    });

    const renderChart = () => (
        <ChartContainer
            config={chartConfig}
            className="h-[600px] w-full flex items-center justify-center"
            aria-label="Gráfico de barras de promedios por objetivo"
        >
            <ResponsiveContainer width="95%" height="95%">
                <BarChart
                    data={barChartData}
                    margin={{ top: 20, right: 20, left: 20, bottom: 60 }}
                >
                    <XAxis
                        dataKey="objetivo"
                        angle={0}
                        textAnchor="middle"
                        height={60}
                        interval={0}
                        tick={{ fontSize: 20 }}
                    />
                    <YAxis tickFormatter={(value) => `${value}%`} domain={[0, 100]} />
                    <ChartTooltip
                        content={
                            <ChartTooltipContent
                                labelFormatter={(label, payload) => {
                                    if (payload && payload.length > 0) {
                                        return payload[0].payload.objetivo;
                                    }
                                    return label;
                                }}
                            />
                        }
                        formatter={(value) => {
                            const numericValue = Number(value);
                            const formattedValue = isNaN(numericValue)
                                ? value
                                : `${numericValue.toFixed(2)}%`;
                            return [formattedValue, " Promedio Total"];
                        }}
                    />
                    <Bar
                        dataKey="totalAverage"
                        fill={chartConfig.totalAverage.color}
                        radius={[4, 4, 0, 0]}
                        name={chartConfig.totalAverage.label}
                    >
                        {barChartData.map((entry, index) => (
                            <Cell
                                key={`totalAverage-${index}`}
                                fill={
                                    entry.totalAverage <= 50
                                        ? "hsl(0, 100%, 50%)"
                                        : entry.totalAverage <= 80
                                            ? "hsl(60, 100%, 50%)"
                                            : "hsl(120, 100%, 50%)"
                                }
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </ChartContainer>
    );

    return (
        <Card className="border-none shadow-lg w-full h-full max-w-[80%] mx-auto p-20">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-red-900">
                    Promedios de Avances por Objetivo
                </CardTitle>
                <p className="text-sm text-red-700">
                    Visualiza el promedio del total por objetivo y ubicación en el mapa.
                </p>
            </CardHeader>
            <CardContent className="pt-6">
                {loading ? (
                    <div className="flex justify-center items-center h-[600px]">
                        <p>Loading...</p>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className="w-full lg:w-1/3">
                            <GeoJsonSvg
                                provincia={provincia}
                                distrito={distrito}
                                setProvincia={setProvincia}
                                setDistrito={setDistrito}
                                data={mapDataArray}
                            />
                        </div>
                        <div className="w-full lg:w-2/3 flex items-center justify-center">
                            {renderChart()}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}