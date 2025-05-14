"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContainerPovertyVulnerability from "./ContainerPovertyVulnerability";
import ContainerSocialPrograms from "./ContainerSocialPrograms";

export default function Page() {
  return (
    <div className="h-full w-full max-w-[75%] flex flex-col mx-auto">
      <div className="flex pt-12 gap-8 flex-col items-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Protección Social 2025
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explora datos interactivos sobre pobreza, poblaciones vulnerables y programas sociales en diferentes provincias y distritos.
          </p>
        </div>
        <Tabs defaultValue="pobreza_vulnerabilidad" className="mb-8 w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-lg p-1">
            <TabsTrigger value="pobreza_vulnerabilidad">
              Pobreza y Vulnerabilidad
            </TabsTrigger>
            <TabsTrigger value="programas_sociales">
              Programas Sociales
            </TabsTrigger>
          </TabsList>
          <TabsContent value="pobreza_vulnerabilidad">
            <ContainerPovertyVulnerability />
          </TabsContent>
          <TabsContent value="programas_sociales">
            <ContainerSocialPrograms />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}