"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Cell,
} from "recharts";
import { Users, DollarSign, TrendingUp } from "lucide-react";

// Test data for charts (in Spanish)
const ingresosData = [
  { mes: "Ene", ingresos: 4000 },
  { mes: "Feb", ingresos: 3000 },
  { mes: "Mar", ingresos: 5000 },
  { mes: "Abr", ingresos: 4500 },
  { mes: "May", ingresos: 6000 },
  { mes: "Jun", ingresos: 5500 },
];

const usuariosData = [
  { mes: "Ene", usuarios: 1200 },
  { mes: "Feb", usuarios: 1900 },
  { mes: "Mar", usuarios: 3000 },
  { mes: "Abr", usuarios: 2500 },
  { mes: "May", usuarios: 4000 },
  { mes: "Jun", usuarios: 3800 },
];

const categoriasData = [
  { nombre: "Electrónica", valor: 400 },
  { nombre: "Ropa", valor: 300 },
  { nombre: "Libros", valor: 200 },
  { nombre: "Hogar", valor: 100 },
];

const ventasData = [
  { mes: "Ene", ventas: 200 },
  { mes: "Feb", ventas: 150 },
  { mes: "Mar", ventas: 300 },
  { mes: "Abr", ventas: 250 },
  { mes: "May", ventas: 400 },
  { mes: "Jun", ventas: 350 },
];

// Chart configuration
const chartConfig = {
  ingresos: { label: "Ingresos", color: "hsl(var(--chart-1))" },
  usuarios: { label: "Usuarios", color: "hsl(var(--chart-2))" },
  ventas: { label: "Ventas", color: "hsl(var(--chart-3))" },
  electrónica: { label: "Electrónica", color: "hsl(var(--chart-1))" },
  ropa: { label: "Ropa", color: "hsl(var(--chart-2))" },
  libros: { label: "Libros", color: "hsl(var(--chart-3))" },
  hogar: { label: "Hogar", color: "hsl(var(--chart-4))" },
};

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Panel de Control</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ingresos Totales
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <p className="text-xs text-muted-foreground">
                +20.1% desde el último mes
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Usuarios Activos
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+2350</div>
              <p className="text-xs text-muted-foreground">
                +12.3% desde el último mes
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ventas</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+573</div>
              <p className="text-xs text-muted-foreground">
                +8.5% desde el último mes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bar Chart: Ingresos */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Ingresos Mensuales</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <BarChart data={ingresosData}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="ingresos" fill="var(--color-ingresos)" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Line Chart: Crecimiento de Usuarios */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Crecimiento de Usuarios</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <LineChart data={usuariosData}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="usuarios"
                    stroke="var(--color-usuarios)"
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Pie Chart: Ventas por Categoría */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Ventas por Categoría</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <PieChart>
                  <Pie
                    data={categoriasData}
                    dataKey="valor"
                    nameKey="nombre"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="var(--color-electrónica)"
                    label
                  >
                    {categoriasData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={`var(--color-${entry.nombre.toLowerCase()})`}
                      />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Area Chart: Ventas Mensuales */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Ventas Mensuales</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <AreaChart data={ventasData}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="ventas"
                    stroke="var(--color-ventas)"
                    fill="var(--color-ventas)"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
