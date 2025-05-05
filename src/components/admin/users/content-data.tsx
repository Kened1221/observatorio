"use client";

import React from "react";
import { z } from "zod";
import PageActivos from "./users-activos/page";
import PageInactivos from "./users-inactivos/page";
import PageCreateUser from "./users-crear-usuario/page";
import PagePassword from "./users-restablecer-contrasenia/page";
import { TabCard } from "@/components/animation/card/tab-card";

export const user_create_schema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  dni: z.string().min(8, "El DNI es requerido").max(8, "El DNI debe tener 8 caracteres"),
  email: z.string().email("El correo electrónico no es válido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  role: z.enum(["admin", "edit", "custom"], { errorMap: () => ({ message: "El rol es requerido" }) }),
});
export type UserCreateSchema = z.infer<typeof user_create_schema>;

const ActiveUsers = () => <PageActivos />;

const InactiveUsers = () => <PageInactivos />;

const CreateUser = () => <PageCreateUser />;

const ResetPassword = () => <PagePassword />;

export const UserManagement = () => {
  type TabKey = "active-users" | "inactive-users" | "create-user" | "reset-password";

  const tabItems = [
    { key: "active-users", label: "Usuarios Activos" },
    { key: "inactive-users", label: "Usuarios Inactivos" },
    { key: "create-user", label: "Crear Usuario" },
    { key: "reset-password", label: "Restablecer Contraseña" },
  ] satisfies { key: TabKey; label: string }[];

  const tabComponents: Record<TabKey, React.ComponentType> = {
    "active-users": ActiveUsers,
    "inactive-users": InactiveUsers,
    "create-user": CreateUser,
    "reset-password": ResetPassword,
  };

  return <TabCard title="Administrar Usuarios" tabItems={tabItems} tabComponents={tabComponents} defaultTab="active-users" />;
};
