"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QualityCoverage from "./quality-coverage";
import ContainerHealthNutrition from "./container-Health-and-nutrition";
import { ConfirmDialog } from "@/components/ui/dialog-confirm";
import EpidemiologicalSurveillance from "./Epidemiological-surveillance";

export default function Page() {
  const [coberturaCalidadExcel, setCoberturaCalidadExcel] = useState<{
    [key: string]: File | null;
  }>({
    paquetes_nino: null,
    paquetes_adolescente: null,
    paquetes_gestante: null,
    paquetes_adulto_mayor: null,
  });
  const [vigilanciaEpidemiologicaExcel, setVigilanciaEpidemiologicaExcel] =
    useState<{
      [key: string]: File | null;
    }>({
      poblacion_curso_vida: null,
      anemia: null,
      desnutricion: null,
      dengue: null,
    });
  const [uploading, ] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState<{
    isOpen: boolean;
    category: "cobertura_calidad" | "vigilancia_epidemiologica" | null;
    subCategory: string | null;
  }>({ isOpen: false, category: null, subCategory: null });
  const [uploadedFiles, ] = useState<
    {
      id: number;
      fileName: string;
      category: "cobertura_calidad" | "vigilancia_epidemiologica";
      subCategory: string;
      uploadedAt: string;
    }[]
  >([]);

  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal({
      isOpen: false,
      category: null,
      subCategory: null,
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Salud y Nutrición
        </h1>
        <p className="text-lg text-muted-foreground">
          Administra los datos relacionados con cobertura de calidad y
          vigilancia epidemiológica
        </p>
      </div>
      <Tabs defaultValue="cobertura_calidad" className="mb-8">
        <TabsList className="grid w-full grid-cols-2 max-w-3xl mx-auto bg-gray-100 rounded-lg p-1">
          <TabsTrigger value="cobertura_calidad">
            Cobertura de Calidad
          </TabsTrigger>
          <TabsTrigger value="vigilancia_epidemiologica">
            Vigilancia Epidemiológica
          </TabsTrigger>
        </TabsList>
        <TabsContent value="cobertura_calidad">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-blue-900">
                Subir Datos de Cobertura de Calidad
              </CardTitle>
              <p className="text-sm text-blue-700">
                Carga archivos Excel con información sobre la cobertura de
                calidad en servicios de salud.
              </p>
            </CardHeader>
            <CardContent className="pt-6">
              <QualityCoverage
                coberturaCalidadExcel={coberturaCalidadExcel}
                setCoberturaCalidadExcel={setCoberturaCalidadExcel}
                uploading={uploading}
                setShowConfirmationModal={setShowConfirmationModal}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="vigilancia_epidemiologica">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-red-900">
                Subir Datos de Vigilancia Epidemiológica
              </CardTitle>
              <p className="text-sm text-red-700">
                Carga archivos Excel con información sobre vigilancia
                epidemiológica en centros de salud.
              </p>
            </CardHeader>
            <CardContent className="pt-6">
              <EpidemiologicalSurveillance
                vigilanciaEpidemiologicaExcel={vigilanciaEpidemiologicaExcel}
                setVigilanciaEpidemiologicaExcel={
                  setVigilanciaEpidemiologicaExcel
                }
                uploading={uploading}
                setShowConfirmationModal={setShowConfirmationModal}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <ContainerHealthNutrition uploadedFiles={uploadedFiles} />
      <ConfirmDialog
        isOpen={showConfirmationModal.isOpen}
        onClose={handleCloseConfirmationModal}
        onConfirm={() => {}}
        title="¿Estás seguro de guardar este archivo?"
        description="Los datos que intentas guardar reemplazarán los registros existentes para el mismo año en la base de datos."
        styleButton="bg-blue-600 hover:bg-blue-700 text-white"
      />
    </div>
  );
}
