"use client";

import * as React from "react";
import { ShieldCheck, Plus, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { sidebarMenus } from "@/admin/utils/data-sidebar";

// Simulación de una API
const fetchRoles = async () => {
  return [
    {
      id: 1,
      name: "Administrador",
      permissions: {
        "/admin": ["leer", "crear", "editar", "eliminar"],
        "/admin/issue/health-and-nutrition": ["leer", "editar"],
      },
      customPermissions: ["Acceso especial"],
    },
    {
      id: 2,
      name: "Editor",
      permissions: {
        "/admin/issue/health-and-nutrition": ["leer", "editar"],
      },
      customPermissions: [],
    },
  ];
};

const fetchPermissions = async () => {
  const perms = sidebarMenus
    .flatMap((group) => group.menu)
    .flatMap((item) => [...(item.items || []).map((subItem) => subItem.url || item.url)])
    .filter((url) => url);
  return perms;
};

const createRole = async (role: { name: string; permissions: Record<string, string[]>; customPermissions: string[] }) => {
  return { success: true, role: { id: Math.random(), ...role } };
};

const updateRole = async (id: number, role: { name: string; permissions: Record<string, string[]>; customPermissions: string[] }) => {
  return { success: true, id, role };
};

const deleteRole = async (id: number) => {
  return { success: true, id };
};

export default function RolesPage() {
  const [roles, setRoles] = React.useState<
    { id: number; name: string; permissions: Record<string, string[]>; customPermissions: string[] }[]
  >([]);
  const [pages, setPages] = React.useState<string[]>([]);
  const [newRole, setNewRole] = React.useState({ name: "", permissions: {} as Record<string, string[]>, customPermissions: [] as string[] });
  const [editRole, setEditRole] = React.useState<
    { id: number; name: string; permissions: Record<string, string[]>; customPermissions: string[] } | null
  >(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);

  React.useEffect(() => {
    const loadData = async () => {
      const [rolesData, pagesData] = await Promise.all([fetchRoles(), fetchPermissions()]);
      setRoles(rolesData);
      setPages(pagesData);
    };
    loadData();
  }, []);

  const handleAddRole = async () => {
    if (!newRole.name) {
      setError("El nombre del rol es requerido.");
      return;
    }
    const result = await createRole(newRole);
    if (result.success) {
      setRoles([...roles, result.role]);
      setNewRole({ name: "", permissions: {}, customPermissions: [] });
      setIsAddDialogOpen(false);
    } else {
      setError("Error al agregar el rol.");
    }
  };

  const handleEditRole = async () => {
    if (!editRole) return;
    const result = await updateRole(editRole.id, editRole);
    if (result.success) {
      setRoles(roles.map((role) => (role.id === editRole.id ? { ...role, ...editRole } : role)));
      setEditRole(null);
    } else {
      setError("Error al editar el rol.");
    }
  };

  const handleDeleteRole = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar este rol?")) {
      const result = await deleteRole(id);
      if (result.success) {
        setRoles(roles.filter((role) => role.id !== id));
      } else {
        setError("Error al eliminar el rol.");
      }
    }
  };

  const updatePermission = (page: string, action: string, checked: boolean) => {
    setEditRole((prev) => {
      if (!prev) return prev;
      const newPermissions = { ...prev.permissions };
      if (checked) {
        newPermissions[page] = [...(newPermissions[page] || []), action];
      } else {
        newPermissions[page] = (newPermissions[page] || []).filter((a) => a !== action);
        if (newPermissions[page].length === 0) delete newPermissions[page];
      }
      return { ...prev, permissions: newPermissions };
    });
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Parte izquierda: Tabla de roles */}
        <Card className="w-full rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-primary">Roles</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Administra los roles del sistema.
              </p>
            </div>
            <Button
              className="bg-indigo-500 hover:bg-indigo-600 py-2"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" /> Agregar
            </Button>
          </div>

          <CardContent className="p-0">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Permisos</TableHead>
                  <TableHead>Permisos Custom</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell>{role.name}</TableCell>
                    <TableCell>
                      {Object.entries(role.permissions)
                        .map(([page, actions]) => `${page}: ${actions.join(", ")}`)
                        .join("; ") || "Ninguno"}
                    </TableCell>
                    <TableCell>{role.customPermissions.join(", ") || "Ninguno"}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditRole({ ...role })}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteRole(role.id)}
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Eliminar</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Parte derecha: Formulario de edición */}
        <Card className="w-full rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-primary">
              {editRole ? "Editar Rol" : "Selecciona un rol"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {editRole
                ? "Edita los datos del rol seleccionado."
                : "Selecciona un rol para editar sus datos."}
            </p>
          </div>

          <CardContent className="space-y-6 p-0">
            {editRole ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="edit-role-name">Nombre</Label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-3 top-4 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="edit-role-name"
                      type="text"
                      value={editRole.name}
                      onChange={(e) =>
                        setEditRole({ ...editRole, name: e.target.value })
                      }
                      className="pl-10 py-6"
                      placeholder="Ingresa el nombre del rol"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Permisos por página</Label>
                  {pages.map((page) => (
                    <div key={page} className="space-y-2">
                      <Label className="font-normal">{page}</Label>
                      <div className="flex gap-2">
                        {["leer", "crear", "editar", "eliminar"].map((action) => (
                          <div key={action} className="flex items-center space-x-2">
                            <Checkbox
                              checked={(editRole.permissions[page] || []).includes(action)}
                              onCheckedChange={(checked) =>
                                updatePermission(page, action, checked as boolean)
                              }
                            />
                            <Label>{action}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="custom-permissions">Permisos Custom</Label>
                  <Input
                    id="custom-permissions"
                    type="text"
                    value={editRole.customPermissions.join(", ")}
                    onChange={(e) =>
                      setEditRole({
                        ...editRole,
                        customPermissions: e.target.value.split(",").map((p) => p.trim()),
                      })
                    }
                    className="py-6"
                    placeholder="Ingresa permisos custom (separados por coma)"
                  />
                </div>

                <Button
                  className="w-full bg-primary hover:bg-primary/90 py-5"
                  onClick={handleEditRole}
                >
                  Guardar cambios
                </Button>
              </>
            ) : (
              <p className="text-center text-muted-foreground">
                Selecciona un rol de la lista para editar.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Agregar nuevo rol</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-role-name">Nombre</Label>
              <Input
                id="new-role-name"
                type="text"
                value={newRole.name}
                onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                placeholder="Ingresa el nombre del rol"
              />
            </div>
            <div className="space-y-2">
              <Label>Permisos por página</Label>
              {pages.map((page) => (
                <div key={page} className="space-y-2">
                  <Label className="font-normal">{page}</Label>
                  <div className="flex gap-2">
                    {["leer", "crear", "editar", "eliminar"].map((action) => (
                      <div key={action} className="flex items-center space-x-2">
                        <Checkbox
                          checked={(newRole.permissions[page] || []).includes(action)}
                          onCheckedChange={(checked) =>
                            setNewRole((prev) => {
                              const newPermissions = { ...prev.permissions };
                              if (checked) {
                                newPermissions[page] = [...(newPermissions[page] || []), action];
                              } else {
                                newPermissions[page] = (newPermissions[page] || []).filter(
                                  (a) => a !== action
                                );
                                if (newPermissions[page].length === 0)
                                  delete newPermissions[page];
                              }
                              return { ...prev, permissions: newPermissions };
                            })
                          }
                        />
                        <Label>{action}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Label htmlFor="custom-permissions">Permisos Custom</Label>
              <Input
                id="custom-permissions"
                type="text"
                value={newRole.customPermissions.join(", ")}
                onChange={(e) =>
                  setNewRole({
                    ...newRole,
                    customPermissions: e.target.value.split(",").map((p) => p.trim()),
                  })
                }
                placeholder="Ingresa permisos custom (separados por coma)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddRole}>Agregar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}