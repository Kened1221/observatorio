"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./sidebar";
import Navbar from "./navbar";
import React from "react";
import { Session } from "next-auth";
import { useUserData } from "../utils/user-data";
import { updateSession } from "@/actions/auth";
import { signOut } from "next-auth/react";

interface AdminLayoutProps {
  session: Session;
  children: React.ReactNode;
}

function Layout({ children, session }: AdminLayoutProps) {
  const [hoveredItem, setHoveredItem] = React.useState<string | null>(null);
  const [hasUpdatedSession, setHasUpdatedSession] = React.useState(false);
  const {
    browser,
    browserVersion,
    os,
    osVersion,
    deviceType,
    deviceModel,
    language,
    browserId,
    ipAddress,
    city,
    country,
    latitude,
    longitude,
    isReady,
  } = useUserData();

  React.useEffect(() => {
    const sessionUpdated = localStorage.getItem(`session-updated-${session?.user?.id}`) === "true";
    setHasUpdatedSession(sessionUpdated);
  }, [session?.user?.id]);

  React.useEffect(() => {
    if (session?.user?.email && isReady && !hasUpdatedSession) {
      const updateSessionData = async () => {
        const result = await updateSession({
          email: session.user.email || "",
          sessionToken: session.user.sessionToken,
          browser: browser || "unknown",
          browserVersion: browserVersion || "unknown",
          os: os || "unknown",
          osVersion: osVersion || "unknown",
          deviceType: deviceType || "unknown",
          deviceModel: deviceModel || "unknown",
          language: language || "unknown",
          browserId: browserId || null,
          ipAddress: ipAddress || "unknown",
          city: city || "unknown",
          country: country || "unknown",
          latitude: latitude || 0,
          longitude: longitude || 0,
        });
        if (result.success) {
          setHasUpdatedSession(true);
          localStorage.setItem(`session-updated-${session.user.id}`, "true");
        } else {
          console.error("Error al actualizar la sesión:", result.message);
        }
      };
      updateSessionData();
    }
  }, [
    session?.user?.email,
    session?.user?.id,
    session?.user?.sessionToken,
    isReady,
    hasUpdatedSession,
    browser,
    browserVersion,
    os,
    osVersion,
    deviceType,
    deviceModel,
    language,
    browserId,
    ipAddress,
    city,
    country,
    latitude,
    longitude,
  ]);

  // WebSocket para escuchar cierres de sesión
  React.useEffect(() => {
    if (!browserId || !session?.user?.id) return;

    const ws = new WebSocket(`ws://localhost:8080?browserId=${browserId}`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.action === "sessionClosed" && data.browserId === browserId) {
        localStorage.removeItem(`session-updated-${session.user.id}`);
        signOut({ callbackUrl: "/login" });
      }
    };

    ws.onerror = (error) => console.error("WebSocket error:", error);
    ws.onclose = () => console.log("WebSocket cerrado");

    return () => ws.close();
  }, [browserId, session?.user?.id]);

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background p-4 w-full gap-4">
        <AppSidebar
          session={session}
          hoveredItem={hoveredItem}
          setHoveredItem={setHoveredItem}
        />
        <SidebarInset className="flex-1 rounded-lg border border-border bg-card shadow-sm overflow-y-auto">
          <Navbar session={session} />
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

export default Layout;