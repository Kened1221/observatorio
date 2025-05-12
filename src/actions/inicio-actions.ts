/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { prisma } from "@/config/prisma";

export async function getPoblacion(
  departamento: string,
  provincia: string = "",
  pAselect: string = "poblacion",
  distrito: string = "",
  rangoEdad: string = "",
  anio: number = new Date().getFullYear()
) {
  try {
    const whereClause: any = {
      anio: anio,
      ubicacion: {
        departamento: {
          nombre: departamento,
        },
      },
    };

    if (distrito !== "") {
      whereClause.ubicacion.distrito = {
        nombre: distrito,
      };
    } else if (provincia !== "") {
      whereClause.ubicacion.provincia = {
        nombre: provincia,
      };
    }

    if (rangoEdad !== "" && rangoEdad !== "Todos") {
      whereClause.edadIntervalo = {
        intervalo: rangoEdad,
      };
    }

    let result;
    if (pAselect === "ambito") {
      const rural = await prisma.poblacion.aggregate({
        _sum: {
          cantidad: true,
        },
        where: {
          ...whereClause,
          ambitoId: 1,
        },
      });

      const urbano = await prisma.poblacion.aggregate({
        _sum: {
          cantidad: true,
        },
        where: {
          ...whereClause,
          ambitoId: 2,
        },
      });

      result = {
        rural: rural._sum.cantidad || 0,
        urbano: urbano._sum.cantidad || 0,
        total: (rural._sum.cantidad || 0) + (urbano._sum.cantidad || 0),
      };
    } else {
      const hombres = await prisma.poblacion.aggregate({
        _sum: {
          cantidad: true,
        },
        where: {
          ...whereClause,
          generoId: 1,
        },
      });

      const mujeres = await prisma.poblacion.aggregate({
        _sum: {
          cantidad: true,
        },
        where: {
          ...whereClause,
          generoId: 2,
        },
      });

      result = {
        hombres: hombres._sum.cantidad || 0,
        mujeres: mujeres._sum.cantidad || 0,
        total: (hombres._sum.cantidad || 0) + (mujeres._sum.cantidad || 0),
      };
    }

    return result;
  } catch (error: any) {
    console.error("Error al obtener datos de población:", error);
    return {
      hombres: 0,
      mujeres: 0,
      rural: 0,
      urbano: 0,
      total: 0,
    };
  }
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

export async function getAvailableYears() {
  try {
    const years = await prisma.poblacion.findMany({
      select: {
        anio: true,
      },
      distinct: ["anio"],
      orderBy: {
        anio: "desc",
      },
    });

    return years.map((item) => item.anio);
  } catch (error: any) {
    console.error("Error al obtener años disponibles:", error);
    return [];
  }
}

export async function downloadPoblacionData(anio: number) {
  try {
    const poblacionData = await prisma.poblacion.findMany({
      where: {
        anio,
      },
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

    if (poblacionData.length === 0) {
      return {
        success: false,
        error: `No hay datos de población para el año ${anio}`,
      };
    }

    const formattedData = poblacionData.map((record) => ({
      anio: record.anio,
      departamento: record.ubicacion.departamento.nombre,
      provincia: record.ubicacion.provincia?.nombre || "",
      distrito: record.ubicacion.distrito?.nombre || "",
      genero: record.genero.nombre,
      ambito: record.ambito.nombre,
      edadIntervalo: record.edadIntervalo.intervalo,
      cantidad: record.cantidad,
    }));

    return {
      success: true,
      data: formattedData,
    };
  } catch (error: any) {
    console.error("Error al obtener datos para descarga:", error);
    return {
      success: false,
      error: "No se pudo obtener los datos para la descarga",
    };
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