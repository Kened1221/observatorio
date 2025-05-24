// src/actions/auth.ts
"use server";

import { auth } from "@/auth";
import { addMinutes, isAfter } from "date-fns";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const sessionUpdateSchema = z.object({
  browser: z.string().nullable().optional(),
  browserVersion: z.string().nullable().optional(),
  os: z.string().nullable().optional(),
  osVersion: z.string().nullable().optional(),
  deviceType: z.string().nullable().optional(),
  deviceModel: z.string().nullable().optional(),
  language: z.string().nullable().optional(),
  browserId: z
    .string({
      required_error: "Browser ID es requerido para actualizar la sesión",
    })
    .min(1, "Browser ID no puede estar vacío"),
  ipAddress: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  latitude: z.string().nullable().optional(),
  longitude: z.string().nullable().optional(),
});

type SessionUpdateResult = {
  success: boolean;
  message?: string;
  sessionToken?: string;
};

// Nuevo Server Action para verificar el estado y la expiración de la sesión
export async function checkSessionStatus(userId: string, browserId: string): Promise<boolean> {
  try {
    if (!userId || !browserId) {
      console.warn("[checkSessionStatus] userId y browserId son requeridos.");
      return false;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, active: true },
    });

    if (!user?.active) {
      console.warn("[checkSessionStatus] Usuario no encontrado.");
      return false;
    }

    const session = await prisma.session.findFirst({
      where: {
        userId,
        browserId,
        status: "active",
      },
      select: {
        expires: true,
        status: true,
      },
    });

    if (!session) {
      console.log("[checkSessionStatus] No se encontró una sesión activa para el usuario y browserId proporcionados.");
      return false;
    }

    const now = new Date();
    const isExpired = session.expires < now;
    const isInactive = session.status !== "active";

    if (isExpired || isInactive) {
      console.log(
        `[checkSessionStatus] Sesión no válida para userId: ${userId}, browserId: ${browserId}. Expirada: ${isExpired}, Inactiva: ${isInactive}`
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error("[checkSessionStatus] Error al verificar el estado de la sesión:", error);
    return false; // En caso de error, asumimos que la sesión no es válida
  }
}

// Acción del servidor para obtener sesiones activas
export async function getActiveSessions(userId: string, browserId: string) {
  try {
    const sessions = await prisma.session.findMany({
      where: { userId, status: "active", browserId },
      select: {
        sessionToken: true,
        browserId: true,
        expires: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return sessions;
  } catch (error) {
    console.error("Error al obtener sesiones activas:", error);
    return null;
  }
}

export async function createSession(
  values: z.infer<typeof sessionUpdateSchema>
): Promise<SessionUpdateResult> {
  try {
    const validated = sessionUpdateSchema.parse(values);
    const currentAuthSession = await auth();

    if (!currentAuthSession?.user?.id) {
      console.warn("[updateSession] Intento de actualizar sin autenticación.");
      return { success: false, message: "Usuario no autenticado." };
    }

    const userId = currentAuthSession.user.id;
    const browserId = validated.browserId;

    try {
      // Crear nueva sesión si no existe
      const newSession = await prisma.session.create({
        data: {
          sessionToken: crypto.randomUUID(),
          userId: userId,
          expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          status: "active",
          browser: validated.browser,
          browserVersion: validated.browserVersion,
          os: validated.os,
          osVersion: validated.osVersion,
          deviceType: validated.deviceType,
          browserId: browserId,
          deviceModel: validated.deviceModel,
          language: validated.language,
          ipAddress: validated.ipAddress,
          city: validated.city,
          country: validated.country,
          latitude: validated.latitude,
          longitude: validated.longitude,
          lastActive: new Date(),
        },
      });

      console.log(
        `[updateSession] Nueva sesión creada: ${newSession.sessionToken}`
      );
      return { success: true, sessionToken: newSession.sessionToken };
    } catch (dbError) {
      console.error("[updateSession] Error en base de datos:", dbError);
      return {
        success: false,
        message: "Error al guardar la sesión en la base de datos.",
      };
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(
        "[updateSession] Error de validación de entrada:",
        error.errors
      );
      return { success: false, message: error.errors[0].message };
    }
    console.error("[updateSession] Error inesperado:", error);
    return {
      success: false,
      message: "Error del servidor al procesar la actualización de la sesión.",
    };
  }
}

// --- signOutSession (Renombrado a revokeAllUserSessions para claridad) ---
// Marca TODAS las sesiones activas de un usuario como 'revoked'
export async function revokeAllUserSessions(userId: string): Promise<{
  success: boolean;
  message?: string;
  count?: number;
}> {
  console.log(`[revokeAllUserSessions] Iniciando para userId: ${userId}`);
  if (!userId) return { success: false, message: "UserID requerido." };
  try {
    // Actualiza todas las sesiones activas a 'revoked'
    const result = await prisma.session.updateMany({
      where: {
        userId: userId,
        status: "active",
      },
      data: {
        status: "revoked", // Usar 'revoked' para cierres forzados
        closedAt: new Date(),
        // Opcional: Poner expires en el pasado inmediato también
        // expires: new Date(Date.now() - 1000),
      },
    });

    console.log(
      `[revokeAllUserSessions] ${result.count} sesiones marcadas como 'revoked' para userId: ${userId}`
    );

    return {
      success: true,
      message: `${result.count} sesiones revocadas exitosamente`,
      count: result.count,
    };
  } catch (error) {
    console.error("[revokeAllUserSessions] Error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
// --- closeSession (Corregido y renombrado a revokeSpecificSession) ---
// Marca UNA sesión específica como 'revoked'
export async function revokeSpecificSession({
  userId, // El ID del usuario dueño de la sesión
  sessionTokenToRevoke, // El token de la sesión a revocar
}: {
  userId: string;
  sessionTokenToRevoke: string;
}): Promise<{
  success: boolean;
  message?: string;
  affectedBrowserId?: string | null;
}> {
  console.log(
    `[revokeSpecificSession] Intentando revocar token: ${sessionTokenToRevoke} para userId: ${userId}`
  );
  if (!userId || !sessionTokenToRevoke) {
    return { success: false, message: "UserID y SessionToken requeridos." };
  }
  try {
    // Encuentra la sesión específica
    const session = await prisma.session.findUnique({
      where: { sessionToken: sessionTokenToRevoke, userId: userId }, // Asegura que el usuario sea el dueño
    });

    if (!session) {
      return {
        success: false,
        message: "Sesión no encontrada o no pertenece al usuario.",
      };
    }

    // Si ya está revocada/inactiva, no hacer nada más
    if (session.status !== "active") {
      return {
        success: true,
        message: "La sesión ya no estaba activa.",
        affectedBrowserId: session.browserId,
      };
    }

    // Actualizar SOLO esa sesión a 'inactive'
    const updatedSession = await prisma.session.update({
      where: { sessionToken: sessionTokenToRevoke },
      data: {
        status: "inactive", // Usar 'inactive'
        closedAt: new Date(),
        // Opcional:
        expires: new Date(Date.now() - 1000),
      },
    });

    console.log(
      `[revokeSpecificSession] Sesión ${updatedSession.sessionToken} marcada como 'inactive'.`
    );


    // NO cierres otras sesiones aquí. Si necesitas esa funcionalidad, llama a revokeAllUserSessions.

    return {
      success: true,
      message: "Sesión revocada exitosamente",
      affectedBrowserId: updatedSession.browserId, // Devuelve el browserId afectado
    };
  } catch (error) {
    console.error("[revokeSpecificSession] Error:", error);
    return {
      success: false,
      message: "Error del servidor al revocar la sesión",
    };
  }
}

// --- Generación y validación de token de recuperación de contraseña ---

// Check if user exists
export async function checkUserExists(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, name: true },
  });

  if (!user) {
    return { error: "No existe una cuenta para el correo ingresado" };
  }

  return user;
}

// Generate reset code and token
// Generate reset code and token
export async function generateResetToken(email: string, userId: string, checkOnly: boolean = false) {
  // Buscar el registro más reciente para el email
  const lastToken = await prisma.passwordResetToken.findFirst({
    where: { email },
    orderBy: { createdAt: "desc" },
  });

  // Verificar si hay un cooldown activo
  const cooldownSeconds = 60 * 1000; // 60 segundos
  if (lastToken && lastToken.lastSentAt) {
    const now = Date.now();
    const timeSinceLastSent = now - Number(lastToken.lastSentAt);
    if (timeSinceLastSent < cooldownSeconds) {
      if (checkOnly) {
        // Devolver el tiempo restante para el frontend
        return { cooldownRemaining: Math.ceil((cooldownSeconds - timeSinceLastSent) / 1000) };
      }
      return { error: "Debes esperar antes de solicitar un nuevo código" };
    }
  }

  if (checkOnly) {
    return { cooldownRemaining: 0 };
  }

  // Eliminar tokens anteriores para el usuario
  await prisma.passwordResetToken.deleteMany({
    where: { userId },
  });

  const code = Array.from(crypto.getRandomValues(new Uint8Array(6)))
    .map(b => (b % 10).toString())
    .join('');

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET no está configurado en las variables de entorno");
  }

  const token = jwt.sign(
    { userId, email, type: "password_reset_initial" },
    jwtSecret,
    { expiresIn: "15m" }
  );

  const expires = addMinutes(new Date(), 15); // Código y token inicial expiran en 15 minutos
  const lastSentAt = BigInt(Date.now()); // Registrar el momento del envío

  const newToken = await prisma.passwordResetToken.create({
    data: {
      userId,
      code,
      token,
      email,
      expires,
      lastSentAt,
    },
  });

  return {
    code: newToken.code,
    token: newToken.token,
    expires: newToken.expires,
  };
}

// Validate reset code
export async function validateResetCode(email: string, code: string) {
  const resetToken = await prisma.passwordResetToken.findFirst({
    where: {
      email,
      code,
      isUsed: false,
      isValidated: false,
    },
  });

  if (!resetToken) {
    return { error: "Código inválido o ya utilizado" };
  }

  if (isAfter(new Date(), resetToken.expires)) {
    return { error: "Código expirado" };
  }

  // Verify JWT token
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET no está configurado en las variables de entorno");
  }

  try {
    jwt.verify(resetToken.token, jwtSecret);
  } catch (error) {
    console.error("[validateResetCode] Error al verificar JWT:", error);
    return { error: "Token inválido o expirado" };
  }

  // Generate new JWT token for password reset with 30-minute expiration
  const newToken = jwt.sign(
    { userId: resetToken.userId, email, type: "password_reset_final" },
    jwtSecret,
    { expiresIn: "30m" } // Token expires in 30 minutes
  );

  const newExpires = addMinutes(new Date(), 30);

  await prisma.passwordResetToken.update({
    where: { id: resetToken.id },
    data: {
      isValidated: true,
      token: newToken,
      expires: newExpires,
    },
  });

  return {
    success: true,
    email: resetToken.email,
    token: newToken,
  };
}

// Update password with token
export async function updatePasswordWithToken(
  email: string,
  token: string,
  newPassword: string
) {
  const resetToken = await prisma.passwordResetToken.findFirst({
    where: {
      email,
      token,
      isValidated: true,
      isUsed: false,
    },
  });

  if (!resetToken) {
    return { error: "Token no validado o ya utilizado" };
  }

  if (isAfter(new Date(), resetToken.expires)) {
    return { error: "Token expirado" };
  }

  // Verify JWT token
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET no está configurado en las variables de entorno");
  }

  try {
    jwt.verify(token, jwtSecret);
  } catch (error) {
    console.error("[updatePasswordWithToken] Error al verificar JWT:", error);
    return { error: "Token inválido o expirado" };
  }

  await prisma.user.update({
    where: { email },
    data: { passwordHash: await bcrypt.hash(newPassword, 12) },
  });

  await prisma.passwordResetToken.update({
    where: { id: resetToken.id },
    data: {
      isUsed: true,
      usedAt: new Date(),
    },
  });

  return { success: true };
}