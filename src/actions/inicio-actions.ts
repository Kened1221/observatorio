/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { prisma } from "@/lib/prisma";


export interface PoAmProps {
  masculino?: number;
  femenino?: number;
  rural?: number;
  urbano?: number;
  total: number;
}

export async function getMap(anio: number) {
  try {
    const distritos = await prisma.distrito.findMany({
      where: {
        provincia: {
          departamento: {
            nombre: "AYACUCHO",
          },
        },
      },
      include: {
        provincia: {
          select: {
            nombre: true,
          },
        },
      },
    });

    const result = await Promise.all(
      distritos.map(async (distrito) => {
        const whereClause: any = {
          anio: anio,
          ubicacion: {
            distrito: {
              id: distrito.id,
            },
            departamento: {
              nombre: "AYACUCHO",
            },
          },
        };

        const poblacion = await prisma.poblacion.aggregate({
          _sum: {
            cantidad: true,
          },
          where: {
            ...whereClause,
            generoId: { in: [1, 2] },
          },
        });

        const puntuacion = poblacion._sum.cantidad || 0;

        return {
          departamento: "AYACUCHO",
          provincia: distrito.provincia.nombre,
          distrito: distrito.nombre,
          puntuacion: puntuacion,
        };
      })
    );

    return result;
  } catch (error: any) {
    console.error("Error al obtener datos del mapa:", error);
    return [];
  }
}

export async function deleteOrResetPoblacionData(anio: number, mode: "delete" | "reset") {
  try {
    if (mode === "delete") {
      const deleteResult = await prisma.poblacion.deleteMany({
        where: {
          anio,
        },
      });

      if (deleteResult.count === 0) {
        return {
          success: false,
          error: `No hay datos de población para el año ${anio} para eliminar`,
        };
      }

      return {
        success: true,
        message: `Datos del año ${anio} eliminados exitosamente`,
      };
    } else {
      const updateResult = await prisma.poblacion.updateMany({
        where: {
          anio,
        },
        data: {
          cantidad: 0,
        },
      });

      if (updateResult.count === 0) {
        return {
          success: false,
          error: `No hay datos de población para el año ${anio} para actualizar`,
        };
      }

      return {
        success: true,
        message: `Datos del año ${anio} restablecidos a 0 exitosamente`,
      };
    }
  } catch (error: any) {
    console.error(`Error al ${mode === "delete" ? "eliminar" : "restablecer"} datos:`, error);
    return {
      success: false,
      error: `No se pudo ${mode === "delete" ? "eliminar" : "restablecer"} los datos`,
    };
  }
}


export async function getAvailableYears() {
  const years = await prisma.poblacion.groupBy({
    by: ["anio"],
    orderBy: {
      anio: "desc",
    },
  });
  return years.map((y) => y.anio);
}

export async function getProvincias(departamento: string) {
  const provs = await prisma.provincia.findMany({
    where: { departamento: { nombre: departamento } },
    select: { id: true, nombre: true },
    orderBy: { nombre: "asc" },
  });
  return provs;
}

export async function getDistritos(provinciaNombre: string) {
  const dists = await prisma.distrito.findMany({
    where: { provincia: { nombre: provinciaNombre } },
    select: { id: true, nombre: true },
    orderBy: { nombre: "asc" },
  });
  return dists;
}

export async function getPoblacion(
  departamento: string,
  provincia: string,
  pAselect: string,
  distrito: string,
  rangoEdad: string,
  anio: number
) {
  const baseQuery = {
    where: {
      anio: anio,
      ubicacion: {
        departamento: { nombre: departamento },
        ...(provincia && { provincia: { nombre: provincia } }),
        ...(distrito && { distrito: { nombre: distrito } }),
      },
      ...(rangoEdad !== "Todos" && { edadIntervalo: { intervalo: rangoEdad } }),
    },
    include: {
      genero: true,
      ambito: true,
      edadIntervalo: true,
    },
  };

  const poblacionData = await prisma.poblacion.findMany(baseQuery);

  const result: PoAmProps = {
    masculino: 0,
    femenino: 0,
    rural: 0,
    urbano: 0,
    total: 0,
  };

  poblacionData.forEach((p) => {
    result.total += p.cantidad;

    if (pAselect === "poblacion") {
      if (p.genero?.nombre === "masculino") result.masculino! += p.cantidad;
      if (p.genero?.nombre === "femenino") result.femenino! += p.cantidad;
    } else {
      if (p.ambito?.nombre === "rural") result.rural! += p.cantidad;
      if (p.ambito?.nombre === "urbano") result.urbano! += p.cantidad;
    }
  });

  return result;
}

export async function downloadPoblacionData(anio: number) {
  const data = await prisma.poblacion.findMany({
    where: { anio: anio },
    include: {
      ubicacion: {
        include: {
          departamento: true,
          provincia: true,
          distrito: true,
        },
      },
      genero: true,
      ambito: true,
      edadIntervalo: true,
    },
  });

  const formattedData = data.map((p) => ({
    ANIO: p.anio,
    UBIGEO_DISTRITAL: p.ubicacion.distrito.ubigeoDistrital || "N/A",
    DEPARTAMENTO: p.ubicacion.departamento.nombre,
    PROVINCIA: p.ubicacion.provincia.nombre,
    DISTRITO: p.ubicacion.distrito.nombre,
    GENERO: p.genero?.nombre || "N/A",
    AMBITO: p.ambito?.nombre || "N/A",
    "INTERVALO EDAD": p.edadIntervalo?.intervalo || "N/A",
    CANTIDAD: p.cantidad,
  }));

  return { success: true, data: formattedData };
}