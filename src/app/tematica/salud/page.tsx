"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContainerQualityCoverage from "./ContainerQualityCoverage";
import ContainerEpidemiologicalSurveillance from "./ContainerEpidemiologicalSurveillance";

export default function Page() {
  return (
    <div className="h-full w-full max-w-[75%] flex flex-col mx-auto">
      <div className="flex pt-12 gap-8 flex-col items-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Salud y Nutrición 2025
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explora datos interactivos sobre cobertura de calidad en servicios de salud y vigilancia epidemiológica en diferentes provincias y distritos.
          </p>
        </div>
        <Tabs defaultValue="cobertura_calidad" className="mb-8 w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-lg p-1">
            <TabsTrigger value="cobertura_calidad">
              Cobertura de Calidad
            </TabsTrigger>
            <TabsTrigger value="vigilancia_epidemiologica">
              Vigilancia Epidemiológica
            </TabsTrigger>
          </TabsList>
          <TabsContent value="cobertura_calidad">
            <ContainerQualityCoverage />
          </TabsContent>
          <TabsContent value="vigilancia_epidemiologica">
            <ContainerEpidemiologicalSurveillance />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}