// src/components/context/SocketContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { io, Socket } from "socket.io-client";
import { useSession, signOut } from "next-auth/react";
import { useUserData } from "@/components/admin/utils/user-data";

interface SocketContextProps {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextProps>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: session, status } = useSession();
  const { browserId, isReady: userDataReady } = useUserData();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const disconnectSocket = useCallback(() => {
    if (socket) {
      console.log("[SocketProvider] Desconectando socket...");
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
    }
  }, [socket]);

  useEffect(() => {
    const sessionToken = session?.user.sessionToken;
    const userId = session?.user?.id;

    if (
      status === "authenticated" &&
      userDataReady &&
      browserId &&
      userId &&
      sessionToken
    ) {
      if (socket) {
        disconnectSocket();
      }

      console.log(
        `[SocketProvider] Intentando conectar con: userId=${userId}, browserId=${browserId}, token=${sessionToken.substring(0, 5)}...`
      );

      const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost";
      const socketPort = process.env.NEXT_PUBLIC_SOCKET_PORT || "8080";
      const fullSocketUrl = `${socketUrl}:${socketPort}`;

      const newSocket = io(fullSocketUrl, {
        query: {
          userId,
          browserId,
        },
        auth: {
          token: sessionToken,
        },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 3000,
      });

      newSocket.on("connect", () => {
        console.log(
          `[SocketProvider] Conectado exitosamente: SocketID=${newSocket.id}, BrowserID=${browserId}`
        );
        setIsConnected(true);
        setSocket(newSocket);
      });

      newSocket.on("disconnect", (reason) => {
        console.log(
          `[SocketProvider] Desconectado: BrowserID=${browserId}, Razón: ${reason}`
        );
        setIsConnected(false);
        if (reason === "io server disconnect") {
          console.warn("[SocketProvider] Desconexión forzada por el servidor.");
        }
      });

      newSocket.on("connect_error", (err) => {
        console.error(
          `[SocketProvider] Error de conexión: BrowserID=${browserId}, Error: ${err.message}`
        );
        setIsConnected(false);
        if (
          err.message.includes("inválido o expirado") ||
          err.message.includes("autenticación")
        ) {
          console.warn(
            "[SocketProvider] Error de autenticación, forzando logout local."
          );
          setTimeout(() => signOut({ callbackUrl: "/" }), 1500);
        }
      });

      newSocket.on(
        "sessionClosed",
        (data: { browserId: string; reason?: string; timestamp?: string }) => {
          console.log(
            `[SocketProvider] Evento 'sessionClosed' recibido: browserId=${data.browserId}, reason=${
              data.reason || "N/A"
            }, timestamp=${data.timestamp || "N/A"}`
          );

          if (data.browserId === browserId) {
            console.log(
              `[SocketProvider] Esta sesión (browserId=${browserId}) fue cerrada remotamente. Forzando logout.`
            );
            localStorage.removeItem(`session-updated-${userId}`);
            signOut({ callbackUrl: "/" });
          } else {
            console.log(
              `[SocketProvider] Otra sesión (browserId=${data.browserId}) fue cerrada. Este cliente (browserId=${browserId}) permanece activo.`
            );
          }
        }
      );

      setSocket(newSocket);

      return () => {
        disconnectSocket();
      };
    } else if (status !== "loading" && (!sessionToken || status === "unauthenticated")) {
      disconnectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, [status, userDataReady, browserId, session?.user?.id, session?.user.sessionToken, disconnectSocket, socket]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};