"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GeoJsonSvg from "@/components/map/GeoJsonSvg";

export default function ContainerRiesgoSanitario() {
  const [riesgo, setRiesgo] = useState<"metales_pesados" | "sistemas_agua">(
    "sistemas_agua"
  );
  const [provincia, setProvincia] = useState<string>("");
  const [distrito, setDistrito] = useState<string>("");

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-red-900">
          Riesgo Sanitario
        </CardTitle>
        <p className="text-sm text-red-700">
          Explora datos sobre metales pesados o sistemas de agua en centros
          poblados por provincia y distrito.
        </p>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs
          value={riesgo}
          onValueChange={(value) =>
            setRiesgo(value as "metales_pesados" | "sistemas_agua")
          }
          className="mb-6"
        >
          <TabsList className="grid w-full grid-cols-2 max-w-md bg-gray-100 rounded-lg p-1">
            <TabsTrigger value="metales_pesados">Metales Pesados</TabsTrigger>
            <TabsTrigger value="sistemas_agua">Sistemas de Agua</TabsTrigger>
          </TabsList>
          <TabsContent value="metales_pesados">
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
                    Gráfico: Distribución de Metales Pesados
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="sistemas_agua">
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
                    Gráfico: Cobertura de Sistemas de Agua
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
