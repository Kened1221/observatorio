/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { prisma } from "@/lib/prisma";

export async function uploadAnemiaData(data: any[]) {
    try {
        // Validar que los datos no estén vacíos
        if (!Array.isArray(data) || data.length === 0) {
            return { success: false, error: "No se proporcionaron datos válidos" };
        }

        // Obtener el año del primer registro
        const anio = data[0].ANIO;
        if (!Number.isInteger(anio)) {
            return {
                success: false,
                error: "El campo 'ANIO' no es válido en los datos del Excel",
            };
        }

        // Validar que las ubicaciones existan
        const ubicacionIds = [...new Set(data.map((row) => row.UBICACION))];
        const ubicaciones = await prisma.ubicacion.findMany({
            where: { id: { in: ubicacionIds } },
            select: { id: true },
        });

        const validUbicacionIds = new Set(ubicaciones.map((u) => u.id));

        // Filtrar datos válidos
        const validData = data.filter((row) => {
            return (
                validUbicacionIds.has(row.UBICACION) &&
                Number.isInteger(row.ANIO) &&
                Number.isInteger(row["NUMERO DE CASOS"]) &&
                Number.isInteger(row.EVALUADOS) &&
                typeof row.PORCENTAJE === "number"
            );
        });

        if (validData.length === 0) {
            return { success: false, error: "Ningún dato válido para insertar" };
        }

        // Usar una transacción para eliminar registros existentes y agregar los nuevos
        await prisma.$transaction(async (tx) => {
            // Eliminar todos los registros con el mismo año
            await tx.ninosAnemia.deleteMany({
                where: {
                    anio: anio,
                },
            });

            // Insertar los nuevos datos
            await tx.ninosAnemia.createMany({
                data: validData.map((row) => ({
                    anio: row.ANIO,
                    ubicacionId: row.UBICACION,
                    numeroCasos: row["NUMERO DE CASOS"],
                    evaluados: row.EVALUADOS,
                    porcentaje: row.PORCENTAJE,
                })),
                skipDuplicates: true,
            });
        });

        return {
            success: true,
            message: `Datos del año ${anio} subidos exitosamente. Se reemplazaron ${validData.length} registros.`,
        };
    } catch (error: any) {
        console.error("Error al procesar los datos de anemia:", error);
        return {
            success: false,
            error: `Error al procesar los datos: ${error.message || "Error desconocido"}`,
        };
    }
}