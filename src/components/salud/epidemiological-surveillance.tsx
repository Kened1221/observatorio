/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
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
import { deleteData, getAvailableYears } from "@/actions/salud-nutricion-actions";

interface Message {
    type: "success" | "error";
    text: string;
}

const DATABASE_OPTIONS = [
    { value: "poblacionCursoVida", label: "Paquetes Niño" },
    { value: "ninosAnemia", label: "Paquetes Adolescentes" },
    { value: "ninosNutricion", label: "Paquetes Gestante" },
    { value: "ninosDengue", label: "Paquetes Adulto Mayor" },
];

export default function ContainerEpidemiological() {
    const [database, setDatabase] = useState<string>("");
    const [selectedYear, setSelectedYear] = useState<string>("");
    const [availableYears, setAvailableYears] = useState<number[]>([]);
    const [deleting, setDeleting] = useState(false);
    const [message, setMessage] = useState<Message | null>(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    useEffect(() => {
        const fetchYears = async () => {
            if (!database) return;
            const years = await getAvailableYears(database);
            setAvailableYears(years);
            if (years.length > 0) {
                setSelectedYear(years[0].toString());
            } else {
                setSelectedYear("");
            }
        };
        fetchYears();
    }, [database]);

    const handleOpenDeleteConfirmation = () => {
        if (database && selectedYear) {
            setShowDeleteConfirmation(true);
        }
    };

    const handleCloseDeleteConfirmation = () => {
        setShowDeleteConfirmation(false);
    };

    const handleDelete = async () => {
        if (!database || !selectedYear) return;

        setDeleting(true);
        setMessage(null);
        setShowDeleteConfirmation(false);

        try {
            const result = await deleteData(database, parseInt(selectedYear));
            if (result.success) {
                setMessage({
                    type: "success",
                    text: result.message || `Datos del año ${selectedYear} eliminados exitosamente de ${database}`,
                });
                const years = await getAvailableYears(database);
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
        <Card className="shadow-lg w-full mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl sm:text-3xl font-semibold">
                    Panel de subidos en Cobertura de Calidad
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                    Selecciona una base de datos y un año para eliminar los datos
                </p>
            </CardHeader>
            <CardContent className="space-y-6 p-4 sm:p-6">
                <div className="space-y-4">
                    <Select
                        value={database}
                        onValueChange={setDatabase}
                        disabled={deleting}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecciona una base de datos" />
                        </SelectTrigger>
                        <SelectContent>
                            {DATABASE_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select
                        value={selectedYear}
                        onValueChange={setSelectedYear}
                        disabled={!database || deleting}
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
                        onClick={handleOpenDeleteConfirmation}
                        disabled={!database || !selectedYear || deleting}
                        variant="destructive"
                        className="w-full text-sm sm:text-base py-2 sm:py-3"
                    >
                        {deleting ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : null}
                        {deleting ? "Eliminando..." : "Eliminar Datos"}
                    </Button>
                </div>
                {message && (
                    <Alert variant={message.type === "error" ? "destructive" : "default"}>
                        <AlertTitle>
                            {message.type === "error" ? "Error" : "Éxito"}
                        </AlertTitle>
                        <AlertDescription>{message

                            .text}</AlertDescription>
                    </Alert>
                )}
                <ConfirmDialog
                    isOpen={showDeleteConfirmation}
                    onClose={handleCloseDeleteConfirmation}
                    onConfirm={handleDelete}
                    title="¿Estás seguro de eliminar estos datos?"
                    description={`Los datos del año ${selectedYear} serán eliminados permanentemente de la base de datos ${database}.`}
                    styleButton="bg-red-600 hover:bg-red-700 text-white text-sm sm:text-base py-2 sm:py-3"
                />
            </CardContent>
        </Card>
    );
}