/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { prisma } from "@/lib/prisma";
import * as XLSX from "xlsx";

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


export async function getAvailableYears(database: string): Promise<number[]> {
  try {
    let years: number[] = [];
    switch (database) {
      case "poblacionCursoVida":
        years = await prisma.poblacionCursoVida.findMany({
          select: { anio: true },
          distinct: ["anio"],
          orderBy: { anio: "desc" },
        }).then((results) => results.map((r) => r.anio));
        break;
      case "ninosAnemia":
        years = await prisma.ninosAnemia.findMany({
          select: { anio: true },
          distinct: ["anio"],
          orderBy: { anio: "desc" },
        }).then((results) => results.map((r) => r.anio));
        break;
      case "ninosNutricion":
        years = await prisma.ninosNutricion.findMany({
          select: { anio: true },
          distinct: ["anio"],
          orderBy: { anio: "desc" },
        }).then((results) => results.map((r) => r.anio));
        break;
      case "ninosDengue":
        years = await prisma.ninosDengue.findMany({
          select: { anio: true },
          distinct: ["anio"],
          orderBy: { anio: "desc" },
        }).then((results) => results.map((r) => r.anio));
        break;
      default:
        throw new Error("Base de datos no válida");
    }
    return years;
  } catch (error: any) {
    console.error("Error al obtener años disponibles:", error);
    throw new Error("No se pudieron obtener los años disponibles");
  }
}

export async function deleteData(database: string, anio: number) {
  try {
    switch (database) {
      case "poblacionCursoVida":
        await prisma.poblacionCursoVida.deleteMany({
          where: { anio },
        });
        break;
      case "ninosAnemia":
        await prisma.ninosAnemia.deleteMany({
          where: { anio },
        });
        break;
      case "ninosNutricion":
        await prisma.ninosNutricion.deleteMany({
          where: { anio },
        });
        break;
      case "ninosDengue":
        await prisma.ninosDengue.deleteMany({
          where: { anio },
        });
        break;
      default:
        throw new Error("Base de datos no válida");
    }
    return {
      success: true,
      message: `Datos del año ${anio} eliminados de ${database}`,
    };
  } catch (error: any) {
    console.error("Error al eliminar los datos:", error);
    return {
      success: false,
      error: error.message || "No se pudo eliminar los datos",
    };
  }
}


export async function downloadEpidemiologicalTemplate() {
  try {
    const ubicaciones = await prisma.ubicacion.findMany({
      orderBy: { id: "asc" },
    });

    if (ubicaciones.length === 0) {
      throw new Error("No se encontraron datos de ubicaciones");
    }

    const templateData = [];
    templateData.push({
      ANIO: "ANIO",
      UBICACION: "UBICACION",
      "NUMERO DE CASOS": "NUMERO DE CASOS",
      EVALUADOS: "EVALUADOS",
      PORCENTAJE: "PORCENTAJE",
    });

    const currentYear = new Date().getFullYear() + 1;

    for (const ubicacion of ubicaciones) {
      templateData.push({
        ANIO: currentYear,
        UBICACION: ubicacion.id,
        "NUMERO DE CASOS": 0,
        EVALUADOS: 0,
        PORCENTAJE: "0.0%",
      });
    }

    const worksheet = XLSX.utils.json_to_sheet(templateData, {
      skipHeader: true,
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Vigilancia_Epidemiologica");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    return excelBuffer;
  } catch (error: any) {
    console.error("Error al generar la plantilla:", error);
    throw new Error(
      `Error al generar la plantilla: ${error.message || "Error desconocido"}`
    );
  }
}

export async function getEpidemiologicalData(
  category: "poblacion_curso_vida" | "anemia" | "desnutricion" | "dengue",
  provincia: string,
  distrito: string
) {
  try {
    let query: any = {};
    if (provincia) query.ubicacion = { provincia: { nombre: provincia } };
    if (distrito) query.ubicacion = { ...query.ubicacion, distrito: { nombre: distrito } };

    let data;
    switch (category) {
      case "poblacion_curso_vida":
        data = await prisma.poblacionCursoVida.findMany({
          where: query,
          include: { ubicacion: { include: { provincia: true, distrito: true } } },
        });
        break;
      case "anemia":
        data = await prisma.ninosAnemia.findMany({
          where: query,
          include: { ubicacion: { include: { provincia: true, distrito: true } } },
        });
        break;
      case "desnutricion":
        data = await prisma.ninosNutricion.findMany({
          where: query,
          include: { ubicacion: { include: { provincia: true, distrito: true } } },
        });
        break;
      case "dengue":
        data = await prisma.ninosDengue.findMany({
          where: query,
          include: { ubicacion: { include: { provincia: true, distrito: true } } },
        });
        break;
      default:
        throw new Error("Categoría no válida");
    }
    return data;
  } catch (error: any) {
    console.error("Error al obtener datos epidemiológicos:", error);
    throw new Error("No se pudieron obtener los datos");
  }
}