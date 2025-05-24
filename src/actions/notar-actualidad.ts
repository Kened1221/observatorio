
"use server";

import { prisma } from "@/lib/prisma";


export async function getNews() {
  try {
    const images = await prisma.image.findMany({
      orderBy: {
        date: "desc",
      },
    });

    const news = images.map((image) => ({
      id: image.id,
      description: image.title,
      detalles: image.description,
      imagenUrl: image.url,
      date: new Date(image.date),
    }));

    return {
      message: "Noticias obtenidas con éxito",
      status: 200,
      data: news,
    };
  } catch (error: unknown) {
    const errorStatus = error instanceof Error ? 500 : 400;
    console.error("Error al obtener las noticias:", error);
    return {
      message: "No se pudieron obtener las noticias",
      status: errorStatus,
      data: [],
    };
  }
}

export async function guardarImg(
  url: string,
  title: string,
  description: string,
  date: string
) {
  try {
    const nuevaImagen = await prisma.image.create({
      data: {
        url,
        title,
        description,
        date: new Date(date),
      },
    });

    return {
      message: "La imagen se guardó con éxito",
      status: 200,
      data: nuevaImagen,
    };
  } catch (error: unknown) {
    const errorStatus = error instanceof Error ? 500 : 400;
    console.error("Error al guardar la imagen:", error);
    return {
      message: "La imagen no se pudo guardar",
      status: errorStatus,
    };
  }
}

export async function updateImg(
  id: string,
  url: string,
  title: string,
  description: string,
  date: string
) {
  try {
    const updatedImage = await prisma.image.update({
      where: { id },
      data: {
        url,
        title,
        description,
        date: new Date(date),
      },
    });

    return {
      message: "La imagen se actualizó con éxito",
      status: 200,
      data: updatedImage,
    };
  } catch (error: unknown) {
    const errorStatus = error instanceof Error ? 500 : 400;
    console.error("Error al actualizar la imagen:", error);
    return {
      message: "La imagen no se pudo actualizar",
      status: errorStatus,
    };
  }
}

export async function deleteImg(id: string) {
  try {
    await prisma.image.delete({
      where: { id },
    });

    return {
      message: "La imagen se eliminó con éxito",
      status: 200,
    };
  } catch (error: unknown) {
    const errorStatus = error instanceof Error ? 500 : 400;
    console.error("Error al eliminar la imagen:", error);
    return {
      message: "La imagen no se pudo eliminar",
      status: errorStatus,
    };
  }
}