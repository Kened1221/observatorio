// components/account/History.tsx
"use client";

import { useEffect, useState } from "react";
import { Smartphone } from "lucide-react";

interface SessionHistory {
  id: number;
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
        const res = await fetch(`/api/session-history?userId=${userId}`);
        const data = await res.json();
        setSessionHistory(data.history);
      } catch (error) {
        console.error("Error fetching session history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [userId]);

  if (isLoading)
    return <div className="px-4 py-5 sm:p-6">Cargando historial de sesiones...</div>;

  return (
    <div className="px-4 py-5 sm:p-6">
      <h2 className="text-lg font-medium">Historial de Sesiones</h2>
      <p className="mt-1 text-sm">Registro de inicios de sesión recientes en tu cuenta.</p>
      <div className="mt-5 overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-card">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-foreground uppercase tracking-wider">
                Dispositivo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-foreground uppercase tracking-wider">
                Ubicación
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-foreground uppercase tracking-wider">
                Fecha y Hora
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-foreground uppercase tracking-wider">
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {sessionHistory.map((session) => (
              <tr key={session.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Smartphone className="w-5 h-5 mr-2" />
                    <div className="text-sm font-medium">{session.device}</div>
                  </div>
                  <div className="text-xs text-secondary-foreground mt-1">{session.browser}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-secondary-foreground">{session.location}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-primary-foreground">
                    {new Date(session.timestamp).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-secondary-foreground">
                    {new Date(session.timestamp).toLocaleTimeString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    session.status === "Cerrada" ? "bg-gray-100 text-gray-800" : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {session.status}
                  </span>
                </td>
              </tr>
            ))}
            {sessionHistory.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  No hay historial de sesiones disponible.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History;
