/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { Session } from "next-auth";
import { Prisma } from "@prisma/client";
import * as XLSX from "xlsx";
import { prisma } from "@/lib/prisma";

export async function uploadAvanceData(data: any[], objetivo: string) {
  try {
    if (!Array.isArray(data) || data.length === 0) {
      return { success: false, error: "No se proporcionaron datos válidos" };
    }

    // Normalize and validate input data
    const distritosNombres = [
      ...new Set(data.map((row) => row.distrito?.toUpperCase())),
    ].filter(Boolean);
    if (!distritosNombres.length) {
      return {
        success: false,
        error: "No se encontraron distritos válidos en los datos",
      };
    }

    // Fetch distritos in a single query
    const distritos = await prisma.distrito.findMany({
      where: { nombre: { in: distritosNombres } },
      select: {
        id: true,
        nombre: true,
        provincia: { select: { nombre: true } },
      },
    });

    const validDistritoMap = new Map(
      distritos.map((d) => [
        d.nombre.toUpperCase(),
        { id: d.id, provinciaNombre: d.provincia.nombre },
      ])
    );

    // Filter and normalize data
    const validData = data
      .filter(
        (row) =>
          row.distrito &&
          validDistritoMap.has(row.distrito.toUpperCase()) &&
          row.operation &&
          typeof row.percentage === "number" &&
          typeof row.total === "number"
      )
      .map((row) => ({
        ...row,
        distrito: row.distrito.toUpperCase(),
      }));

    if (validData.length === 0) {
      return {
        success: false,
        error:
          "Ningún dato válido para insertar: distritos no encontrados o datos incompletos",
      };
    }

    // Perform transaction
    await prisma.$transaction(async (tx) => {
      // Delete existing records for the objective
      await tx.avance.deleteMany({
        where: { objetive: objetivo },
      });

      // Insert new records
      await tx.avance.createMany({
        data: validData.map((row) => ({
          objetive: objetivo,
          distritoId: validDistritoMap.get(row.distrito)!.id,
          operation: row.operation,
          percentage: Math.max(0, Math.min(100, row.percentage)),
          total: Math.max(0, row.total),
        })),
      });
    });

    return {
      success: true,
      message: `Datos subidos exitosamente. Se procesaron ${validData.length} registros.`,
    };
  } catch (error: any) {
    console.error("Error al procesar los datos de avance:", error);
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        error:
          "Error: El archivo contiene datos duplicados para el mismo objetivo, distrito y operación. Cada combinación debe ser única.",
        details: error.message,
      };
    }
    return {
      success: false,
      error: `Error al procesar los datos: ${
        error.message || "Error desconocido"
      }`,
      details: error.stack || "No stack trace available",
    };
  }
}

export async function deleteAvanceData(objetivo: string) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const deleted = await tx.avance.deleteMany({
        where: { objetive: objetivo },
      });
      return deleted.count;
    });

    if (result === 0) {
      return {
        success: true,
        message: `No se encontraron datos para eliminar en ${objetivo}.`,
      };
    }

    return {
      success: true,
      message: `Se eliminaron ${result} registros de ${objetivo} exitosamente.`,
    };
  } catch (error: any) {
    console.error("Error al eliminar los datos de avance:", error);
    return {
      success: false,
      error: `Error al eliminar los datos: ${
        error.message || "Error desconocido"
      }`,
      details: error.stack || "No stack trace available",
    };
  }
}

export async function getAvanceData(operation: string, objetivo: string) {
  try {
    const avances = await prisma.avance.findMany({
      where: {
        operation,
        objetive: objetivo,
      },
      include: {
        distrito: {
          include: {
            provincia: {
              include: { departamento: true },
            },
          },
        },
      },
    });

    return avances.map((avance) => ({
      provincia: avance.distrito.provincia.nombre,
      distrito: avance.distrito.nombre,
      percentage: Number(avance.percentage) || 0,
      total: Number(avance.total) || 0,
    }));
  } catch (error: any) {
    console.error("Error al obtener datos de avance:", error);
    return [];
  }
}

export async function getAvanceOperations(objetivo: string) {
  try {
    const operations = await prisma.avance.findMany({
      where: { objetive: objetivo },
      select: { operation: true },
      distinct: ["operation"],
    });
    return operations.map((op) => op.operation).sort();
  } catch (error: any) {
    console.error("Error al obtener operaciones de avance:", error);
    return [];
  }
}

export async function getUserModules(session: Session): Promise<string[]> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        overriddenModule: true,
        role: {
          select: { defaultModule: true },
        },
      },
    });

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    return user.overriddenModule?.length > 0
      ? user.overriddenModule
      : user.role?.defaultModule ?? [];
  } catch (error: any) {
    console.error("Error al obtener módulos del usuario:", error);
    throw new Error("No se pudieron obtener los módulos");
  }
}

export async function downloadObjectiveTemplate() {
  try {
    const [departamentos, provincias, distritos] = await Promise.all([
      prisma.departamento.findMany({ orderBy: { nombre: "asc" } }),
      prisma.provincia.findMany({ orderBy: { nombre: "asc" } }),
      prisma.distrito.findMany({ orderBy: { nombre: "asc" } }),
    ]);

    if (
      departamentos.length === 0 ||
      provincias.length === 0 ||
      distritos.length === 0
    ) {
      throw new Error(
        "No se encontraron datos de referencia necesarios (departamentos, provincias o distritos)"
      );
    }

    const templateData = [];

    // Añadir fila vacía como primera fila
    templateData.push({
      PROVINCIA: "",
      DISTRITO: "",
      "AVANCE OP 01": "",
      TOTAL: "",
    });

    // Añadir encabezados en la segunda fila
    templateData.push({
      PROVINCIA: "PROVINCIA",
      DISTRITO: "DISTRITO",
      "AVANCE OP 01": "AVANCE OP 01",
      TOTAL: "TOTAL",
    });

    // Agrupar distritos por provincia
    for (const provincia of provincias) {
      const distritosProvincia = distritos.filter(
        (d) => d.provinciaId === provincia.id
      );

      for (const distrito of distritosProvincia) {
        templateData.push({
          PROVINCIA: provincia.nombre,
          DISTRITO: distrito.nombre,
          "AVANCE OP 01": "0%",
          TOTAL: "0%",
        });
      }
    }

    // Crear el libro de Excel
    const worksheet = XLSX.utils.json_to_sheet(templateData, {
      skipHeader: true,
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Objetivos");

    // Generar el buffer del Excel
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    return excelBuffer;
  } catch (error: any) {
    console.error("Error al generar la plantilla de objetivos:", error);
    throw new Error(
      `Error al generar la plantilla: ${error.message || "Error desconocido"}`
    );
  }
}
