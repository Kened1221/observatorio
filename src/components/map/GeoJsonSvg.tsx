"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/button";

// Ruta del archivo GeoJSON
const GEOJSON_URL = "/data/distritos-peru@bogota-laburbano.geojson";

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
  distritos?: { nombre: string; puntuacion: number }[];
  setProvincias: (provincia: string) => void;
}

interface GeoJSONData {
  type: string;
  features: GeoJSONFeature[];
}

const GeoJsonSvg: React.FC<GeoJSONMap> = ({
  type,
  distritos,
  setProvincias,
}) => {
  const [geoData, setGeoData] = useState<GeoJSONData | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);

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
      return `hsl(50, 100%, ${brightness}%)`; // Color naranja para puntuaciones medias
    } else {
      const maxPuntuacion = 3000; // Puntuación máxima para normalizar
      const brightness =
        maxBrightness - ((puntuacion - 2000) / maxPuntuacion) * minBrightness;
      return `hsl(0, 100%, ${brightness}%)`; // Color rojo para puntuaciones altas
    }
  };

  return (
    <div className="flex flex-col w-full h-full items-center justify-center">
      <div className="flex flex-row w-full justify-center gap-6">
        {type !== "all" && (
          <Button
            className="bg-red-500 hover:bg-red-400"
            onClick={() => setProvincias("all")}
          >
            Atras
          </Button>
        )}

        <h1 className="text-xl font-bold mb-4">
          Mapa de {type === "all" ? "Ayacucho" : type}
        </h1>
      </div>

      <div className="w-[700px] h-[500px] border-border border-2">
        <svg
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
              (d) => d.nombre === feature.properties.nombdist
            );
            const fillColor = distrito ? getColor(distrito.puntuacion) : "#ddd"; // Color por defecto si no se encuentra el distrito

            return (
              <path
                key={index}
                d={pathData}
                fill={fillColor}
                stroke="black"
                strokeWidth="2"
                className="cursor-grabbing transition-all duration-200 hover:fill-blue-500"
                onClick={() => {
                  setSelectedRegion(index);
                  setProvincias(filteredFeatures[index].properties.nombprov);
                }}
              />
            );
          })}
        </svg>
      </div>

      {/* Mostrar el nombre del distrito solo cuando se haga clic */}
      {type !== "all" &&
        selectedRegion !== null &&
        filteredFeatures[selectedRegion] && (
          <p className="text-lg text-blue-700">
            Distrito seleccionado:{" "}
            {filteredFeatures[selectedRegion].properties.nombdist} <br />
            Provincia: {
              filteredFeatures[selectedRegion].properties.nombprov
            }{" "}
            <br />
            Puntuación:{" "}
            {distritos?.find(
              (distrito) =>
                distrito.nombre ===
                filteredFeatures[selectedRegion].properties.nombdist
            )?.puntuacion || "No disponible"}
          </p>
        )}
    </div>
  );
};

export default GeoJsonSvg;
