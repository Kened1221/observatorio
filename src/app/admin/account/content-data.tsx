"use client";

import React, { useEffect, useState } from "react";
import { googleLinkedAccountVerify } from "@/actions/user-actions";
import { Session } from "next-auth";
import Security from "@/components/admin/account/Security";
import History from "@/components/admin/account/History";
import { useUserData } from "@/components/admin/utils/user-data";
import Sessions from "@/components/admin/account/Sessions";
import { Profile } from "@/components/admin/account/Profile";

type TabType = "profile" | "security" | "sessions" | "history";

interface ContentDataProps {
  session: Session;
}

export const ContentData = ({ session }: ContentDataProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [isGoogleLinkedAccount, setIsGoogleLinkedAccount] = useState(false);
  const { browserId, isReady } = useUserData();

  useEffect(() => {
    if (!session?.user?.id) return;

    const checkGoogleLinkedAccount = async () => {
      try {
        const res = await googleLinkedAccountVerify({ id: session.user.id });
        setIsGoogleLinkedAccount(res);

        if (!isReady || !browserId) return;

      } catch (error) {
        console.error("Error checking Google linked account:", error);
      }
    };

    checkGoogleLinkedAccount();
  }, [session?.user?.id, browserId, isReady]);

  if (!session) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>No has iniciado sesión</p>
      </div>
    );
  }

  const userData = {
    name: session.user?.name || "",
    email: session.user?.email || "",
    avatar: session.user?.image || "",
    isGoogleLinked: isGoogleLinkedAccount,
  };

  return (
    <div className="relative bg-card h-full">
      <main className="mx-auto sm:px-6 lg:px-8 py-6 max-w-7xl">
        <div className="px-4 sm:px-6 py-5">
          <h1 className="font-semibold text-secondary-foreground text-2xl">Administración de Cuenta</h1>
          <p className="mt-1 text-secondary-foreground text-sm">Gestiona tu perfil, dispositivos y seguridad.</p>
        </div>
        <div className="gap-6 grid grid-cols-1 lg:grid-cols-4 mt-6">
          {/* Menú lateral */}
          <div className="lg:col-span-1">
            <nav className="space-y-1 bg-card shadow p-4 border rounded-lg">
              {["profile", "security", "sessions", "history"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as TabType)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === tab ? "bg-secondary text-secondary-foreground" : "text-secondary-foreground hover:bg-secondary"
                  }`}
                >
                  {tab === "profile" ? "Perfil" : tab === "security" ? "Seguridad" : tab === "sessions" ? "Sesiones Activas" : "Historial de Sesiones"}
                </button>
              ))}
            </nav>
          </div>

          {/* Contenido principal */}
          <div className="lg:col-span-3">
            <div className="bg-card shadow border rounded-lg text-primary-foreground">
              {activeTab === "profile" && <Profile userData={userData} />}
              {activeTab === "security" && <Security />}
              {activeTab === "sessions" && <Sessions userId={session.user?.id || ""} />}
              {activeTab === "history" && <History userId={session.user?.id || ""} />}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
