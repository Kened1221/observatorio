/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle2 } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/dialog-confirm";
import ContainerStart from "./container-start";
import {
  downloadPoblacionTemplate,
  uploadPoblacionData,
} from "@/actions/dashboard-actions";
import DragDropExcelInput from "@/components/ui/drag-drop-excel-input";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

interface Message {
  type: "success" | "error";
  text: string;
}

export default function Page() {
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
  };

  const handleOpenConfirmationModal = () => {
    if (file) {
      setShowConfirmationModal(true);
    }
  };

  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
  };

  const handleConfirmSave = async () => {
    if (!file) return;

    setUploading(true);
    setMessage(null);
    setShowConfirmationModal(false);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const edadIntervaloMap: Record<string, number> = {
        "Menores de 1 año": 1,
        "De 1 a 4 años": 2,
        "De 5 a 9 años": 3,
        "De 10 a 14 años": 4,
        "De 15 a 19 años": 5,
        "De 20 a 24 años": 6,
        "De 25 a 29 años": 7,
        "De 30 a 34 años": 8,
        "De 35 a 39 años": 9,
        "De 40 a 44 años": 10,
        "De 45 a 49 años": 11,
        "De 50 a 54 años": 12,
        "De 55 a 59 años": 13,
        "De 60 a 64 años": 14,
        "De 65 y más años": 15,
      };

      const processedData = jsonData.map((row: any) => ({
        anio: parseInt(row.ANIO) || 0,
        ubicacionId: parseInt(row.UBICACIÓN) || 0,
        generoId: row.GENERO === "masculino" ? 1 : 2,
        ambitoId: row.AMBITO === "rural" ? 1 : 2,
        edadIntervaloId: edadIntervaloMap[row["INTERVALO EDAD"]],
        cantidad: parseInt(row.CANTIDAD) || 0,
      }));

      const result = await uploadPoblacionData(processedData);

      if (result.success) {
        setMessage({
          type: "success",
          text: result.message || "Datos subidos exitosamente",
        });
        toast.success(result.message || "Datos subidos exitosamente", {
          position: "top-center",
          style: {
            background: "#22c55e",
            color: "#ffffff",
            border: "2px solid #16a34a",
            fontWeight: "bold",
          },
          icon: <CheckCircle2 className="h-5 w-5" />,
        });
      } else {
        setMessage({
          type: "error",
          text: result.error || "Error al subir los datos",
        });
        toast.error(result.error || "Error al subir los datos", {
          position: "top-center",
          style: {
            background: "#ef4444",
            color: "#ffffff",
            border: "2px solid #dc2626",
          },
        });
      }
    } catch (error: any) {
      console.error("Error al procesar el archivo:", error);
      setMessage({
        type: "error",
        text: error.message || "No se pudo procesar el archivo",
      });
      toast.error(error.message || "No se pudo procesar el archivo", {
        position: "top-center",
        style: {
          background: "#ef4444",
          color: "#ffffff",
          border: "2px solid #dc2626",
        },
      });
    } finally {
      setUploading(false);
      setFile(null);
    }
  };

  const fn_excel_template = async () => {
    setDownloading(true);
    try {
      const excelBuffer = await downloadPoblacionTemplate();

      const blob = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Plantilla_Poblacion.xlsx";
      link.click();
      URL.revokeObjectURL(url);

      toast.success("Plantilla descargada exitosamente", {
        position: "top-center",
        style: {
          background: "#22c55e",
          color: "#ffffff",
          border: "2px solid #16a34a",
          fontWeight: "bold",
        },
        icon: <CheckCircle2 className="h-5 w-5" />,
      });
    } catch (error) {
      console.error("Error al descargar la plantilla:", error);

      toast.error("Error al descargar la plantilla", {
        position: "top-center",
        style: {
          background: "#ef4444",
          color: "#ffffff",
          border: "2px solid #dc2626",
        },
      });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6">
      <Toaster />
      <Card className="shadow-lg max-w-7xl w-full">
        <CardHeader className="flex flex-row justify-between items-start">
          <div>
            <CardTitle className="text-3xl font-semibold">
              Panel de Inicio
            </CardTitle>
            <CardDescription>
              Sube datos de la población para actualizar la base de datos
            </CardDescription>
          </div>
          <Button onClick={fn_excel_template} disabled={downloading}>
            {downloading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {downloading ? "Descargando..." : "Descargar Plantilla"}
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <DragDropExcelInput
              file={file}
              setFile={setFile}
              onFileSelect={handleFileSelect}
              placeholderText="Arrastra y suelta un archivo Excel (.xlsx, .xls) aquí o haz clic para seleccionar"
            />
            <Button
              onClick={handleOpenConfirmationModal}
              disabled={!file || uploading}
              className="w-full"
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {uploading ? "Subiendo..." : "Enviar Archivo"}
            </Button>
          </div>
          {message && message.type === "success" && (
            <Alert
              variant="default"
              className="bg-green-100 border-green-500 text-green-800"
            >
              <CheckCircle2 className="h-5 w-5 mr-2 text-green-600" />
              <AlertTitle className="text-lg font-semibold">¡Éxito!</AlertTitle>
              <AlertDescription className="text-base">
                {message.text}
              </AlertDescription>
            </Alert>
          )}
          {message && message.type === "error" && (
            <Alert
              variant="destructive"
              className="bg-red-100 border-red-500 text-red-800"
            >
              <AlertTitle className="text-lg font-semibold">Error</AlertTitle>
              <AlertDescription className="text-base">
                {message.text}
              </AlertDescription>
            </Alert>
          )}
          <ConfirmDialog
            isOpen={showConfirmationModal}
            onClose={handleCloseConfirmationModal}
            onConfirm={handleConfirmSave}
            title="¿Estás seguro de guardar este archivo?"
            description="Los datos que intentas guardar reemplazarán los registros existentes para el mismo año en la base de datos."
            styleButton="bg-primary hover:bg-primary/70 text-white"
          />
        </CardContent>
      </Card>
      <ContainerStart />
    </div>
  );
}