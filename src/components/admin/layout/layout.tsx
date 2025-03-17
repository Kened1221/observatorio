"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./sidebar";
import Navbar from "./navbar";
import React from "react";

function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [hoveredItem, setHoveredItem] = React.useState<string | null>(null);

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background p-4 w-full gap-4">
        <AppSidebar hoveredItem={hoveredItem} setHoveredItem={setHoveredItem} />
        <SidebarInset className="flex-1 rounded-lg border border-border bg-card shadow-sm overflow-y-auto">
          <Navbar />
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

export default Layout;
