"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./sidebar";
import Navbar from "./navbar";
import React from "react";
import { Session } from "next-auth";
import { useUserData } from "../utils/user-data";
import { updateSession } from "@/actions/auth";
import { signOut } from "next-auth/react";
import io from "socket.io-client";
import { ProfileProvider } from "@/admin/context/ProfileContext";

interface AdminLayoutProps {
  session: Session;
  children: React.ReactNode;
}

function Layout({ children, session }: AdminLayoutProps) {
  const [hoveredItem, setHoveredItem] = React.useState<string | null>(null);
  const [hasUpdatedSession, setHasUpdatedSession] = React.useState(false);
  const [sessionToken, setSessionToken] = React.useState<string | null>(null);
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
          setSessionToken(result.sessionToken || null);
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

  React.useEffect(() => {
    if (!browserId || !session?.user?.id || !isReady || !sessionToken) return;

    const socket = io("http://localhost:8080", {
      query: { browserId, userId: session.user.id },
      auth: { token: sessionToken },
      reconnection: true,
    });

    socket.on("sessionClosed", (data: { browserId: string }) => {
      if (data.browserId === browserId) {
        localStorage.removeItem(`session-updated-${session.user.id}`);
        signOut();
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [browserId, session?.user?.id, isReady, sessionToken]);

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