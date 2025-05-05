"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { fn_active_user, fn_get_user, fn_update_user } from "@/actions/user-m-actions";
import { fn_get_roles } from "@/actions/role-action";


import { Edit, UserRoundX } from "lucide-react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { roleModule } from "@prisma/client";
import { RoleModule } from "@/admin/lib/enum";
import { fn_format_date } from "@/admin/helpers/date-helper";

const user_schema = z.object({
  name: z.string(),
  email: z.string(),
  dni: z.string().optional(),
  role: z.string().optional(),
  fecha_inactive: z.string().optional(),
  modulos: z.array(z.nativeEnum(roleModule)),
});
export type UserSchema = z.infer<typeof user_schema>;

type RoleWithModules = {
  name: string;
  defaultModule: z.infer<typeof RoleModule>[];
};

export const ModifyData = ({ user_id, onRefresh, onClose }: { user_id: string; onRefresh: () => void; onClose: () => void }) => {
  const [isPending, startTransition] = React.useTransition();
  const [data, setData] = React.useState<UserSchema | null>(null);
  const [rolesData, setRolesData] = React.useState<RoleWithModules[]>([]);
  const [modulosDisponibles, setModulosDisponibles] = React.useState<z.infer<typeof RoleModule>[]>([]);

  const form = useForm<UserSchema>({
    resolver: zodResolver(user_schema),
    defaultValues: {
      name: "",
      email: "",
      dni: "",
      role: "",
      modulos: [],
    },
  });

  React.useEffect(() => {
    const fetchAll = async () => {
      const [resUser, resRoles] = await Promise.all([fn_get_user(user_id), fn_get_roles()]);

      if (resRoles.success && resRoles.response) {
        const roles = resRoles.response.map((r) => ({
          name: r.name,
          defaultModule: r.defaultModule,
        }));
        setRolesData(roles);
      }

      if (resUser.success && resUser.response) {
        const user = resUser.response;
        const rolActual = resRoles.response?.find((r) => r.name === user.role?.name);
        const defaulModule = rolActual?.defaultModule ?? [];

        const isOverride = user.overriddenModule && user.overriddenModule.length > 0;

        setModulosDisponibles(defaulModule);

        setData({
          name: user.name ?? "",
          email: user.email,
          dni: user.dni ?? "",
          role: user.role?.name,
          fecha_inactive: user.date_inactive?.toISOString(),
          modulos: isOverride ? user.overriddenModule : defaulModule,
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

  const handleEnable = async () => {
    startTransition(async () => {
      try {
        const res = await fn_active_user(user_id, 1); // ← deshabilita
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
                          setModulosDisponibles(rol.defaultModule);
                          const currentOverrides = form.getValues("modulos") ?? [];
                          const intersection = rol.defaultModule.filter((e) => currentOverrides.includes(e));

                          form.setValue("modulos", intersection.length > 0 ? intersection : rol.defaultModule);
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
            name="modulos"
            render={() => (
              <FormItem>
                <FormLabel>Modulos Permitidas</FormLabel>
                <div className="gap-2 grid grid-cols-2">
                  {modulosDisponibles.map((modulo) => (
                    <FormField
                      key={modulo}
                      control={form.control}
                      name="modulos"
                      render={({ field }) => {
                        return (
                          <FormItem className="flex items-center gap-2 px-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(modulo)}
                                onCheckedChange={(checked) => {
                                  const newValue = checked ? [...(field.value ?? []), modulo] : (field.value ?? []).filter((e) => e !== modulo);
                                  field.onChange(newValue);
                                }}
                              />
                            </FormControl>
                            <FormLabel className="p-2 font-normal uppercase">{modulo}</FormLabel>
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

          <div>
            <strong className="text-primary">{data.name}</strong> fue inhabilidato el
            <strong className="text-red-600">{data.fecha_inactive && fn_format_date(data.fecha_inactive)}</strong>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="button" variant="destructive" onClick={handleEnable}>
              <UserRoundX className="mr-1 w-4 h-4" />
              Habilitar
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
