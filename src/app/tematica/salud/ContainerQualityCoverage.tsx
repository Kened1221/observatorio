"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GeoJsonSvg from "@/components/map/GeoJsonSvg";

export default function ContainerQualityCoverage() {
  const [category, setCategory] = useState<
    "paquetes_nino" | "paquetes_adolescente" | "paquetes_gestante" | "paquetes_adulto_mayor"
  >("paquetes_nino");
  const [provincia, setProvincia] = useState<string>("");
  const [distrito, setDistrito] = useState<string>("");

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-blue-900">
          Cobertura de Calidad
        </CardTitle>
        <p className="text-sm text-blue-700">
          Explora datos sobre la cobertura de calidad en servicios de salud por provincia y distrito.
        </p>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs
          value={category}
          onValueChange={(value) =>
            setCategory(
              value as
                | "paquetes_nino"
                | "paquetes_adolescente"
                | "paquetes_gestante"
                | "paquetes_adulto_mayor"
            )
          }
          className="mb-6"
        >
          <TabsList className="grid w-full grid-cols-4 gap-2 bg-gray-100 rounded-lg p-1">
            <TabsTrigger value="paquetes_nino">Paquetes Niño</TabsTrigger>
            <TabsTrigger value="paquetes_adolescente">Paquetes Adolescente</TabsTrigger>
            <TabsTrigger value="paquetes_gestante">Paquetes Gestante</TabsTrigger>
            <TabsTrigger value="paquetes_adulto_mayor">Paquetes Adulto Mayor</TabsTrigger>
          </TabsList>
          <TabsContent value="paquetes_nino">
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
                    Gráfico: Cobertura de Paquetes Niño
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="paquetes_adolescente">
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
                    Gráfico: Cobertura de Paquetes Adolescente
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="paquetes_gestante">
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
                    Gráfico: Cobertura de Paquetes Gestante
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="paquetes_adulto_mayor">
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
                    Gráfico: Cobertura de Paquetes Adulto Mayor
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