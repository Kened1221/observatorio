"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./sidebar";
import Navbar from "./navbar";
import React from "react";
import { Session } from "next-auth";
import { useUserData } from "../utils/user-data";
import { ProfileProvider } from "@/admin/context/ProfileContext";
import { useSessionMonitor } from "@/admin/hooks/useSessionMonitor";

interface AdminLayoutProps {
  session: Session;
  children: React.ReactNode;
}

function Layout({ children, session }: AdminLayoutProps) {
  const [hoveredItem, setHoveredItem] = React.useState<string | null>(null);
  const { isReady, ...userData } = useUserData();


  // Usar el hook para monitorear la sesión
  useSessionMonitor({
    session,
    isReady,
    browserId: userData.browserId || undefined,
    browser: userData.browser || undefined,
    browserVersion: userData.browserVersion || undefined,
    city: userData.city || undefined,
    country: userData.country || undefined,
    deviceModel: userData.deviceModel || undefined,
    deviceType: userData.deviceType || undefined,
    ipAddress: userData.ipAddress || undefined,
    language: userData.language || undefined,
    latitude: userData.latitude || undefined,
    longitude: userData.longitude || undefined,
    os: userData.os || undefined,
    osVersion: userData.osVersion || undefined,
  });

  return (
    <ProfileProvider>
      <SidebarProvider>
        <div className="flex h-screen bg-background p-4 w-full gap-4">
          <AppSidebar
            session={session}
            hoveredItem={hoveredItem}
            setHoveredItem={setHoveredItem}
          />
          <SidebarInset className="flex-1 rounded-lg border border-border bg-card shadow-sm overflow-y-auto">
            <Navbar />
            {children}
          </SidebarInset>
        </div>
      </SidebarProvider>
    </ProfileProvider>
  );
}

export default Layout;