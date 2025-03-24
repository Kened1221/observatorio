"use client";

import * as React from "react";
import { Lock, Plus, Edit, Trash } from "lucide-react";
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
import { sidebarMenus } from "@/admin/utils/data-sidebar";

// Simulación de una API
const fetchPermissions = async () => {
  const permissions = sidebarMenus
    .flatMap((group) => group.menu)
    .flatMap((item) => [
      ...(item.items || []).map((subItem) => ({
        id: `${item.url || subItem.url}-leer`,
        name: `Leer ${subItem.label || item.label}`,
        page: subItem.url || item.url,
        action: "leer",
      })),
      ...(item.items || []).map((subItem) => ({
        id: `${item.url || subItem.url}-crear`,
        name: `Crear ${subItem.label || item.label}`,
        page: subItem.url || item.url,
        action: "crear",
      })),
      ...(item.items || []).map((subItem) => ({
        id: `${item.url || subItem.url}-editar`,
        name: `Editar ${subItem.label || item.label}`,
        page: subItem.url || item.url,
        action: "editar",
      })),
      ...(item.items || []).map((subItem) => ({
        id: `${item.url || subItem.url}-eliminar`,
        name: `Eliminar ${subItem.label || item.label}`,
        page: subItem.url || item.url,
        action: "eliminar",
      })),
    ])
    .filter((perm) => perm.page); // Filtra permisos de páginas válidas
  return permissions;
};

const createPermission = async (permission: { name: string; page: string; action: string }) => {
  return { success: true, permission: { id: Math.random(), ...permission } };
};

const updatePermission = async (id: number, permission: { name: string; page: string; action: string }) => {
  return { success: true, id, permission };
};

const deletePermission = async (id: number) => {
  return { success: true, id };
};

export default function PermissionsPage() {
  const [permissions, setPermissions] = React.useState<
    { id: number; name: string; page: string; action: string }[]
  >([]);
  const [newPermission, setNewPermission] = React.useState({ name: "", page: "", action: "" });
  const [editPermission, setEditPermission] = React.useState<
    { id: number; name: string; page: string; action: string } | null
  >(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);

  React.useEffect(() => {
    const loadPermissions = async () => {
      const permsData = await fetchPermissions();
      setPermissions(permsData);
    };
    loadPermissions();
  }, []);

  const handleAddPermission = async () => {
    if (!newPermission.name || !newPermission.page || !newPermission.action) {
      setError("Todos los campos son requeridos.");
      return;
    }
    const result = await createPermission(newPermission);
    if (result.success) {
      setPermissions([...permissions, result.permission]);
      setNewPermission({ name: "", page: "", action: "" });
      setIsAddDialogOpen(false);
    } else {
      setError("Error al agregar el permiso.");
    }
  };

  const handleEditPermission = async () => {
    if (!editPermission) return;
    const result = await updatePermission(editPermission.id, editPermission);
    if (result.success) {
      setPermissions(
        permissions.map((perm) =>
          perm.id === editPermission.id ? { ...perm, ...editPermission } : perm
        )
      );
      setEditPermission(null);
    } else {
      setError("Error al editar el permiso.");
    }
  };

  const handleDeletePermission = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar este permiso?")) {
      const result = await deletePermission(id);
      if (result.success) {
        setPermissions(permissions.filter((perm) => perm.id !== id));
      } else {
        setError("Error al eliminar el permiso.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Parte izquierda: Tabla de permisos */}
        <Card className="w-full rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-primary">Permisos</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Administra los permisos del sistema.
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
                  <TableHead>Página</TableHead>
                  <TableHead>Acción</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {permissions.map((permission) => (
                  <TableRow key={permission.id}>
                    <TableCell>{permission.name}</TableCell>
                    <TableCell>{permission.page}</TableCell>
                    <TableCell>{permission.action}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditPermission({ ...permission })}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeletePermission(permission.id)}
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
              {editPermission ? "Editar Permiso" : "Selecciona un permiso"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {editPermission
                ? "Edita los datos del permiso seleccionado."
                : "Selecciona un permiso para editar sus datos."}
            </p>
          </div>

          <CardContent className="space-y-6 p-0">
            {editPermission ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="edit-permission-name">Nombre</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-4 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="edit-permission-name"
                      type="text"
                      value={editPermission.name}
                      onChange={(e) =>
                        setEditPermission({
                          ...editPermission,
                          name: e.target.value,
                        })
                      }
                      className="pl-10 py-6"
                      placeholder="Ingresa el nombre del permiso"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-page">Página</Label>
                  <Input
                    id="edit-page"
                    type="text"
                    value={editPermission.page}
                    onChange={(e) =>
                      setEditPermission({
                        ...editPermission,
                        page: e.target.value,
                      })
                    }
                    className="py-6"
                    placeholder="Ingresa la URL de la página"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-action">Acción</Label>
                  <Input
                    id="edit-action"
                    type="text"
                    value={editPermission.action}
                    onChange={(e) =>
                      setEditPermission({
                        ...editPermission,
                        action: e.target.value,
                      })
                    }
                    className="py-6"
                    placeholder="Ingresa la acción (leer, crear, editar, eliminar)"
                  />
                </div>

                <Button
                  className="w-full bg-primary hover:bg-primary/90 py-5"
                  onClick={handleEditPermission}
                >
                  Guardar cambios
                </Button>
              </>
            ) : (
              <p className="text-center text-muted-foreground">
                Selecciona un permiso de la lista para editar.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Agregar nuevo permiso</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-permission-name">Nombre</Label>
              <Input
                id="new-permission-name"
                type="text"
                value={newPermission.name}
                onChange={(e) =>
                  setNewPermission({ ...newPermission, name: e.target.value })
                }
                placeholder="Ingresa el nombre del permiso"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-page">Página</Label>
              <Input
                id="new-page"
                type="text"
                value={newPermission.page}
                onChange={(e) =>
                  setNewPermission({ ...newPermission, page: e.target.value })
                }
                placeholder="Ingresa la URL de la página"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-action">Acción</Label>
              <Input
                id="new-action"
                type="text"
                value={newPermission.action}
                onChange={(e) =>
                  setNewPermission({ ...newPermission, action: e.target.value })
                }
                placeholder="Ingresa la acción (leer, crear, editar, eliminar)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddPermission}>Agregar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}