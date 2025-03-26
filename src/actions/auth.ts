"use server";

import { z } from "zod";
import { AuthError } from "next-auth";
import { signIn as nextAuthSignIn } from "@/auth";
import { prisma } from "@/config/prisma";
import { notifySessionClosed } from "@/config/websocket";

// Esquema de validación con Zod (ajustado para incluir los nuevos campos)
const signInSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type LoginResult = {
  success: boolean;
  message?: string;
  redirectTo?: string;
};

const sessionUpdateSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  sessionToken: z.string().optional(),
  browser: z.string().nullable().optional(),
  browserVersion: z.string().nullable().optional(),
  os: z.string().nullable().optional(),
  osVersion: z.string().nullable().optional(),
  deviceType: z.string().nullable().optional(),
  deviceModel: z.string().nullable().optional(),
  language: z.string().nullable().optional(),
  browserId: z.string().nullable().optional(),
  ipAddress: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
});

type SessionUpdateResult = {
  success: boolean;
  message?: string;
  sessionToken?: string;
};

export async function updateSession(
  values: z.infer<typeof sessionUpdateSchema>
): Promise<SessionUpdateResult> {
  try {
    const validated = sessionUpdateSchema.parse(values);
    const user = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (!user) {
      return { success: false, message: "Usuario no encontrado" };
    }

    // Buscar una sesión existente basada en browserId (principal identificador)
    const existingSession = await prisma.session.findFirst({
      where: {
        userId: user.id,
        browserId: validated.browserId || null,
        status: "active",
        expires: { gt: new Date() },
      },
    });

    if (existingSession) {
      // Actualizar la sesión existente
      const updatedSession = await prisma.session.update({
        where: { sessionToken: existingSession.sessionToken },
        data: {
          browser: validated.browser || null,
          browserVersion: validated.browserVersion || null,
          os: validated.os || null,
          osVersion: validated.osVersion || null,
          deviceType: validated.deviceType || null,
          deviceModel: validated.deviceModel || null,
          language: validated.language || null,
          ipAddress: validated.ipAddress || null,
          city: validated.city || null,
          country: validated.country || null,
          latitude: validated.latitude || null,
          longitude: validated.longitude || null,
          expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(),
        },
      });
      return { success: true, sessionToken: updatedSession.sessionToken };
    }

    // Crear una nueva sesión si no existe
    const sessionToken = crypto.randomUUID();
    const newSession = await prisma.session.create({
      data: {
        sessionToken,
        userId: user.id,
        browser: validated.browser || null,
        browserVersion: validated.browserVersion || null,
        os: validated.os || null,
        osVersion: validated.osVersion || null,
        deviceType: validated.deviceType || null,
        deviceModel: validated.deviceModel || null,
        language: validated.language || null,
        browserId: validated.browserId || null,
        ipAddress: validated.ipAddress || null,
        city: validated.city || null,
        country: validated.country || null,
        latitude: validated.latitude || null,
        longitude: validated.longitude || null,
        expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        status: "active",
      },
    });

    return { success: true, sessionToken: newSession.sessionToken };
  } catch (error) {
    console.error("Error al actualizar la sesión:", error);
    return { success: false, message: "Error del servidor" };
  }
}
// Acción del servidor para iniciar sesión
export async function loginAction(
  values: z.infer<typeof signInSchema>
): Promise<LoginResult> {
  try {
    // Validar con Zod
    const validated = signInSchema.parse(values);

    // Usar la versión server-side de signIn
    const result = await nextAuthSignIn("credentials", {
      email: validated.email,
      password: validated.password,
      redirect: false,
    });

    if (!result || result.error) {
      return {
        success: false,
        message: result?.error || "Error al iniciar sesión",
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.errors[0].message,
      };
    }
    if (error instanceof AuthError) {
      return {
        success: false,
        message: "Credenciales inválidas",
      };
    }
    console.error("Error de autenticación:", error);
    return {
      success: false,
      message: "Error del servidor",
    };
  }
}

export async function signOutSession(userId: string): Promise<{
  success: boolean;
  message?: string;
}> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      console.log(`No se encontró un usuario con ID ${userId}`);
      return { success: false, message: "No se encontró el usuario" };
    }

    const result = await prisma.session.updateMany({
      where: {
        userId: userId,
        status: "active",
      },
      data: {
        status: "inactive",
        expires: new Date(),
      },
    });

    console.log(`${result.count} sesiones actualizadas a inactive`);
    return {
      success: true,
      message: `${result.count} sesiones cerradas exitosamente`,
    };
  } catch (error) {
    console.error("Error en signOutSession:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

export async function closeSession({
  userId,
  sessionToken,
}: {
  userId: string;
  sessionToken: string;
}): Promise<{ success: boolean; message?: string; affectedBrowserId?: string }> {
  try {
    const session = await prisma.session.findUnique({
      where: { sessionToken, userId },
    });

    if (!session) {
      return { success: false, message: "Sesión no encontrada" };
    }

    await prisma.session.update({
      where: { sessionToken },
      data: { status: "inactive", expires: new Date() },
    });

    // Notificar al cliente afectado
    if (session.browserId) {
      notifySessionClosed(session.browserId);
    }

    return {
      success: true,
      message: "Sesión cerrada exitosamente",
      affectedBrowserId: session.browserId || undefined,
    };
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    return { success: false, message: "Error del servidor" };
  }
}