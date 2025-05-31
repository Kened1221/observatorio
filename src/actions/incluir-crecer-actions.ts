/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { Prisma } from "@prisma/client";
import * as XLSX from "xlsx";
import { prisma } from "@/lib/prisma";

export async function uploadAvanceData(data: any[], objetivo: string) {
  try {
    if (!Array.isArray(data) || data.length === 0) {
      return { success: false, error: "No se proporcionaron datos válidos" };
    }

    const validData = data.filter(
      (row) =>
        row.anio &&
        row.ubicacionId > 0 &&
        typeof row.total === "number" &&
        Array.isArray(row.avancesOps) &&
        row.avancesOps.length > 0 &&
        row.avancesOps.every((op: any) => op.operation && typeof op.percentage === "number")
    );

    if (validData.length === 0) {
      return {
        success: false,
        error: "Ningún dato válido para insertar: datos incompletos o inválidos",
      };
    }

    const ubicacionIds = [...new Set(validData.map((row: any) => row.ubicacionId))];
    const ubicacionesCount = await prisma.ubicacion.count({
      where: { id: { in: ubicacionIds } },
    });

    if (ubicacionesCount !== ubicacionIds.length) {
      const existingUbicaciones = await prisma.ubicacion.findMany({
        where: { id: { in: ubicacionIds } },
        select: { id: true },
      });
      const existingIds = existingUbicaciones.map((u) => u.id);
      const missingIds = ubicacionIds.filter((id: number) => !existingIds.includes(id));
      return {
        success: false,
        error: `Ubicaciones no encontradas: ${missingIds.join(", ")}`,
      };
    }

    await prisma.$transaction(async (tx) => {
      for (const row of validData) {
        await tx.avance.deleteMany({
          where: {
            anio: row.anio,
            ubicacionId: row.ubicacionId,
            objetive: objetivo,
          },
        });

        await tx.avance.create({
          data: {
            anio: row.anio,
            ubicacionId: row.ubicacionId,
            total: Math.max(0, Math.min(100, row.total)),
            objetive: objetivo,
            detalles: {
              create: row.avancesOps.map((op: any) => ({
                operacion: op.operation,
                porcentaje: Math.max(0, Math.min(100, op.percentage)),
              })),
            },
          },
        });
      }
    });

    return {
      success: true,
      message: `Datos subidos exitosamente para el ${objetivo} con ${validData.length} registros procesados.`,
    };
  } catch (error: any) {
    console.error("Error al procesar los datos de avance:", error);
    let errorMessage = "Error al procesar los datos";
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        errorMessage = "Error: Datos duplicados para el mismo año, ubicación y objetivo";
      } else if (error.code === "P2003") {
        errorMessage = "Error: Ubicación no encontrada";
      }
    }
    return {
      success: false,
      error: `${errorMessage}: ${error.message || "Error desconocido"}`,
    };
  }
}

export async function deleteAvanceData(anios: number[], objetivo: string) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const whereClause: any = { objetive: objetivo };
      if (anios.length > 0) {
        whereClause.anio = { in: anios };
      }
      const deleted = await tx.avance.deleteMany({
        where: whereClause,
      });
      return deleted.count;
    });

    return {
      success: true,
      message:
        result > 0
          ? `Se eliminaron ${result} registros para ${objetivo} exitosamente.`
          : `No se encontraron datos para eliminar para ${objetivo}.`,
    };
  } catch (error: any) {
    console.error("Error al eliminar los datos de avance:", error);
    return {
      success: false,
      error: `Error al eliminar los datos: ${error.message || "Error desconocido"}`,
    };
  }
}

export async function downloadAvanceTemplate() {
  try {
    const ubicaciones = await prisma.ubicacion.findMany({
      orderBy: { id: "asc" },
      include: { distrito: true },
    });

    if (ubicaciones.length === 0) {
      throw new Error("No se encontraron ubicaciones en la base de datos");
    }

    const currentYear = new Date().getFullYear();
    const templateData = [
      ...ubicaciones.map((ubicacion) => ({
        ANIO: currentYear,
        UBIGEO_DISTRITAL: ubicacion.distrito.ubigeoDistrital,
        UBICACION: ubicacion.id,
        "AVANCE OP 01": "0%",
        TOTAL: "0%",
      })),
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Avances");

    return XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
  } catch (error: any) {
    console.error("Error al generar plantilla:", error);
    throw new Error(
      `Error al generar plantilla: ${error.message || "Error desconocido"}`
    );
  }
}

export async function getAvanceAverages(provincia?: string, distrito?: string) {
  try {
    const whereClause: Prisma.AvanceWhereInput = {
      objetive: {
        in: ["objetivo 1", "objetivo 2", "objetivo 3", "objetivo 4", "objetivo 5"],
      },
    };

    if (provincia) {
      whereClause.ubicacion = {
        provincia: {
          nombre: {
            equals: provincia.toUpperCase(),
            mode: "insensitive",
          },
        },
      };

      if (distrito) {
        whereClause.ubicacion.distrito = {
          nombre: {
            equals: distrito.toUpperCase(),
            mode: "insensitive",
          },
        };
      }
    }

    const avances = await prisma.avance.findMany({
      where: whereClause,
      select: {
        objetive: true,
        total: true,
        ubicacionId: true,
        ubicacion: {
          select: {
            provincia: { select: { nombre: true } },
            distrito: { select: { nombre: true } },
          },
        },
      },
    });

    const dataByLocation: Record<
      number,
      { objetivo: string; total: number | null; provincia: string; distrito: string }[]
    > = {};

    avances.forEach((avance) => {
      if (!dataByLocation[avance.ubicacionId]) {
        dataByLocation[avance.ubicacionId] = [];
      }
      dataByLocation[avance.ubicacionId].push({
        objetivo: avance.objetive,
        total: avance.total,
        provincia: avance.ubicacion.provincia.nombre,
        distrito: avance.ubicacion.distrito.nombre,
      });
    });

    const result = Object.entries(dataByLocation).flatMap(([ubicacionId, items]) => {

      const locationData = items[0];

      return ["objetivo 1", "objetivo 2", "objetivo 3", "objetivo 4", "objetivo 5"].map((objetivo) => {

        const objetivoData = items.find(item => item.objetivo === objetivo);

        return {
          ubicacionId: Number(ubicacionId),
          objetivo,
          provincia: locationData.provincia,
          distrito: locationData.distrito,
          total: objetivoData ? objetivoData.total : null
        };
      });
    });

    return result;

  } catch (error: any) {
    console.error("Error fetching avance averages:", error);
    throw new Error(`Error al obtener datos: ${error.message || "Error desconocido"}`);
  }
}