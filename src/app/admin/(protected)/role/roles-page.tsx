"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash } from "lucide-react";
import EditarRole from "./editar-role";
import { Role } from "@prisma/client";
import { fn_get_roles, fn_delete_role } from "@/actions/role-action";
import CrearRole from "./crear-role";

export default function RolesPage() {
  const [roles, setRoles] = React.useState<Role[]>([]);
  const [editar, setEditar] = React.useState(false);
  const [crear, setCrear] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState<Role | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const onRefresh = async () => {
    setIsLoading(true);
    const res = await fn_get_roles();
    if (res.success && res.response) {
      setRoles(res.response);
    }
    setIsLoading(false);
  };

  React.useEffect(() => {
    onRefresh();
  }, []);

  const setEditRole = (role: Role) => {
    setSelectedRole(role);
    setEditar(true);
  };

  const handleDelete = async (role: Role) => {
    const confirm = window.confirm(`¿Estás seguro de que deseas eliminar el rol "${role.name}"? Esta acción también actualizará usuarios relacionados.`);
    if (!confirm) return;

    const res = await fn_delete_role(role.id);
    if (res.success) {
      alert(res.message ?? "Rol eliminado correctamente.");
      onRefresh();
    } else {
      alert(res.message ?? "Error al eliminar el rol.");
    }
  };

  const closeEditModal = () => {
    setEditar(false);
    setSelectedRole(null);
    onRefresh();
  };

  return (
    <div className="mx-auto p-4 container">
      <Card className="bg-card shadow-sm p-6 border border-border rounded-lg w-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-semibold text-primary text-2xl">Roles</h1>
            <p className="mt-2 text-muted-foreground text-sm">Administra los roles del sistema.</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 py-2 text-white" onClick={() => setCrear(true)}>
            <Plus className="mr-2 w-4 h-4" /> Agregar
          </Button>
        </div>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center py-10 text-muted-foreground text-sm">Cargando roles...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Modulos Disponibles</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell>{role.name}</TableCell>
                    <TableCell>
                      {role.defaultModule.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {role.defaultModule.map((ent, index) => (
                            <span key={index} className={`inline-block px-4 text-center items-center py-1 text-xs font-semibold rounded-full bg-stone-200`}>
                              {ent}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">Ninguno</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setEditRole(role)}>
                          <Edit className="w-4 h-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(role)}>
                          <Trash className="w-4 h-4" />
                          <span className="sr-only">Eliminar</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {editar && selectedRole && (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/50 bg-opacity-50">
          <div className="bg-card shadow-2xl p-6 rounded-lg w-full max-w-md">
            <EditarRole role={selectedRole} onClose={closeEditModal} />
          </div>
        </div>
      )}

      {crear && (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/50 bg-opacity-50">
          <div className="bg-card shadow-2xl p-6 rounded-lg w-full max-w-md">
            <CrearRole
              onClose={() => {
                setCrear(false);
                onRefresh();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}