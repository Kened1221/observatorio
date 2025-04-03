"use server";

import { prisma } from "@/config/prisma";
import { compare, hash } from "bcryptjs";
import { z } from "zod";

// Esquema de validación para actualizar el perfil
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

export async function sessionTokenUser({
  id,
  browserId,
}: {
  id: string;
  browserId: string;
}) {
  try {
    const session = await prisma.session.findFirst({
      where: { userId: id, browserId },
      select: { sessionToken: true },
    });

    return session?.sessionToken;
  } catch (error) {
    console.log("Error al obtener el token de sesión del usuario:", error);
    return null;
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
    // Buscar el usuario por ID
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

    // Verificar la contraseña actual
    const isPasswordValid = await compare(currentPassword, user.passwordHash);
    if (!isPasswordValid) {
      return { success: false, message: "La contraseña actual es incorrecta" };
    }

    // Validar la nueva contraseña (mínimo 8 caracteres)
    if (newPassword.length < 8) {
      return {
        success: false,
        message: "La nueva contraseña debe tener al menos 8 caracteres",
      };
    }

    // Hashear la nueva contraseña
    const hashedPassword = await hash(newPassword, 10);

    // Actualizar la contraseña en la base de datos
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

export async function updateProfile(
  values: z.infer<typeof updateProfileSchema>
): Promise<UpdateProfileResult> {
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
