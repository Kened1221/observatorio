"use client";
import GeoJsonSvg from "@/components/map/GeoJsonSvg";
import { useState, useMemo } from "react";
import { MdPeopleAlt } from "react-icons/md";
import { FaChild, FaChildDress } from "react-icons/fa6";
import Button from "@/components/animation/button-animation2";

export default function Page() {
  const [provincia, setProvincia] = useState<string>("");
  const [distrito, setDistrito] = useState<string>("");
  const [pAselect, setPAselect] = useState<string>("Población"); // Estado para el select de ámbito
  const [rangoEdad, setRangoEdad] = useState<string>("0 a 1 año"); // Estado para el select de edad

  // Usar useMemo para evitar recrear el array en cada renderizado
  const all = useMemo(
    () => [
      // Provincia: Cangallo
      {
        departamento: "Ayacucho",
        provincia: "CANGALLO",
        distrito: "CANGALLO",
        puntuacion: 5400,
      }, // Estimado Censo 2017: ~5,200
      {
        departamento: "Ayacucho",
        provincia: "CANGALLO",
        distrito: "CHUSCHI",
        puntuacion: 3200,
      }, // Estimado Censo 2017: ~3,100
      {
        departamento: "Ayacucho",
        provincia: "CANGALLO",
        distrito: "LOS MOROCHUCOS",
        puntuacion: 4100,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "CANGALLO",
        distrito: "MARIA PARADO DE BELLIDO",
        puntuacion: 2800,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "CANGALLO",
        distrito: "PARAS",
        puntuacion: 3500,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "CANGALLO",
        distrito: "TOTOS",
        puntuacion: 4900,
      }, // Estimado

      // Provincia: Huamanga
      {
        departamento: "Ayacucho",
        provincia: "HUAMANGA",
        distrito: "ACOCRO",
        puntuacion: 2600,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "HUAMANGA",
        distrito: "ACOS VINCHOS",
        puntuacion: 2300,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "HUAMANGA",
        distrito: "ANDRES AVELINO CACERES DORREGARAY",
        puntuacion: 18000,
      }, // Parte urbana, estimado
      {
        departamento: "Ayacucho",
        provincia: "HUAMANGA",
        distrito: "AYACUCHO",
        puntuacion: 105000,
      }, // Censo 2017: ~100,000, ajustado a 2025
      {
        departamento: "Ayacucho",
        provincia: "HUAMANGA",
        distrito: "CARMEN ALTO",
        puntuacion: 22000,
      }, // Parte urbana, estimado
      {
        departamento: "Ayacucho",
        provincia: "HUAMANGA",
        distrito: "CHIARA",
        puntuacion: 1500,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "HUAMANGA",
        distrito: "JESUS NAZARENO",
        puntuacion: 25000,
      }, // Parte urbana, estimado
      {
        departamento: "Ayacucho",
        provincia: "HUAMANGA",
        distrito: "OCROS",
        puntuacion: 4700,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "HUAMANGA",
        distrito: "PACAYCASA",
        puntuacion: 3200,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "HUAMANGA",
        distrito: "QUINUA",
        puntuacion: 3800,
      }, // Censo 2017: ~3,600
      {
        departamento: "Ayacucho",
        provincia: "HUAMANGA",
        distrito: "SAN JOSE DE TICLLAS",
        puntuacion: 2900,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "HUAMANGA",
        distrito: "SAN JUAN BAUTISTA",
        puntuacion: 30000,
      }, // Parte urbana, estimado
      {
        departamento: "Ayacucho",
        provincia: "HUAMANGA",
        distrito: "SANTIAGO DE PISCHA",
        puntuacion: 4800,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "HUAMANGA",
        distrito: "SOCOS",
        puntuacion: 5100,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "HUAMANGA",
        distrito: "TAMBILLO",
        puntuacion: 4200,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "HUAMANGA",
        distrito: "VINCHOS",
        puntuacion: 3400,
      }, // Estimado

      // Provincia: Huanca Sancos
      {
        departamento: "Ayacucho",
        provincia: "HUANCA SANCOS",
        distrito: "CARAPO",
        puntuacion: 900,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "HUANCA SANCOS",
        distrito: "SACSAMARCA",
        puntuacion: 5200,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "HUANCA SANCOS",
        distrito: "SANCOS",
        puntuacion: 3100,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "HUANCA SANCOS",
        distrito: "SANTIAGO DE LUCANAMARCA",
        puntuacion: 3600,
      }, // Estimado

      // Provincia: Huanta
      {
        departamento: "Ayacucho",
        provincia: "HUANTA",
        distrito: "AYAHUANCO",
        puntuacion: 1700,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "HUANTA",
        distrito: "CANAYRE",
        puntuacion: 2800,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "HUANTA",
        distrito: "CHACA",
        puntuacion: 3700,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "HUANTA",
        distrito: "HUAMANGUILLA",
        puntuacion: 2200,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "HUANTA",
        distrito: "HUANTA",
        puntuacion: 49000,
      }, // Censo 2017: ~47,000, ajustado
      {
        departamento: "Ayacucho",
        provincia: "HUANTA",
        distrito: "IGUAIN",
        puntuacion: 2700,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "HUANTA",
        distrito: "LLOCHEGUA",
        puntuacion: 1300,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "HUANTA",
        distrito: "LURICOCHA",
        puntuacion: 2900,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "HUANTA",
        distrito: "PUCACOLPA",
        puntuacion: 1400,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "HUANTA",
        distrito: "SANTILLANA",
        puntuacion: 4500,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "HUANTA",
        distrito: "SIVIA",
        puntuacion: 5200,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "HUANTA",
        distrito: "UCHURACCAY",
        puntuacion: 4600,
      }, // Estimado

      // Provincia: La Mar
      {
        departamento: "Ayacucho",
        provincia: "LA MAR",
        distrito: "ANCHIHUAY",
        puntuacion: 3100,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "LA MAR",
        distrito: "ANCO",
        puntuacion: 5300,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "LA MAR",
        distrito: "AYNA",
        puntuacion: 1900,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "LA MAR",
        distrito: "CHILCAS",
        puntuacion: 1300,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "LA MAR",
        distrito: "CHUNGUI",
        puntuacion: 2900,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "LA MAR",
        distrito: "LUIS CARRANZA",
        puntuacion: 3800,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "LA MAR",
        distrito: "ORONCCOY",
        puntuacion: 4800,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "LA MAR",
        distrito: "SAMUGARI",
        puntuacion: 3700,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "LA MAR",
        distrito: "SAN MIGUEL",
        puntuacion: 5500,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "LA MAR",
        distrito: "SANTA ROSA",
        puntuacion: 2400,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "LA MAR",
        distrito: "TAMBO",
        puntuacion: 600,
      }, // Estimado

      // Provincia: Lucanas
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "AUCARA",
        puntuacion: 4900,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "CABANA",
        puntuacion: 4200,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "CARMEN SALCEDO",
        puntuacion: 1800,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "CHAVIÑA",
        puntuacion: 4500,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "CHIPAO",
        puntuacion: 1500,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "HUAC-HUAS",
        puntuacion: 4600,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "LARAMATE",
        puntuacion: 4700,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "LEONCIO PRADO",
        puntuacion: 2000,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "LLAUTA",
        puntuacion: 5400,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "LUCANAS",
        puntuacion: 4800,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "OCAÑA",
        puntuacion: 1900,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "OTOCA",
        puntuacion: 2700,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "PUQUIO",
        puntuacion: 13000,
      }, // Censo 2017: ~12,500
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "SAISA",
        puntuacion: 200,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "SANCOS",
        puntuacion: 5300,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "SAN CRISTOBAL",
        puntuacion: 5000,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "SAN JUAN",
        puntuacion: 2200,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "SAN PEDRO",
        puntuacion: 4200,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "SAN PEDRO DE PALCO",
        puntuacion: 1800,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "SANTA ANA DE HUAYCAHUACHO",
        puntuacion: 3700,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "LUCANAS",
        distrito: "SANTA LUCIA",
        puntuacion: 4600,
      }, // Estimado

      // Provincia: Parinacochas
      {
        departamento: "Ayacucho",
        provincia: "PARINACOCHAS",
        distrito: "CHUMPI",
        puntuacion: 2300,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "PARINACOCHAS",
        distrito: "CORACORA",
        puntuacion: 7000,
      }, // Censo 2017: ~6,800
      {
        departamento: "Ayacucho",
        provincia: "PARINACOCHAS",
        distrito: "CORONEL CASTAÑEDA",
        puntuacion: 1200,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "PARINACOCHAS",
        distrito: "PACAPAUSA",
        puntuacion: 2500,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "PARINACOCHAS",
        distrito: "PULLO",
        puntuacion: 4500,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "PARINACOCHAS",
        distrito: "PUYUSCA",
        puntuacion: 2000,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "PARINACOCHAS",
        distrito: "SAN FRANCISCO DE RAVACAYCO",
        puntuacion: 4900,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "PARINACOCHAS",
        distrito: "UPAHUACHO",
        puntuacion: 4600,
      }, // Estimado

      // Provincia: Paucar del Sara Sara
      {
        departamento: "Ayacucho",
        provincia: "PAUCAR DEL SARA SARA",
        distrito: "COLTA",
        puntuacion: 5300,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "PAUCAR DEL SARA SARA",
        distrito: "CORCULLA",
        puntuacion: 3500,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "PAUCAR DEL SARA SARA",
        distrito: "LAMPA",
        puntuacion: 2700,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "PAUCAR DEL SARA SARA",
        distrito: "MARCABAMBA",
        puntuacion: 5000,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "PAUCAR DEL SARA SARA",
        distrito: "OYOLO",
        puntuacion: 2900,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "PAUCAR DEL SARA SARA",
        distrito: "PARARCA",
        puntuacion: 4000,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "PAUCAR DEL SARA SARA",
        distrito: "PAUSA",
        puntuacion: 5500,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "PAUCAR DEL SARA SARA",
        distrito: "SAN JAVIER DE ALPABAMBA",
        puntuacion: 2100,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "PAUCAR DEL SARA SARA",
        distrito: "SAN JOSE DE USHUA",
        puntuacion: 1300,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "PAUCAR DEL SARA SARA",
        distrito: "SARA SARA",
        puntuacion: 3000,
      }, // Estimado

      // Provincia: Sucre
      {
        departamento: "Ayacucho",
        provincia: "SUCRE",
        distrito: "BELEN",
        puntuacion: 2300,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "SUCRE",
        distrito: "CHALCOS",
        puntuacion: 4900,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "SUCRE",
        distrito: "CHILCAYOC",
        puntuacion: 3900,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "SUCRE",
        distrito: "HUACAÑA",
        puntuacion: 4400,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "SUCRE",
        distrito: "MORCOLLA",
        puntuacion: 3800,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "SUCRE",
        distrito: "PAICO",
        puntuacion: 3500,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "SUCRE",
        distrito: "QUEROBAMBA",
        puntuacion: 4500,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "SUCRE",
        distrito: "SAN PEDRO DE LARCAY",
        puntuacion: 1900,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "SUCRE",
        distrito: "SAN SALVADOR DE QUIJE",
        puntuacion: 4200,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "SUCRE",
        distrito: "SANTIAGO DE PAUCARAY",
        puntuacion: 4800,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "SUCRE",
        distrito: "SORAS",
        puntuacion: 4700,
      }, // Estimado

      // Provincia: Victor Fajardo
      {
        departamento: "Ayacucho",
        provincia: "VICTOR FAJARDO",
        distrito: "ALCAMENCA",
        puntuacion: 4000,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "VICTOR FAJARDO",
        distrito: "APONGO",
        puntuacion: 1900,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "VICTOR FAJARDO",
        distrito: "ASQUIPATA",
        puntuacion: 5400,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "VICTOR FAJARDO",
        distrito: "CANARIA",
        puntuacion: 3900,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "VICTOR FAJARDO",
        distrito: "CAYARA",
        puntuacion: 2000,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "VICTOR FAJARDO",
        distrito: "COLCA",
        puntuacion: 3800,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "VICTOR FAJARDO",
        distrito: "HUAMANQUIQUIA",
        puntuacion: 5100,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "VICTOR FAJARDO",
        distrito: "HUANCAPI",
        puntuacion: 4100,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "VICTOR FAJARDO",
        distrito: "HUANCARAYLLA",
        puntuacion: 2800,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "VICTOR FAJARDO",
        distrito: "HUAYA",
        puntuacion: 2300,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "VICTOR FAJARDO",
        distrito: "SARHUA",
        puntuacion: 5100,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "VICTOR FAJARDO",
        distrito: "VILCANCHOS",
        puntuacion: 2000,
      }, // Estimado

      // Provincia: Vilcas Huaman
      {
        departamento: "Ayacucho",
        provincia: "VILCAS HUAMAN",
        distrito: "ACCOMARCA",
        puntuacion: 4300,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "VILCAS HUAMAN",
        distrito: "CARHUANCA",
        puntuacion: 2200,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "VILCAS HUAMAN",
        distrito: "CONCEPCION",
        puntuacion: 1500,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "VILCAS HUAMAN",
        distrito: "HUAMBALPA",
        puntuacion: 2300,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "VILCAS HUAMAN",
        distrito: "INDEPENDENCIA",
        puntuacion: 3600,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "VILCAS HUAMAN",
        distrito: "SAURAMA",
        puntuacion: 5100,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "VILCAS HUAMAN",
        distrito: "VILCAS HUAMAN",
        puntuacion: 2900,
      }, // Estimado
      {
        departamento: "Ayacucho",
        provincia: "VILCAS HUAMAN",
        distrito: "VISCHONGO",
        puntuacion: 3800,
      }, // Estimado
    ],
    []
  );

  // Opciones para el select de rango de edad
  const rangosEdad = [
    "0 a 1 año",
    "2 a 5 años",
    "6 a 11 años",
    "12 a 17 años",
    "18 a 24 años",
    "25 a 39 años",
    "40 a 59 años",
    "60 años o más",
  ];

  return (
    <div className="flex flex-col w-full h-full mx-auto overflow-hidden max-w-[95rem] gap-8 p-6 sm:py-10">
      <h2 className="mb-8 sm:mb-10 text-center text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
        Población en Ayacucho
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
        {pAselect === "Población" ? (
          <div className="flex flex-col items-center space-y-8">
            {/* Population Group */}
            <div className="flex flex-col items-center">
              <Button setPAselect={setPAselect} />

              <MdPeopleAlt className="text-9xl" />
              <p className="text-7xl font-bold">616176</p>
            </div>

            {/* Select Rango de Edad */}
            <div className="w-full max-w-md">
              <select
                value={rangoEdad}
                onChange={(e) => setRangoEdad(e.target.value)}
                className="w-full bg-[#0c5e7f] text-white py-3 px-6 rounded-md text-xl font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0c5e7f]"
              >
                {rangosEdad.map((rango) => (
                  <option key={rango} value={rango}>
                    {rango}
                  </option>
                ))}
              </select>
            </div>

            {/* Gender Statistics */}
            <div className="flex justify-center gap-20 w-full">
              {/* Male */}
              <div className="flex flex-col items-center">
                <p className="text-xl font-bold">Niños</p>
                <FaChild className="text-9xl text-blue-500" />
                <p className="text-6xl font-bold">676</p>
              </div>

              {/* Female */}
              <div className="flex flex-col items-center">
                <p className="text-xl font-bold">Niñas</p>
                <FaChildDress className="text-9xl text-fuchsia-500" />
                <p className="text-6xl font-bold">676</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-8">
            {/* Population Group */}
            <div className="flex flex-col items-center">
              <Button setPAselect={setPAselect} />

              <MdPeopleAlt className="text-9xl" />
              <p className="text-7xl font-bold">616176</p>
            </div>

            {/* Select Rango de Edad */}
            <div className="w-full max-w-md">
              <select
                value={rangoEdad}
                onChange={(e) => setRangoEdad(e.target.value)}
                className="w-full bg-[#0c5e7f] text-white py-3 px-6 rounded-md text-xl font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0c5e7f]"
              >
                {rangosEdad.map((rango) => (
                  <option key={rango} value={rango}>
                    {rango}
                  </option>
                ))}
              </select>
            </div>

            {/* Gender Statistics */}
            <div className="flex justify-center gap-20 w-full">
              {/* Male */}
              <div className="flex flex-col items-center">
                <p className="text-xl font-bold">Rural</p>
                <FaChild className="text-9xl text-amber-800" />
                <p className="text-6xl font-bold">676</p>
              </div>

              {/* Female */}
              <div className="flex flex-col items-center">
                <p className="text-xl font-bold">Urbano</p>
                <FaChild className="text-9xl text-red-200" />
                <p className="text-6xl font-bold">676</p>
              </div>
            </div>
          </div>
        )}
        {/* Right Column - Statistics */}
      </div>
    </div>
  );
}
