/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import DragDropExcelInput from "@/components/ui/drag-drop-excel-input";
import { ConfirmDialog } from "@/components/ui/dialog-confirm";
import {
  uploadAvanceData,
  deleteAvanceData,
} from "@/actions/objetivos-actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Message {
  type: "success" | "error" | "delete-success";
  text: string;
}

export default function Page() {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState(false);
  const [selectedObjective, setSelectedObjective] = useState("objetivo 1");
  const [selectedDeleteObjective, setSelectedDeleteObjective] =
    useState("objetivo 1");

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
      });

      // Obtener encabezados dinámicamente (segunda fila)
      const headers = jsonData[1] as string[];
      const avanceOpColumns = headers
        .map((header, index) => ({ header, index }))
        .filter(({ header }) => header.startsWith("AVANCE OP"))
        .map(({ header, index }) => ({ name: header, index }));

      // Validar que existan los encabezados requeridos
      if (
        !headers.includes("PROVINCIA") ||
        !headers.includes("DISTRITO") ||
        !headers.includes("TOTAL")
      ) {
        throw new Error(
          "El archivo no contiene las columnas requeridas: PROVINCIA, DISTRITO y TOTAL."
        );
      }

      // Procesar datos (omitir las primeras dos filas: título y encabezados)
      const processedData = jsonData
        .slice(2)
        .flatMap((row: any, rowIndex: number) => {
          const provincia = row[headers.indexOf("PROVINCIA")]
            ?.toString()
            .trim()
            .toUpperCase();
          const distrito = row[headers.indexOf("DISTRITO")]
            ?.toString()
            .trim()
            .toUpperCase();
          const totalRaw =
            row[headers.indexOf("TOTAL")]?.toString().trim() || "";

          // Validar campos requeridos
          if (!provincia || !distrito || !totalRaw) {
            console.warn(
              `Skipping row ${
                rowIndex + 3
              } with missing PROVINCIA, DISTRITO or TOTAL:`,
              row
            );
            return [];
          }

          // Safely parse TOTAL
          const total = totalRaw
            ? parseFloat(totalRaw.replace("%", "")) || 0
            : 0;

          const result = avanceOpColumns.map((op) => {
            // Safely parse percentage
            const valueRaw = row[op.index]?.toString().trim() || "";
            const percentage = valueRaw
              ? parseFloat(valueRaw.replace("%", "")) || 0
              : 0;

            return {
              provincia,
              distrito,
              operation: op.name,
              percentage,
              total,
            };
          });

          // Incluir todas las filas, incluso si percentage y total son 0
          return result;
        });

      if (processedData.length === 0) {
        throw new Error(
          "No se encontraron datos válidos en el archivo. Verifique que el archivo contenga valores válidos para PROVINCIA, DISTRITO, TOTAL y al menos un AVANCE OP."
        );
      }

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
      const result = await deleteAvanceData(selectedDeleteObjective);
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

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6">
      <Card className="shadow-lg max-w-7xl w-full">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold">
            Objetivos prioritarios
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Sube o elimina datos de avances para actualizar la base de datos
          </p>
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
          <Alert
            variant="default"
            className="border-blue-200 bg-blue-50 dark:bg-blue-900/20"
          >
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <AlertTitle className="text-lg font-semibold text-blue-800 dark:text-blue-200">
              Recomendaciones para el archivo Excel
            </AlertTitle>
            <AlertDescription className="text-blue-700 dark:text-blue-300">
              <p className="mb-2">
                Para garantizar un procesamiento correcto del archivo:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  Evite tildes (á, é, í, ó, ú) y la letra ñ, ya que pueden
                  generar caracteres incorrectos.
                </li>
                <li>
                  Utilice los nombres correctos de provincias y distritos según
                  esta lista:
                </li>
                <ul className="list-[circle] pl-6 mt-1 space-y-1">
                  <li>Huamanga - Ayacucho (no Huamanga - Huamanga)</li>
                  <li>La Mar - San Miguel (no La Mar - La Mar)</li>
                  <li>Lucanas - Huachuas (no Lucanas - Huac-Huas)</li>
                  <li>
                    Parinacochas - Coracora (no Parinacochas - Parinacochas)
                  </li>
                  <li>Sucre - Querobamba (no Sucre - Sucre)</li>
                  <li>Victor Fajardo - Huaya (no Victor Fajardo - Hualla)</li>
                  <li>
                    Victor Fajardo - Huancapi (no Victor Fajardo - Victor
                    Fajardo)
                  </li>
                </ul>
              </ul>
            </AlertDescription>
          </Alert>
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
