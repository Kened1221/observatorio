"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import DragDropExcelInput from "@/components/ui/drag-drop-excel-input";

interface QualityCoverageProps {
  coberturaCalidadExcel: { [key: string]: File | null };
  setCoberturaCalidadExcel: React.Dispatch<
    React.SetStateAction<{ [key: string]: File | null }>
  >;
  uploading: boolean;
  setShowConfirmationModal: React.Dispatch<
    React.SetStateAction<{
      isOpen: boolean;
      category: "cobertura_calidad" | "vigilancia_epidemiologica" | null;
      subCategory: string | null;
    }>
  >;
}

export default function QualityCoverage({
  coberturaCalidadExcel,
  setCoberturaCalidadExcel,
  uploading,
  setShowConfirmationModal,
}: QualityCoverageProps) {
  const handleCancel = (subCategory: string) => {
    setCoberturaCalidadExcel((prev) => ({
      ...prev,
      [subCategory]: null,
    }));
  };

  const handleOpenConfirmationModal = (subCategory: string) => {
    if (coberturaCalidadExcel[subCategory]) {
      setShowConfirmationModal({
        isOpen: true,
        category: "cobertura_calidad",
        subCategory,
      });
    }
  };

  return (
    <Tabs defaultValue="paquetes_nino">
      <TabsList className="grid w-full grid-cols-4 gap-2 mb-6">
        <TabsTrigger value="paquetes_nino">Paquetes Niño</TabsTrigger>
        <TabsTrigger value="paquetes_adolescente">
          Paquetes Adolescente
        </TabsTrigger>
        <TabsTrigger value="paquetes_gestante">Paquetes Gestante</TabsTrigger>
        <TabsTrigger value="paquetes_adulto_mayor">
          Paquetes Adulto Mayor
        </TabsTrigger>
      </TabsList>
      <TabsContent value="paquetes_nino">
        <DragDropExcelInput
          file={coberturaCalidadExcel.paquetes_nino}
          setFile={(file) =>
            setCoberturaCalidadExcel((prev) => ({
              ...prev,
              paquetes_nino: file,
            }))
          }
          onFileSelect={(file) =>
            setCoberturaCalidadExcel((prev) => ({
              ...prev,
              paquetes_nino: file,
            }))
          }
          placeholderText="Arrastra y suelta un archivo Excel (.xlsx, .xls) con datos de paquetes de atención integral del niño"
        />
        <div className="mt-6 flex gap-4">
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => handleOpenConfirmationModal("paquetes_nino")}
            disabled={!coberturaCalidadExcel.paquetes_nino || uploading}
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {uploading ? "Subiendo..." : "Guardar"}
          </Button>
          <Button
            variant="outline"
            className="w-full border-blue-300 text-blue-600 hover:bg-blue-50"
            onClick={() => handleCancel("paquetes_nino")}
            disabled={!coberturaCalidadExcel.paquetes_nino || uploading}
          >
            Cancelar
          </Button>
        </div>
      </TabsContent>
      <TabsContent value="paquetes_adolescente">
        <DragDropExcelInput
          file={coberturaCalidadExcel.paquetes_adolescente}
          setFile={(file) =>
            setCoberturaCalidadExcel((prev) => ({
              ...prev,
              paquetes_adolescente: file,
            }))
          }
          onFileSelect={(file) =>
            setCoberturaCalidadExcel((prev) => ({
              ...prev,
              paquetes_adolescente: file,
            }))
          }
          placeholderText="Arrastra y suelta un archivo Excel (.xlsx, .xls) con datos de paquetes de atención integral del adolescente"
        />
        <div className="mt-6 flex gap-4">
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => handleOpenConfirmationModal("paquetes_adolescente")}
            disabled={!coberturaCalidadExcel.paquetes_adolescente || uploading}
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {uploading ? "Subiendo..." : "Guardar"}
          </Button>
          <Button
            variant="outline"
            className="w-full border-blue-300 text-blue-600 hover:bg-blue-50"
            onClick={() => handleCancel("paquetes_adolescente")}
            disabled={!coberturaCalidadExcel.paquetes_adolescente || uploading}
          >
            Cancelar
          </Button>
        </div>
      </TabsContent>
      <TabsContent value="paquetes_gestante">
        <DragDropExcelInput
          file={coberturaCalidadExcel.paquetes_gestante}
          setFile={(file) =>
            setCoberturaCalidadExcel((prev) => ({
              ...prev,
              paquetes_gestante: file,
            }))
          }
          onFileSelect={(file) =>
            setCoberturaCalidadExcel((prev) => ({
              ...prev,
              paquetes_gestante: file,
            }))
          }
          placeholderText="Arrastra y suelta un archivo Excel (.xlsx, .xls) con datos de paquetes de atención integral de la gestante"
        />
        <div className="mt-6 flex gap-4">
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => handleOpenConfirmationModal("paquetes_gestante")}
            disabled={!coberturaCalidadExcel.paquetes_gestante || uploading}
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {uploading ? "Subiendo..." : "Guardar"}
          </Button>
          <Button
            variant="outline"
            className="w-full border-blue-300 text-blue-600 hover:bg-blue-50"
            onClick={() => handleCancel("paquetes_gestante")}
            disabled={!coberturaCalidadExcel.paquetes_gestante || uploading}
          >
            Cancelar
          </Button>
        </div>
      </TabsContent>
      <TabsContent value="paquetes_adulto_mayor">
        <DragDropExcelInput
          file={coberturaCalidadExcel.paquetes_adulto_mayor}
          setFile={(file) =>
            setCoberturaCalidadExcel((prev) => ({
              ...prev,
              paquetes_adulto_mayor: file,
            }))
          }
          onFileSelect={(file) =>
            setCoberturaCalidadExcel((prev) => ({
              ...prev,
              paquetes_adulto_mayor: file,
            }))
          }
          placeholderText="Arrastra y suelta un archivo Excel (.xlsx, .xls) con datos de paquetes de atención integral del adulto mayor"
        />
        <div className="mt-6 flex gap-4">
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => handleOpenConfirmationModal("paquetes_adulto_mayor")}
            disabled={!coberturaCalidadExcel.paquetes_adulto_mayor || uploading}
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {uploading ? "Subiendo..." : "Guardar"}
          </Button>
          <Button
            variant="outline"
            className="w-full border-blue-300 text-blue-600 hover:bg-blue-50"
            onClick={() => handleCancel("paquetes_adulto_mayor")}
            disabled={!coberturaCalidadExcel.paquetes_adulto_mayor || uploading}
          >
            Cancelar
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
}