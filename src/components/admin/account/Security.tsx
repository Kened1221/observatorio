"use client";

import { useState, useTransition } from "react";
import { Key, Eye, EyeOff } from "lucide-react";
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
import { updatePassword } from "@/actions/user-actions";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

// Esquema de validación con Zod
const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "La contraseña actual es requerida"),
    newPassword: z
      .string()
      .min(8, "La nueva contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string().min(1, "Confirma tu nueva contraseña"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

const Security = () => {
  const { data: session } = useSession(); // Obtener el userId de la sesión
  const userId = session?.user?.id;

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Estados para controlar la visibilidad de cada campo
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Configurar el formulario con react-hook-form y zod
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: PasswordFormValues) => {
    if (!userId) {
      toast.error("No se pudo identificar al usuario");
      return;
    }

    startTransition(async () => {
      const result = await updatePassword({
        userId,
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

      if (result.success) {
        toast.success(result.message, {
          description: "Tu contraseña ha sido actualizada.",
        });
        form.reset();
        setShowPasswordForm(false);
      } else {
        toast.error(result.message, {
          description: "Por favor, intenta de nuevo.",
        });
      }
    });
  };

  return (
    <div className="px-4 py-5 sm:p-6">
      <h2 className="text-lg font-medium text-secondary-foreground">
        Seguridad de la Cuenta
      </h2>
      <div className="mt-5">
        <dl className="divide-y divide-border">
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-secondary-foreground">
              Contraseña
            </dt>
            <dd className="mt-1 text-sm text-primary-foreground sm:mt-0 sm:col-span-2 flex items-center justify-between">
              <div className="flex items-center">
                <Key className="w-4 h-4 mr-2" />
                <span>••••••••••••</span>
              </div>
              <Button
                variant="secondary"
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className="inline-flex items-center px-3 py-1.5"
              >
                {showPasswordForm ? "Cancelar" : "Cambiar contraseña"}
              </Button>
            </dd>
          </div>
          {showPasswordForm && (
            <div className="py-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6 text-secondary-foreground"
                >
                  {/* Campo: Contraseña actual */}
                  <FormField
                    control={form.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contraseña actual</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              type={showCurrent ? "text" : "password"}
                              placeholder="Ingresa tu contraseña actual"
                              {...field}
                              className="pr-10"
                            />
                          </FormControl>
                          <button
                            type="button"
                            onClick={() => setShowCurrent(!showCurrent)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showCurrent ? (
                              <EyeOff className="w-5 h-5 text-muted-foreground" />
                            ) : (
                              <Eye className="w-5 h-5 text-muted-foreground" />
                            )}
                          </button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Campo: Nueva contraseña */}
                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nueva contraseña</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              type={showNew ? "text" : "password"}
                              placeholder="Ingresa tu nueva contraseña"
                              {...field}
                              className="pr-10"
                            />
                          </FormControl>
                          <button
                            type="button"
                            onClick={() => setShowNew(!showNew)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showNew ? (
                              <EyeOff className="w-5 h-5 text-muted-foreground" />
                            ) : (
                              <Eye className="w-5 h-5 text-muted-foreground" />
                            )}
                          </button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Campo: Confirmar nueva contraseña */}
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmar nueva contraseña</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              type={showConfirm ? "text" : "password"}
                              placeholder="Confirma tu nueva contraseña"
                              {...field}
                              className="pr-10"
                            />
                          </FormControl>
                          <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showConfirm ? (
                              <EyeOff className="w-5 h-5 text-muted-foreground" />
                            ) : (
                              <Eye className="w-5 h-5 text-muted-foreground" />
                            )}
                          </button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowPasswordForm(false)}
                      disabled={isPending}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" variant="default" disabled={isPending} className="text-white">
                      {isPending ? "Guardando..." : "Guardar cambios"}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
};

export default Security;