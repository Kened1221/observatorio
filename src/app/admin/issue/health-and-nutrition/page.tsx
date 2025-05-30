/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import QualityCoverage from "./quality-coverage";
import { ConfirmDialog } from "@/components/ui/dialog-confirm";
import * as XLSX from "xlsx";
import { uploadAnemiaData } from "@/actions/salud-nutricion-actions";
import { EpidemiologicalSurveillance } from "./epidemiological-surveillance";

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
  const [uploading, setUploading] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState<{
    isOpen: boolean;
    category: "cobertura_calidad" | "vigilancia_epidemiologica" | null;
    subCategory: string | null;
    data?: any[] | null;
    error?: string | null;
  }>({ isOpen: false, category: null, subCategory: null, data: null, error: null });
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal({
      isOpen: false,
      category: null,
      subCategory: null,
      data: null,
      error: null,
    });
  };

  const handleConfirmUpload = async () => {
    if (!showConfirmationModal.subCategory || !showConfirmationModal.category) return;

    const file =
      showConfirmationModal.category === "cobertura_calidad"
        ? coberturaCalidadExcel[showConfirmationModal.subCategory]
        : vigilanciaEpidemiologicaExcel[showConfirmationModal.subCategory];

    if (!file) {
      setShowConfirmationModal({
        ...showConfirmationModal,
        isOpen: false,
        data: null,
        error: "No se seleccionó ningún archivo",
      });
      return;
    }

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      const promise = new Promise((resolve, reject) => {
        reader.onload = async (e) => {
          try {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: "array" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(sheet);

            // Validación específica para anemia
            if (showConfirmationModal.subCategory === "anemia") {
              const requiredHeaders = ["ANIO", "UBICACION", "NUMERO DE CASOS", "EVALUADOS", "PORCENTAJE"];
              const headers = Object.keys(jsonData[0] || {});
              const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h));
              if (missingHeaders.length > 0) {
                setShowConfirmationModal({
                  ...showConfirmationModal,
                  isOpen: true,
                  error: `Faltan columnas requeridas: ${missingHeaders.join(", ")}`,
                });
                setUploading(false);
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
                  ...showConfirmationModal,
                  isOpen: true,
                  error: "Datos inválidos detectados: asegúrese de que ANIO, UBICACION, NUMERO DE CASOS y EVALUADOS sean enteros, y PORCENTAJE sea un número",
                });
                setUploading(false);
                return;
              }

              // Convertir los datos a un formato serializable
              const serializableData = jsonData.map((row: any) => ({
                ANIO: row.ANIO,
                UBICACION: row.UBICACION,
                "NUMERO DE CASOS": row["NUMERO DE CASOS"],
                EVALUADOS: row.EVALUADOS,
                PORCENTAJE: row.PORCENTAJE,
              }));

              const response = await uploadAnemiaData(serializableData);
              if (response.success) {
                setNotification({
                  message: response.message || `Se subieron ${serializableData.length} registros para el año ${serializableData[0].ANIO} exitosamente`,
                  type: "success",
                });
                setShowConfirmationModal({
                  isOpen: false,
                  category: null,
                  subCategory: null,
                  data: null,
                  error: null,
                });
                resolve(response);
              } else {
                setShowConfirmationModal({
                  ...showConfirmationModal,
                  isOpen: true,
                  error: response.error || "Error al subir el archivo",
                });
                setNotification({
                  message: response.error || "Error al subir el archivo",
                  type: "error",
                });
                resolve(response);
              }
            }
          } catch (error: any) {
            setShowConfirmationModal({
              ...showConfirmationModal,
              isOpen: true,
              error: `Error al procesar el archivo: ${error.message || "Error desconocido"}`,
            });
            setNotification({
              message: `Error al procesar el archivo: ${error.message || "Error desconocido"}`,
              type: "error",
            });
            reject(error);
          } finally {
            setUploading(false);
          }
        };
      });
      await promise;
    } catch (error: any) {
      setShowConfirmationModal({
        ...showConfirmationModal,
        isOpen: true,
        error: `Error al procesar el archivo: ${error.message || "Error desconocido"}`,
      });
      setNotification({
        message: `Error al procesar el archivo: ${error.message || "Error desconocido"}`,
        type: "error",
      });
      setUploading(false);
    }
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
        {notification && (
          <div
            className={`p-4 rounded-lg text-white ${notification.type === "success" ? "bg-green-600" : "bg-red-600"
              }`}
          >
            {notification.message}
          </div>
        )}
      </Tabs>
      <ConfirmDialog
        isOpen={showConfirmationModal.isOpen}
        onClose={handleCloseConfirmationModal}
        onConfirm={handleConfirmUpload}
        title="¿Estás seguro de guardar este archivo?"
        description={
          showConfirmationModal.error ||
          "Los datos que intentas guardar reemplazarán los registros existentes para el mismo año en la base de datos."
        }
        styleButton="bg-blue-600 hover:bg-blue-700 text-white"
      />
    </div>
  );
}