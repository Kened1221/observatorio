/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import DragDropExcelInput from "@/components/ui/drag-drop-excel-input";
import * as XLSX from "xlsx";

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
      data?: any[] | null;
      error?: string | null;
    }>
  >;
}

export function EpidemiologicalSurveillance({
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

  const handleOpenConfirmationModal = async (subCategory: string) => {
    const file = vigilanciaEpidemiologicaExcel[subCategory];
    if (!file) {
      setShowConfirmationModal({
        isOpen: true,
        category: "vigilancia_epidemiologica",
        subCategory,
        error: "No se seleccionó ningún archivo",
      });
      return;
    }

    try {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        if (subCategory === "anemia") {
          const requiredHeaders = ["ANIO", "UBICACION", "NUMERO DE CASOS", "EVALUADOS", "PORCENTAJE"];
          const headers = Object.keys(jsonData[0] || {});
          const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h));
          if (missingHeaders.length > 0) {
            setShowConfirmationModal({
              isOpen: true,
              category: "vigilancia_epidemiologica",
              subCategory,
              error: `Faltan columnas requeridas: ${missingHeaders.join(", ")}`,
            });
            return;
          }

          const invalidRows = jsonData.filter((row: any) => {
            return (
              !Number.isInteger(row.ANIO) ||
              !Number.isInteger(row.UBICACION) ||
              !Number.isInteger(row["NUMERO DE CASOS"]) ||
              !Number.isInteger(row.EVALUADOS) ||
              typeof row.PORCENTAJE !== "number"
            );
          });

          if (invalidRows.length > 0) {
            setShowConfirmationModal({
              isOpen: true,
              category: "vigilancia_epidemiologica",
              subCategory,
              error: "Datos inválidos detectados: asegúrese de que ANIO, UBICACION, NUMERO DE CASOS y EVALUADOS sean enteros, y PORCENTAJE sea un número",
            });
            return;
          }
        }

        // Convertir los datos a un formato serializable
        const serializableData = jsonData.map((row: any) => ({
          ANIO: row.ANIO,
          UBICACION: row.UBICACION,
          "NUMERO DE CASOS": row["NUMERO DE CASOS"],
          EVALUADOS: row.EVALUADOS,
          PORCENTAJE: row.PORCENTAJE,
        }));

        setShowConfirmationModal({
          isOpen: true,
          category: "vigilancia_epidemiologica",
          subCategory,
          data: serializableData,
          error: null,
        });
      };
    } catch (error: any) {
      setShowConfirmationModal({
        isOpen: true,
        category: "vigilancia_epidemiologica",
        subCategory,
        error: `Error al procesar el archivo: ${error.message || "Error desconocido"}`,
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
          <Button
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            onClick={() => handleOpenConfirmationModal("poblacion_curso_vida")}
            disabled={!vigilanciaEpidemiologicaExcel.poblacion_curso_vida || uploading}
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {uploading ? "Subiendo..." : "Guardar"}
          </Button>
          <Button
            variant="outline"
            className="w-full border-red-300 text-red-600 hover:bg-red-50"
            onClick={() => handleCancel("poblacion_curso_vida")}
            disabled={!vigilanciaEpidemiologicaExcel.poblacion_curso_vida || uploading}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
          <Button
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            onClick={() => handleOpenConfirmationModal("anemia")}
            disabled={!vigilanciaEpidemiologicaExcel.anemia || uploading}
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
          <Button
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            onClick={() => handleOpenConfirmationModal("desnutricion")}
            disabled={!vigilanciaEpidemiologicaExcel.desnutricion || uploading}
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
          <Button
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            onClick={() => handleOpenConfirmationModal("dengue")}
            disabled={!vigilanciaEpidemiologicaExcel.dengue || uploading}
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
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