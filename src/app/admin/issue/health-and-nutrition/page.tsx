/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2 } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/dialog-confirm";
import * as XLSX from "xlsx";
import { uploadPoblacionData, uploadAnemiaData, uploadDesnutricionData, uploadDengueData, downloadEpidemiologicalTemplate } from "@/actions/salud-nutricion-actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ContainerQuality from "@/components/salud/quality-coverage";
import ContainerEpidemiological from "@/components/salud/epidemiological-surveillance";
import { EpidemiologicalSurveillance } from "./epidemiological-surveillance";
import QualityCoverage from "./quality-coverage";

export default function Page() {
  const [coberturaCalidadExcel, setCoberturaCalidadExcel] = useState<{
    [key: string]: File | null;
  }>({
    paquetes_nino: null,
    paquetes_adolescente: null,
    paquetes_gestante: null,
    paquetes_adulto_mayor: null,
  });
  const [vigilanciaEpidemiologicaExcel, setVigilanciaEpidemiologicaExcel] = useState<{
    [key: string]: File | null;
  }>({
    poblacion_curso_vida: null,
    anemia: null,
    desnutricion: null,
    dengue: null,
  });
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState<{
    isOpen: boolean;
    category: "cobertura_calidad" | "vigilancia_epidemiologica" | null;
    subCategory: string | null;
    data?: any[] | null;
    error?: string | null;
  }>({
    isOpen: false,
    category: null,
    subCategory: null,
    data: null,
    error: null,
  });
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleCloseConfirmationModal = useCallback(() => {
    setShowConfirmationModal({
      isOpen: false,
      category: null,
      subCategory: null,
      data: null,
      error: null,
    });
  }, []);

  const handleConfirmUpload = useCallback(async () => {
    const { category, subCategory } = showConfirmationModal;
    if (!subCategory || !category) return;

    const file = category === "cobertura_calidad"
      ? coberturaCalidadExcel[subCategory]
      : vigilanciaEpidemiologicaExcel[subCategory];

    if (!file) {
      setShowConfirmationModal({ ...showConfirmationModal, isOpen: false, error: "No se seleccionó ningún archivo" });
      return;
    }

    setUploading(true);
    try {
      const data = await new Promise<any[]>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = (e) => {
          try {
            const arrayData = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(arrayData, { type: "array" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(sheet);
            resolve(jsonData);
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = () => reject(new Error("Error al leer el archivo"));
      });

      const uploadFunctions: { [key: string]: (data: any[]) => Promise<any> } = {
        poblacion_curso_vida: uploadPoblacionData,
        anemia: uploadAnemiaData,
        desnutricion: uploadDesnutricionData,
        dengue: uploadDengueData,
      };

      if (category === "vigilancia_epidemiologica") {
        const requiredHeaders = ["ANIO", "UBICACION", "NUMERO DE CASOS", "EVALUADOS", "PORCENTAJE"];
        const headers = Object.keys(data[0] || {});
        const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
        if (missingHeaders.length > 0) {
          setShowConfirmationModal({ ...showConfirmationModal, isOpen: true, error: `Faltan columnas requeridas: ${missingHeaders.join(", ")}` });
          setUploading(false);
          return;
        }

        const invalidRows = data.filter((row: any) => !Number.isInteger(row.ANIO) || !Number.isInteger(row.UBICACION) ||
          !Number.isInteger(row["NUMERO DE CASOS"]) || !Number.isInteger(row.EVALUADOS) || typeof row.PORCENTAJE !== "number");

        if (invalidRows.length > 0) {
          setShowConfirmationModal({ ...showConfirmationModal, isOpen: true, error: "Datos inválidos: ANIO, UBICACION, NUMERO DE CASOS y EVALUADOS deben ser enteros, PORCENTAJE un número" });
          setUploading(false);
          return;
        }

        const serializableData = data.map((row: any) => ({
          ANIO: row.ANIO,
          UBICACION: row.UBICACION,
          "NUMERO DE CASOS": row["NUMERO DE CASOS"],
          EVALUADOS: row.EVALUADOS,
          PORCENTAJE: row.PORCENTAJE,
        }));

        const uploadFunction = uploadFunctions[subCategory];
        if (!uploadFunction) throw new Error("Subcategoría no válida");

        const response = await uploadFunction(serializableData);
        if (response.success) {
          setNotification({ message: response.message || `Se subieron ${serializableData.length} registros para el año ${serializableData[0].ANIO} exitosamente`, type: "success" });
          handleCloseConfirmationModal();
          setVigilanciaEpidemiologicaExcel(prev => ({ ...prev, [subCategory]: null }));
        } else {
          setShowConfirmationModal({ ...showConfirmationModal, isOpen: true, error: response.error || "Error al subir el archivo" });
          setNotification({ message: response.error || "Error al subir el archivo", type: "error" });
        }
      } else if (category === "cobertura_calidad") {
        setNotification({ message: "Funcionalidad para cobertura de calidad no implementada aún", type: "error" });
        setShowConfirmationModal({ ...showConfirmationModal, isOpen: true, error: "Funcionalidad no implementada" });
      }
    } catch (error: any) {
      const errorMsg = `Error al procesar el archivo: ${error.message || "Error desconocido"}`;
      setShowConfirmationModal({ ...showConfirmationModal, isOpen: true, error: errorMsg });
      setNotification({ message: errorMsg, type: "error" });
    } finally {
      setUploading(false);
    }
  }, [showConfirmationModal, coberturaCalidadExcel, vigilanciaEpidemiologicaExcel, handleCloseConfirmationModal, setCoberturaCalidadExcel, setVigilanciaEpidemiologicaExcel]);

  const handleDownloadTemplate = async () => {
    setDownloading(true);
    try {
      const excelBuffer = await downloadEpidemiologicalTemplate();
      const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Plantilla_Vigilancia_Epidemiologica.xlsx";
      link.click();
      URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error("Error al descargar la plantilla:", error);
      setNotification({ message: "Error al descargar la plantilla", type: "error" });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Salud y Nutrición</h1>
        <p className="text-lg text-muted-foreground">Administra los datos relacionados con cobertura de calidad y vigilancia epidemiológica</p>
      </div>
      <Tabs defaultValue="cobertura_calidad" className="mb-8 space-y-4">
        <TabsList className="grid w-full grid-cols-2 max-w-3xl mx-auto bg-gray-100 rounded-lg p-1">
          <TabsTrigger value="cobertura_calidad">Cobertura de Calidad</TabsTrigger>
          <TabsTrigger value="vigilancia_epidemiologica">Vigilancia Epidemiológica</TabsTrigger>
        </TabsList>
        <TabsContent value="cobertura_calidad">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-blue-900">Subir Datos de Cobertura de Calidad</CardTitle>
              <p className="text-sm text-blue-700">Carga archivos Excel con información sobre la cobertura de calidad en servicios de salud.</p>
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
          <div className="flex flex-col w-full h-full">
            <ContainerEpidemiological />
          </div>
        </TabsContent>
        <TabsContent value="vigilancia_epidemiologica" className="space-y-8">
          <Card className="border-none shadow-lg">

            <CardHeader className="flex flex-row justify-between items-start">
              <div>
                <CardTitle className="text-2xl font-semibold text-yellow-500">Subir Datos de Vigilancia Epidemiológica</CardTitle>
                <p className="text-sm text-yellow-600">Carga archivos Excel con información sobre vigilancia epidemiológica en centros de salud.</p>

              </div>
              <Button
                onClick={handleDownloadTemplate}
                disabled={uploading || downloading}
                className="mb-6"
              >
                {downloading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                {downloading ? "Descargando..." : "Descargar Plantilla"}
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <EpidemiologicalSurveillance
                vigilanciaEpidemiologicaExcel={vigilanciaEpidemiologicaExcel}
                setVigilanciaEpidemiologicaExcel={setVigilanciaEpidemiologicaExcel}
                uploading={uploading}
                setShowConfirmationModal={setShowConfirmationModal}
              />
            </CardContent>
          </Card>
          {notification && (
            <Alert
              variant={notification.type === "success" ? "default" : "destructive"}
              className={notification.type === "success" ? "bg-green-100 border-green-500 text-green-800" : "bg-red-100 border-red-500 text-red-800"}
            >
              <CheckCircle2 className="h-5 w-5 mr-2 text-green-600" />
              <AlertTitle className="text-lg font-semibold">
                {notification.type === "success" ? "¡Éxito!" : "Error"}
              </AlertTitle>
              <AlertDescription className="text-base">
                {notification.message}
              </AlertDescription>
            </Alert>
          )}
          <div className="flex flex-col w-full h-full">
            <ContainerQuality />
          </div>
        </TabsContent>
      </Tabs>
      <ConfirmDialog
        isOpen={showConfirmationModal.isOpen}
        onClose={handleCloseConfirmationModal}
        onConfirm={handleConfirmUpload}
        title="¿Estás seguro de guardar este archivo?"
        description={showConfirmationModal.error || "Los datos que intentas guardar reemplazarán los registros existentes para el mismo año en la base de datos."}
        styleButton="bg-blue-600 hover:bg-blue-700 text-white"
      />
    </div>
  );
}