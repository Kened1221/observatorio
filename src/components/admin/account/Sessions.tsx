//src/components/account/Sessions.tsx
"use client";

import { revokeSpecificSession } from "@/actions/auth"; // Importa la acción corregida
import { useEffect, useState } from "react";
import { Smartphone, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { activeSessionsVerify } from "@/actions/user-actions";
import { useUserData } from "../utils/user-data";

interface Session {
  sessionToken: string;
  browserId: string;
  id: string;
  device: string;
  browser: string;
  os: string;
  location: string;
  lastActive: string;
  current: boolean;
}

const Sessions = ({ userId }: { userId: string }) => {
  const [activeSessions, setActiveSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { browserId, isReady } = useUserData();

  useEffect(() => {
    const fetchSessions = async () => {
      if (!isReady || !browserId) return;
      try {
        const sessions = await activeSessionsVerify({ id: userId, browserId });
        setActiveSessions(
          sessions.map((session) => ({
            ...session,
            browserId: session.browserId || "",
          }))
        );
      } catch (error) {
        console.error("Error fetching sessions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, [userId, browserId, isReady]);


  // --- Handler para cerrar una sesión específica ---
  const handleLogoutDevice = async (sessionTokenToRevoke: string) => {
    setIsLoading(true);
    try {
      // Llama a la acción corregida
      const result = await revokeSpecificSession({
        userId,
        sessionTokenToRevoke,
      });
      if (result.success) {
        // Actualiza el estado local eliminando la sesión revocada
        // Usa el browserId devuelto por la acción si lo necesitas, o filtra por token
        setActiveSessions((prev) =>
          prev.filter(
            (session) => session.sessionToken !== sessionTokenToRevoke
          )
        );
        console.log("Sesión remota revocada:", result.message);
      } else {
        console.error("Error al revocar sesión remota:", result.message);
        // Podrías mostrar una notificación al usuario
      }
    } catch (error) {
      console.error("Error en handleLogoutDevice:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading)
    return <div className="px-4 py-5 sm:p-6">Cargando sesiones...</div>;

  return (
    <div className="px-4 py-5 sm:p-6">
      <h2 className="text-lg font-medium text-secondary-foreground">
        Sesiones Activas
      </h2>
      <p className="mt-1 text-sm">
        Dispositivos donde tu cuenta está actualmente conectada.
      </p>
      <ul className="mt-5 divide-y">
        {activeSessions.map((session) => (
          <li
            key={session.sessionToken}
            className="py-4 flex items-center justify-between"
          >
            <div className="flex items-center">
              <Smartphone className="w-10 h-10 text-secondary-foreground" />
              <div className="ml-3">
                <p className="text-sm font-medium text-secondary-foreground">
                  {session.device}{" "}
                  {session.current && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-green-100 text-green-500">
                      Actual
                    </span>
                  )}
                </p>
                <div className="text-xs">
                  <span className="mr-3">Navegador: {session.browser}</span>
                  <span className="mr-3">SO: {session.os}</span>
                  <span className="mr-3">Ubicación: {session.location}</span>
                  <span>
                    Activo: {new Date(session.lastActive).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            {!session.current && (
              <Button
                variant="destructive"
                onClick={() => handleLogoutDevice(session.sessionToken)}
              >
                <LogOut className="w-3 h-3 mr-1" /> Cerrar sesión
              </Button>
            )}
          </li>
        ))}
        {activeSessions.length === 0 && (
          <li className="py-8 text-center">
            No hay sesiones activas actualmente.
          </li>
        )}
      </ul>
    </div>
  );
};

export default Sessions;
