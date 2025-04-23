import { prisma } from "@/config/prisma";

async function seed() {
  try {
    // Insertar ubicaciones (1 a 124)
    await prisma.ubicacion.createMany({
      data: Array.from({ length: 124 }, (_, i) => ({
        id: i + 1,
        nombre: `Ubicación ${i + 1}`,
      })),
      skipDuplicates: true,
    });

    // Insertar ámbitos (1 a 2)
    await prisma.ambito.createMany({
      data: [
        { id: 1, nombre: "Ámbito 1" },
        { id: 2, nombre: "Ámbito 2" },
      ],
      skipDuplicates: true,
    });

    // Insertar intervalos de edad (1 a 15)
    await prisma.edadIntervalo.createMany({
      data: Array.from({ length: 15 }, (_, i) => ({
        id: i + 1,
        rango: `Intervalo ${i + 1}`,
      })),
      skipDuplicates: true,
    });

    // Insertar géneros (1 a 2)
    await prisma.genero.createMany({
      data: [
        { id: 1, nombre: "Masculino" },
        { id: 2, nombre: "Femenino" },
      ],
      skipDuplicates: true,
    });

    console.log("Datos de seed insertados correctamente");
  } catch (error) {
    console.error("Error al insertar datos de seed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
