"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react"; // Import eye icons


import { fn_user_create } from "@/actions/user-m-actions";
import { fn_get_roles } from "@/actions/role-action";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RoleModule } from "@/admin/lib/enum";
import { roleModule } from "@prisma/client";


type RoleWithModule = {
  name: string;
  defaultModule: z.infer<typeof RoleModule>[];
};

export const user_create_schema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  dni: z.string().length(8, "El DNI debe tener 8 caracteres"),
  email: z.string().email("Correo inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  role: z.string().min(1, "Selecciona un rol"),
  modulos: z.array(z.nativeEnum(roleModule)),
});
export type UserCreateSchema = z.infer<typeof user_create_schema>;

export default function PageCreateUser() {
  const [isPending, startTransition] = useTransition();
  const [rolesData, setRolesData] = useState<RoleWithModule[]>([]);
  const [modulosDisponibles, setModulosDisponibles] = useState<z.infer<typeof RoleModule>[]>([]);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  const form = useForm<UserCreateSchema>({
    resolver: zodResolver(user_create_schema),
    defaultValues: {
      name: "",
      dni: "",
      email: "",
      password: "",
      role: undefined,
      modulos: [],
    },
  });

  useEffect(() => {
    const fetchRoles = async () => {
      const res = await fn_get_roles();
      if (res.success && res.response) {
        const roles = res.response.map((r) => ({
          name: r.name,
          defaultModule: r.defaultModule,
        }));
        setRolesData(roles);
      }
    };
    fetchRoles();
  }, []);

  const onSubmit = (data: UserCreateSchema) => {
    console.log("🚀 Datos del formulario:", data);
    startTransition(async () => {
      try {
        const res = await fn_user_create(data);
        console.log("✅ Usuario creado:", res);
        // Aquí puedes usar `toast.success(...)` o redireccionar
      } catch (error) {
        console.error("🔥 Error al crear usuario:", error);
      } finally {
        form.reset();
        setModulosDisponibles([]);
      }
    });
  };

  return (
    <div>
      <h3 className="mb-4 font-semibold text-lg">Crear Usuario</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Correo electrónico" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Contraseña"
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="link"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-muted-foreground/80 hover:cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-row gap-4">
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
                        form.setValue("modulos", rol.defaultModule);
                      }
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un rol" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {rolesData.map((r) => (
                        <SelectItem key={r.name} value={r.name} className="text-primary-foreground">
                          {r.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("role") && modulosDisponibles.length > 0 && (
              <div className="px-4 w-full">
                <FormField
                  control={form.control}
                  name="modulos"
                  render={() => (
                    <FormItem>
                      <FormLabel>Modulos Permitidas</FormLabel>
                      <div className="gap-2 grid grid-cols-2">
                        {modulosDisponibles.map((ent) => (
                          <FormField
                            key={ent}
                            control={form.control}
                            name="modulos"
                            render={({ field }) => {
                              return (
                                <FormItem className="flex items-center space-x-2 px-2">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value.includes(ent)}
                                      onCheckedChange={(checked) => {
                                        const newValue = checked ? [...field.value, ent] : field.value.filter((e) => e !== ent);
                                        field.onChange(newValue);
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal uppercase">{ent}</FormLabel>
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
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creando..." : "Crear Usuario"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}