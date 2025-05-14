"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GeoJsonSvg from "@/components/map/GeoJsonSvg";

export default function ContainerSocialPrograms() {
  const [program, setProgram] = useState<
    "cunamas" | "juntos" | "pension_65" | "wasi_mikuna" | "confodes"
  >("cunamas");
  const [provincia, setProvincia] = useState<string>("");
  const [distrito, setDistrito] = useState<string>("");

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-red-900">
          Programas Sociales
        </CardTitle>
        <p className="text-sm text-red-700">
          Explora datos sobre la cobertura y beneficiarios de programas sociales
          por provincia y distrito.
        </p>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs
          value={program}
          onValueChange={(value) =>
            setProgram(
              value as
                | "cunamas"
                | "juntos"
                | "pension_65"
                | "wasi_mikuna"
                | "confodes"
            )
          }
          className="mb-6"
        >
          <TabsList className="grid w-full grid-cols-5 gap-2 bg-gray-100 rounded-lg p-1">
            <TabsTrigger value="cunamas">Cunamás</TabsTrigger>
            <TabsTrigger value="juntos">Juntos</TabsTrigger>
            <TabsTrigger value="pension_65">Pensión 65</TabsTrigger>
            <TabsTrigger value="wasi_mikuna">Wasi Mikuna</TabsTrigger>
            <TabsTrigger value="confodes">Confodes</TabsTrigger>
          </TabsList>
          <TabsContent value="cunamas">
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
                    Gráfico: Cobertura de Cunamás
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="juntos">
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
                    Gráfico: Cobertura de Juntos
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="pension_65">
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
                    Gráfico: Cobertura de Pensión 65
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="wasi_mikuna">
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
                    Gráfico: Cobertura de Wasi Mikuna
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="confodes">
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
                    Gráfico: Cobertura de Confodes
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
