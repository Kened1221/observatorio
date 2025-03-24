"use client";

import * as React from "react";
import { User, Mail, Plus, Edit, Trash } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sidebarMenus } from "@/admin/utils/data-sidebar";

// Simulación de una API
const fetchUsers = async () => {
  return [
    {
      id: 1,
      name: "Juan Pérez",
      email: "juan.perez@example.com",
      role: "Administrador",
      permissions: {
        "/admin": ["leer", "crear", "editar", "eliminar"],
        "/admin/issue/health-and-nutrition": ["leer", "editar"],
      },
      customPermissions: ["Acceso especial"],
    },
    {
      id: 2,
      name: "María Gómez",
      email: "maria.gomez@example.com",
      role: null,
      permissions: {
        "/admin/issue/health-and-nutrition": ["leer"],
      },
      customPermissions: [],
    },
  ];
};

const fetchRoles = async () => [
  { id: 1, name: "Administrador" },
  { id: 2, name: "Editor" },
];

const fetchRolePermissions = async (roleName: string) => {
  const roles = await fetchRoles();
  const role = roles.find((r) => r.name === roleName);
  return role
    ? {
        Administrador: {
          "/admin": ["leer", "crear", "editar", "eliminar"],
          "/admin/issue/health-and-nutrition": ["leer", "editar"],
        },
        Editor: {
          "/admin/issue/health-and-nutrition": ["leer", "editar"],
        },
      }[roleName] || {}
    : {};
};

const fetchPermissions = async () => {
  const perms = sidebarMenus
    .flatMap((group) => group.menu)
    .flatMap((item) => [...(item.items || []).map((subItem) => subItem.url || item.url)])
    .filter((url) => url);
  return perms;
};

const createUser = async (user: { name: string; email: string; role: string | null; permissions: Record<string, string[]>; customPermissions: string[] }) => {
  return { success: true, user: { id: Math.random(), ...user } };
};

const updateUser = async (id: number, user: { name: string; email: string; role: string | null; permissions: Record<string, string[]>; customPermissions: string[] }) => {
  return { success: true, id, user };
};

const deleteUser = async (id: number) => {
  return { success: true, id };
};

export default function UsersPage() {
  const [users, setUsers] = React.useState<
    { id: number; name: string; email: string; role: string | null; permissions: Record<string, string[]>; customPermissions: string[] }[]
  >([]);
  const [roles, setRoles] = React.useState<{ id: number; name: string }[]>([]);
  const [pages, setPages] = React.useState<string[]>([]);
  const [newUser, setNewUser] = React.useState({ name: "", email: "", role: null, permissions: {} as Record<string, string[]>, customPermissions: [] as string[] });
  const [editUser, setEditUser] = React.useState<
    { id: number; name: string; email: string; role: string | null; permissions: Record<string, string[]>; customPermissions: string[] } | null
  >(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);

  React.useEffect(() => {
    const loadData = async () => {
      const [usersData, rolesData, pagesData] = await Promise.all([fetchUsers(), fetchRoles(), fetchPermissions()]);
      setUsers(usersData);
      setRoles(rolesData);
      setPages(pagesData);
    };
    loadData();
  }, []);

  const updatePermission = (page: string, action: string, checked: boolean) => {
    setEditUser((prev) => {
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

  const syncRolePermissions = async (role: string | null) => {
    if (!editUser) return;
    const rolePerms = role ? await fetchRolePermissions(role) : {};
    setEditUser((prev) => (prev ? { ...prev, permissions: rolePerms } : prev));
  };

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email) {
      setError("El nombre y el correo son requeridos.");
      return;
    }
    const result = await createUser(newUser);
    if (result.success) {
      setUsers([...users, result.user]);
      setNewUser({ name: "", email: "", role: null, permissions: {}, customPermissions: [] });
      setIsAddDialogOpen(false);
    } else {
      setError("Error al agregar el usuario.");
    }
  };

  const handleEditUser = async () => {
    if (!editUser) return;
    const result = await updateUser(editUser.id, editUser);
    if (result.success) {
      setUsers(users.map((user) => (user.id === editUser.id ? { ...user, ...editUser } : user)));
      setEditUser(null);
    } else {
      setError("Error al editar el usuario.");
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar este usuario?")) {
      const result = await deleteUser(id);
      if (result.success) {
        setUsers(users.filter((user) => user.id !== id));
      } else {
        setError("Error al eliminar el usuario.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Parte izquierda: Tabla de usuarios */}
        <Card className="w-full rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-primary">Usuarios</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Administra los usuarios del sistema.
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
                  <TableHead>Correo</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Permisos</TableHead>
                  <TableHead>Permisos Custom</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role || "Sin rol"}</TableCell>
                    <TableCell>
                      {Object.entries(user.permissions)
                        .map(([page, actions]) => `${page}: ${actions.join(", ")}`)
                        .join("; ") || "Ninguno"}
                    </TableCell>
                    <TableCell>{user.customPermissions.join(", ") || "Ninguno"}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditUser({ ...user })}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteUser(user.id)}
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
              {editUser ? "Editar Usuario" : "Selecciona un usuario"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {editUser
                ? "Edita los datos del usuario seleccionado."
                : "Selecciona un usuario para editar sus datos."}
            </p>
          </div>

          <CardContent className="space-y-6 p-0">
            {editUser ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Nombre</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-4 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="edit-name"
                      type="text"
                      value={editUser.name}
                      onChange={(e) =>
                        setEditUser({ ...editUser, name: e.target.value })
                      }
                      className="pl-10 py-6"
                      placeholder="Ingresa el nombre"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-email">Correo electrónico</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-4 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="edit-email"
                      type="email"
                      value={editUser.email}
                      onChange={(e) =>
                        setEditUser({ ...editUser, email: e.target.value })
                      }
                      className="pl-10 py-6"
                      placeholder="Ingresa el correo"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-role">Rol</Label>
                  <Select
                    value={editUser.role || ""}
                    onValueChange={(value) => {
                      setEditUser({ ...editUser, role: value || null });
                      syncRolePermissions(value || null);
                    }}
                  >
                    <SelectTrigger className="w-full py-6">
                      <SelectValue placeholder="Selecciona un rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Sin rol</SelectItem>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.name}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                              checked={(editUser.permissions[page] || []).includes(action)}
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
                    value={editUser.customPermissions.join(", ")}
                    onChange={(e) =>
                      setEditUser({
                        ...editUser,
                        customPermissions: e.target.value.split(",").map((p) => p.trim()),
                      })
                    }
                    className="py-6"
                    placeholder="Ingresa permisos custom (separados por coma)"
                  />
                </div>

                <Button
                  className="w-full bg-primary hover:bg-primary/90 py-5"
                  onClick={handleEditUser}
                >
                  Guardar cambios
                </Button>
              </>
            ) : (
              <p className="text-center text-muted-foreground">
                Selecciona un usuario de la lista para editar.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Agregar nuevo usuario</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-name">Nombre</Label>
              <Input
                id="new-name"
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                placeholder="Ingresa el nombre"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-email">Correo electrónico</Label>
              <Input
                id="new-email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="Ingresa el correo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-role">Rol</Label>
              <Select
                value={newUser.role || ""}
                onValueChange={(value) => {
                  setNewUser({ ...newUser, role: value || null });
                  syncRolePermissions(value || null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Sin rol</SelectItem>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.name}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                          checked={(newUser.permissions[page] || []).includes(action)}
                          onCheckedChange={(checked) =>
                            setNewUser((prev) => {
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
                value={newUser.customPermissions.join(", ")}
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
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
            <Button onClick={handleAddUser}>Agregar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}