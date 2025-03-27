/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { prisma } from "@/config/prisma";

export async function getData(
  departamento: string,
  provincia: string = "",
  pAselect: string = "poblacion", // "poblacion" o "ambito"
  distrito: string = "",
  rangoEdad: string = ""
) {
  console.log(
    "Filtros recibidos:",
    departamento,
    provincia,
    pAselect,
    distrito,
    rangoEdad
  );

  // Construir el filtro where dinámicamente
  const whereClause: any = {
    rango: {
      encuestas: {
        some: {
          departamento: {
            nombre: departamento, // Siempre filtramos por departamento (ej. "Ayacucho")
          },
        },
      },
    },
  };

  // Filtro por distrito si no está vacío
  if (distrito !== "") {
    whereClause.rango.encuestas.some.distrito = {
      nombre: distrito,
    };
  }
  // Filtro por provincia si distrito está vacío y provincia no
  else if (provincia !== "") {
    whereClause.rango.encuestas.some.provincia = {
      nombre: provincia,
    };
  }

  // Filtro por rango de edad si no está vacío
  if (rangoEdad !== "") {
    whereClause.rango.Edad = {
      edadIntervalo: rangoEdad,
    };
  }

  // Determinar qué tabla consultar según pAselect
  let result;
  if (pAselect === "ambito") {
    const ambito = await prisma.ambito.aggregate({
      _sum: {
        rural: true,
        urbano: true,
      },
      where: whereClause,
    });

    result = {
      rural: ambito._sum.rural || 0,
      urbano: ambito._sum.urbano || 0,
      total: (ambito._sum.rural || 0) + (ambito._sum.urbano || 0),
    };
  } else {
    // Por defecto o si pAselect es "poblacion"
    const poblacion = await prisma.poblacion.aggregate({
      _sum: {
        hombres: true,
        mujeres: true,
      },
      where: whereClause,
    });

    result = {
      hombres: poblacion._sum.hombres || 0,
      mujeres: poblacion._sum.mujeres || 0,
      total: (poblacion._sum.hombres || 0) + (poblacion._sum.mujeres || 0),
    };
  }

  return result;
}

export async function getMap(
  departamento: string = "Ayacucho",
  pAselect: string = "poblacion" // "poblacion" o "ambito"
) {
  console.log("Filtros recibidos:", departamento, pAselect);

  // Obtener todos los distritos de Ayacucho con sus provincias
  const distritos = await prisma.distrito.findMany({
    where: {
      provincia: {
        departamento: {
          nombre: departamento,
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
        rango: {
          encuestas: {
            some: {
              distrito: {
                id: distrito.id, // Filtrar por el ID del distrito
              },
              departamento: {
                nombre: departamento,
              },
            },
          },
        },
      };

      let puntuacion = 0;
      if (pAselect === "ambito") {
        const ambito = await prisma.ambito.aggregate({
          _sum: {
            rural: true,
            urbano: true,
          },
          where: whereClause,
        });
        puntuacion = (ambito._sum.rural || 0) + (ambito._sum.urbano || 0);
      } else {
        // Por defecto o si pAselect es "poblacion"
        const poblacion = await prisma.poblacion.aggregate({
          _sum: {
            hombres: true,
            mujeres: true,
          },
          where: whereClause,
        });
        puntuacion =
          (poblacion._sum.hombres || 0) + (poblacion._sum.mujeres || 0);
      }

      return {
        departamento: departamento,
        provincia: distrito.provincia.nombre,
        distrito: distrito.nombre,
        puntuacion: puntuacion,
      };
    })
  );

  return result;
}
