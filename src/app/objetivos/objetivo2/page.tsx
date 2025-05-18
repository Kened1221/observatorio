/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Bar, BarChart, Pie, PieChart, ResponsiveContainer, XAxis, YAxis, Legend, Cell } from "recharts";
import { getAvanceData, getAvanceOperations } from "@/actions/objetivos-actions";
import GeoJsonSvg from "@/components/map/GeoJsonSvgObj";

interface AvanceData {
    provincia: string;
    distrito: string;
    percentage: number;
    total: number;
}

export default function Objetivos1Page() {
    const [avanceData, setAvanceData] = useState<AvanceData[]>([]);
    const [operations, setOperations] = useState<string[]>([]);
    const [provincia, setProvincia] = useState<string>("");
    const [distrito, setDistrito] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [avance, setAvance] = useState("AVANCE OP 01");

    useEffect(() => {
        const fetchOperations = async () => {
            const ops = await getAvanceOperations("objetivo 2");
            setOperations(ops);
            if (ops.length > 0 && !ops.includes(avance)) {
                setAvance(ops[0]);
            }
        };
        fetchOperations();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const data = await getAvanceData(avance, "objetivo 2");
            setAvanceData(data);
            setLoading(false);
        };
        fetchData();
    }, [avance]);

    const barChartData = avanceData
        .filter((d) => !provincia || d.provincia === provincia)
        .map((d) => ({
            distrito: d.distrito,
            percentage: d.percentage,
        }));

    const pieChartData = [
        {
            name: "0–50% (Rojo)",
            value: avanceData.filter((d) => d.percentage <= 50).length,
            fill: "hsl(0, 100%, 50%)",
        },
        {
            name: "50–80% (Amarillo)",
            value: avanceData.filter((d) => d.percentage > 50 && d.percentage <= 80).length,
            fill: "hsl(60, 100%, 50%)",
        },
        {
            name: ">80% (Verde)",
            value: avanceData.filter((d) => d.percentage > 80).length,
            fill: "hsl(120, 100%, 50%)",
        },
    ].filter((d) => d.value > 0);

    const chartConfig = {
        percentage: {
            label: "Porcentaje",
            color: "hsl(220, 70%, 50%)",
        },
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-lg border border-gray-200 dark:border-gray-700">
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{label}</p>
                    <p className="text-gray-700 dark:text-gray-300">
                        Porcentaje: {payload[0].value.toFixed(1)}%
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="flex flex-col w-full min-h-screen mx-auto max-w-[85%] p-6 sm:p-8 gap-8">
            <Card className="shadow-xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                        Avances en Objetivos 2 - Ayacucho
                    </CardTitle>
                    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Selecciona el tipo de avance">
                        {operations.map((op) => (
                            <button
                                key={op}
                                onClick={() => setAvance(op)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${avance === op
                                    ? "bg-orange-500 text-white shadow-md"
                                    : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600"
                                    }`}
                                role="radio"
                                aria-checked={avance === op}
                                aria-label={`Seleccionar ${op}`}
                            >
                                {op}
                            </button>
                        ))}
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p className="text-center text-gray-500 dark:text-gray-400">Cargando datos...</p>
                    ) : avanceData.length === 0 ? (
                        <p className="text-center text-gray-500 dark:text-gray-400">No hay datos disponibles</p>
                    ) : (
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-semibold">Leyenda:</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-red-500 rounded-full" />
                                    <span className="text-sm">0–50%</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-yellow-500 rounded-full" />
                                    <span className="text-sm">50–80%</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-green-500 rounded-full" />
                                    <span className="text-sm">80%</span>
                                </div>
                            </div>
                            <div className="w-[500px] mx-auto">
                                <GeoJsonSvg
                                    provincia={provincia}
                                    distrito={distrito}
                                    setProvincia={setProvincia}
                                    setDistrito={setDistrito}
                                    data={avanceData}
                                />
                            </div>

                        </div>
                    )}
                </CardContent>
            </Card>
            <Card className="shadow-xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        Resumen de Avances
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                    <div className="flex flex-col gap-6">
                        <div className="w-full">
                            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
                                Porcentaje por Distrito
                            </h3>
                            <ChartContainer config={chartConfig} className="h-[300px] w-full" aria-label="Gráfico de barras de porcentaje por distrito">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={barChartData}>
                                        <XAxis
                                            dataKey="distrito"
                                            angle={-45}
                                            textAnchor="end"
                                            height={60}
                                            interval="preserveStartEnd"
                                            tick={{ fontSize: 12 }}
                                            tickFormatter={(value) => value.length > 10 ? `${value.slice(0, 10)}...` : value}
                                        />
                                        <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                                        <ChartTooltip content={<CustomTooltip />} />
                                        <Bar dataKey="percentage" fill={chartConfig.percentage.color} radius={[4, 4, 0, 0]}>
                                            {barChartData.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={entry.percentage <= 50 ? "hsl(0, 100%, 50%)" : entry.percentage <= 80 ? "hsl(60, 100%, 50%)" : "hsl(120, 100%, 50%)"}
                                                />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </div>
                        <div className="w-full flex justify-center">
                            <div className="w-[400px] sm:w-[600px]">
                                <h3 className="text-xl font-semibold mb-4 text-center text-gray-900 dark:text-gray-100">
                                    Distribución de Avances
                                </h3>
                                <ChartContainer config={chartConfig} className="h-[400px]" aria-label="Gráfico de pastel de distribución de avances">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={pieChartData}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={180}
                                                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                                labelLine={true}
                                            >
                                                {pieChartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                                ))}
                                            </Pie>
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}