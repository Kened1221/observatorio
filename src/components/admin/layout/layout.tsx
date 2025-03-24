"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./sidebar";
import Navbar from "./navbar";
import React from "react";

import { Session } from "next-auth";
import { useUserData } from "../utils/user-data";
import { updateSession } from "@/actions/auth";

interface AdminLayoutProps {
  session: Session
  children: React.ReactNode;
}

function Layout({ children, session }: AdminLayoutProps) {

  const [hoveredItem, setHoveredItem] = React.useState<string | null>(null);
  const [hasUpdatedSession, setHasUpdatedSession] = React.useState(false);
  const { deviceInfo, ipAddress, location, isReady } = useUserData();

  React.useEffect(() => {
    if (session?.user?.email && isReady && !hasUpdatedSession) {
      const updateSessionData = async () => {
        const result = await updateSession({
          email: session.user.email || "",
          deviceInfo: deviceInfo || "unknown",
          ipAddress: ipAddress || "unknown",
          location: location || "unknown",
        });
        if (result.success) {
          setHasUpdatedSession(true); // Marcar como actualizado
        } else {
          console.error("Error al actualizar la sesión:", result.message);
        }
      };
      updateSessionData();
    }
  }, [session?.user?.email, isReady, hasUpdatedSession, deviceInfo, ipAddress, location]); // Dependencias

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background p-4 w-full gap-4">
        <AppSidebar session={session} hoveredItem={hoveredItem} setHoveredItem={setHoveredItem} />
        <SidebarInset className="flex-1 rounded-lg border border-border bg-card shadow-sm overflow-y-auto">
          <Navbar session={session}/>
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

export default Layout;
