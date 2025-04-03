/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { prisma } from "@/config/prisma";

export async function getPoblacion(
  departamento: string,
  provincia: string = "",
  pAselect: string = "poblacion",
  distrito: string = "",
  rangoEdad: string = ""
) {
  // Construir el filtro where dinámicamente
  const whereClause: any = {
    ubicacion: {
      departamento: {
        nombre: departamento, // Siempre filtramos por departamento
      },
    },
  };

  // Filtro por distrito si no está vacío
  if (distrito !== "") {
    whereClause.ubicacion.distrito = {
      nombre: distrito,
    };
  }
  // Filtro por provincia si distrito está vacío y provincia no
  else if (provincia !== "") {
    whereClause.ubicacion.provincia = {
      nombre: provincia,
    };
  }

  // Filtro por rango de edad solo si rangoEdad no está vacío y no es "Todos"
  if (rangoEdad !== "" && rangoEdad !== "Todos") {
    whereClause.edadIntervalo = {
      intervalo: rangoEdad,
    };
  }

  // Determinar qué tabla consultar según pAselect
  let result;
  if (pAselect === "ambito") {
    // Consulta para ámbito (rural y urbano)
    const rural = await prisma.poblacion.aggregate({
      _sum: {
        cantidad: true,
      },
      where: {
        ...whereClause,
        ambitoId: 1, // Asumiendo 1 = rural
      },
    });

    const urbano = await prisma.poblacion.aggregate({
      _sum: {
        cantidad: true,
      },
      where: {
        ...whereClause,
        ambitoId: 2, // Asumiendo 2 = urbano
      },
    });

    result = {
      rural: rural._sum.cantidad || 0,
      urbano: urbano._sum.cantidad || 0,
      total: (rural._sum.cantidad || 0) + (urbano._sum.cantidad || 0),
    };
  } else {
    // Por defecto o si pAselect es "poblacion"
    const hombres = await prisma.poblacion.aggregate({
      _sum: {
        cantidad: true,
      },
      where: {
        ...whereClause,
        generoId: 1, // Asumiendo 1 = hombres
      },
    });

    const mujeres = await prisma.poblacion.aggregate({
      _sum: {
        cantidad: true,
      },
      where: {
        ...whereClause,
        generoId: 2, // Asumiendo 2 = mujeres
      },
    });

    result = {
      hombres: hombres._sum.cantidad || 0,
      mujeres: mujeres._sum.cantidad || 0,
      total: (hombres._sum.cantidad || 0) + (mujeres._sum.cantidad || 0),
    };
  }

  return result;
}

export async function getMap() {
  // Obtener todos los distritos de Ayacucho con sus provincias
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

  // Construir el resultado con la puntuación para cada distrito
  const result = await Promise.all(
    distritos.map(async (distrito) => {
      const whereClause: any = {
        ubicacion: {
          distrito: {
            id: distrito.id, // Filtrar por el ID del distrito
          },
          departamento: {
            nombre: "AYACUCHO",
          },
        },
      };

      // Calcular la puntuación como la suma total de población (hombres + mujeres)
      const poblacion = await prisma.poblacion.aggregate({
        _sum: {
          cantidad: true,
        },
        where: {
          ...whereClause,
          generoId: { in: [1, 2] }, // Incluye ambos géneros (1 = hombres, 2 = mujeres)
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
}
