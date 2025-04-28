// src/app/admin/account/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Loader } from "lucide-react";
import Profile from "@/components/admin/account/Profile";
import Security from "@/components/admin/account/Security";
import Sessions from "@/components/admin/account/Sessions";
import History from "@/components/admin/account/History";
import { googleLinkedAccountVerify, getSessionToken } from "@/actions/user-actions";
import { useUserData } from "@/components/admin/utils/user-data";

type TabType = "profile" | "security" | "sessions" | "history";

const AccountManagement = () => {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [isGoogleLinkedAccount, setIsGoogleLinkedAccount] = useState(false);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const { browserId, isReady } = useUserData();

  useEffect(() => {
    if (!session?.user?.id) return;
    const checkGoogleLinkedAccount = async () => {
      try {
        const res = await googleLinkedAccountVerify({ id: session.user.id });
        setIsGoogleLinkedAccount(res);

        if (!isReady || !browserId) return;
        const sessionTokenU = await getSessionToken({ id: session.user.id, browserId });
        setSessionToken(sessionTokenU ?? null);
      } catch (error) {
        console.error("Error checking Google linked account or session token:", error);
      }
    };
    checkGoogleLinkedAccount();
  }, [session?.user?.id, browserId, isReady]);

  if (status === "loading") {
    return (
      <div className="h-full flex items-center justify-center bg-card">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="mt-2 text-secondary-foreground">Cargando información de la cuenta...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <div>No has iniciado sesión</div>;
  }

  const userData = {
    name: session.user?.name || "",
    email: session.user?.email || "",
    avatar: session.user?.image || "",
    isGoogleLinked: isGoogleLinkedAccount,
  };

  return (
    <div className="relative h-full bg-card">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-5 sm:px-6">
          <h1 className="text-2xl font-semibold text-primary-foreground">Administración de Cuenta</h1>
          <p className="mt-1 text-sm text-secondary-foreground">
            Gestiona tu perfil, dispositivos y seguridad.
          </p>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <nav className="space-y-1 bg-card border shadow rounded-lg p-4">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === "profile" ? "bg-secondary text-secondary-foreground" : "text-secondary-foreground hover:bg-secondary"
                }`}
              >
                Perfil
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === "security" ? "bg-secondary text-secondary-foreground" : "text-secondary-foreground hover:bg-secondary"
                }`}
              >
                Seguridad
              </button>
              <button
                onClick={() => setActiveTab("sessions")}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === "sessions" ? "bg-secondary text-secondary-foreground" : "text-secondary-foreground hover:bg-secondary"
                }`}
              >
                Sesiones Activas
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === "history" ? "bg-secondary text-secondary-foreground" : "text-secondary-foreground hover:bg-secondary"
                }`}
              >
                Historial de Sesiones
              </button>
            </nav>
          </div>
          <div className="lg:col-span-3">
            <div className="bg-card border text-primary-foreground shadow rounded-lg">
              {activeTab === "profile" && <Profile userData={userData} />}
              {activeTab === "security" && <Security />}
              {activeTab === "sessions" && <Sessions sessionToken={sessionToken} userId={session.user?.id || ""} />}
              {activeTab === "history" && <History userId={session.user?.id || ""} />}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AccountManagement;