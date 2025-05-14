"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ConfirmDialog } from "@/components/ui/dialog-confirm";
import PovertyVulnerability from "./PovertyVulnerability";
import SocialPrograms from "./SocialPrograms";
import ContainerSocialProtection from "./ContainerSocialProtection";

export default function Page() {
  const [pobrezaVulnerabilidadExcel, setPobrezaVulnerabilidadExcel] = useState<{
    [key: string]: File | null;
  }>({
    pobreza: null,
    adultos_mayores_riesgo: null,
    adultos_mayores_asociaciones: null,
    femenino: null,
    oredis: null,
    nino_nina: null,
    victimas: null,
    pueblos_indigenas: null,
    organizaciones_juveniles: null,
    consejos_juveniles: null,
  });
  const [programasSocialesExcel, setProgramasSocialesExcel] = useState<{
    [key: string]: File | null;
  }>({
    возможность: null,
    juntos: null,
    pension_65: null,
    wasi_mikuna: null,
    confodes: null,
  });
  const [uploading, setUploading] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState<{
    isOpen: boolean;
    category: "pobreza_vulnerabilidad" | "programas_sociales" | null;
    subCategory: string | null;
  }>({ isOpen: false, category: null, subCategory: null });
  const [uploadedFiles, setUploadedFiles] = useState<
    {
      id: number;
      fileName: string;
      category: "pobreza_vulnerabilidad" | "programas_sociales";
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
          Protección Social
        </h1>
        <p className="text-lg text-muted-foreground">
          Administra los datos relacionados con pobreza, vulnerabilidad y
          programas sociales
        </p>
      </div>
      <Tabs defaultValue="pobreza_vulnerabilidad" className="mb-8">
        <TabsList className="grid w-full grid-cols-2 max-w-3xl mx-auto bg-gray-100 rounded-lg p-1">
          <TabsTrigger value="pobreza_vulnerabilidad">
            Pobreza y Vulnerabilidad
          </TabsTrigger>
          <TabsTrigger value="programas_sociales">
            Programas Sociales
          </TabsTrigger>
        </TabsList>
        <TabsContent value="pobreza_vulnerabilidad">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-blue-900">
                Subir Datos de Pobreza y Vulnerabilidad
              </CardTitle>
              <p className="text-sm text-blue-700">
                Carga archivos Excel con información sobre niveles de pobreza y
                poblaciones vulnerables.
              </p>
            </CardHeader>
            <CardContent className="pt-6">
              <PovertyVulnerability
                pobrezaVulnerabilidadExcel={pobrezaVulnerabilidadExcel}
                setPobrezaVulnerabilidadExcel={setPobrezaVulnerabilidadExcel}
                uploading={uploading}
                setShowConfirmationModal={setShowConfirmationModal}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="programas_sociales">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-red-900">
                Subir Datos de Programas Sociales
              </CardTitle>
              <p className="text-sm text-red-700">
                Carga archivos Excel con información sobre programas sociales
                implementados.
              </p>
            </CardHeader>
            <CardContent className="pt-6">
              <SocialPrograms
                programasSocialesExcel={programasSocialesExcel}
                setProgramasSocialesExcel={setProgramasSocialesExcel}
                uploading={uploading}
                setShowConfirmationModal={setShowConfirmationModal}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <ContainerSocialProtection uploadedFiles={uploadedFiles} />
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
