"use server";

import { z } from "zod";
import { AuthError } from "next-auth";
import { signIn as nextAuthSignIn } from "@/auth";
import { prisma } from "@/config/prisma";

// Esquema de validación con Zod (ajustado para incluir los nuevos campos)
const signInSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  deviceInfo: z.string().nullable().optional(), // Texto plano (JSON.stringify)
  ipAddress: z.string().nullable().optional(), // Texto plano
  location: z.string().nullable().optional(), // Texto plano (JSON.stringify)
});

type LoginResult = {
  success: boolean;
  message?: string;
  redirectTo?: string;
};


const sessionUpdateSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  deviceInfo: z.string().nullable().optional(),
  ipAddress: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
});

type SessionUpdateResult = {
  success: boolean;
  message?: string;
};

// Función reutilizable para actualizar o crear una sesión
export async function updateSession(
  values: z.infer<typeof sessionUpdateSchema>
): Promise<SessionUpdateResult> {
  try {
    // Validar los datos con Zod
    const validated = sessionUpdateSchema.parse(values);

    // Buscar al usuario en la base de datos por email
    const user = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (!user) {
      return {
        success: false,
        message: "Usuario no encontrado",
      };
    }

    // Buscar una sesión existente con los mismos datos de dispositivo
    const existingSession = await prisma.session.findFirst({
      where: {
        userId: user.id,
        deviceInfo: validated.deviceInfo || null,
        ipAddress: validated.ipAddress || null,
        location: validated.location || null,
        expires: { gt: new Date() }, // Sesión no expirada
      },
    });

    if (existingSession) {
      // Si ya existe una sesión para este dispositivo, no hacemos nada
      return {
        success: true,
        message: "Sesión ya existe para este dispositivo",
      };
    }

    // Si no existe, crear una nueva sesión
    await prisma.session.create({
      data: {
        sessionToken: crypto.randomUUID(), // Generar un token único
        userId: user.id,
        expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 días
        deviceInfo: validated.deviceInfo || null,
        ipAddress: validated.ipAddress || null,
        location: validated.location || null,
      },
    });

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
    console.error("Error al actualizar la sesión:", error);
    return {
      success: false,
      message: "Error del servidor",
    };
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


export async function signOutSession(userId: string) {
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
  } catch (error) {
    console.error("Error en signOutSession:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
