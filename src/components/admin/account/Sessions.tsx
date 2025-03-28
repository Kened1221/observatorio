"use client";

import { useEffect, useState } from "react";
import { Smartphone, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { closeSession } from "@/actions/auth";
import { activeSessionsVerify } from "@/actions/user-actions";
import { useUserData } from "../utils/user-data";
import { signOut } from "next-auth/react";
import io from "socket.io-client";

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

interface SessionsProps {
  userId: string;
  sessionToken: string | null;
}

const Sessions = ({ userId, sessionToken }: SessionsProps) => {
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

  useEffect(() => {
    if (!isReady || !browserId || !userId || !sessionToken) return;

    const socket = io("http://localhost:8080", {
      query: { browserId, userId },
      auth: { token: sessionToken },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log(`Socket.IO conectado: browserId=${browserId}`);
    });

    socket.on("sessionClosed", (data: { browserId: string }) => {
      if (data.browserId === browserId) {
        signOut({ callbackUrl: "/login" });
      } else {
        setActiveSessions((prev) =>
          prev.filter((session) => session.browserId !== data.browserId)
        );
      }
    });

    socket.on("disconnect", () => {
      console.log(`Socket.IO desconectado: browserId=${browserId}`);
    });

    socket.on("reconnect", () => {
      console.log(`Socket.IO reconectado: browserId=${browserId}`);
    });

    return () => {
      socket.disconnect();
    };
  }, [browserId, userId, isReady, sessionToken]);

  const handleLogoutDevice = async (sessionToken: string) => {
    setIsLoading(true);
    try {
      const result = await closeSession({ userId, sessionToken });
      if (result.success) {
        setActiveSessions((prev) =>
          prev.filter((session) => session.sessionToken !== sessionToken)
        );
        console.log("Sesión cerrada exitosamente:", result.message);
      } else {
        console.error("Error al cerrar sesión:", result.message);
      }
    } catch (error) {
      console.error("Error logging out device:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading)
    return <div className="px-4 py-5 sm:p-6">Cargando sesiones...</div>;

  return (
    <div className="px-4 py-5 sm:p-6">
      <h2 className="text-lg font-medium">Sesiones Activas</h2>
      <p className="mt-1 text-sm">Dispositivos donde tu cuenta está actualmente conectada.</p>
      <ul className="mt-5 divide-y">
        {activeSessions.map((session) => (
          <li
            key={session.sessionToken}
            className="py-4 flex items-center justify-between"
          >
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
          <li className="py-8 text-center">No hay sesiones activas actualmente.</li>
        )}
      </ul>
    </div>
  );
};

export default Sessions;