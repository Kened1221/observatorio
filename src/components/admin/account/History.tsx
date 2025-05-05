// components/account/History.tsx
"use client";

import { useEffect, useState } from "react";
import { Smartphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { historySessions } from "@/actions/user-actions";
import DynamicTable from "../table/dynamic-table";

interface SessionHistory {
  id: string;
  device: string;
  browser: string;
  location: string;
  timestamp: string;
  status: string;
}

interface HistoryProps {
  userId: string;
}

const History = ({ userId }: HistoryProps) => {
  const [sessionHistory, setSessionHistory] = useState<SessionHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await historySessions({ id: userId });
        setSessionHistory(history);
      } catch (error) {
        console.error("Error fetching session history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [userId]);

  const columns = [
    {
      key: "device",
      header: "Dispositivo",
      filterable: true,
      getFilterValue: (row: SessionHistory) => row.device, // Usar solo el valor de device para el filtro
      render: (row: SessionHistory) => (
        <div className="flex items-center">
          <Smartphone className="w-5 h-5 mr-2" />
          <div>
            <div className="text-sm font-medium">{row.device}</div>
            <div className="text-xs text-muted-foreground">{row.browser}</div>
          </div>
        </div>
      ),
    },
    {
      key: "location",
      header: "Ubicación",
      filterable: true,
      getFilterValue: (row: SessionHistory) => row.location, // Usar el valor de location directamente
      render: (row: SessionHistory) => (
        <div className="text-sm text-muted-foreground">{row.location}</div>
      ),
    },
    {
      key: "timestamp",
      header: "Fecha y Hora",
      filterable: true,
      getFilterValue: (row: SessionHistory) =>
        new Date(row.timestamp).toLocaleDateString(), // Usar solo la fecha para el filtro
      render: (row: SessionHistory) => (
        <div>
          <div className="text-sm text-primary-foreground">
            {new Date(row.timestamp).toLocaleDateString()}
          </div>
          <div className="text-xs text-muted-foreground">
            {new Date(row.timestamp).toLocaleTimeString()}
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Estado",
      filterable: true,
      getFilterValue: (row: SessionHistory) => row.status,
      render: (row: SessionHistory) => (
        <Badge
          variant={row.status === "inactive" ? "secondary" : "destructive"}
        >
          {row.status}
        </Badge>
      ),
    },
  ];

  if (isLoading)
    return <div className="px-4 py-5 sm:p-6">Cargando historial de sesiones...</div>;

  return (
    <div className="px-4 py-5 sm:p-6 text-secondary-foreground">
      <h2 className="text-lg font-medium">Historial de Sesiones</h2>
      <p className="mt-1 text-sm">Registro de inicios de sesión recientes en tu cuenta.</p>
      <div className="mt-5">
        <DynamicTable
          data={sessionHistory}
          columns={columns}
          itemsPerPage={5}
          emptyMessage="No hay historial de sesiones disponible"
        />
      </div>
    </div>
  );
};

export default History;