// components/account/Sessions.tsx
"use client";

import { useEffect, useState } from "react";
import { Smartphone, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { activeSessionsVerify } from "@/actions/user-actions";

interface Session {
  id: string;
  device: string;
  browser: string;
  location: string;
  lastActive: string;
  current: boolean;
}

interface SessionsProps {
  userId: string;
}

const Sessions = ({ userId }: SessionsProps) => {
  const [activeSessions, setActiveSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const activeSessions = await activeSessionsVerify({ id: userId });
        setActiveSessions(activeSessions);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, [userId]);

  const handleLogoutDevice = async (sessionId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/logout-device`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId })
      });
      console.log("Logout device response:", res);
    } catch (error) {
      console.error("Error logging out device:", error);
    }
    setIsLoading(false);
  };

  if (isLoading)
    return <div className="px-4 py-5 sm:p-6">Cargando sesiones...</div>;

  return (
    <div className="px-4 py-5 sm:p-6">
      <h2 className="text-lg font-medium">Sesiones Activas</h2>
      <p className="mt-1 text-sm">Dispositivos donde tu cuenta está actualmente conectada.</p>
      <ul className="mt-5 divide-y">
        {activeSessions.map((session, i) => (
          <li key={i} className="py-4 flex items-center justify-between">
            <div className="flex items-center">
              <Smartphone className="w-10 h-10" />
              <div className="ml-3">
                <p className="text-sm font-medium">
                  {session.device}{" "}
                  {session.current && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-green-100 text-green-800">
                      Actual
                    </span>
                  )}
                </p>
                <div className="text-xs">
                  <span className="mr-3">Navegador: {session.browser}</span>
                  <span className="mr-3">Ubicación: {session.location}</span>
                  <span>
                    Activo: {new Date(session.lastActive).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            {!session.current && (
              <Button variant="destructive" onClick={() => handleLogoutDevice(session.id)}>
                <LogOut className="w-3 h-3 mr-1" /> Cerrar sesión
              </Button>
            )}
          </li>
        ))}
        {activeSessions.length === 0 && (
          <li className="py-8 text-center">No hay sesiones activas actualmente.</li>
        )}
      </ul>
    </div>
  );
};

export default Sessions;
