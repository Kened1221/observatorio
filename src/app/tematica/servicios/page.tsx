"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContainerAccesoAguaClorada from "./container-AccesoAguaClorada";
import ContainerRiesgoSanitario from "./container-RiesgoSanitario";

export default function Page() {
  return (
    <div className="h-full w-full max-w-[75%] flex flex-col mx-auto">
      <div className="flex pt-12 gap-8 flex-col items-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Servicio de Agua para Consumo Humano 2025
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explora datos interactivos sobre el acceso al agua clorada y los
            riesgos sanitarios en diferentes provincias y distritos.
          </p>
        </div>
        <Tabs defaultValue="acceso_agua_clorada" className="mb-8 w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-lg p-1">
            <TabsTrigger value="acceso_agua_clorada">
              Acceso a Agua Clorada
            </TabsTrigger>
            <TabsTrigger value="riesgo_sanitario">Riesgo Sanitario</TabsTrigger>
          </TabsList>
          <TabsContent value="acceso_agua_clorada">
            <ContainerAccesoAguaClorada />
          </TabsContent>
          <TabsContent value="riesgo_sanitario">
            <ContainerRiesgoSanitario />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
