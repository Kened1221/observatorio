"use server";

import { prisma } from "@/config/prisma";
import { RoleModule, Role } from "@prisma/client";

export const fn_get_roles_user = async (userId: string): Promise<{ success: boolean; message?: string; response?: RoleModule[] }> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: { select: { defaultModule: true } } },
    });

    if (!user || !user.role) throw new Error("No se encontró el usuario o el rol asociado en la base de datos.");

    return { success: true, response: user.role.defaultModule };
  } catch (error) {
    console.log("[fn_get_roles_user]", error);
    return { success: false, message: error instanceof Error ? error.message : "Error al obtener los roles del usuario" };
  }
};

export const fn_get_roles = async (): Promise<{ success: boolean; message?: string; response?: Role[] }> => {
  try {
    const response = await prisma.role.findMany();
    if (!response) throw new Error("No se encontraron roles en la base de datos.");

    return { success: true, response };
  } catch (error) {
    console.log("[fn_get_roles]", error);
    return { success: false, message: error instanceof Error ? error.message : "Error al obtener los roles" };
  }
};

export const fn_get_role = async (id: string): Promise<{ success: boolean; message?: string; response?: Role }> => {
  try {
    const response = await prisma.role.findUnique({ where: { id } });
    if (!response) throw new Error("No se encontró el rol en la base de datos.");

    return { success: true, response };
  } catch (error) {
    console.log("[fn_get_role]", error);
    return { success: false, message: error instanceof Error ? error.message : "Error al obtener el rol" };
  }
};

export const fn_update_role = async (data: Partial<Role> & { defaultModule?: RoleModule[] }): Promise<{ success: boolean; message?: string }> => {
  try {
    if (!data.id) throw new Error("Falta el ID del rol.");

    const current_role = await prisma.role.findUnique({ where: { id: data.id } });
    if (!current_role) throw new Error("No se encontró el rol en la base de datos.");

    const validEntities = Object.values(RoleModule);
    const newDefaultModule = (data.defaultModule ?? []).filter((ent) => validEntities.includes(ent));

    await prisma.role.update({
      where: { id: data.id },
      data: { name: data.name?.trim(), defaultModule: newDefaultModule },
    });

    return { success: true, message: "Rol actualizado correctamente." };
  } catch (error) {
    console.error("[fn_update_role]", error);
    return { success: false, message: error instanceof Error ? error.message : "Error al actualizar el rol" };
  }
};

export const fn_delete_role = async (id: string): Promise<{ success: boolean; message?: string }> => {
  try {
    const existingRole = await prisma.role.findUnique({ where: { id } });
    if (!existingRole) throw new Error("No se encontró el rol en la base de datos.");

    const affectedUsers = await prisma.user.findMany({ where: { roleId: id }, select: { id: true } });

    for (const user of affectedUsers) {
      await prisma.user.update({
        where: { id: user.id },
        data: { roleId: null },
      });
    }

    await prisma.role.delete({ where: { id } });

    return { success: true, message: `Rol eliminado correctamente. Se actualizaron ${affectedUsers.length} usuarios.` };
  } catch (error) {
    console.error("[fn_delete_role]", error);
    return { success: false, message: error instanceof Error ? error.message : "Error al eliminar el rol" };
  }
};

interface CreateRoleInput {
  name: string;
  description?: string;
  defaultModule: RoleModule[];
}

export const fn_create_role = async (data: CreateRoleInput): Promise<{ success: boolean; message?: string }> => {
  try {
    const existing = await prisma.role.findUnique({
      where: { name: data.name.trim() },
    });

    if (existing) {
      return {
        success: false,
        message: `Ya existe un rol con el nombre "${data.name}".`,
      };
    }

    const validEntities = Object.values(RoleModule);
    const filteredEntities = data.defaultModule.filter((ent) => validEntities.includes(ent));

    await prisma.role.create({
      data: {
        name: data.name.trim(),
        description: data.description?.trim(),
        defaultModule: filteredEntities,
      },
    });

    return { success: true, message: "Rol creado correctamente." };
  } catch (error) {
    console.error("[fn_create_role]", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error al crear el rol",
    };
  }
};