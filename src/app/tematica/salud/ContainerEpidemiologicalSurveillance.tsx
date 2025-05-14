"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GeoJsonSvg from "@/components/map/GeoJsonSvg";

export default function ContainerEpidemiologicalSurveillance() {
  const [category, setCategory] = useState<
    "poblacion_curso_vida" | "anemia" | "desnutricion" | "dengue"
  >("poblacion_curso_vida");
  const [provincia, setProvincia] = useState<string>("");
  const [distrito, setDistrito] = useState<string>("");

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-red-900">
          Vigilancia Epidemiológica
        </CardTitle>
        <p className="text-sm text-red-700">
          Explora datos sobre población por curso de vida, anemia, desnutrición y dengue por provincia y distrito.
        </p>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs
          value={category}
          onValueChange={(value) =>
            setCategory(
              value as
                | "poblacion_curso_vida"
                | "anemia"
                | "desnutricion"
                | "dengue"
            )
          }
          className="mb-6"
        >
          <TabsList className="grid w-full grid-cols-4 gap-2 bg-gray-100 rounded-lg p-1">
            <TabsTrigger value="poblacion_curso_vida">Población por Curso de Vida</TabsTrigger>
            <TabsTrigger value="anemia">Anemia</TabsTrigger>
            <TabsTrigger value="desnutricion">Desnutrición</TabsTrigger>
            <TabsTrigger value="dengue">Dengue</TabsTrigger>
          </TabsList>
          <TabsContent value="poblacion_curso_vida">
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
                    Gráfico: Población por Curso de Vida
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="anemia">
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
                    Gráfico: Prevalencia de Anemia
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="desnutricion">
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
                    Gráfico: Prevalencia de Desnutrición
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="dengue">
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
                    Gráfico: Incidencia de Dengue
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