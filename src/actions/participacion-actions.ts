"use server";

import { prisma } from "@/config/prisma";

export async function fetchParticipacionData() {
  try {
    const data = [
      {
        id: 1,
        title: "Video 1",
        description: "Esta es la descripción del Video 1.",
        videoUrl: "https://www.youtube.com/embed/rs1YAkfF8QM",
      },
      {
        id: 2,
        title: "Video 2",
        description: "Esta es la descripción del Video 2.",
        videoUrl: "https://www.youtube.com/embed/C8XAcfyFTfk",
      },
      {
        id: 3,
        title: "Video 3",
        description: "Esta es la descripción del Video 3.",
        videoUrl:
          "https://www.youtube.com/embed/IaTGzcc9h-4?si=yk6Qb5jc82TRbEm-",
      },
      {
        id: 4,
        title: "Video 4",
        description: "Esta es la descripción del Video 4.",
        videoUrl:
          "https://www.youtube.com/embed/9xqOhlAESk0?si=Gbb4nf-hY4mbjY8h",
      },
    ];
    return data;
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
    console.log("Prisma video model:", prisma.video);
    if (!prisma.video) {
      throw new Error("Prisma video model is undefined");
    }

    if (!data?.title || !data?.description || !data?.videoUrl) {
      throw new Error(
        "Missing required fields: title, description, or videoUrl"
      );
    }

    console.log("Creating participacion with data:", data);

    const response = await prisma.video.create({
      data: {
        title: data.title,
        description: data.description,
        videoUrl: data.videoUrl,
      },
    });

    return response;
  } catch (error) {
    console.error("Error creating participacion:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
