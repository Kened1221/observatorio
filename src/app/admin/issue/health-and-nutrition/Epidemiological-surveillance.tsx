"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import DragDropExcelInput from "@/components/ui/drag-drop-excel-input";

interface EpidemiologicalSurveillanceProps {
  vigilanciaEpidemiologicaExcel: { [key: string]: File | null };
  setVigilanciaEpidemiologicaExcel: React.Dispatch<
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

export default function EpidemiologicalSurveillance({
  vigilanciaEpidemiologicaExcel,
  setVigilanciaEpidemiologicaExcel,
  uploading,
  setShowConfirmationModal,
}: EpidemiologicalSurveillanceProps) {
  const handleCancel = (subCategory: string) => {
    setVigilanciaEpidemiologicaExcel((prev) => ({
      ...prev,
      [subCategory]: null,
    }));
  };

  const handleOpenConfirmationModal = (subCategory: string) => {
    if (vigilanciaEpidemiologicaExcel[subCategory]) {
      setShowConfirmationModal({
        isOpen: true,
        category: "vigilancia_epidemiologica",
        subCategory,
      });
    }
  };

  return (
    <Tabs defaultValue="poblacion_curso_vida">
      <TabsList className="grid w-full grid-cols-4 gap-2 mb-6">
        <TabsTrigger value="poblacion_curso_vida">
          Población por Curso de Vida
        </TabsTrigger>
        <TabsTrigger value="anemia">Anemia</TabsTrigger>
        <TabsTrigger value="desnutricion">Desnutrición</TabsTrigger>
        <TabsTrigger value="dengue">Dengue</TabsTrigger>
      </TabsList>
      <TabsContent value="poblacion_curso_vida">
        <DragDropExcelInput
          file={vigilanciaEpidemiologicaExcel.poblacion_curso_vida}
          setFile={(file) =>
            setVigilanciaEpidemiologicaExcel((prev) => ({
              ...prev,
              poblacion_curso_vida: file,
            }))
          }
          onFileSelect={(file) =>
            setVigilanciaEpidemiologicaExcel((prev) => ({
              ...prev,
              poblacion_curso_vida: file,
            }))
          }
          placeholderText="Arrastra y suelta un archivo Excel (.xlsx, .xls) con datos de población por curso de vida"
        />
        <div className="mt-6 flex gap-4">
          <Button
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            onClick={() =>
              handleOpenConfirmationModal("poblacion_curso_vida")
            }
            disabled={
              !vigilanciaEpidemiologicaExcel.poblacion_curso_vida || uploading
            }
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {uploading ? "Subiendo..." : "Guardar"}
          </Button>
          <Button
            variant="outline"
            className="w-full border-red-300 text-red-600 hover:bg-red-50"
            onClick={() => handleCancel("poblacion_curso_vida")}
            disabled={
              !vigilanciaEpidemiologicaExcel.poblacion_curso_vida || uploading
            }
          >
            Cancelar
          </Button>
        </div>
      </TabsContent>
      <TabsContent value="anemia">
        <DragDropExcelInput
          file={vigilanciaEpidemiologicaExcel.anemia}
          setFile={(file) =>
            setVigilanciaEpidemiologicaExcel((prev) => ({
              ...prev,
              anemia: file,
            }))
          }
          onFileSelect={(file) =>
            setVigilanciaEpidemiologicaExcel((prev) => ({
              ...prev,
              anemia: file,
            }))
          }
          placeholderText="Arrastra y suelta un archivo Excel (.xlsx, .xls) con datos de anemia"
        />
        <div className="mt-6 flex gap-4">
          <Button
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            onClick={() => handleOpenConfirmationModal("anemia")}
            disabled={!vigilanciaEpidemiologicaExcel.anemia || uploading}
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {uploading ? "Subiendo..." : "Guardar"}
          </Button>
          <Button
            variant="outline"
            className="w-full border-red-300 text-red-600 hover:bg-red-50"
            onClick={() => handleCancel("anemia")}
            disabled={!vigilanciaEpidemiologicaExcel.anemia || uploading}
          >
            Cancelar
          </Button>
        </div>
      </TabsContent>
      <TabsContent value="desnutricion">
        <DragDropExcelInput
          file={vigilanciaEpidemiologicaExcel.desnutricion}
          setFile={(file) =>
            setVigilanciaEpidemiologicaExcel((prev) => ({
              ...prev,
              desnutricion: file,
            }))
          }
          onFileSelect={(file) =>
            setVigilanciaEpidemiologicaExcel((prev) => ({
              ...prev,
              desnutricion: file,
            }))
          }
          placeholderText="Arrastra y suelta un archivo Excel (.xlsx, .xls) con datos de desnutrición"
        />
        <div className="mt-6 flex gap-4">
          <Button
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            onClick={() => handleOpenConfirmationModal("desnutricion")}
            disabled={!vigilanciaEpidemiologicaExcel.desnutricion || uploading}
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {uploading ? "Subiendo..." : "Guardar"}
          </Button>
          <Button
            variant="outline"
            className="w-full border-red-300 text-red-600 hover:bg-red-50"
            onClick={() => handleCancel("desnutricion")}
            disabled={!vigilanciaEpidemiologicaExcel.desnutricion || uploading}
          >
            Cancelar
          </Button>
        </div>
      </TabsContent>
      <TabsContent value="dengue">
        <DragDropExcelInput
          file={vigilanciaEpidemiologicaExcel.dengue}
          setFile={(file) =>
            setVigilanciaEpidemiologicaExcel((prev) => ({
              ...prev,
              dengue: file,
            }))
          }
          onFileSelect={(file) =>
            setVigilanciaEpidemiologicaExcel((prev) => ({
              ...prev,
              dengue: file,
            }))
          }
          placeholderText="Arrastra y suelta un archivo Excel (.xlsx, .xls) con datos de dengue"
        />
        <div className="mt-6 flex gap-4">
          <Button
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            onClick={() => handleOpenConfirmationModal("dengue")}
            disabled={!vigilanciaEpidemiologicaExcel.dengue || uploading}
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {uploading ? "Subiendo..." : "Guardar"}
          </Button>
          <Button
            variant="outline"
            className="w-full border-red-300 text-red-600 hover:bg-red-50"
            onClick={() => handleCancel("dengue")}
            disabled={!vigilanciaEpidemiologicaExcel.dengue || uploading}
          >
            Cancelar
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
}