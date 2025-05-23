"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import DragDropExcelInput from "@/components/ui/drag-drop-excel-input";
import { ConfirmDialog } from "@/components/ui/dialog-confirm";
import ContainerBasicServices from "./container-BasicServices";

export default function Page() {
  const [accesoAguaExcel, setAccesoAguaExcel] = useState<File | null>(null);
  const [metalesPesadosExcel, setMetalesPesadosExcel] = useState<File | null>(
    null
  );
  const [sistemasAguaExcel, setSistemasAguaExcel] = useState<File | null>(null);
  const [uploading, ] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState<{
    isOpen: boolean;
    category:
      | "acceso_agua_clorada"
      | "riesgo_metales_pesados"
      | "riesgo_sistemas_agua"
      | null;
  }>({ isOpen: false, category: null });
  const [uploadedFiles, ] = useState<
    {
      id: number;
      fileName: string;
      category:
        | "acceso_agua_clorada"
        | "riesgo_metales_pesados"
        | "riesgo_sistemas_agua";
      uploadedAt: string;
    }[]
  >([]);

  const handleCancel = (
    category:
      | "acceso_agua_clorada"
      | "riesgo_metales_pesados"
      | "riesgo_sistemas_agua"
  ) => {
    if (category === "acceso_agua_clorada") {
      setAccesoAguaExcel(null);
    } else if (category === "riesgo_metales_pesados") {
      setMetalesPesadosExcel(null);
    } else {
      setSistemasAguaExcel(null);
    }
  };

  const handleOpenConfirmationModal = (
    category:
      | "acceso_agua_clorada"
      | "riesgo_metales_pesados"
      | "riesgo_sistemas_agua"
  ) => {
    if (
      (category === "acceso_agua_clorada" && accesoAguaExcel) ||
      (category === "riesgo_metales_pesados" && metalesPesadosExcel) ||
      (category === "riesgo_sistemas_agua" && sistemasAguaExcel)
    ) {
      setShowConfirmationModal({ isOpen: true, category });
    }
  };

  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal({ isOpen: false, category: null });
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Servicios Básicos - Agua para Consumo Humano
        </h1>
        <p className="text-lg text-muted-foreground">
          Administra los datos relacionados con el acceso al agua y riesgos
          sanitarios
        </p>
      </div>
      <Tabs defaultValue="acceso_agua_clorada" className="mb-8">
        <TabsList className="grid w-full grid-cols-3 max-w-3xl mx-auto bg-gray-100 rounded-lg p-1">
          <TabsTrigger value="acceso_agua_clorada">
            Acceso a Agua Clorada
          </TabsTrigger>
          <TabsTrigger value="riesgo_metales_pesados">
            Metales Pesados
          </TabsTrigger>
          <TabsTrigger value="riesgo_sistemas_agua">
            Sistemas de Agua
          </TabsTrigger>
        </TabsList>
        <TabsContent value="acceso_agua_clorada">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-blue-900">
                Subir Datos de Acceso a Agua Clorada
              </CardTitle>
              <p className="text-sm text-blue-700">
                Carga un archivo Excel con información sobre sistemas de agua
                (bueno, regular, colapsado) y monitoreo de cloro residual.
              </p>
            </CardHeader>
            <CardContent className="pt-6">
              <DragDropExcelInput
                file={accesoAguaExcel}
                setFile={setAccesoAguaExcel}
                onFileSelect={(file) => setAccesoAguaExcel(file)}
                placeholderText="Arrastra y suelta un archivo Excel (.xlsx, .xls) con datos de acceso a agua clorada"
              />
              <div className="mt-6 flex gap-4">
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() =>
                    handleOpenConfirmationModal("acceso_agua_clorada")
                  }
                  disabled={!accesoAguaExcel || uploading}
                >
                  {uploading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  {uploading ? "Subiendo..." : "Guardar"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-blue-300 text-blue-600 hover:bg-blue-50"
                  onClick={() => handleCancel("acceso_agua_clorada")}
                  disabled={!accesoAguaExcel || uploading}
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="riesgo_metales_pesados">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-red-900">
                Subir Datos de Metales Pesados
              </CardTitle>
              <p className="text-sm text-red-700">
                Carga un archivo Excel con información sobre centros poblados de
                distritos con metales pesados, incluyendo tipo de metal.
              </p>
            </CardHeader>
            <CardContent className="pt-6">
              <DragDropExcelInput
                file={metalesPesadosExcel}
                setFile={setMetalesPesadosExcel}
                onFileSelect={(file) => setMetalesPesadosExcel(file)}
                placeholderText="Arrastra y suelta un archivo Excel (.xlsx, .xls) con datos de metales pesados"
              />
              <div className="mt-6 flex gap-4">
                <Button
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  onClick={() =>
                    handleOpenConfirmationModal("riesgo_metales_pesados")
                  }
                  disabled={!metalesPesadosExcel || uploading}
                >
                  {uploading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  {uploading ? "Subiendo..." : "Guardar"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-red-300 text-red-600 hover:bg-red-50"
                  onClick={() => handleCancel("riesgo_metales_pesados")}
                  disabled={!metalesPesadosExcel || uploading}
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="riesgo_sistemas_agua">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-amber-900">
                Subir Datos de Sistemas de Agua
              </CardTitle>
              <p className="text-sm text-amber-700">
                Carga un archivo Excel con información sobre centros poblados
                por distritos con y sin sistemas de agua.
              </p>
            </CardHeader>
            <CardContent className="pt-6">
              <DragDropExcelInput
                file={sistemasAguaExcel}
                setFile={setSistemasAguaExcel}
                onFileSelect={(file) => setSistemasAguaExcel(file)}
                placeholderText="Arrastra y suelta un archivo Excel (.xlsx, .xls) con datos de sistemas de agua"
              />
              <div className="mt-6 flex gap-4">
                <Button
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                  onClick={() =>
                    handleOpenConfirmationModal("riesgo_sistemas_agua")
                  }
                  disabled={!sistemasAguaExcel || uploading}
                >
                  {uploading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  {uploading ? "Subiendo..." : "Guardar"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-amber-300 text-amber-600 hover:bg-amber-50"
                  onClick={() => handleCancel("riesgo_sistemas_agua")}
                  disabled={!sistemasAguaExcel || uploading}
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <ContainerBasicServices uploadedFiles={uploadedFiles} />
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
