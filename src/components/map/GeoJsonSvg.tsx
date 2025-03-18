"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";

import { IoChevronBack } from "react-icons/io5";

// Ruta del archivo GeoJSON
const GEOJSON_URL = "/data/distritos-peru.geojson";

// Interfaz para tipado del GeoJSON
interface GeoJSONFeature {
  type: string;
  properties: {
    capital: string;
    ccdd: string;
    ccdi: string;
    ccpp: string;
    cnt_ccpp: number;
    codigo: string;
    dat_pob: string;
    descripcio: string;
    fecha: number;
    geo_point_2d: { lon: number; lat: number };
    idprov: string;
    nombdep: string;
    nombdist: string;
    nombprov: string;
    poblacion: number;
    ubigeo: string;
  };
  geometry: { type: string; coordinates: number[][][] };
}

interface GeoJSONMap {
  type: "all" | string;
  distritos?: { provincia: string; distrito: string; puntuacion: number }[];
  setProvincia: (provincia: string) => void;
}

interface GeoJSONData {
  type: string;
  features: GeoJSONFeature[];
}

interface TooltipInfo {
  visible: boolean;
  x: number;
  y: number;
  distrito: string;
  provincia: string;
  puntuacion: number | string;
}

const GeoJsonSvg: React.FC<GeoJSONMap> = ({
  type,
  distritos,
  setProvincia,
}) => {
  const [geoData, setGeoData] = useState<GeoJSONData | null>(null);
  const [tooltip, setTooltip] = useState<TooltipInfo>({
    visible: false,
    x: 0,
    y: 0,
    distrito: "",
    provincia: "",
    puntuacion: "",
  });
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    fetch(GEOJSON_URL)
      .then((response) => response.json())
      .then((data: GeoJSONData) => setGeoData(data))
      .catch((error) => console.error("Error cargando GeoJSON:", error));
  }, []);

  if (!geoData) return <p>Cargando mapa...</p>;

  // Filtrar las características según el tipo de región
  let filteredFeatures = geoData.features.filter(
    (feature) =>
      feature &&
      feature.properties &&
      feature.geometry &&
      feature.geometry.coordinates &&
      feature.geometry.coordinates.length > 0 &&
      feature.geometry.coordinates[0].length > 0
  );

  if (type !== "all") {
    // Filtrar por la provincia indicada (ejemplo: "HUAMANGA")
    filteredFeatures = filteredFeatures.filter(
      (feature) => feature.properties.nombprov === type
    );
  }

  // Si no hay características después del filtrado, mostrar un mensaje
  if (filteredFeatures.length === 0) {
    return <p>No se encontraron distritos para la provincia seleccionada</p>;
  }

  // Obtener los límites de las coordenadas para escalar el SVG
  const allCoordinates = filteredFeatures.flatMap((feature) =>
    feature.geometry.coordinates.flat()
  );

  const minX = Math.min(...allCoordinates.map(([x]) => x));
  const minY = Math.min(...allCoordinates.map(([, y]) => y));
  const maxX = Math.max(...allCoordinates.map(([x]) => x));
  const maxY = Math.max(...allCoordinates.map(([, y]) => y));

  // Escalado para ajustar al SVG
  const scale = 1000 / Math.max(maxX - minX, maxY - minY);

  // Función para calcular el color basado en la puntuación
  const getColor = (puntuacion: number) => {
    const maxBrightness = 80; // Brillo máximo
    const minBrightness = 30; // Brillo mínimo

    if (puntuacion < 1000) {
      const maxPuntuacion = 1000; // Puntuación máxima para normalizar
      const brightness =
        maxBrightness - (puntuacion / maxPuntuacion) * minBrightness;
      return `hsl(100, 100%, ${brightness}%)`; // Color verde para puntuaciones bajas
    } else if (puntuacion >= 1000 && puntuacion < 2000) {
      const maxPuntuacion = 2000; // Puntuación máxima para normalizar
      const brightness =
        maxBrightness - ((puntuacion - 1000) / maxPuntuacion) * minBrightness;
      return `hsl(50, 100%, ${brightness}%)`; // Color amarillo para puntuaciones medias
    } else {
      const maxPuntuacion = 3000; // Puntuación máxima para normalizar
      const brightness =
        maxBrightness - ((puntuacion - 2000) / maxPuntuacion) * minBrightness;
      return `hsl(0, 100%, ${brightness}%)`; // Color rojo para puntuaciones altas
    }
  };

  // Función para manejar el evento de hover en un distrito
  const handleMouseOver = (
    e: React.MouseEvent<SVGPathElement>,
    feature: GeoJSONFeature
  ) => {
    const distrito = feature.properties.nombdist;
    const provincia = feature.properties.nombprov;
    const distritoInfo = distritos?.find((d) => d.distrito === distrito);
    const puntuacion = distritoInfo?.puntuacion || "No disponible";

    // Calcular la posición del tooltip relativa al SVG
    if (svgRef.current) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const mouseX = e.clientX - svgRect.left;
      const mouseY = e.clientY - svgRect.top;

      setTooltip({
        visible: true,
        x: mouseX,
        y: mouseY,
        distrito,
        provincia,
        puntuacion,
      });
    }
  };

  // Función para ocultar el tooltip
  const handleMouseOut = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  return (
    <div className="flex flex-col w-full h-full items-center justify-center gap-4">
      <div className="flex flex-row w-full justify-center gap-6">
        {type !== "all" && (
          <Button
            className="bg-red-500 hover:bg-red-400 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
            onClick={() => setProvincia("all")}
          >
            <IoChevronBack className="text-lg" />
            <span className="ml-2">Volver</span>
          </Button>
        )}

        <h1 className="text-sm lg:text-xl font-bold mb-4">
          {type === "all" ? "MAPA DE AYACUCHO" : "MAPA DE " + type}
        </h1>
      </div>

      <div className="w-full h-full">
        <svg
          ref={svgRef}
          viewBox="0 0 1000 1000" // El tamaño original del mapa
          preserveAspectRatio="xMidYMid meet" // Escalar para mantener la proporción
          className="w-full h-full"
        >
          {filteredFeatures.map((feature, index) => {
            // Validar que el feature tenga coordenadas válidas
            if (
              !feature.geometry ||
              !feature.geometry.coordinates ||
              feature.geometry.coordinates.length === 0
            ) {
              return null;
            }

            const coordinates = feature.geometry.coordinates[0]; // Tomamos solo el primer polígono

            if (!coordinates || coordinates.length === 0) {
              return null;
            }

            const pathData = `M${coordinates
              .map(
                ([x, y]) =>
                  `${((x - minX) * scale).toFixed(2)},${(
                    (maxY - y) *
                    scale
                  ).toFixed(2)}`
              )
              .join(" L")} Z`;

            // Encontrar la puntuación del distrito actual
            const distrito = distritos?.find(
              (d) => d.distrito === feature.properties.nombdist
            );
            const fillColor = distrito ? getColor(distrito.puntuacion) : "#ddd"; // Color por defecto si no se encuentra el distrito

            return (
              <path
                key={index}
                d={pathData}
                fill={fillColor}
                stroke="black"
                strokeWidth="2"
                className="cursor-pointer transition-all duration-200 hover:fill-blue-300 hover:opacity-80"
                onClick={() => {
                  if (type === "all") {
                    setProvincia(feature.properties.nombprov);
                  }
                }}
                onMouseOver={(e) => handleMouseOver(e, feature)}
                onMouseOut={handleMouseOut}
                onMouseMove={(e) => {
                  if (svgRef.current) {
                    const svgRect = svgRef.current.getBoundingClientRect();
                    const mouseX = e.clientX - svgRect.left;
                    const mouseY = e.clientY - svgRect.top;
                    setTooltip((prev) => ({ ...prev, x: mouseX, y: mouseY }));
                  }
                }}
              />
            );
          })}
        </svg>

        {/* Tooltip */}
        {tooltip.visible && (
          <div
            className="absolute pointer-events-none bg-white p-2 rounded-md shadow-lg border border-gray-300 z-10 text-sm"
            style={{
              left: `${tooltip.x + 10}px`,
              top: `${tooltip.y + 10}px`,
              maxWidth: "200px",
            }}
          >
            <p className="font-bold text-red-500">{tooltip.distrito}</p>
            <p>Provincia: {tooltip.provincia}</p>
            <p>Cantidad: {tooltip.puntuacion}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeoJsonSvg;
