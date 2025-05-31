// GeoJsonSvg.tsx
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

interface MapData {
  ubicacionId: number;
  provincia: string;
  distrito: string;
  porcentaje: number;
}

interface GeoJsonSvgProps {
  provincia: string;
  distrito: string;
  setProvincia: (provincia: string) => void;
  setDistrito: (distrito: string) => void;
  data: MapData[];
}

interface TooltipInfo {
  visible: boolean;
  x: number;
  y: number;
  distrito: string;
  provincia: string;
  porcentaje: number;
}

const GeoJsonSvg: React.FC<GeoJsonSvgProps> = ({
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
    porcentaje: 0,
  });

  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    fetch(GEOJSON_URL)
      .then((response) => response.json())
      .then((data: GeoJSONData) => {
        console.log("GeoJSON Data Loaded:", data); // Debug: Log the GeoJSON data
        setGeoData(data);
      })
      .catch((error) => console.error("Error cargando GeoJSON:", error));
  }, []);

  if (!geoData) return <p className="text-center text-gray-500">Cargando mapa...</p>;

  // Start with all features with valid geometry
  let filteredFeatures = geoData.features.filter(
    (feature) =>
      feature?.properties &&
      feature?.geometry?.coordinates?.length > 0 &&
      Array.isArray(feature.geometry.coordinates[0]) &&
      feature.geometry.coordinates[0].length > 0
  );

  console.log("Initial features count:", filteredFeatures.length); // Debug: Log initial feature count

  // Get unique departments, provinces, and districts for debugging
  const uniqueDepartamentos = [...new Set(geoData.features.map(f => f.properties.nombdep?.trim().toUpperCase()))].filter(Boolean);
  const uniqueProvincias = [...new Set(geoData.features.map(f => f.properties.nombprov?.trim().toUpperCase()))].filter(Boolean);
  const uniqueDistritos = [...new Set(geoData.features.map(f => f.properties.nombdist?.trim().toUpperCase()))].filter(Boolean);
  console.log("Unique Departamentos:", uniqueDepartamentos);
  console.log("Unique Provincias:", uniqueProvincias);
  console.log("Unique Distritos:", uniqueDistritos);

  // Apply department filter (case-insensitive and trimmed)
  filteredFeatures = filteredFeatures.filter(
    (feature) =>
      feature.properties.nombdep?.trim().toUpperCase() === "AYACUCHO".toUpperCase()
  );
  console.log("Features after AYACUCHO filter count:", filteredFeatures.length); // Debug: Log after AYACUCHO filter

  // Further filter by provincia if provided
  if (provincia) {
    filteredFeatures = filteredFeatures.filter(
      (feature) => feature.properties.nombprov?.trim().toUpperCase() === provincia.toUpperCase()
    );
    console.log(`Features after provincia (${provincia}) filter count:`, filteredFeatures.length); // Debug: Log after provincia filter

    // Further filter by distrito if provided
    if (distrito) {
      filteredFeatures = filteredFeatures.filter(
        (feature) => feature.properties.nombdist?.trim().toUpperCase() === distrito.toUpperCase()
      );
      console.log(`Features after distrito (${distrito}) filter count:`, filteredFeatures.length); // Debug: Log after distrito filter
    }
  }

  if (filteredFeatures.length === 0) {
    console.log("No features found after filtering. Provincia:", provincia, "Distrito:", distrito);
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

  const getColor = (porcentaje: number) => {
    if (porcentaje <= 50) return "hsl(0, 100%, 50%)"; // Rojo
    if (porcentaje <= 80) return "hsl(60, 100%, 50%)"; // Amarillo
    return "hsl(120, 100%, 50%)"; // Verde
  };

  const handleMouseOver = (
    e: React.MouseEvent<SVGPathElement>,
    feature: GeoJSONFeature
  ) => {
    const distNombre = feature.properties.nombdist || "Desconocido";
    const provNombre = feature.properties.nombprov || "Desconocida";
    const distritoInfo = data.find(
      (d) =>
        d.distrito.toUpperCase() === distNombre.toUpperCase() &&
        d.provincia.toUpperCase() === provNombre.toUpperCase()
    );

    const porcentaje = distritoInfo ? distritoInfo.porcentaje : 0;

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
        porcentaje,
      });
    }
  };

  const handleMouseOut = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  const handleMapClick = (feature: GeoJSONFeature) => {
    if (!provincia) {
      setProvincia(feature.properties.nombprov || "");
    } else if (!distrito) {
      setDistrito(feature.properties.nombdist || "");
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
                d.distrito.toUpperCase() === feature.properties.nombdist?.toUpperCase() &&
                d.provincia.toUpperCase() === feature.properties.nombprov?.toUpperCase()
            );
            const porcentaje = distritoActual ? distritoActual.porcentaje : 0;
            const fillColor = getColor(porcentaje);

            const isSelected =
              distrito
                ? feature.properties.nombdist?.toUpperCase() === distrito.toUpperCase() &&
                feature.properties.nombprov?.toUpperCase() === provincia.toUpperCase()
                : feature.properties.nombprov?.toUpperCase() === provincia.toUpperCase();

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
            <p>Porcentaje: {tooltip.porcentaje.toFixed(1)}%</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeoJsonSvg;