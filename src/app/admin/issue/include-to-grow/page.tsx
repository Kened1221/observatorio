/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { uploadPoblacionData } from "@/actions/dashboard-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import DragDropExcelInput from "@/components/ui/drag-drop-excel-input";
import { ConfirmDialog } from "@/components/ui/dialog-confirm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { downloadPoblacionData, getAvailableYears } from "@/actions/inicio-actions";

export default function Page() {
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("");

  // Obtener años disponibles al montar el componente
  useEffect(() => {
    const fetchYears = async () => {
      const years = await getAvailableYears();
      setAvailableYears(years);
      if (years.length > 0) {
        setSelectedYear(years[0].toString());
      }
    };
    fetchYears();
  }, []);

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

  const handleDownload = async () => {
    if (!selectedYear) return;

    setDownloading(true);
    setMessage(null);

    try {
      const result = await downloadPoblacionData(parseInt(selectedYear));

      if (result.success && result.data) {
        const worksheet = XLSX.utils.json_to_sheet(result.data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Poblacion");
        const excelBuffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Poblacion_${selectedYear}.xlsx`;
        link.click();
        URL.revokeObjectURL(url);
        setMessage({
          type: "success",
          text: `Datos del año ${selectedYear} descargados exitosamente`,
        });
      } else {
        setMessage({
          type: "error",
          text: result.error || "No se pudo descargar los datos",
        });
      }
    } catch (error: any) {
      console.error("Error al descargar el archivo:", error);
      setMessage({
        type: "error",
        text: error.message || "No se pudo descargar el archivo",
      });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6">
      <Card className="shadow-lg max-w-7xl w-full">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold">POLITICA INCLUIR PARA CRECER</CardTitle>
          <p className="text-sm text-muted-foreground">
            Sube datos para actualizar la base de datos
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
      <Card className="shadow-lg max-w-7xl w-full">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold">Panel de Control</CardTitle>
          <p className="text-sm text-muted-foreground">
            Aquí puedes descargar en Excel los datos de la población
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Select
              value={selectedYear}
              onValueChange={setSelectedYear}
              disabled={downloading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona un año" />
              </SelectTrigger>
              <SelectContent>
                {availableYears.length > 0 ? (
                  availableYears.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="0" disabled>
                    No hay años disponibles
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            <Button
              onClick={handleDownload}
              disabled={!selectedYear || downloading}
              className="w-full"
            >
              {downloading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {downloading ? "Descargando..." : "Descargar Excel"}
            </Button>
          </div>
          {message && message.type === "error" && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}