/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { prisma } from "@/config/prisma";
import { Session } from "next-auth";
import { Prisma } from "@prisma/client";

export async function uploadAvanceData(data: any[], objetivo: string) {
  try {
    if (!Array.isArray(data) || data.length === 0) {
      return { success: false, error: "No se proporcionaron datos válidos" };
    }

    // Normalize and validate input data
    const distritosNombres = [...new Set(data.map((row) => row.distrito?.toUpperCase()))].filter(Boolean);
    if (!distritosNombres.length) {
      return { success: false, error: "No se encontraron distritos válidos en los datos" };
    }

    // Fetch distritos in a single query
    const distritos = await prisma.distrito.findMany({
      where: { nombre: { in: distritosNombres } },
      select: { id: true, nombre: true, provincia: { select: { nombre: true } } },
    });

    const validDistritoMap = new Map(
      distritos.map((d) => [d.nombre.toUpperCase(), { id: d.id, provinciaNombre: d.provincia.nombre }])
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
      return { success: false, error: "Ningún dato válido para insertar: distritos no encontrados o datos incompletos" };
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
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return {
        success: false,
        error:
          "Error: El archivo contiene datos duplicados para el mismo objetivo, distrito y operación. Cada combinación debe ser única.",
        details: error.message,
      };
    }
    return {
      success: false,
      error: `Error al procesar los datos: ${error.message || "Error desconocido"}`,
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

    return user.overriddenModule?.length > 0 ? user.overriddenModule : user.role?.defaultModule ?? [];
  } catch (error: any) {
    console.error("Error al obtener módulos del usuario:", error);
    throw new Error("No se pudieron obtener los módulos");
  }
}