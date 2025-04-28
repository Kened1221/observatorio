// src/actions/user-actions.ts
"use server";

import { prisma } from "@/config/prisma";
import { compare, hash } from "bcryptjs";
import { z } from "zod";
import { auth } from "@/auth";
import axios from "axios";
import { notifySessionClosed } from "@/config/socket";

const updateProfileSchema = z.object({
  userId: z.string().min(1, "El ID del usuario es requerido"),
  name: z.string().min(1, "El nombre es requerido"),
  avatar: z
    .string()
    .url("El avatar debe ser una URL válida")
    .nullable()
    .optional(),
});

type UpdateProfileResult = {
  success: boolean;
  message?: string;
};

export async function googleLinkedAccountVerify({ id }: { id: string }) {
  try {
    const result = await prisma.account.findFirst({
      where: { userId: id, provider: "google" },
    });
    return !!result;
  } catch (error) {
    console.log("Error al verificar si la cuenta está vinculada a Google:", error);
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
    // Limpiar sesiones expiradas
    await prisma.session.updateMany({
      where: {
        userId: id,
        status: "active",
        expires: { lte: new Date() },
      },
      data: { status: "inactive" },
    });

    // Obtener todas las sesiones activas
    const activeSessions = await prisma.session.findMany({
      where: { userId: id, status: "active" },
      orderBy: { updatedAt: "desc" },
    });

    // Deduplicar por browserId, manteniendo la sesión más reciente
    const sessionsByBrowserId = new Map<string, typeof activeSessions[0]>();
    const sessionsWithoutBrowserId: typeof activeSessions = [];

    // Separar sesiones con y sin browserId
    for (const session of activeSessions) {
      if (session.browserId) {
        if (!sessionsByBrowserId.has(session.browserId)) {
          sessionsByBrowserId.set(session.browserId, session);
        } else {
          // Marcar la sesión más antigua como inactiva
          await prisma.session.update({
            where: { sessionToken: session.sessionToken },
            data: { status: "inactive", updatedAt: new Date() },
          });
          console.log(`Marcada como inactiva (browserId duplicado): sessionToken=${session.sessionToken}, browserId=${session.browserId}`);
        }
      } else {
        sessionsWithoutBrowserId.push(session);
      }
    }

    // Deduplicar sesiones sin browserId por sessionToken
    const sessionsByToken = new Map<string, typeof activeSessions[0]>();
    for (const session of sessionsWithoutBrowserId) {
      if (!sessionsByToken.has(session.sessionToken)) {
        sessionsByToken.set(session.sessionToken, session);
      } else {
        await prisma.session.update({
          where: { sessionToken: session.sessionToken },
          data: { status: "inactive", updatedAt: new Date() },
        });
        console.log(`Marcada como inactiva (sessionToken duplicado, sin browserId): sessionToken=${session.sessionToken}`);
      }
    }

    // Actualizar la lista de sesiones después de la deduplicación
    const sessions = await prisma.session.findMany({
      where: {
        userId: id,
        status: "active",
        OR: [
          { browserId: { in: Array.from(sessionsByBrowserId.keys()) } },
          { sessionToken: { in: Array.from(sessionsByToken.keys()) } },
        ],
      },
      orderBy: { updatedAt: "desc" },
    });

    // Asegurarse de que no haya duplicados por browserId después de la actualización
    const finalSessionsByBrowserId = new Map<string, typeof sessions[0]>();
    for (const session of sessions) {
      if (session.browserId) {
        if (!finalSessionsByBrowserId.has(session.browserId)) {
          finalSessionsByBrowserId.set(session.browserId, session);
        } else {
          await prisma.session.update({
            where: { sessionToken: session.sessionToken },
            data: { status: "inactive", updatedAt: new Date() },
          });
          console.log(`Marcada como inactiva (verificación final): sessionToken=${session.sessionToken}, browserId=${session.browserId}`);
        }
      }
    }

    // Obtener la lista final de sesiones activas
    const finalSessions = await prisma.session.findMany({
      where: {
        userId: id,
        status: "active",
        OR: [
          { browserId: { in: Array.from(finalSessionsByBrowserId.keys()) } },
          { sessionToken: { in: Array.from(sessionsByToken.keys()) } },
        ],
      },
      orderBy: { updatedAt: "desc" },
    });

    console.log("activeSessionsVerify - Sesiones finales:", JSON.stringify(finalSessions.map((session) => ({
      sessionToken: session.sessionToken,
      browserId: session.browserId,
      id: String(session.userId),
      device: `${session.deviceType || "Desconocido"} (${session.deviceModel || "Desconocido"})`,
      browser: `${session.browser || "Desconocido"} ${session.browserVersion || ""}`,
      os: `${session.os || "Desconocido"} ${session.osVersion || ""}`,
      location: `${session.city || "Desconocido"} - ${session.country || "Desconocido"}`,
      lastActive: session.updatedAt.toISOString(),
    })), null, 2));

    return finalSessions.map((session) => ({
      sessionToken: session.sessionToken,
      browserId: session.browserId,
      id: String(session.userId),
      device: `${session.deviceType || "Desconocido"} (${session.deviceModel || "Desconocido"})`,
      browser: `${session.browser || "Desconocido"} ${session.browserVersion || ""}`,
      os: `${session.os || "Desconocido"} ${session.osVersion || ""}`,
      location: `${session.city || "Desconocido"} - ${session.country || "Desconocido"}`,
      lastActive: session.updatedAt.toISOString(),
      current: browserId ? session.browserId === browserId : false,
    }));
  } catch (error) {
    console.error("Error al verificar sesiones activas:", error);
    return [];
  }
}

export async function historySessions({ id }: { id: string }) {
  try {
    const sessions = await prisma.session.findMany({
      where: { userId: id },
      orderBy: { updatedAt: "desc" },
    });

    return sessions.map((session) => ({
      id: String(session.userId),
      device: `${session.deviceType || "Desconocido"} (${session.deviceModel || "Desconocido"})`,
      browser: `${session.browser || "Desconocido"} ${session.browserVersion || ""}`,
      os: `${session.os || "Desconocido"} ${session.osVersion || ""}`,
      location: `${session.city || "Desconocido"} - ${session.country || "Desconocido"}`,
      timestamp: session.updatedAt.toISOString(),
      status: session.status,
    }));
  } catch (error) {
    console.error("Error al obtener historial de sesiones:", error);
    return [];
  }
}

export async function getSessionToken({ id, browserId }: { id: string; browserId: string }) {
  try {
    const session = await prisma.session.findFirst({
      where: { userId: id, browserId, status: "active" },
    });
    return session?.sessionToken ?? null;
  } catch (error) {
    console.error("Error fetching session token:", error);
    return null;
  }
}

export async function closeSession({ sessionToken }: { sessionToken: string }) {
  try {
    console.log("closeSession - Consultando sesión con token:", sessionToken);

    const session = await prisma.session.findUnique({
      where: { sessionToken },
    });

    if (!session) {
      console.error("closeSession - No se encontró sesión para el token:", sessionToken);
      return { success: true, message: "Sesión no encontrada, posiblemente ya cerrada" };
    }

    if (session.status !== "active") {
      console.warn("closeSession - La sesión ya está inactiva:", sessionToken);
      return { success: true, message: "Sesión ya estaba inactiva" };
    }

    await prisma.session.update({
      where: { sessionToken },
      data: { status: "inactive", updatedAt: new Date() },
    });

    if (session.browserId) {
      notifySessionClosed(session.userId, session.browserId);
    } else {
      console.warn("closeSession - No hay browserId para la sesión:", sessionToken);
    }

    return { success: true, message: "Sesión cerrada correctamente" };
  } catch (error) {
    console.error("closeSession - Error al cerrar sesión:", error);
    return { success: false, message: "Error al cerrar sesión" };
  }
}

export async function closeAccount({ userId }: { userId: string }) {
  const session = await auth();

  if (!session || session.user.role !== "Admin") {
    throw new Error("No autorizado");
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { accounts: true },
    });
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    const sessions = await prisma.session.findMany({
      where: { userId },
    });

    await prisma.session.updateMany({
      where: { userId },
      data: { status: "inactive" },
    });

    const googleAccount = user.accounts.find((acc) => acc.provider === "google");
    if (googleAccount?.access_token) {
      try {
        await axios.post("https://accounts.google.com/o/oauth2/revoke", null, {
          params: { token: googleAccount.access_token },
        });
      } catch (error) {
        console.error("Error revoking Google token:", error);
      }
    }

    await prisma.user.delete({ where: { id: userId } });

    // Notify all sessions via Socket.IO if browserId exists
    sessions.forEach((s) => {
      if (s.browserId) {
        notifySessionClosed(userId, s.browserId);
      }
    });

    return { success: true, message: "Cuenta cerrada exitosamente" };
  } catch (error) {
    console.error("Error closing account:", error);
    throw new Error(error instanceof Error ? error.message : "Error interno del servidor");
  }
}

export async function updatePassword({
  userId,
  currentPassword,
  newPassword,
}: {
  userId: string;
  currentPassword: string;
  newPassword: string;
}) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { passwordHash: true },
    });

    if (!user || !user.passwordHash) {
      return {
        success: false,
        message: "Usuario no encontrado o no tiene contraseña",
      };
    }

    const isPasswordValid = await compare(currentPassword, user.passwordHash);
    if (!isPasswordValid) {
      return { success: false, message: "La contraseña actual es incorrecta" };
    }

    if (newPassword.length < 8) {
      return {
        success: false,
        message: "La nueva contraseña debe tener al menos 8 caracteres",
      };
    }

    const hashedPassword = await hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: hashedPassword },
    });

    return { success: true, message: "Contraseña actualizada correctamente" };
  } catch (error) {
    console.error("Error al actualizar la contraseña:", error);
    return { success: false, message: "Error al actualizar la contraseña" };
  }
}

export async function updateProfile(values: z.infer<typeof updateProfileSchema>): Promise<UpdateProfileResult> {
  try {
    const validated = updateProfileSchema.parse(values);

    const user = await prisma.user.findUnique({
      where: { id: validated.userId },
    });

    if (!user) {
      return { success: false, message: "Usuario no encontrado" };
    }

    await prisma.user.update({
      where: { id: validated.userId },
      data: {
        name: validated.name,
        image: validated.avatar || null,
      },
    });

    return { success: true, message: "Perfil actualizado correctamente" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0].message };
    }
    console.error("Error al actualizar el perfil:", error);
    return { success: false, message: "Error del servidor" };
  }
}

export async function getProfile(userId: string): Promise<{
  name: string;
  role: string;
  avatar: string;
}> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, image: true, roles: true },
    });

    return {
      name: user?.name || "",
      role: user?.roles[0].name || "",
      avatar: user?.image || "",
    };
  } catch (error) {
    console.error("Error al obtener el perfil:", error);
    return { name: "", role: "", avatar: "" };
  }
}