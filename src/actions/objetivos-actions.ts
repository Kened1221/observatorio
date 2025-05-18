/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { prisma } from "@/config/prisma";
import { Session } from "next-auth";

export async function uploadAvanceData(data: any[]) {
  try {
    if (!Array.isArray(data) || data.length === 0) {
      return { success: false, error: "No se proporcionaron datos válidos" };
    }

    const distritosNombres = [...new Set(data.map((row) => row.distrito))];
    const distritos = await prisma.distrito.findMany({
      where: { nombre: { in: distritosNombres } },
      select: { id: true, nombre: true, provincia: { select: { nombre: true } } },
    });

    const validDistritoMap = new Map(distritos.map((d) => [d.nombre, { id: d.id, provinciaNombre: d.provincia.nombre }]));

    const validData = data.filter((row) => validDistritoMap.has(row.distrito));

    if (validData.length === 0) {
      return { success: false, error: "Ningún dato válido para insertar: distritos no encontrados" };
    }

    await prisma.$transaction(async (tx) => {
      await tx.avance.deleteMany({});
      await tx.avance.createMany({
        data: validData.map((row) => ({
          distritoId: validDistritoMap.get(row.distrito)!.id,
          operation: row.operation,
          percentage: row.percentage,
          total: row.total,
        })),
        skipDuplicates: true,
      });
    });

    return {
      success: true,
      message: `Datos subidos exitosamente. Se procesaron ${validData.length} registros.`,
    };
  } catch (error: any) {
    console.error("Error al procesar los datos de avance:", error);
    return { success: false, error: `Error al procesar los datos: ${error.message || "Error desconocido"}` };
  }
}

export async function getAvanceData(operation: string) {
  try {
    const avances = await prisma.avance.findMany({
      where: { operation },
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
      percentage: avance.percentage,
      total: avance.total ?? 0,
    }));
  } catch (error: any) {
    console.error("Error al obtener datos de avance:", error);
    return [];
  }
}

export async function getAvanceOperations() {
  try {
    const operations = await prisma.avance.findMany({
      select: { operation: true },
      distinct: ["operation"],
    });
    return operations.map((op) => op.operation).sort();
  } catch (error: any) {
    console.error("Error al obtener operaciones de avance:", error);
    return ["AVANCE OP 01", "AVANCE OP 02", "AVANCE OP 03", "AVANCE OP 04", "AVANCE OP 05"];
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