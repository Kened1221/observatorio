/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useTransition, useEffect } from "react";
import { Mail, Check, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { updateProfile } from "@/actions/user-actions";
import { useProfile } from "@/admin/context/ProfileContext";

const profileSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  avatar: z
    .string()
    .optional()
    .transform((val) => (val === "" ? null : val))
    .refine(
      (val) => !val || z.string().url().safeParse(val).success,
      "El avatar debe ser una URL válida"
    ),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileProps {
  userData: {
    name: string;
    email: string;
    avatar: string | null;
    isGoogleLinked: boolean;
  };
}

const Profile = ({ userData }: ProfileProps) => {
  const { data: session, update } = useSession();
  const { profile, fetchProfile } = useProfile();
  const userId = session?.user?.id;

  const [showEditForm, setShowEditForm] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile.name,
      avatar: profile.avatar || "",
    },
  });

  // Sincronizar el formulario con los valores de profile cuando cambien
  useEffect(() => {
    form.reset({
      name: profile.name,
      avatar: profile.avatar || "",
    });
  }, [profile, form]);

  const onSubmit = (values: ProfileFormValues) => {
    if (!userId) {
      toast.error("No se pudo identificar al usuario");
      return;
    }

    startTransition(async () => {
      const result = await updateProfile({
        userId,
        name: values.name,
        avatar: values.avatar || null,
      });

      if (result.success) {
        toast.success(result.message, {
          description: "Tu perfil ha sido actualizado.",
        });
        await update({ name: values.name, image: values.avatar });
        await fetchProfile(userId);
        setShowEditForm(false);
      } else {
        toast.error(result.message, {
          description: "Por favor, intenta de nuevo.",
        });
      }
    });
  };

  return (
    <div className="px-4 py-5 sm:p-6">
      <h2 className="text-lg font-medium text-primary-foreground">
        Información del Perfil
      </h2>
      <div className="mt-5 flex flex-col sm:flex-row">
        <div className="sm:w-1/3 flex justify-center">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100">
            <img
              src={
                profile.avatar
                  ? profile.avatar
                  : "https://icons.veryicon.com/png/o/miscellaneous/user-avatar/user-avatar-male-5.png"
              }
              alt={profile.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="mt-4 sm:mt-0 sm:w-2/3 sm:ml-4">
          {showEditForm ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Ingresa tu nombre" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="avatar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL del Avatar</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ingresa la URL de tu avatar (opcional)"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowEditForm(false)}
                    disabled={isPending}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="default"
                    disabled={isPending}
                    className="text-white"
                  >
                    {isPending ? "Guardando..." : "Guardar cambios"}
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <>
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
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-green-100 text-green-800">
                          <Check className="w-4 h-4 mr-1" /> Vinculada
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-red-100 text-red-800">
                          <XCircle className="w-4 h-4 mr-1" /> No vinculada
                        </span>
                      )}
                    </div>
                  </dd>
                </div>
              </dl>
              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <Button
                  type="button"
                  variant={"outline"}
                  onClick={() => setShowEditForm(true)}
                  className="inline-flex items-center px-4 py-2"
                >
                  Editar Perfil
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;