"use server";

import { z } from "zod";
import { AuthError } from "next-auth";
import { auth, signIn as nextAuthSignIn } from "@/auth";
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

    // Buscar al usuario en la base de datos
    const userFound = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (!userFound) {
      return {
        success: false,
        message: "Usuario no encontrado",
      };
    }

    // Obtener la sesión activa de NextAuth (puedes obtener el sessionToken desde el resultado de signIn si está disponible)
    // Nota: Dependiendo de cómo configures NextAuth, el sessionToken puede no estar directamente disponible aquí.
    // Si usas un adaptador de Prisma con NextAuth, puedes buscar la sesión por userId.
    const session = await prisma.session.findFirst({
      where: {
        userId: userFound.id,
        expires: { gt: new Date() }, // Sesión no expirada
      },
    });

    if (session) {
      // Actualizar la sesión existente con los datos del dispositivo, IP y ubicación
      await prisma.session.update({
        where: { sessionToken: session.sessionToken },
        data: {
          status: "active",
          deviceInfo: validated.deviceInfo || null,
          ipAddress: validated.ipAddress || null,
          location: validated.location || null,
          updatedAt: new Date(),
        },
      });
    } else {
      // Si no hay una sesión existente, creamos una nueva
      // Nota: Normalmente NextAuth crea la sesión automáticamente, pero si no, puedes hacerlo manualmente
      await prisma.session.create({
        data: {
          sessionToken: result?.url?.split("session=")[1] || crypto.randomUUID(), // Esto depende de cómo obtengas el sessionToken
          userId: userFound.id,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Expira en 30 días (ajusta según tu configuración)
          status: "active",
          deviceInfo: validated.deviceInfo || null,
          ipAddress: validated.ipAddress || null,
          location: validated.location || null,
        },
      });
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

interface googleSessionProps{
  deviceInfo: string | null;
  ipAddress: string | null;
  location: string | null;
}

type GoogleSignInResult = {
  success: boolean;
  message?: string;
};

// Server Action para inicio de sesión con Google
export async function googleSessionAction({ deviceInfo, ipAddress, location }: googleSessionProps): Promise<GoogleSignInResult> {
  try {

    const session = await auth()
    if (!session) {
      return {
        success: false,
        message: "No se pudo iniciar sesión",
      };
    }

    // Actualizar la sesión con los datos del dispositivo
    await prisma.session.updateMany({
      where: { userId: session.user.id },
      data: {
        status: "active",
        deviceInfo: deviceInfo || null,
        ipAddress: ipAddress || null,
        location: location || null,
        updatedAt: new Date(),
      },
    });

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.errors[0].message,
      };
    }
    console.error("Error en inicio de sesión con Google:", error);
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
    })
    if (!user) {
      console.log(`No se encontró un usuario con ID ${userId}`);
      return { success: false, message: "No se encontró el usuario" };
    }

    const result = await prisma.session.updateMany({
      where: {
        userId: userId,
        status: "active"
      },
      data: {
        status: "inactive",
        expires: new Date()
      }
    });

    console.log(`${result.count} sesiones actualizadas a inactive`);

  } catch (error) {
    console.error("Error en signOutSession:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Error desconocido" 
    };
  }
}