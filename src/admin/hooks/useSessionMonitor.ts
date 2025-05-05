"use client";

import { useEffect } from "react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { checkSessionStatus, createSession, revokeSpecificSession } from "@/actions/auth";
import { sessionTokenUser } from "@/actions/user-actions";

interface UseSessionMonitorProps {
  session: Session | null;
  isReady: boolean;
  browserId: string | undefined;
  browser: string | undefined;
  browserVersion: string | undefined;
  city: string | undefined;
  country: string | undefined;
  deviceModel: string | undefined;
  deviceType: string | undefined;
  ipAddress: string | undefined;
  language: string | undefined;
  latitude: number | undefined;
  longitude: number | undefined;
  os: string | undefined;
  osVersion: string | undefined;
}

export function useSessionMonitor({
  session,
  isReady,
  browserId,
  browser,
  browserVersion,
  city,
  country,
  deviceModel,
  deviceType,
  ipAddress,
  language,
  latitude,
  longitude,
  os,
  osVersion,
}: UseSessionMonitorProps) {
  // Guardar browserId en localStorage cuando esté disponible
  useEffect(() => {
    if (browserId) {
      localStorage.setItem("browserId", browserId);
    }
  }, [browserId]);

  // Crear la sesión
  useEffect(() => {
    const updateSession = async () => {
      if (!isReady || !session?.user?.email || !session?.user?.id) return;
      const key = `session-updated-${session.user.id}`;

      const hasSessionUpdated = () => {
        return !!localStorage.getItem(key);
      };

      if (hasSessionUpdated()) {
        console.log("[SessionMonitor] Sesión ya actualizada para este usuario.");
        return;
      }

      console.log("[SessionMonitor] Llamando a updateSession...");
      try {
        const result = await createSession({
          browser: browser ?? "unknown",
          browserId: browserId ?? "unknown",
          browserVersion: browserVersion ?? "unknown",
          city: city ?? "unknown",
          country: country ?? "unknown",
          deviceModel: deviceModel ?? "unknown",
          deviceType: deviceType ?? "unknown",
          ipAddress: ipAddress ?? "unknown",
          language: language ?? "unknown",
          latitude: String(latitude) ?? "unknown",
          longitude: String(longitude) ?? "unknown",
          os: os ?? "unknown",
          osVersion: osVersion ?? "unknown",
        });

        if (result.success) {
          console.log("[SessionMonitor] updateSession exitoso.");
          localStorage.setItem(key, "true");
        } else {
          console.error("[SessionMonitor] Error en updateSession:", result.message);
        }
      } catch (error) {
        console.error("[SessionMonitor] Error en updateSession:", error);
      }
    };

    updateSession();
  }, [
    isReady,
    session?.user?.email,
    session?.user?.id,
    browserId,
    browser,
    browserVersion,
    city,
    country,
    deviceModel,
    deviceType,
    ipAddress,
    language,
    latitude,
    longitude,
    os,
    osVersion,
  ]);

  // Escuchar cambios en localStorage y verificar periódicamente
  useEffect(() => {
    if (!isReady || !session?.user?.id || !browserId) return;

    // Verificar si las variables críticas existen
    const checkCriticalVariables = () => {
      if (!session?.user?.id || !browserId) return false;
      const sessionUpdatedKey = `session-updated-${session.user.id}`;
      const sessionUpdatedExists = !!localStorage.getItem(sessionUpdatedKey);
      const browserIdExists = !!localStorage.getItem("browserId");
      return sessionUpdatedExists && browserIdExists;
    };

    const handleCloseSession = async () => {
      try {
        // Verificar si tenemos todos los datos para hacer un cierre de sesión adecuado
        localStorage.removeItem(`session-updated-${session.user.id}`);
        if (isReady && browserId) {
          const idUser = session.user.id;

          // Intentar obtener sessionToken
          const sessionTokenU = await sessionTokenUser({
            id: idUser,
            browserId: browserId,
          });

          if (sessionTokenU) {
            // Cerrar sesión con token
            const result = await revokeSpecificSession({
              userId: idUser,
              sessionTokenToRevoke: sessionTokenU,
            });

            if (result.success) {
              localStorage.removeItem(`session-updated-${idUser}`);
            } else {
              console.warn(
                "No se pudo cerrar la sesión correctamente:",
                result.message
              );
            }
          }
        } else {
          console.warn(
            "Datos de usuario no listos, procediendo con cierre de sesión simple"
          );
        }

        // Siempre intentar cerrar sesión, incluso si los pasos anteriores fallaron
        await signOut({ callbackUrl: "/" });
      } catch (error) {
        console.error("Error durante el cierre de sesión:", error);
        // Aún así intentar cerrar sesión como respaldo
        await signOut({ callbackUrl: "/" });
      }
    };

    const handleLogout = async () => {
      // Verificar variables críticas en localStorage
      const criticalVariablesValid = checkCriticalVariables();
      if (!criticalVariablesValid) {
        console.log("[SessionMonitor] Variables críticas eliminadas. Cerrando sesión...");
        await handleCloseSession();
        return;
      }

      // Verificar el estado de la sesión en la base de datos
      const sessionValid = await checkSessionStatus(session.user.id, browserId);
      if (!sessionValid) {
        console.log("[SessionMonitor] Sesión inactiva o expirada en la base de datos. Cerrando sesión...");
        await handleCloseSession();
      }
    };

    const handleStorageChange = (event: StorageEvent) => {
      if (event.storageArea !== localStorage) return;
      if (
        event.key === `session-updated-${session.user.id}` ||
        event.key === "browserId"
      ) {
        handleLogout();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    const intervalId = setInterval(() => {
      handleLogout();
    }, 10000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(intervalId);
    };
  }, [isReady, session?.user?.id, browserId]);
}