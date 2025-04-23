/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { prisma } from "@/config/prisma";

export async function uploadPoblacionData(data: any[]) {
  try {
    // Validar que los datos no estén vacíos
    if (!Array.isArray(data) || data.length === 0) {
      return { success: false, error: "No se proporcionaron datos válidos" };
    }

    // Obtener el año del primer registro
    const anio = data[0].anio;
    if (!Number.isInteger(anio)) {
      return { success: false, error: "El campo 'anio' no es válido en los datos del Excel" };
    }

    // Validar que las relaciones existan
    const ubicacionIds = [...new Set(data.map((row) => row.ubicacionId))];
    const ambitoIds = [...new Set(data.map((row) => row.ambitoId))];
    const edadIntervaloIds = [...new Set(data.map((row) => row.edadIntervaloId))];
    const generoIds = [...new Set(data.map((row) => row.generoId))];

    const ubicaciones = await prisma.ubicacion.findMany({
      where: { id: { in: ubicacionIds } },
      select: { id: true },
    });
    const ambitos = await prisma.ambito.findMany({
      where: { id: { in: ambitoIds } },
      select: { id: true },
    });
    const edadIntervalos = await prisma.edadIntervalo.findMany({
      where: { id: { in: edadIntervaloIds } },
      select: { id: true },
    });
    const generos = await prisma.genero.findMany({
      where: { id: { in: generoIds } },
      select: { id: true },
    });

    const validUbicacionIds = new Set(ubicaciones.map((u) => u.id));
    const validAmbitoIds = new Set(ambitos.map((a) => a.id));
    const validEdadIntervaloIds = new Set(edadIntervalos.map((e) => e.id));
    const validGeneroIds = new Set(generos.map((g) => g.id));

    // Filtrar datos válidos
    const validData = data.filter((row) => {
      return (
        validUbicacionIds.has(row.ubicacionId) &&
        validAmbitoIds.has(row.ambitoId) &&
        validEdadIntervaloIds.has(row.edadIntervaloId) &&
        validGeneroIds.has(row.generoId) &&
        Number.isInteger(row.anio) &&
        Number.isInteger(row.cantidad)
      );
    });

    if (validData.length === 0) {
      return { success: false, error: "Ningún dato válido para insertar" };
    }

    // Usar una transacción para eliminar registros existentes y agregar los nuevos
    await prisma.$transaction(async (tx) => {
      // Eliminar todos los registros con el mismo año
      await tx.poblacion.deleteMany({
        where: {
          anio: anio,
        },
      });

      // Insertar los nuevos datos
      await tx.poblacion.createMany({
        data: validData.map((row) => ({
          anio: row.anio,
          cantidad: row.cantidad,
          ubicacionId: row.ubicacionId,
          ambitoId: row.ambitoId,
          edadIntervaloId: row.edadIntervaloId,
          generoId: row.generoId,
        })),
        skipDuplicates: true,
      });
    });

    return {
      success: true,
      message: `Datos del año ${anio} subidos exitosamente. Se reemplazaron ${validData.length} registros.`,
    };
  } catch (error: any) {
    console.error("Error al procesar los datos de población:", error);
    return {
      success: false,
      error: `Error al procesar los datos: ${error.message || "Error desconocido"}`,
    };
  }
}