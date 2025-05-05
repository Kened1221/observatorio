"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { fn_create_role } from "@/actions/role-action";
import { roleModule } from "@prisma/client";

const formSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  defaultModule: z.array(z.nativeEnum(roleModule)),
});

type RoleForm = z.infer<typeof formSchema>;

interface CrearRoleProps {
  onClose: () => void;
}

export default function CrearRole({ onClose }: CrearRoleProps) {
  const form = useForm<RoleForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      defaultModule: [],
    },
  });

  const [isSaving, setIsSaving] = useState(false);
  const allPermissions = Object.values(roleModule);

  const onSubmit = async (values: RoleForm) => {
    setIsSaving(true);
    const res = await fn_create_role(values);
    setIsSaving(false);

    if (res.success) {
      onClose();
    } else {
      alert(res.message ?? "Error al crear el rol");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <h2 className="font-semibold text-2xl text-center">Crear nuevo rol</h2>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del rol</FormLabel>
              <FormControl>
                <Input placeholder="Ingrese el nombre del rol" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="defaultModule"
          render={() => (
            <FormItem>
              <FormLabel>Modulos permitidas</FormLabel>
              <div className="gap-3 grid grid-cols-2 sm:grid-cols-3 mt-2">
                {allPermissions.map((perm) => (
                  <FormField
                    key={perm}
                    control={form.control}
                    name="defaultModule"
                    render={({ field }) => {
                      const checked = field.value?.includes(perm);
                      return (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(check) => {
                                const newValue = check ? [...field.value, perm] : field.value.filter((v) => v !== perm);
                                field.onChange(newValue);
                              }}
                            />
                          </FormControl>
                          <FormLabel className="capitalize">{perm.replace(/_/g, " ")}</FormLabel>
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

        <div className="flex justify-end gap-2 mt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Guardando..." : "Crear"}
          </Button>
        </div>
      </form>
    </Form>
  );
}