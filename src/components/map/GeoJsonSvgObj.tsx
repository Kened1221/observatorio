"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const GEOJSON_URL = "/data/distritos-peru.geojson";

interface GeoJSONFeature {
  type: string;
  properties: {
    nombdep: string;
    nombprov: string;
    nombdist: string;
  };
  geometry: { type: string; coordinates: number[][][] };
}

interface GeoJSONData {
  type: string;
  features: GeoJSONFeature[];
}

interface GeoJSONMap {
  provincia: string;
  distrito: string;
  setProvincia: (provincia: string) => void;
  setDistrito: (distrito: string) => void;
  data: {
    provincia: string;
    distrito: string;
    percentage: number;
  }[];
}

interface TooltipInfo {
  visible: boolean;
  x: number;
  y: number;
  distrito: string;
  provincia: string;
  percentage: number;
}

const GeoJsonSvg: React.FC<GeoJSONMap> = ({
  provincia,
  distrito,
  setProvincia,
  setDistrito,
  data,
}) => {
  const [geoData, setGeoData] = useState<GeoJSONData | null>(null);
  const [tooltip, setTooltip] = useState<TooltipInfo>({
    visible: false,
    x: 0,
    y: 0,
    distrito: "",
    provincia: "",
    percentage: 0,
  });

  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    fetch(GEOJSON_URL)
      .then((response) => response.json())
      .then((data: GeoJSONData) => setGeoData(data))
      .catch((error) => console.error("Error cargando GeoJSON:", error));
  }, []);

  if (!geoData) return <p className="text-center text-gray-500">Cargando mapa...</p>;

  let filteredFeatures = geoData.features.filter(
    (feature) =>
      feature?.properties &&
      feature?.geometry?.coordinates?.length > 0 &&
      feature.properties.nombdep === "AYACUCHO"
  );

  if (provincia) {
    filteredFeatures = filteredFeatures.filter(
      (feature) => feature.properties.nombprov === provincia
    );
    if (distrito) {
      filteredFeatures = filteredFeatures.filter(
        (feature) => feature.properties.nombdist === distrito
      );
    }
  }

  if (filteredFeatures.length === 0) {
    return <p className="text-center text-gray-500">No se encontraron datos para la selección</p>;
  }

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

  const getColor = (percentage: number) => {
    if (percentage <= 50) return "hsl(0, 100%, 50%)"; // Rojo
    if (percentage <= 80) return "hsl(60, 100%, 50%)"; // Amarillo
    return "hsl(120, 100%, 50%)"; // Verde
  };

  const handleMouseOver = (
    e: React.MouseEvent<SVGPathElement>,
    feature: GeoJSONFeature
  ) => {
    const distNombre = feature.properties.nombdist;
    const provNombre = feature.properties.nombprov;
    const distritoInfo = data.find(
      (d) => d.distrito === distNombre && d.provincia === provNombre
    );

    const percentage = distritoInfo ? distritoInfo.percentage : 0;

    if (svgRef.current) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const mouseX = e.clientX - svgRect.left;
      const mouseY = e.clientY - svgRect.top;

      setTooltip({
        visible: true,
        x: mouseX,
        y: mouseY,
        distrito: distNombre,
        provincia: provNombre,
        percentage,
      });
    }
  };

  const handleMouseOut = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  const handleMapClick = (feature: GeoJSONFeature) => {
    if (!provincia) {
      setProvincia(feature.properties.nombprov);
    } else if (!distrito) {
      setDistrito(feature.properties.nombdist);
    }
  };

  const handleVolver = () => {
    if (distrito) {
      setDistrito("");
    } else if (provincia) {
      setProvincia("");
    }
  };

  const getTitulo = () => {
    if (!provincia) return "MAPA DE AYACUCHO";
    if (!distrito) return `PROVINCIA DE ${provincia}`;
    return `DISTRITO DE ${distrito}`;
  };

  return (
    <div className="flex flex-col w-full h-full items-center gap-4">
      <div className="flex items-center justify-center gap-4 w-full">
        {(provincia || distrito) && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleVolver}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
        )}
        <h1 className="text-lg font-bold text-gray-700 dark:text-gray-200">
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
            if (!feature.geometry?.coordinates?.length) return null;

            const coordinates = feature.geometry.coordinates[0];
            if (!coordinates?.length) return null;

            const pathData = `M${coordinates
              .map(([x, y]) => `${((x - minX) * scale).toFixed(2)},${((maxY - y) * scale).toFixed(2)}`)
              .join(" L")} Z`;

            const distritoActual = data.find(
              (d) =>
                d.distrito === feature.properties.nombdist &&
                d.provincia === feature.properties.nombprov
            );
            const percentage = distritoActual ? distritoActual.percentage : 0;
            const fillColor = getColor(percentage);

            const isSelected =
              distrito
                ? feature.properties.nombdist === distrito && feature.properties.nombprov === provincia
                : feature.properties.nombprov === provincia;

            return (
              <path
                key={index}
                d={pathData}
                fill={fillColor}
                stroke={isSelected ? "black" : "#333"}
                strokeWidth={isSelected ? "3" : "1"}
                className="cursor-pointer transition-all duration-200 hover:opacity-80"
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
            className="absolute pointer-events-none bg-white p-3 rounded-md shadow-lg border border-gray-200 z-10 text-sm"
            style={{ left: `${tooltip.x + 10}px`, top: `${tooltip.y + 10}px`, maxWidth: "250px" }}
          >
            <p className="font-bold text-red-500">{tooltip.distrito}</p>
            <p>Provincia: {tooltip.provincia}</p>
            <p>Porcentaje: {tooltip.percentage.toFixed(1)}%</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeoJsonSvg;