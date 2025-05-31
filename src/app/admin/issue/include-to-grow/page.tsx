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
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import DragDropExcelInput from "@/components/ui/drag-drop-excel-input";
import { ConfirmDialog } from "@/components/ui/dialog-confirm";
import {
  uploadAvanceData,
  deleteAvanceData,
  downloadAvanceTemplate,
} from "@/actions/incluir-crecer-actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Message {
  type: "success" | "error" | "delete-success";
  text: string;
}

export default function Page() {
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
  const [selectedObjective, setSelectedObjective] = useState("objetivo 1");
  const [selectedDeleteObjective, setSelectedDeleteObjective] = useState("objetivo 1");

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

  const handleOpenDeleteConfirmationModal = () => {
    setShowDeleteConfirmationModal(true);
  };

  const handleCloseDeleteConfirmationModal = () => {
    setShowDeleteConfirmationModal(false);
  };

  const handleConfirmSave = async () => {
    if (!file) return;

    setUploading(true);
    setMessage(null);
    setShowConfirmationModal(false);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array", cellText: true });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        raw: false,
        defval: "",
        header: 1,
      }) as string[][];

      if (jsonData.length < 2) {
        throw new Error("El archivo está vacío o no contiene datos válidos.");
      }

      const headers = jsonData[0];
      const requiredColumns = ["ANIO", "UBICACION", "TOTAL"];
      const missingColumns = requiredColumns.filter((col) => !headers.includes(col));

      if (missingColumns.length > 0) {
        throw new Error(`Faltan columnas requeridas: ${missingColumns.join(", ")}`);
      }

      const anioIndex = headers.indexOf("ANIO");
      const ubicacionIndex = headers.indexOf("UBICACION");
      const totalIndex = headers.indexOf("TOTAL");
      const avanceOpColumns = headers
        .map((header, index) => ({ header, index }))
        .filter(({ header }) => header.startsWith("AVANCE OP"))
        .map(({ header, index }) => ({ name: header, index }));

      if (avanceOpColumns.length === 0) {
        throw new Error("No se encontraron columnas de AVANCE OP en el archivo.");
      }

      const processedData = jsonData.slice(1).flatMap((row, rowIndex) => {
        const anioRaw = row[anioIndex]?.trim() || "";
        const ubicacionId = parseInt(row[ubicacionIndex]?.trim() || "0");
        const totalRaw = row[totalIndex]?.trim() || "";

        const anio = parseInt(anioRaw);
        if (isNaN(anio) || anio < 2000 || anio > 2100) {
          console.warn(`Fila ${rowIndex + 2} ignorada: ANIO inválido (${anioRaw})`);
          return [];
        }

        if (ubicacionId <= 0 || totalRaw === "") {
          console.warn(`Fila ${rowIndex + 2} ignorada: UBICACION o TOTAL inválidos`);
          return [];
        }

        const total = parseFloat(totalRaw.replace("%", "")) || 0;

        return [{
          anio,
          ubicacionId,
          total,
          avancesOps: avanceOpColumns.map((op) => {
            const valueRaw = row[op.index]?.trim() || "";
            const percentage = parseFloat(valueRaw.replace("%", "")) || 0;
            return { operation: op.name, percentage };
          }),
        }];
      });

      if (processedData.length === 0) {
        throw new Error("No se encontraron datos válidos en el archivo.");
      }

      const uniqueYears = [...new Set(processedData.map((row) => row.anio))];
      await deleteAvanceData(uniqueYears, selectedObjective);

      const result = await uploadAvanceData(processedData, selectedObjective);

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

  const handleConfirmDelete = async () => {
    setDeleting(true);
    setMessage(null);
    setShowDeleteConfirmationModal(false);

    try {
      const result = await deleteAvanceData([], selectedDeleteObjective);
      if (result.success) {
        setMessage({
          type: "delete-success",
          text: result.message || "Eliminación exitosa",
        });
      } else {
        setMessage({
          type: "error",
          text: result.error || "Error al eliminar los datos",
        });
      }
    } catch (error: any) {
      console.error("Error al eliminar los datos:", error);
      setMessage({
        type: "error",
        text: error.message || "No se pudo eliminar los datos",
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleDownloadTemplate = async () => {
    setDownloading(true);
    try {
      const excelBuffer = await downloadAvanceTemplate();
      const blob = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Plantilla_Avances.xlsx";
      link.click();
      URL.revokeObjectURL(url);

      toast.success("Plantilla descargada exitosamente");
    } catch (error) {
      console.error("Error al descargar la plantilla:", error);
      toast.error("Error al descargar la plantilla");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6">
      <Card className="shadow-lg max-w-7xl w-full">
        <CardHeader className="flex flex-row justify-between items-start">
          <div>
            <CardTitle className="text-3xl font-semibold">
              Avances Epidemiológicos
            </CardTitle>
            <CardDescription>
              Sube o elimina datos de avances para actualizar la base de datos
            </CardDescription>
          </div>
          <Button onClick={handleDownloadTemplate} disabled={downloading}>
            {downloading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {downloading ? "Descargando..." : "Descargar Plantilla"}
          </Button>
        </CardHeader>
        {message && (
          <Alert
            variant={
              message.type === "delete-success"
                ? "default"
                : message.type === "success"
                  ? "default"
                  : "destructive"
            }
            className="border-green-200 bg-green-50 dark:bg-green-900/20"
          >
            {message.type === "delete-success" ? (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-green-600" />
            )}
            <AlertTitle>
              {message.type === "delete-success"
                ? "Eliminación Exitosa"
                : message.type === "success"
                  ? "Éxito"
                  : "Error"}
            </AlertTitle>
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <DragDropExcelInput
              file={file}
              setFile={setFile}
              onFileSelect={handleFileSelect}
              placeholderText="Arrastra y suelta un archivo Excel (.xlsx, .xls) aquí o haz clic para seleccionar"
            />
            <Select
              value={selectedObjective}
              onValueChange={setSelectedObjective}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona un objetivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="objetivo 1">Objetivo 1</SelectItem>
                <SelectItem value="objetivo 2">Objetivo 2</SelectItem>
                <SelectItem value="objetivo 3">Objetivo 3</SelectItem>
                <SelectItem value="objetivo 4">Objetivo 4</SelectItem>
                <SelectItem value="objetivo 5">Objetivo 5</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleOpenConfirmationModal}
              disabled={!file || uploading || deleting}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {uploading ? "Subiendo..." : "Enviar Archivo"}
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-lg max-w-7xl w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-red-600 dark:text-red-400">
            Eliminar Datos
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Selecciona un objetivo para eliminar todos sus registros
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select
            value={selectedDeleteObjective}
            onValueChange={setSelectedDeleteObjective}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona un objetivo para eliminar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="objetivo 1">Objetivo 1</SelectItem>
              <SelectItem value="objetivo 2">Objetivo 2</SelectItem>
              <SelectItem value="objetivo 3">Objetivo 3</SelectItem>
              <SelectItem value="objetivo 4">Objetivo 4</SelectItem>
              <SelectItem value="objetivo 5">Objetivo 5</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={handleOpenDeleteConfirmationModal}
            disabled={uploading || deleting}
            variant="destructive"
            className="w-full"
          >
            {deleting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {deleting ? "Eliminando..." : "Eliminar Datos"}
          </Button>
        </CardContent>
      </Card>
      <ConfirmDialog
        isOpen={showConfirmationModal}
        onClose={handleCloseConfirmationModal}
        onConfirm={handleConfirmSave}
        title="¿Estás seguro de guardar este archivo?"
        description="Los datos que intentas guardar reemplazarán todos los registros existentes en la tabla de avances para el objetivo seleccionado."
        styleButton="bg-primary hover:bg-primary/70 text-white"
      />
      <ConfirmDialog
        isOpen={showDeleteConfirmationModal}
        onClose={handleCloseDeleteConfirmationModal}
        onConfirm={handleConfirmDelete}
        title="¿Estás seguro de eliminar los datos?"
        description={`Se eliminarán todos los registros de avances asociados con ${selectedDeleteObjective}. Esta acción no se puede deshacer.`}
        styleButton="bg-destructive hover:bg-destructive/70 text-white"
      />
    </div>
  );
}