/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import DragDropExcelInput from "@/components/ui/drag-drop-excel-input";
import * as XLSX from "xlsx";

interface ExcelRow {
  ANIO: number;
  UBICACION: number;
  "NUMERO DE CASOS": number;
  EVALUADOS: number;
  PORCENTAJE: number;
}

interface EpidemiologicalSurveillanceProps {
  vigilanciaEpidemiologicaExcel: { [key: string]: File | null };
  setVigilanciaEpidemiologicaExcel: React.Dispatch<React.SetStateAction<{ [key: string]: File | null }>>;
  uploading: boolean;
  setShowConfirmationModal: React.Dispatch<React.SetStateAction<{
    isOpen: boolean;
    category: "cobertura_calidad" | "vigilancia_epidemiologica" | null;
    subCategory: string | null;
    data?: ExcelRow[] | null;
    error?: string | null;
  }>>;
}

export function EpidemiologicalSurveillance({
  vigilanciaEpidemiologicaExcel,
  setVigilanciaEpidemiologicaExcel,
  uploading,
  setShowConfirmationModal,
}: EpidemiologicalSurveillanceProps) {
  const handleCancel = (subCategory: string) => {
    setVigilanciaEpidemiologicaExcel(prev => ({ ...prev, [subCategory]: null }));
  };

  const handleOpenConfirmationModal = async (subCategory: string) => {
    const file = vigilanciaEpidemiologicaExcel[subCategory];
    if (!file) {
      setShowConfirmationModal({ isOpen: true, category: "vigilancia_epidemiologica", subCategory, error: "No se seleccionó ningún archivo" });
      return;
    }

    try {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData: unknown[] = XLSX.utils.sheet_to_json(sheet);

        if (!jsonData.length) {
          setShowConfirmationModal({ isOpen: true, category: "vigilancia_epidemiologica", subCategory, error: "El archivo Excel está vacío" });
          return;
        }

        const requiredHeaders = ["ANIO", "UBICACION", "NUMERO DE CASOS", "EVALUADOS", "PORCENTAJE"];
        const headers = Object.keys(jsonData[0] as Record<string, unknown>);
        const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
        if (missingHeaders.length > 0) {
          setShowConfirmationModal({ isOpen: true, category: "vigilancia_epidemiologica", subCategory, error: `Faltan columnas requeridas: ${missingHeaders.join(", ")}` });
          return;
        }

        const invalidRows = jsonData.filter((row: unknown) => {
          const typedRow = row as ExcelRow;
          return (
            !Number.isInteger(typedRow.ANIO) ||
            !Number.isInteger(typedRow.UBICACION) ||
            !Number.isInteger(typedRow["NUMERO DE CASOS"]) ||
            !Number.isInteger(typedRow.EVALUADOS) ||
            typeof typedRow.PORCENTAJE !== "number"
          );
        });

        if (invalidRows.length > 0) {
          setShowConfirmationModal({
            isOpen: true,
            category: "vigilancia_epidemiologica",
            subCategory,
            error: "Datos inválidos: ANIO, UBICACION, NUMERO DE CASOS y EVALUADOS deben ser enteros, PORCENTAJE un número",
          });
          return;
        }

        const serializableData: ExcelRow[] = jsonData.map((row: unknown) => ({
          ANIO: (row as ExcelRow).ANIO,
          UBICACION: (row as ExcelRow).UBICACION,
          "NUMERO DE CASOS": (row as ExcelRow)["NUMERO DE CASOS"],
          EVALUADOS: (row as ExcelRow).EVALUADOS,
          PORCENTAJE: (row as ExcelRow).PORCENTAJE,
        }));

        setShowConfirmationModal({ isOpen: true, category: "vigilancia_epidemiologica", subCategory, data: serializableData, error: null });
      };
      reader.onerror = () => setShowConfirmationModal({ isOpen: true, category: "vigilancia_epidemiologica", subCategory, error: "Error al leer el archivo Excel" });
    } catch (error: any) {
      setShowConfirmationModal({ isOpen: true, category: "vigilancia_epidemiologica", subCategory, error: `Error al procesar el archivo: ${error.message || "Error desconocido"}` });
    }
  };

  const tabs = [
    { value: "poblacion_curso_vida", label: "Población por Curso de Vida", placeholder: "Arrastra y suelta un archivo Excel (.xlsx, .xls) con datos de población por curso de vida" },
    { value: "anemia", label: "Anemia", placeholder: "Arrastra y suelta un archivo Excel (.xlsx, .xls) con datos de anemia" },
    { value: "desnutricion", label: "Desnutrición", placeholder: "Arrastra y suelta un archivo Excel (.xlsx, .xls) con datos de desnutrición" },
    { value: "dengue", label: "Dengue", placeholder: "Arrastra y suelta un archivo Excel (.xlsx, .xls) con datos de dengue" },
  ];

  return (
    <Tabs defaultValue="poblacion_curso_vida">
      <TabsList className="grid w-full grid-cols-4 gap-2 mb-6">
        {tabs.map(({ value, label }) => (
          <TabsTrigger key={value} value={value}>{label}</TabsTrigger>
        ))}
      </TabsList>
      {tabs.map(({ value, placeholder }) => (
        <TabsContent key={value} value={value}>
          <DragDropExcelInput
            file={vigilanciaEpidemiologicaExcel[value]}
            setFile={(file) => setVigilanciaEpidemiologicaExcel(prev => ({ ...prev, [value]: file }))}
            onFileSelect={(file) => setVigilanciaEpidemiologicaExcel(prev => ({ ...prev, [value]: file }))}
            placeholderText={placeholder}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
            <Button
              className="w-full bg-red-600 hover:bg-red-700 text-white"
              onClick={() => handleOpenConfirmationModal(value)}
              disabled={!vigilanciaEpidemiologicaExcel[value] || uploading}
            >
              {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {uploading ? "Subiendo..." : "Guardar"}
            </Button>
            <Button
              variant="outline"
              className="w-full border-red-300 text-red-600 hover:bg-red-50"
              onClick={() => handleCancel(value)}
              disabled={!vigilanciaEpidemiologicaExcel[value] || uploading}
            >
              Cancelar
            </Button>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}