"use client";

import React, { useState, useEffect } from "react";
import { Edit, Trash, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import DynamicTable from "@/components/admin/table/dynamic-table";
import { createPermission, fetchModules, fetchPermissions, updatePermission } from "@/actions/permission-actions";

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState([]);
  const [modules, setModules] = useState([]);
  const [newPermission, setNewPermission] = useState({
    name: "",
    moduleId: "",
    canRead: false,
    canWrite: false,
    canEdit: false,
    canDelete: false,
  });
  const [editPermission, setEditPermission] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const [perms, mods] = await Promise.all([
        fetchPermissions(),
        fetchModules(),
      ]);
      setPermissions(perms);
      setModules(mods);
    };
    loadData();
  }, []);

  const columns = [
    { key: "name", header: "Nombre", filterable: true },
    {
      key: "moduleId",
      header: "Módulo",
      render: (row) =>
        modules.find((m) => m.id === row.moduleId)?.name || row.moduleId,
      filterable: true,
    },
    {
      key: "canRead",
      header: "Leer",
      render: (row) => (row.canRead ? "Sí" : "No"),
      filterable: true,
    },
    {
      key: "canWrite",
      header: "Crear",
      render: (row) => (row.canWrite ? "Sí" : "No"),
      filterable: true,
    },
    {
      key: "canEdit",
      header: "Editar",
      render: (row) => (row.canEdit ? "Sí" : "No"),
      filterable: true,
    },
    {
      key: "canDelete",
      header: "Eliminar",
      render: (row) => (row.canDelete ? "Sí" : "No"),
      filterable: true,
    },
  ];

  const actions = [
    {
      label: "Editar",
      onClick: (row) => setEditPermission(row),
      icon: <Edit className="h-4 w-4" />,
      variant: "outline",
    },
    {
      label: "Eliminar",
      onClick: (row) => handleDelete(row.id),
      icon: <Trash className="h-4 w-4" />,
      variant: "destructive",
    },
  ];

  const handleAdd = async () => {
    const result = await createPermission(newPermission);
    if (result.success) {
      setPermissions([...permissions, result.permission]);
      setNewPermission({
        name: "",
        moduleId: "",
        canRead: false,
        canWrite: false,
        canEdit: false,
        canDelete: false,
      });
      setIsAddDialogOpen(false);
      toast.success("Permiso creado exitosamente");
    } else {
      toast.error(result.message);
    }
  };

  const handleEdit = async () => {
    if (!editPermission) return;
    const result = await updatePermission(editPermission.id, editPermission);
    if (result.success) {
      setPermissions(
        permissions.map((p) =>
          p.id === editPermission.id ? result.permission : p
        )
      );
      setEditPermission(null);
      toast.success("Permiso actualizado exitosamente");
    } else {
      toast.error(result.message);
    }
  };

  const handleDelete = async (id) => {
    const result = await deletePermission(id);
    if (result.success) {
      setPermissions(permissions.filter((p) => p.id !== id));
      toast.success("Permiso eliminado exitosamente");
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="p-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-primary">Permisos</h1>
            <p className="text-sm text-muted-foreground">
              Administra los permisos del sistema
            </p>
          </div>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-indigo-500 hover:bg-indigo-600"
          >
            <Plus className="mr-2 h-4 w-4" /> Agregar
          </Button>
        </div>
        <DynamicTable data={permissions} columns={columns} actions={actions} />
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Permiso</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nombre (Rol)</Label>
              <Input
                value={newPermission.name}
                onChange={(e) =>
                  setNewPermission({ ...newPermission, name: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Módulo</Label>
              <select
                value={newPermission.moduleId}
                onChange={(e) =>
                  setNewPermission({
                    ...newPermission,
                    moduleId: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
              >
                <option value="">Selecciona un módulo</option>
                {modules.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-4">
              <label>
                <input
                  type="checkbox"
                  checked={newPermission.canRead}
                  onChange={(e) =>
                    setNewPermission({
                      ...newPermission,
                      canRead: e.target.checked,
                    })
                  }
                />{" "}
                Leer
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={newPermission.canWrite}
                  onChange={(e) =>
                    setNewPermission({
                      ...newPermission,
                      canWrite: e.target.checked,
                    })
                  }
                />{" "}
                Crear
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={newPermission.canEdit}
                  onChange={(e) =>
                    setNewPermission({
                      ...newPermission,
                      canEdit: e.target.checked,
                    })
                  }
                />{" "}
                Editar
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={newPermission.canDelete}
                  onChange={(e) =>
                    setNewPermission({
                      ...newPermission,
                      canDelete: e.target.checked,
                    })
                  }
                />{" "}
                Eliminar
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAdd}>Agregar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {editPermission && (
        <Dialog
          open={!!editPermission}
          onOpenChange={() => setEditPermission(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Permiso</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nombre (Rol)</Label>
                <Input
                  value={editPermission.name}
                  onChange={(e) =>
                    setEditPermission({
                      ...editPermission,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label>Módulo</Label>
                <select
                  value={editPermission.moduleId}
                  onChange={(e) =>
                    setEditPermission({
                      ...editPermission,
                      moduleId: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="">Selecciona un módulo</option>
                  {modules.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-4">
                <label>
                  <input
                    type="checkbox"
                    checked={editPermission.canRead}
                    onChange={(e) =>
                      setEditPermission({
                        ...editPermission,
                        canRead: e.target.checked,
                      })
                    }
                  />{" "}
                  Leer
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={editPermission.canWrite}
                    onChange={(e) =>
                      setEditPermission({
                        ...editPermission,
                        canWrite: e.target.checked,
                      })
                    }
                  />{" "}
                  Crear
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={editPermission.canEdit}
                    onChange={(e) =>
                      setEditPermission({
                        ...editPermission,
                        canEdit: e.target.checked,
                      })
                    }
                  />{" "}
                  Editar
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={editPermission.canDelete}
                    onChange={(e) =>
                      setEditPermission({
                        ...editPermission,
                        canDelete: e.target.checked,
                      })
                    }
                  />{" "}
                  Eliminar
                </label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditPermission(null)}>
                Cancelar
              </Button>
              <Button onClick={handleEdit}>Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
