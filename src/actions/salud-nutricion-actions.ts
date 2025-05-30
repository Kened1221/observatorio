/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { prisma } from "@/lib/prisma";

type ModelName = 'ninosNutricion' | 'ninosAnemia' | 'ninosDengue' | 'poblacionCursoVida';

async function validateAndUploadData(data: any[], model: ModelName, successMessage: string) {
  try {
    if (!Array.isArray(data) || data.length === 0) return { success: false, error: "No se proporcionaron datos válidos" };

    const anio = data[0]?.ANIO;
    if (!Number.isInteger(anio)) return { success: false, error: "El campo 'ANIO' no es válido en los datos del Excel" };

    const ubicacionIds = [...new Set(data.map((row: any) => row.UBICACION))];
    const ubicaciones = await prisma.ubicacion.findMany({ where: { id: { in: ubicacionIds } }, select: { id: true } });
    const validUbicacionIds = new Set(ubicaciones.map(u => u.id));

    const validData = data.filter((row: any) =>
      validUbicacionIds.has(row.UBICACION) &&
      Number.isInteger(row.ANIO) &&
      Number.isInteger(row["NUMERO DE CASOS"]) &&
      Number.isInteger(row.EVALUADOS) &&
      typeof row.PORCENTAJE === "number"
    );

    if (validData.length === 0) return { success: false, error: "Ningún dato válido para insertar" };

    const modelActions = {
      ninosNutricion: {
        delete: (tx: any, anio: number) => tx.ninosNutricion.deleteMany({ where: { anio } }),
        create: (tx: any, data: any[]) => tx.ninosNutricion.createMany({ data, skipDuplicates: true }),
      },
      ninosAnemia: {
        delete: (tx: any, anio: number) => tx.ninosAnemia.deleteMany({ where: { anio } }),
        create: (tx: any, data: any[]) => tx.ninosAnemia.createMany({ data, skipDuplicates: true }),
      },
      ninosDengue: {
        delete: (tx: any, anio: number) => tx.ninosDengue.deleteMany({ where: { anio } }),
        create: (tx: any, data: any[]) => tx.ninosDengue.createMany({ data, skipDuplicates: true }),
      },
      poblacionCursoVida: {
        delete: (tx: any, anio: number) => tx.poblacionCursoVida.deleteMany({ where: { anio } }),
        create: (tx: any, data: any[]) => tx.poblacionCursoVida.createMany({ data, skipDuplicates: true }),
      },
    };

    await prisma.$transaction(async (tx) => {
      const actions = modelActions[model];
      await actions.delete(tx, anio);
      await actions.create(tx, validData.map((row: any) => ({
        anio: row.ANIO,
        ubicacionId: row.UBICACION,
        numeroCasos: row["NUMERO DE CASOS"],
        evaluados: row.EVALUADOS,
        porcentaje: row.PORCENTAJE,
      })));
    });

    return { success: true, message: `Datos del año ${anio} subidos exitosamente. Se reemplazaron ${validData.length} registros para ${successMessage}.` };
  } catch (error: any) {
    console.error(`Error al procesar los datos de ${model}:`, error);
    return { success: false, error: `Error al procesar los datos: ${error.message || "Error desconocido"}` };
  }
}

export async function uploadPoblacionData(data: any[]) {
  return validateAndUploadData(data, "poblacionCursoVida", "Población por Curso de Vida");
}

export async function uploadAnemiaData(data: any[]) {
  return validateAndUploadData(data, "ninosAnemia", "Anemia");
}

export async function uploadDesnutricionData(data: any[]) {
  return validateAndUploadData(data, "ninosNutricion", "Desnutrición");
}

export async function uploadDengueData(data: any[]) {
  return validateAndUploadData(data, "ninosDengue", "Dengue");
}