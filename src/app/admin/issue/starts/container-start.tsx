/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { downloadPoblacionData, getAvailableYears, deleteOrResetPoblacionData } from "@/actions/inicio-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmDialog } from "@/components/ui/dialog-confirm";

interface Message {
  type: "success" | "error";
  text: string;
}

export default function ContainerStart() {
  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

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
        const blob = new Blob([excelBuffer], {
          type: "application/octet-stream",
        });
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

  const handleOpenDeleteConfirmation = () => {
    if (selectedYear) {
      setShowDeleteConfirmation(true);
    }
  };

  const handleCloseDeleteConfirmation = () => {
    setShowDeleteConfirmation(false);
  };

  const handleDeleteOrReset = async () => {
    if (!selectedYear) return;

    setDeleting(true);
    setMessage(null);
    setShowDeleteConfirmation(false);

    try {
      const result = await deleteOrResetPoblacionData(parseInt(selectedYear), "delete");

      if (result.success) {
        setMessage({
          type: "success",
          text: result.message || `Datos del año ${selectedYear} eliminados exitosamente`,
        });
        const years = await getAvailableYears();
        setAvailableYears(years);
        setSelectedYear(years.length > 0 ? years[0].toString() : "");
      } else {
        setMessage({
          type: "error",
          text: result.error || "No se pudo eliminar los datos",
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
    <Card className="shadow-lg max-w-7xl w-full">
      <CardHeader>
        <CardTitle className="text-3xl font-semibold">
          Panel de Control
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Aquí puedes descargar o eliminar datos de la población
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Select
            value={selectedYear}
            onValueChange={setSelectedYear}
            disabled={downloading || deleting}
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
          <div className="flex space-x-4">
            <Button
              onClick={handleDownload}
              disabled={!selectedYear || downloading || deleting}
              className="w-full"
            >
              {downloading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {downloading ? "Descargando..." : "Descargar Excel"}
            </Button>
            <Button
              onClick={handleOpenDeleteConfirmation}
              disabled={!selectedYear || downloading || deleting}
              variant="destructive"
              className="w-full"
            >
              {deleting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {deleting ? "Eliminando..." : "Eliminar Año"}
            </Button>
          </div>
        </div>
        {message && (
          <Alert variant={message.type === "error" ? "destructive" : "default"}>
            <AlertTitle>{message.type === "error" ? "Error" : "Éxito"}</AlertTitle>
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}
        <ConfirmDialog
          isOpen={showDeleteConfirmation}
          onClose={handleCloseDeleteConfirmation}
          onConfirm={handleDeleteOrReset}
          title="¿Estás seguro de eliminar este año?"
          description={`Los datos de población para el año ${selectedYear} serán eliminados permanentemente de la base de datos.`}
          styleButton="bg-red-600 hover:bg-red-700 text-white"
        />
      </CardContent>
    </Card>
  );
}