/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect } from "react";
import { Mail, Check, XCircle } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { useProfile } from "@/admin/context/ProfileContext";

// Definir el esquema de Zod
const profileSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  avatar: z
    .string()
    .optional()
    .nullable() // Permitir explícitamente null
    .transform((val) => (val === "" ? null : val))
    .refine((val) => !val || z.string().url().safeParse(val).success, "El avatar debe ser una URL válida"),
});

// Tipo inferido del esquema
type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileProps {
  userData: {
    name: string;
    email: string;
    avatar: string | null;
    isGoogleLinked: boolean;
  };
}

export const Profile = ({ userData }: ProfileProps) => {

  const { profile } = useProfile();

  // Tipar explícitamente useForm con ProfileFormValues
  const form: UseFormReturn<ProfileFormValues> = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema) as any, // Forzar compatibilidad (ver nota abajo)
    defaultValues: {
      name: profile.name,
      avatar: profile.avatar || null, // Asegurar que sea null en lugar de ""
    },
  });

  // Sincronizar el formulario con los valores de profile cuando cambien
  useEffect(() => {
    form.reset({
      name: profile.name,
      avatar: profile.avatar || null,
    });
  }, [profile, form]);

  return (
    <div className="sm:p-6 px-4 py-5">
      <h2 className="font-medium text-secondary-foreground text-lg">
        Información del Perfil
      </h2>
      <div className="flex sm:flex-row flex-col mt-5">
        <div className="flex justify-center sm:w-1/3">
          <div className="bg-gray-50 rounded-full w-32 h-32 overflow-hidden">
            <img
              src={profile.avatar ? profile.avatar : "https://icons.veryicon.com/png/o/miscellaneous/user-avatar/user-avatar-male-5.png"}
              alt={profile.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-4 sm:w-2/3">
          <dl className="divide-y divide-border">
            <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-secondary-foreground">
                Nombre completo
              </dt>
              <dd className="mt-1 text-sm text-primary-foreground sm:mt-0 sm:col-span-2">
                {profile.name}
              </dd>
            </div>
            <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-secondary-foreground">
                Correo electrónico
              </dt>
              <dd className="mt-1 text-sm text-primary-foreground sm:mt-0 sm:col-span-2 flex items-center">
                <Mail className="w-4 h-4 mr-2" /> {userData.email}
              </dd>
            </div>
            <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-secondary-foreground">
                Cuenta de Google
              </dt>
              <dd className="mt-1 text-sm text-primary-foreground sm:mt-0 sm:col-span-2">
                <div className="flex items-center space-x-2">
                  {userData.isGoogleLinked ? (
                    <span className="inline-flex items-center bg-green-100 px-2.5 py-0.5 rounded-md font-medium text-green-800 text-sm">
                      <Check className="mr-1 w-4 h-4" /> Vinculada
                    </span>
                  ) : (
                    <span className="inline-flex items-center bg-red-100 px-2.5 py-0.5 rounded-md font-medium text-red-800 text-sm">
                      <XCircle className="mr-1 w-4 h-4" /> No vinculada
                    </span>
                  )}
                </div>
              </dd>
            </div>
          </dl>

        </div>
      </div>
    </div>
  );
};
