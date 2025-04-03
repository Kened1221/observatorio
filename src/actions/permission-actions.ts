"use server";

import { prisma } from "@/config/prisma";
import { z } from "zod";

// Esquemas de validación
const permissionSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  moduleId: z.string().min(1, "El módulo es requerido"),
  canRead: z.boolean().optional(),
  canWrite: z.boolean().optional(),
  canEdit: z.boolean().optional(),
  canDelete: z.boolean().optional(),
});

const roleSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional(),
  isCustom: z.boolean().optional(),
});

const userSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  email: z.string().email("Correo inválido"),
  roleId: z.string().optional().nullable(),
});

// --- Permisos ---
export async function fetchPermissions() {
  try {
    const permissions = await prisma.rolePermission.findMany({
      include: { module: true, role: true },
    });
    return permissions.map((perm) => ({
      id: perm.id,
      name: `Permiso para ${perm.module.name}`,
      moduleId: perm.moduleId,
      roleId: perm.roleId,
      canRead: perm.canRead,
      canWrite: perm.canWrite,
      canEdit: perm.canEdit,
      canDelete: perm.canDelete,
    }));
  } catch (error) {
    console.error("Error al obtener permisos:", error);
    return [];
  }
}

export async function createPermission(data: z.infer<typeof permissionSchema>) {
  try {
    const validated = permissionSchema.parse(data);
    const permission = await prisma.rolePermission.create({
      data: {
        moduleId: validated.moduleId,
        roleId: validated.name, // Aquí asumimos que name será el roleId
        canRead: validated.canRead ?? false,
        canWrite: validated.canWrite ?? false,
        canEdit: validated.canEdit ?? false,
        canDelete: validated.canDelete ?? false,
      },
    });
    return { success: true, permission };
  } catch (error) {
    console.error("Error al crear permiso:", error);
    return { success: false, message: "Error al crear el permiso" };
  }
}

export async function updatePermission(id: string, data: z.infer<typeof permissionSchema>) {
  try {
    const validated = permissionSchema.parse(data);
    const permission = await prisma.rolePermission.update({
      where: { id },
      data: {
        moduleId: validated.moduleId,
        roleId: validated.name, // Aquí asumimos que name será el roleId
        canRead: validated.canRead,
        canWrite: validated.canWrite,
        canEdit: validated.canEdit,
        canDelete: validated.canDelete,
      },
    });
    return { success: true, permission };
  } catch (error) {
    console.error("Error al actualizar permiso:", error);
    return { success: false, message: "Error al actualizar el permiso" };
  }
}

export async function deletePermission(id: string) {
  try {
    await prisma.rolePermission.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar permiso:", error);
    return { success: false, message: "Error al eliminar el permiso" };
  }
}

// --- Roles ---
export async function fetchRoles() {
  try {
    return await prisma.role.findMany({
      include: { permissions: { include: { module: true } } },
    });
  } catch (error) {
    console.error("Error al obtener roles:", error);
    return [];
  }
}

export async function createRole(data: z.infer<typeof roleSchema>) {
  try {
    const validated = roleSchema.parse(data);
    const role = await prisma.role.create({
      data: {
        name: validated.name,
        description: validated.description,
        isCustom: validated.isCustom ?? false,
      },
    });
    return { success: true, role };
  } catch (error) {
    console.error("Error al crear rol:", error);
    return { success: false, message: "Error al crear el rol" };
  }
}

export async function updateRole(id: string, data: z.infer<typeof roleSchema>) {
  try {
    const validated = roleSchema.parse(data);
    const role = await prisma.role.update({
      where: { id },
      data: {
        name: validated.name,
        description: validated.description,
        isCustom: validated.isCustom,
      },
    });
    return { success: true, role };
  } catch (error) {
    console.error("Error al actualizar rol:", error);
    return { success: false, message: "Error al actualizar el rol" };
  }
}

export async function deleteRole(id: string) {
  try {
    await prisma.role.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar rol:", error);
    return { success: false, message: "Error al eliminar el rol" };
  }
}

// --- Usuarios ---
export async function fetchUsers() {
  try {
    return await prisma.user.findMany({
      include: { roles: true },
    });
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return [];
  }
}

export async function createUser(data: z.infer<typeof userSchema>) {
  try {
    const validated = userSchema.parse(data);
    const user = await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        roles: validated.roleId ? { connect: { id: validated.roleId } } : undefined,
      },
    });
    return { success: true, user };
  } catch (error) {
    console.error("Error al crear usuario:", error);
    return { success: false, message: "Error al crear el usuario" };
  }
}

export async function updateUser(id: string, data: z.infer<typeof userSchema>) {
  try {
    const validated = userSchema.parse(data);
    const user = await prisma.user.update({
      where: { id },
      data: {
        name: validated.name,
        email: validated.email,
        roles: validated.roleId
          ? { connect: { id: validated.roleId } }
          : { set: [] }, // Desconectar si no hay rol
      },
    });
    return { success: true, user };
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    return { success: false, message: "Error al actualizar el usuario" };
  }
}

export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    return { success: false, message: "Error al eliminar el usuario" };
  }
}

// --- Módulos (para permisos) ---
export async function fetchModules() {
  try {
    return await prisma.module.findMany();
  } catch (error) {
    console.error("Error al obtener módulos:", error);
    return [];
  }
}