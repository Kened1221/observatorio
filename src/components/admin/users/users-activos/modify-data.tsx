"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { fn_active_user, fn_get_user, fn_update_user } from "@/actions/user-m-actions";
import { fn_get_roles } from "@/actions/role-action";
import { Entity } from "@/lib/enum";

import { Edit, UserRoundX } from "lucide-react";
import { entity } from "@prisma/client";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const user_schema = z.object({
  name: z.string(),
  email: z.string(),
  dni: z.string().optional(),
  role: z.string().optional(),
  entidades: z.array(z.nativeEnum(entity)),
});
export type UserSchema = z.infer<typeof user_schema>;

type RoleWithEntities = {
  name: string;
  defaultEntities: z.infer<typeof Entity>[];
};

export const ModifyData = ({ user_id, onRefresh, onClose }: { user_id: string; onRefresh: () => void; onClose: () => void }) => {
  const [isPending, startTransition] = React.useTransition();
  const [data, setData] = React.useState<UserSchema | null>(null);
  const [rolesData, setRolesData] = React.useState<RoleWithEntities[]>([]);
  const [entidadesDisponibles, setEntidadesDisponibles] = React.useState<z.infer<typeof Entity>[]>([]);

  const form = useForm<UserSchema>({
    resolver: zodResolver(user_schema),
    defaultValues: {
      name: "",
      email: "",
      dni: "",
      role: "",
      entidades: [],
    },
  });

  React.useEffect(() => {
    const fetchAll = async () => {
      const [resUser, resRoles] = await Promise.all([fn_get_user(user_id), fn_get_roles()]);

      if (resRoles.success && resRoles.response) {
        const roles = resRoles.response.map((r) => ({
          name: r.name,
          defaultEntities: r.defaultEntities,
        }));
        setRolesData(roles);
      }

      if (resUser.success && resUser.response) {
        const user = resUser.response;
        const rolActual = resRoles.response?.find((r) => r.name === user.role?.name);
        const defaultEntities = rolActual?.defaultEntities ?? [];

        const isOverride = user.overriddenEntities && user.overriddenEntities.length > 0;

        setEntidadesDisponibles(defaultEntities);

        setData({
          name: user.name ?? "",
          email: user.email,
          dni: user.dni ?? "",
          role: user.role?.name,
          entidades: isOverride ? user.overriddenEntities : defaultEntities,
        });
      }
    };

    fetchAll();
  }, [user_id]);

  React.useEffect(() => {
    if (data) {
      form.reset(data);
    }
  }, [data, form]);

  const handleDisable = async () => {
    startTransition(async () => {
      try {
        const res = await fn_active_user(user_id, 0); // ← deshabilita
        if (res.success) {
          console.log("✅ Usuario deshabilitado:", res.message);
          // toast.success(res.message ?? "Usuario deshabilitado.");
          onRefresh?.(); // ← vuelve a cargar datos
        } else {
          console.error("❌ Error al deshabilitar el usuario:", res.message);
          // toast.error(res.message ?? "Error al deshabilitar.");
        }
      } catch (error) {
        console.error("🔥 Error inesperado al deshabilitar:", error);
        // toast.error("Error inesperado al deshabilitar.");
      }
    });
  };

  const onSubmit = async (formData: UserSchema) => {
    startTransition(async () => {
      try {
        const res = await fn_update_user(user_id, formData);
        if (res.success) {
          console.log("✅ Usuario actualizado:", res.message);
          // toast.success(res.message ?? "Actualizado");
          onRefresh?.();
        } else {
          console.error("❌ Error al actualizar el usuario:", res.message);
          // toast.error(res.message ?? "Error al actualizar");
        }
      } catch (error) {
        console.error("🔥 Error inesperado en onSubmit:", error);
        // toast.error("Error inesperado al actualizar");
      }
    });
  };

  if (!data) return <p className="text-muted-foreground text-sm">Cargando datos del usuario...</p>;

  return (
    <div className="space-y-6 px-5 w-full">
      <h2 className="font-semibold text-lg">
        Actualizar Informacion de <strong className="text-primary">{data.name}</strong>
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-5 w-full">
          <div className="gap-4 grid grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dni"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>DNI</FormLabel>
                  <FormControl>
                    <Input placeholder="DNI del usuario" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-row-reverse gap-4">
            <div className="w-auto">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rol</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        const rol = rolesData.find((r) => r.name === value);
                        if (rol) {
                          setEntidadesDisponibles(rol.defaultEntities);
                          const currentOverrides = form.getValues("entidades") ?? [];
                          const intersection = rol.defaultEntities.filter((e) => currentOverrides.includes(e));

                          form.setValue("entidades", intersection.length > 0 ? intersection : rol.defaultEntities);
                        }
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un rol" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {rolesData.map((role) => (
                          <SelectItem key={role.name} value={role.name}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="w-full">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo Electrónico</FormLabel>
                    <FormControl>
                      <Input placeholder="ejemplo@correo.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="entidades"
            render={() => (
              <FormItem>
                <FormLabel>Entidades Permitidas</FormLabel>
                <div className="gap-2 grid grid-cols-2">
                  {entidadesDisponibles.map((entidad) => (
                    <FormField
                      key={entidad}
                      control={form.control}
                      name="entidades"
                      render={({ field }) => {
                        return (
                          <FormItem className="flex items-center gap-2 px-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(entidad)}
                                onCheckedChange={(checked) => {
                                  const newValue = checked ? [...(field.value ?? []), entidad] : (field.value ?? []).filter((e) => e !== entidad);
                                  field.onChange(newValue);
                                }}
                              />
                            </FormControl>
                            <FormLabel className="p-2 font-normal uppercase">{entidad}</FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="button" variant="destructive" onClick={handleDisable}>
              <UserRoundX className="mr-1 w-4 h-4" />
              Deshabilitar
            </Button>
            <Button type="submit" disabled={isPending} className="flex items-center gap-2">
              <Edit className="w-4 h-4" />
              {isPending ? "Guardando..." : "Modificar"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
