"use client";

import { useState, useEffect, useRef } from "react";
import LogoutButton from "../animation/button-animation";

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
  provincia: string;
  distrito: string;
  setProvincia: (provincia: string) => void;
  setDistrito: (distrito: string) => void;
  data?: {
    departamento: string;
    provincia: string;
    distrito: string;
    puntuacion: number;
  }[];
  big?: boolean;
  singleColor?: string; // Color base para la escala monocromática
}

interface GeoJSONData {
  type: string;
  features: GeoJSONFeature[];
}

interface TooltipInfo {
  visible: boolean;
  x: number;
  y: number;
  departamento: string;
  distrito: string;
  provincia: string;
  puntuacion: number;
}

const GeoJsonSvg: React.FC<GeoJSONMap> = ({
  provincia,
  distrito,
  setProvincia,
  setDistrito,
  data,
  big = false,
  singleColor,
}) => {
  const [geoData, setGeoData] = useState<GeoJSONData | null>(null);
  const [tooltip, setTooltip] = useState<TooltipInfo>({
    visible: false,
    x: 0,
    y: 0,
    departamento: "",
    distrito: "",
    provincia: "",
    puntuacion: 0,
  });

  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    fetch(GEOJSON_URL)
      .then((response) => response.json())
      .then((data: GeoJSONData) => setGeoData(data))
      .catch((error) => console.error("Error cargando GeoJSON:", error));
  }, []);

  if (!geoData) return <p>Cargando mapa...</p>;

  // Filtrar las características según el nivel de navegación
  let filteredFeatures = geoData.features.filter(
    (feature) =>
      feature &&
      feature.properties &&
      feature.geometry &&
      feature.geometry.coordinates &&
      feature.geometry.coordinates.length > 0 &&
      feature.geometry.coordinates[0].length > 0 &&
      feature.properties.nombdep === "AYACUCHO"
  );

  if (provincia !== "") {
    filteredFeatures = filteredFeatures.filter(
      (feature) => feature.properties.nombprov === provincia
    );

    if (distrito !== "") {
      filteredFeatures = filteredFeatures.filter(
        (feature) => feature.properties.nombdist === distrito
      );
    }
  }

  if (filteredFeatures.length === 0) {
    return <p>No se encontraron datos para la selección actual</p>;
  }

  // Obtener los límites de las coordenadas para escalar el SVG
  const allCoordinates = filteredFeatures.flatMap((feature) =>
    feature.geometry.coordinates.flat()
  );

  const minX = Math.min(...allCoordinates.map(([x]) => x));
  const minY = Math.min(...allCoordinates.map(([, y]) => y));
  const maxX = Math.max(...allCoordinates.map(([x]) => x));
  const maxY = Math.max(...allCoordinates.map(([, y]) => y));
  const width = maxX - minX;
  const height = maxY - minY;
  const scale = 1000 / Math.max(width, height);
  const viewBoxWidth = width * scale;
  const viewBoxHeight = height * scale;

  // Función para calcular el color basado en la puntuación
  const getColor = (puntuacion: number) => {
    const maxBrightness = 90; // Brillo máximo
    const minBrightness = 30; // Brillo mínimo

    if (singleColor) {
      // Escala monocromática basada en singleColor
      const baseHue = getHueFromColor(singleColor); // Obtener el tono base
      const maxPuntuacion = big ? 150000 : 3000; // Máxima puntuación según big
      const brightness =
        maxBrightness -
        (puntuacion / maxPuntuacion) * (maxBrightness - minBrightness);
      return `hsl(${baseHue}, 100%, ${brightness}%)`;
    } else {
      // Lógica original con colores múltiples
      if (big) {
        if (puntuacion < 5000) {
          const maxPuntuacion = 5000;
          const brightness =
            maxBrightness - (puntuacion / maxPuntuacion) * minBrightness;
          return `hsl(100, 100%, ${brightness}%)`; // Verde
        } else if (puntuacion >= 5000 && puntuacion < 20000) {
          const maxPuntuacion = 20000;
          const brightness =
            maxBrightness - (puntuacion / maxPuntuacion) * minBrightness;
          return `hsl(50, 100%, ${brightness}%)`; // Amarillo
        } else {
          const maxPuntuacion = 150000;
          const brightness =
            maxBrightness - (puntuacion / maxPuntuacion) * minBrightness;
          return `hsl(0, 100%, ${brightness}%)`; // Rojo
        }
      } else {
        if (puntuacion < 1000) {
          const maxPuntuacion = 1000;
          const brightness =
            maxBrightness - (puntuacion / maxPuntuacion) * minBrightness;
          return `hsl(100, 100%, ${brightness}%)`; // Verde
        } else if (puntuacion >= 1000 && puntuacion < 2000) {
          const maxPuntuacion = 2000;
          const brightness =
            maxBrightness -
            ((puntuacion - 1000) / maxPuntuacion) * minBrightness;
          return `hsl(50, 100%, ${brightness}%)`; // Amarillo
        } else {
          const maxPuntuacion = 3000;
          const brightness =
            maxBrightness -
            ((puntuacion - 2000) / maxPuntuacion) * minBrightness;
          return `hsl(0, 100%, ${brightness}%)`; // Rojo
        }
      }
    }
  };

  // Función auxiliar para obtener el tono (hue) de un color CSS
  const getHueFromColor = (color: string): number => {
    if (color === "red") return 0; // Rojo
    if (color === "green") return 120; // Verde
    if (color === "blue") return 240; // Azul
    if (color.startsWith("#")) {
      // Convertir hex a RGB y luego a HSL para obtener el hue
      const hex = color.replace("#", "");
      const r = parseInt(hex.slice(0, 2), 16) / 255;
      const g = parseInt(hex.slice(2, 4), 16) / 255;
      const b = parseInt(hex.slice(4, 6), 16) / 255;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0;
      if (max === min) return 0; // Gris, sin tono definido
      if (max === r) h = (60 * (g - b)) / (max - min);
      else if (max === g) h = (60 * (2 + (b - r))) / (max - min);
      else if (max === b) h = (60 * (4 + (r - g))) / (max - min);
      return h < 0 ? h + 360 : h;
    }
    return 0; // Default a rojo si no se reconoce el color
  };

  const handleMouseOver = (
    e: React.MouseEvent<SVGPathElement>,
    feature: GeoJSONFeature
  ) => {
    const depNombre = feature.properties.nombdep;
    const distNombre = feature.properties.nombdist;
    const provNombre = feature.properties.nombprov;
    const distritoInfo = data?.find(
      (d) => d.distrito === distNombre && d.provincia === provNombre
    );
    const puntuacion = distritoInfo?.puntuacion || 0; // Valor por defecto 0

    if (svgRef.current) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const mouseX = e.clientX - svgRect.left;
      const mouseY = e.clientY - svgRect.top;

      setTooltip({
        visible: true,
        x: mouseX,
        y: mouseY,
        departamento: depNombre,
        distrito: distNombre,
        provincia: provNombre,
        puntuacion,
      });
    }
  };

  const handleMouseOut = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  const handleMapClick = (feature: GeoJSONFeature) => {
    if (provincia === "") {
      setProvincia(feature.properties.nombprov);
    } else if (distrito === "") {
      setDistrito(feature.properties.nombdist);
    }
  };

  const handleVolver = () => {
    if (distrito !== "") {
      setDistrito("");
    } else if (provincia !== "") {
      setProvincia("");
    }
  };

  const getTitulo = () => {
    if (provincia === "") {
      return "MAPA DE AYACUCHO";
    } else if (distrito === "") {
      return `PROVINCIA DE ${provincia}`;
    } else {
      return `DISTRITO DE ${distrito}`;
    }
  };

  return (
    <div className="flex flex-col w-full h-full items-center justify-center gap-4">
      <div className="flex flex-row w-full items-center justify-center gap-6">
        {(provincia !== "" || distrito !== "") && (
          <LogoutButton onClick={handleVolver} />
        )}
        <h1 className="text-sm lg:text-xl font-bold text-gray-700 dark:text-gray-200">
          {getTitulo()}
        </h1>
      </div>

      <div className="w-full h-full relative">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full"
        >
          {filteredFeatures.map((feature, index) => {
            if (
              !feature.geometry ||
              !feature.geometry.coordinates ||
              feature.geometry.coordinates.length === 0
            ) {
              return null;
            }

            const coordinates = feature.geometry.coordinates[0];
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

            const distritoActual = data?.find(
              (d) =>
                d.distrito === feature.properties.nombdist &&
                d.provincia === feature.properties.nombprov
            );
            const fillColor = distritoActual
              ? getColor(distritoActual.puntuacion)
              : "#ddd";

            const isSelected =
              distrito !== ""
                ? feature.properties.nombdist === distrito &&
                feature.properties.nombprov === provincia
                : feature.properties.nombprov === provincia;

            const strokeWidth = isSelected ? "3" : "1";
            const strokeColor = isSelected ? "black" : "#333";

            return (
              <path
                key={index}
                d={pathData}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                className="cursor-pointer transition-all duration-200 hover:fill-blue-300 hover:opacity-80"
                onClick={() => handleMapClick(feature)}
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
