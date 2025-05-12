/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import DragDropExcelInput from "@/components/ui/drag-drop-excel-input";
import { ConfirmDialog } from "@/components/ui/dialog-confirm";
import ContainerStart from "./container-start";
import { uploadPoblacionData } from "@/actions/dashboard-actions";

interface Message {
  type: "success" | "error";
  text: string;
}

export default function Page() {
  const [uploading, setUploading] = useState(false);
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

      const processedData = jsonData.map((row: any) => ({
        anio: parseInt(row.anio) || 0,
        cantidad: parseInt(row.cantidad) || 0,
        ubicacionId: parseInt(row.ubicacionId) || 0,
        ambitoId: parseInt(row.ambitoId) || 0,
        edadIntervaloId: parseInt(row.edadIntervalo) || 0,
        generoId: parseInt(row.generoId) || 0,
      }));

      const result = await uploadPoblacionData(processedData);

      if (result.success) {
        setMessage({
          type: "success",
          text: result.message || "Datos subidos exitosamente",
        });
      } else {
        setMessage({
          type: "error",
          text: result.error || "Error al subir los datos",
        });
      }
    } catch (error: any) {
      console.error("Error al procesar el archivo:", error);
      setMessage({
        type: "error",
        text: error.message || "No se pudo procesar el archivo",
      });
    } finally {
      setUploading(false);
      setFile(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6">
      <Card className="shadow-lg max-w-7xl w-full">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold">
            Panel de Inicio
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Sube datos de la población para actualizar la base de datos
          </p>
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
            <Alert variant="default">
              <AlertTitle>Éxito</AlertTitle>
              <AlertDescription>{message.text}</AlertDescription>
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