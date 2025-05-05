import { fn_get_users, fn_reset_password } from "@/actions/user-m-actions";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, CircleAlert } from "lucide-react";
import * as React from "react";
import { TableContent } from "../../table/table-content";
import { fn_format_date } from "@/admin/helpers/date-helper";
import { UserRecord } from "@/admin/types/user-types";

export default function PagePassword() {
  const [data, setData] = React.useState<UserRecord[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [user_id, setUserId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchUsers = async () => {
      const res = await fn_get_users();
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
      accessorKey: "estado",
      header: "Estado",
      cell: ({ row }) => {
        const activo = row.original.active === 1;
        return (
          <span
            className={`text-sm font-semibold  ${
              activo ? "text-green-600" : "text-red-600"
            }`}
          >
            {activo ? "activo" : "inactivo"}
          </span>
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
                {ent}
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
          onRowClick={(row) => setUserId(row.id)}
        />
      )}

      <div className="flex flex-col gap-2">
        {user_id && (
          <RestorePassword
            user={data.find((u) => u.id === user_id)!}
            onClose={() => setUserId(null)}
          />
        )}
      </div>
    </div>
  );
}

export const RestorePassword = ({
  user,
  onClose,
}: {
  user: UserRecord;
  onClose: () => void;
}) => {
  const [isPending, startTransition] = React.useTransition();

  const handleRestorePassword = (enable: boolean) => {
    startTransition(async () => {
      try {
        const res = await fn_reset_password(user.id, enable);
        if (res.success) {
          console.log("✅", res.message);
        } else {
          console.error("❌", res.message);
        }
        onClose();
      } catch (error) {
        console.error("🔥 Error inesperado:", error);
      }
    });
  };

  return (
    <div className="flex flex-col gap-2 p-4">
      <h2 className="font-semibold text-lg">Restaurar Contraseña</h2>
      <p>
        ¿Estás seguro de que deseas restaurar la contraseña de{" "}
        <strong className="text-primary">{user.name}</strong>?
      </p>
      {!user.active && (
        <p>
          El usuario fue deshabilitado el{" "}
          <strong className="text-red-500">
            {user.date_inactive && fn_format_date(user.date_inactive)}
          </strong>
        </p>
      )}

      <div className="flex flex-row items-center gap-2 text-slate-600">
        <CircleAlert size={16} />
        <p className="text-sm">
          La contraseña será el número de identificación nacional del usuario.
        </p>
      </div>

      <div className="flex flex-row justify-end items-center gap-4 mt-4">
        <Button variant="secondary" onClick={onClose} disabled={isPending}>
          Cancelar
        </Button>
        {!user.active && (
          <Button
            onClick={() => handleRestorePassword(true)}
            disabled={isPending}
          >
            Restablecer y habilitar
          </Button>
        )}
        <Button
          onClick={() => handleRestorePassword(false)}
          disabled={isPending}
        >
          Restaurar Contraseña
        </Button>
      </div>
    </div>
  );
};
