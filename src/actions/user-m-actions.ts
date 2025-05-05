/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { UserRecord } from "@/admin/types/user-types";
import { UserSchema } from "@/components/admin/users/users-activos/modify-data";
import { UserCreateSchema } from "@/components/admin/users/users-crear-usuario/page";
import { prisma } from "@/config/prisma";
import { Prisma, roleModule } from "@prisma/client";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function fn_reset_password(user_id: string, enable: boolean): Promise<{ success: boolean; message?: string }> {
  try {
    const current_user = await prisma.user.findUnique({ where: { id: user_id } });
    if (!current_user) throw new Error(`El usuario con ID "${user_id}" no existe.`);

    const newPassword = current_user.dni ?? "00000000";
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({ where: { id: user_id }, data: { passwordHash: hashedPassword, ...(enable && { active: 1, date_inactive: null }) } });

    return { success: true, message: enable ? "Contraseña restablecida y usuario habilitado correctamente." : "Contraseña restablecida correctamente." };
  } catch (error) {
    console.error("[fn_reset_password]", error);
    return { success: false, message: error instanceof Error ? error.message : "Error al restablecer la contraseña." };
  }
}

export async function fn_active_user(user_id: string, active: number): Promise<{ success: boolean; message?: string }> {
  try {
    const current_user = await prisma.user.findUnique({ where: { id: user_id } });
    if (!current_user) throw new Error(`El usuario con ID "${user_id}" no existe.`);

    await prisma.user.update({ where: { id: user_id }, data: { active, date_inactive: active === 0 ? new Date() : null } });

    // revalidatePath("/admin/users");
    return { success: true, message: active === 1 ? "Usuario habilitado correctamente." : "Usuario deshabilitado correctamente." };
  } catch (error) {
    console.error("[fn_active_user]", error);
    return { success: false, message: error instanceof Error ? error.message : "Error al activar el usuario." };
  }
}

export type UserResponse = Prisma.UserGetPayload<{ include: { role: true } }>;
export const fn_get_user = async (id: string): Promise<{ success: boolean; message?: string; response?: UserResponse }> => {
  try {
    const response = await prisma.user.findUnique({ where: { id }, include: { role: true } });
    if (!response) throw new Error("No se encontró el usuario en la base de datos.");

    return { success: true, response };
  } catch (error) {
    console.log("[fn_get_user]", error);
    return { success: false, message: error instanceof Error ? error.message : "Error al obtener el usuario" };
  }
};

export async function fn_update_user(user_id: string, data: UserSchema): Promise<{ success: boolean; message?: string }> {
  try {
    // 1. Obtener usuario actual
    const current_user = await prisma.user.findUnique({ where: { id: user_id }, include: { role: true } });
    if (!current_user) throw new Error(`El usuario con ID "${user_id}" no existe.`);

    // 2. Obtener nuevo rol
    const new_role = await prisma.role.findUnique({ where: { name: data.role ?? undefined } });
    if (!new_role) throw new Error(`El rol "${data.role}" no existe.`);

    const defaultModule = new_role.defaultModule;
    const inputModule = data.modulos;

    // 3. Validar que no se agregue modulos que no están en el rol
    const modulosInvalidas = inputModule.filter((e: any) => !defaultModule.includes(e));
    if (modulosInvalidas.length > 0) throw new Error(`Las siguientes modulos no pertenecen al rol "${new_role.name}": ${modulosInvalidas.join(", ")}`);

    // 4. Determinar overriddenModule
    let overriddenModule: roleModule[] = [];

    const modulosFaltantes = defaultModule.filter((e) => !inputModule.includes(e));
    const modulosExtra = inputModule.filter((e: any) => !defaultModule.includes(e)); // redundante si ya validamos arriba

    const isOverride = modulosFaltantes.length > 0 || modulosExtra.length > 0;

    if (isOverride) overriddenModule = [...inputModule];

    // 5. Si son iguales (sin importar el orden), overriddenModule debe ser []
    const sameModule = defaultModule.length === inputModule.length && defaultModule.every((e) => inputModule.includes(e));

    if (sameModule) overriddenModule = [];

    // 6. Actualizar usuario
    await prisma.user.update({
      where: { id: user_id },
      data: {
        name: data.name,
        email: data.email,
        dni: data.dni,
        roleId: new_role.id,
        overriddenModule,
      },
    });

    return { success: true, message: "Usuario actualizado correctamente." };
  } catch (error) {
    console.error("[fn_update_user]", error);
    return { success: false, message: error instanceof Error ? error.message : "Error al actualizar el usuario." };
  }
}

export async function fn_get_users(active?: number): Promise<{ success: boolean; message?: string; response?: UserRecord[] }> {
  try {
    const whereClause = typeof active === "number" ? { active } : {};

    const response = await prisma.user.findMany({ where: whereClause, include: { role: true } });

    if (!response) throw new Error("No se encontraron usuarios en la base de datos.");

    const userRecords: UserRecord[] = response.map((user) => {
      const modulos =
        user.overriddenModule && user.overriddenModule.length > 0
          ? user.overriddenModule.map((ent) => ent.toString())
          : user.role?.defaultModule.map((ent) => ent.toString()) ?? [];

      return {
        id: user.id,
        name: user.name ?? "",
        active: Number(user.active),
        dni: user.dni ?? "",
        date_inactive: user.date_inactive?.toISOString() ?? "",
        role: user.role?.name ?? "",
        modulos,
      };
    });

    return { success: true, response: userRecords };
  } catch (error) {
    console.error("[fn_get_users]", error);
    return { success: false, message: error instanceof Error ? error.message : "Error al obtener los usuarios" };
  }
}

export async function fn_user_create(data: UserCreateSchema) {
  try {
    const validModule = Object.values(roleModule);
    for (const ent of data.modulos) if (!validModule.includes(ent)) throw new Error(`Entidad no válida: ${ent}`);

    const role = await prisma.role.findUnique({ where: { name: data.role }, select: { id: true, defaultModule: true } });
    if (!role) throw new Error(`Rol "${data.role}" no encontrado.`);

    const isOverride = data.modulos.length !== role.defaultModule.length || !data.modulos.every((ent) => role.defaultModule.includes(ent));

    const hashedPassword = await bcrypt.hash(data.password, 10);

    await prisma.user.create({
      data: {
        name: data.name,
        dni: data.dni,
        email: data.email,
        passwordHash: hashedPassword,
        role: { connect: { name: data.role } },
        overriddenModule: isOverride ? data.modulos : [],
      },
    });

    revalidatePath("/admin/users");

    return { success: true, message: "Usuario creado correctamente." };
  } catch (error: any) {
    console.error("[fn_user_create]", error);
    return { success: false, message: error.message || "Error al crear el usuario" };
  }
}
