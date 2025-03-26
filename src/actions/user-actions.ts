"use server";

import { prisma } from "@/config/prisma";

export async function googleLinkedAccountVerify({ id }: { id: string }) {
  try {
    const result = await prisma.account.findFirst({
      where: {
        userId: id,
        provider: "google",
      },
    });

    return !!result;
  } catch (error) {
    console.log(
      "Error al verificar si la cuenta está vinculada a Google:",
      error
    );
    return false;
  }
}

export async function activeSessionsVerify({
  id,
  browserId,
}: {
  id: string;
  browserId?: string;
}) {
  try {
    const sessions = await prisma.session.findMany({
      where: { userId: id, status: "active" },
      orderBy: { updatedAt: "desc" },
    });

    return sessions.map((session) => ({
      sessionToken: session.sessionToken,
      browserId: session.browserId,
      id: String(session.userId),
      device: `${session.deviceType || "Desconocido"} (${
        session.deviceModel || "Desconocido"
      })`,
      browser: `${session.browser || "Desconocido"} ${
        session.browserVersion || ""
      }`,
      os: `${session.os || "Desconocido"} ${session.osVersion || ""}`,
      location: `${session.city || "Desconocido"} - ${
        session.country || "Desconocido"
      }`,
      lastActive: session.updatedAt.toISOString(),
      current: browserId ? session.browserId === browserId : false, // Comparar con browserId
    }));
  } catch (error) {
    console.error("Error al verificar sesiones activas:", error);
    return [];
  }
}

export async function historySessions({ id }: { id: string }) {
  try {
    const sessions = await prisma.session.findMany({
      where: {
        userId: id,
      },
      orderBy: { updatedAt: "desc" },
    });

    return sessions.map((session) => ({
      id: String(session.userId),
      device: `${session.deviceType || "Desconocido"} (${
        session.deviceModel || "Desconocido"
      })`,
      browser: `${session.browser || "Desconocido"} ${
        session.browserVersion || ""
      }`,
      os: `${session.os || "Desconocido"} ${session.osVersion || ""}`,
      location: `${session.city || "Desconocido"} - ${
        session.country || "Desconocido"
      }`,
      timestamp: session.updatedAt.toISOString(),
      status: session.status,
    }));
  } catch (error) {
    console.error("Error al obtener historial de sesiones:", error);
    return [];
  }
}

export async function sessionTokenUser ({ id, browserId } : { id: string, browserId: string}) {
  try {
    const session = await prisma.session.findFirst({
      where: { userId: id, browserId },
      select: { sessionToken: true },
    })

    return session?.sessionToken;

  } catch (error) {
    console.log("Error al obtener el token de sesión del usuario:", error);
    return null;
  }
}
