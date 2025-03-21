"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./sidebar";
import Navbar from "./navbar";
import React from "react";

import { usePathname } from 'next/navigation'
import { Session } from "next-auth";

interface AdminLayoutProps {
  session: Session
  children: React.ReactNode;
}

function Layout({ children, session }: AdminLayoutProps) {
  const pathname = usePathname()

  const [hoveredItem, setHoveredItem] = React.useState<string | null>(null);

  if (pathname.startsWith('/admin/auth')){
    return <>{children}</>
  }

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
