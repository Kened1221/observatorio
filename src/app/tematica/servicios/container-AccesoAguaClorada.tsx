"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GeoJsonSvg from "@/components/map/GeoJsonSvg";

export default function ContainerAccesoAguaClorada() {
  const [provincia, setProvincia] = useState<string>("");
  const [distrito, setDistrito] = useState<string>("");

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-blue-900">
          Acceso a Agua Clorada
        </CardTitle>
        <p className="text-sm text-blue-700">
          Visualiza el estado de los sistemas de agua (bueno, regular,
          colapsado) y el monitoreo de cloro residual por provincia y distrito.
        </p>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-1/3">
            <GeoJsonSvg
              provincia={provincia}
              distrito={distrito}
              setProvincia={setProvincia}
              setDistrito={setDistrito}
              data={[]}
            />
          </div>
          <div className="w-full lg:w-2/3">
            <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-500 text-sm">
                Gráfico: Estado de Sistemas de Agua
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
