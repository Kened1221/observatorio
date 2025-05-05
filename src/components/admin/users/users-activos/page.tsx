"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { fn_get_users } from "@/actions/user-m-actions";
import { ColumnDef } from "@tanstack/react-table";
import { ModifyData } from "./modify-data";
import { UserRecord } from "@/admin/types/user-types";
import { TableContent } from "../../table/table-content";

export default function PageActivos() {
  const [data, setData] = React.useState<UserRecord[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [user_id, setUserId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchUsers = async () => {
      const res = await fn_get_users(1);
      if (res.success && res.response) setData(res.response);

      setLoading(false);
    };

    fetchUsers();
  }, []);

  const columns: ColumnDef<UserRecord>[] = [
    {
      accessorKey: "dni",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          DNI
          <ArrowUpDown className="ml-2 w-4 h-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("dni")}</div>,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nombre
          <ArrowUpDown className="ml-2 w-4 h-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Rol
          <ArrowUpDown className="ml-2 w-4 h-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const value = row.getValue("role") as string | null;
        return (
          <div>
            {value?.trim() || <strong className="text-red-600">Ninguno</strong>}
          </div>
        );
      },
    },
    {
      accessorKey: "modulos",
      header: "Modulos",
      cell: ({ row }) => {
        const modulos = row.getValue("modulos") as string[] | undefined;

        if (!modulos || modulos.length === 0) {
          return (
            <span className="text-red-600 text-sm">
              No hay modulos permitidas
            </span>
          );
        }

        return (
          <div className="flex flex-wrap gap-3">
            {modulos.map((ent, index) => (
              <span
                key={index}
                className={`inline-block transition-colors duration-200 py-1 text-xs font-semibold rounded-full bg-gray-200 border-gray-300} px-4 text-center items-center`}
              >
                {ent.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-4 w-full">
      {loading ? (
        <p className="text-muted-foreground text-sm">Cargando usuarios...</p>
      ) : (
        <TableContent<UserRecord>
          data={data}
          columns={columns}
          globalFilterPlaceholder="Buscar por DNI, nombre o fecha..."
          onRowClick={(row) => setUserId(row.id)} // <-- Captura el ID
        />
      )}

      <div className="flex flex-col gap-2">
        {user_id && (
          <ModifyData
            user_id={user_id}
            onRefresh={async () => {
              const res = await fn_get_users(1);
              if (res.success && res.response) setData(res.response);
              setUserId(null);
            }}
            onClose={() => setUserId(null)}
          />
        )}
      </div>
    </div>
  );
}
