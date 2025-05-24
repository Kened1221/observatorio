"use server";

import { prisma } from "@/lib/prisma";


export async function fetchParticipacionData() {
  try {
    const videos = await prisma.video.findMany({
      orderBy: { createdAt: "desc" },
    });
    return videos;
  } catch (error) {
    console.error("Error fetching participacion data:", error);
    throw error;
  }
}

export async function createParticipacion(data: {
  title: string;
  description: string;
  videoUrl: string;
}) {
  try {
    await prisma.video.create({
      data: {
        title: data.title,
        description: data.description,
        videoUrl: data.videoUrl,
      },
    });
    return { status: 200, message: "Video subido exitosamente" };
  } catch (error) {
    console.error("Error creating participacion:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function updateParticipacion(id: number, data: {
  title: string;
  description: string;
  videoUrl: string;
}) {
  try {
    await prisma.video.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        videoUrl: data.videoUrl,
      },
    });
    return { status: 200, message: "Video actualizado exitosamente" };
  } catch (error) {
    console.error("Error updating participacion:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function deleteParticipacion(id: number) {
  try {
    await prisma.video.delete({ where: { id } });
    return { status: 200, message: "Video eliminado exitosamente" };
  } catch (error) {
    console.error("Error al eliminar video:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}