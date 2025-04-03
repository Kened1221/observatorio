/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";
import ContainerGestantes from "./gestantes/page";
import ContainerAdolescentes from "./adolescentes/page";
import ContainerJovenes from "./jovenes/page";
import ContainerAdultos from "./adultos/page";
import ContainerAdultosMayores from "./adultos-mayores/page";
import GeoJsonSvg from "@/components/map/GeoJsonSvg";
import ContainerNino from "./ninos/page";

const categorias = [
  { nombre: "Gestantes", color: "#ec4899", component: ContainerGestantes },
  { nombre: "Ninos", color: "#f59e0b", component: ContainerNino },
  {
    nombre: "Adolescentes",
    color: "#8b5cf6",
    component: ContainerAdolescentes,
  },
  { nombre: "Jovenes", color: "#06b6d4", component: ContainerJovenes },
  { nombre: "Adultos", color: "#10b981", component: ContainerAdultos },
  {
    nombre: "Adultos-Mayores",
    color: "#ef4444",
    component: ContainerAdultosMayores,
  },
];

export default function Page() {
  const [provincia, setProvincia] = useState<string>("");
  const [distrito, setDistrito] = useState<string>("");
  const [categoria, setCategoria] = useState(categorias[0].nombre);

  // Comprehensive data for all regions
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
        distrito: "PUTIS",
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
        distrito: "UNION PROGRESO",
        puntuacion: 295,
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
        distrito: "PATIBAMBA",
        puntuacion: 4121,
      },
      {
        departamento: "Ayacucho",
        provincia: "LA MAR",
        distrito: "NINABAMBA",
        puntuacion: 142,
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
        distrito: "CORONEL CASTAÑEDA",
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
        distrito: "HUACAÑA",
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

  // Handler function to manage chart bar clicks
  const handleBarClick = (data: any) => {
    if (provincia === "" && data.nombre) {
      setProvincia(data.nombre);
    } else if (distrito === "" && data.nombre) {
      setDistrito(data.nombre);
    }
  };

  const categoriaActual = categorias.find((c) => c.nombre === categoria);

  // Prepare chart data for the current selection
// Prepare chart data for the current selection
const getChartData = () => {
  if (distrito !== "") {
    const districtData = all.find(
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
    const districtsInProvince = all.filter(
      (item) => item.provincia === provincia
    );
    return districtsInProvince.map((item) => ({
      nombre: item.distrito,
      puntuacion: item.puntuacion,
      fill: getColorForValue(item.puntuacion),
      cursor: "pointer",
    }));
  }

  // Definir el tipo de provinceData explícitamente
  const provinceData: { [key: string]: { total: number; count: number } } = {};
  all.forEach((item) => {
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

  // Helper function to determine fill color based on value
  const getColorForValue = (value: any) => {
    if (value < 1000) return "#57D385"; // Green
    if (value < 2000) return "#F2CE5E"; // Yellow
    return "#F26565"; // Red
  };

  // Create the chart config
  const chartConfig = {
    xAxisType: "number",
    yAxisType: "category",
    yAxisWidth: 150,
  };

  // ComponenteActual should always be a valid component
  const ComponenteActual =
    categoriaActual?.component || (() => <div>Selecciona una categoría</div>);

  return (
    <div className="w-full h-full flex flex-col lg:flex-row pt-16 max-w-[80%] mx-auto gap-8 p-4">
      {/* Menú lateral */}
      <div className="flex flex-col h-full w-full lg:w-1/5 gap-4">
        {categorias.map((item) => (
          <div
            key={item.nombre}
            className={`rounded-xl p-2 text-center cursor-pointer transition ${
              categoria === item.nombre
                ? "text-white shadow-lg"
                : "bg-gray-200 text-gray-700"
            }`}
            style={{
              backgroundColor:
                categoria === item.nombre ? item.color : undefined,
            }}
            onClick={() => setCategoria(item.nombre)}
          >
            {item.nombre}
          </div>
        ))}
      </div>

      <div className="h-full w-full flex flex-col sm:flex-row gap-2">
        <div className="w-full">
          <GeoJsonSvg
            provincia={provincia}
            distrito={distrito}
            setProvincia={setProvincia}
            setDistrito={setDistrito}
            data={all}
          />
        </div>
        <div
          className="h-full flex-1 p-6 rounded-xl shadow-lg text-white"
          style={{ backgroundColor: categoriaActual?.color || "#cccccc" }}
        >
          <ComponenteActual
            provincia={provincia}
            distrito={distrito}
            handleBarClick={handleBarClick}
            chartData={getChartData()}
            chartConfig={chartConfig}
          />
        </div>
      </div>
    </div>
  );
}
