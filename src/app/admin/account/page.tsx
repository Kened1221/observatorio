"use client";

import * as React from "react";
import { Lock, Eye, EyeOff, User, Mail, LogOut, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Simulación de una API para sesiones activas
const fetchActiveSessions = async () => {
  // Simulación de una llamada a la API
  return [
    {
      id: 1,
      device: "Laptop",
      location: "Bogotá, Colombia",
      lastActive: "2025-03-16 14:30",
      ip: "192.168.1.1",
    },
    {
      id: 2,
      device: "iPhone",
      location: "Medellín, Colombia",
      lastActive: "2025-03-17 09:15",
      ip: "192.168.1.2",
    },
  ];
};

const closeSession = async (sessionId: number) => {
  // Simulación de una llamada a la API para cerrar una sesión
  return { success: true, sessionId };
};

export default function AccountPage() {
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [userData, setUserData] = React.useState({
    name: "Juan Pérez",
    email: "juan.perez@example.com",
    role: "Administrador",
    authMethod: "local" as "local" | "google",
    activeSessions: [] as {
      id: number;
      device: string;
      location: string;
      lastActive: string;
      ip: string;
    }[],
  });
  const [passwords, setPasswords] = React.useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = React.useState<string | null>(null);

  // Cargar sesiones activas al montar el componente
  React.useEffect(() => {
    const loadSessions = async () => {
      const sessions = await fetchActiveSessions();
      setUserData((prev) => ({ ...prev, activeSessions: sessions }));
    };
    loadSessions();
  }, []);

  // Simulación de funciones (deberías conectarlas a un backend)
  const handleSaveChanges = () => {
    if (
      userData.authMethod === "local" &&
      (!passwords.currentPassword ||
        !passwords.newPassword ||
        passwords.newPassword !== passwords.confirmPassword)
    ) {
      setError("La contraseña actual es requerida y las nuevas contraseñas deben coincidir.");
      return;
    }
    setError(null);
    alert("Cambios guardados con éxito!");
  };

  const handleUnlinkGoogle = () => {
    if (confirm("¿Estás seguro de desvincular tu cuenta de Google?")) {
      alert("Cuenta de Google desvinculada.");
      setUserData((prev) => ({ ...prev, authMethod: "local" }));
    }
  };

  const handleCloseSession = async (sessionId: number) => {
    if (confirm("¿Estás seguro de cerrar esta sesión?")) {
      const result = await closeSession(sessionId);
      if (result.success) {
        setUserData((prev) => ({
          ...prev,
          activeSessions: prev.activeSessions.filter((session) => session.id !== sessionId),
        }));
        alert(`Sesión ${sessionId} cerrada con éxito.`);
      } else {
        setError("Error al cerrar la sesión. Intenta de nuevo.");
      }
    }
  };

  return (
    <div className="h-full w-full bg-background p-4">
      <div className="flex flex-col md:flex-row justify-center items-start gap-8">
        {/* Parte izquierda: Información personal */}
        <Card className="w-full md:max-w-md rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-primary">
              Información de Cuenta
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Revisa y actualiza tus datos personales.
            </p>
          </div>

          <CardContent className="space-y-6 p-0">
            {/* Alerta de error */}
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Nombre */}
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <div className="relative">
                <User className="absolute left-3 top-4 h-5 w-5 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  value={userData.name}
                  onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                  className="pl-10 py-6"
                  placeholder="Ingresa tu nombre"
                />
              </div>
            </div>

            {/* Correo */}
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-4 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={userData.email}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                  className="pl-10 py-6"
                  placeholder="Ingresa tu correo"
                  disabled={userData.authMethod === "google"}
                />
              </div>
            </div>

            {/* Rol */}
            <div className="space-y-2">
              <Label htmlFor="role">Rol</Label>
              <Input
                id="role"
                type="text"
                value={userData.role}
                className="py-6"
                disabled
                placeholder="Tu rol en el sistema"
              />
            </div>

            {/* Método de autenticación */}
            <div className="space-y-2">
              <Label>Método de autenticación</Label>
              <Select
                value={userData.authMethod}
                onValueChange={(value: "local" | "google") =>
                  setUserData({ ...userData, authMethod: value })
                }
                disabled
              >
                <SelectTrigger className="w-full py-6">
                  <SelectValue placeholder="Selecciona un método" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="local">Credenciales locales</SelectItem>
                  <SelectItem value="google">Google</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sesiones activas */}
            <div className="space-y-2">
              <Label>Sesiones activas</Label>
              {userData.activeSessions.length > 0 ? (
                <div className="space-y-2">
                  {userData.activeSessions.map((session) => (
                    <div
                      key={session.id}
                      className="p-3 bg-muted rounded-lg text-sm flex justify-between items-start"
                    >
                      <div className="flex flex-col gap-1">
                        <span>Dispositivo: {session.device}</span>
                        <span>Ubicación: {session.location}</span>
                        <span>Dirección IP: {session.ip}</span>
                        <span>Última actividad: {session.lastActive}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleCloseSession(session.id)}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Cerrar sesión</span>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <Input
                  type="text"
                  value="No hay sesiones activas"
                  className="py-6"
                  disabled
                  placeholder="Sesiones activas"
                />
              )}
            </div>

            {/* Acción de desvinculación */}
            {userData.authMethod === "google" && (
              <Button
                variant="destructive"
                className="w-full py-5"
                onClick={handleUnlinkGoogle}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Desvincular cuenta de Google
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Parte derecha: Seguridad y Configuración */}
        <Card className="w-full md:max-w-md rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-primary">
              Seguridad y Configuración
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Administra tu seguridad y sesiones.
            </p>
          </div>

          <CardContent className="space-y-6 p-0">
            {/* Contraseña actual (solo para autenticación local) */}
            {userData.authMethod === "local" && (
              <div className="space-y-2">
                <Label htmlFor="current-password">Contraseña actual</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-4 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="current-password"
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwords.currentPassword}
                    onChange={(e) =>
                      setPasswords({ ...passwords, currentPassword: e.target.value })
                    }
                    className="pl-10 py-6"
                    placeholder="Ingresa tu contraseña actual"
                  />
                  <Button
                    type="button"
                    variant="link"
                    size="icon"
                    className="absolute right-0 top-1.5 h-10 w-10 text-muted-foreground hover:text-muted-foreground/80"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                    <span className="sr-only">
                      {showCurrentPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    </span>
                  </Button>
                </div>
              </div>
            )}

            {/* Nueva contraseña (solo para autenticación local) */}
            {userData.authMethod === "local" && (
              <div className="space-y-2">
                <Label htmlFor="new-password">Nueva contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-4 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    value={passwords.newPassword}
                    onChange={(e) =>
                      setPasswords({ ...passwords, newPassword: e.target.value })
                    }
                    className="pl-10 py-6"
                    placeholder="Ingresa nueva contraseña"
                  />
                  <Button
                    type="button"
                    variant="link"
                    size="icon"
                    className="absolute right-0 top-1.5 h-10 w-10 text-muted-foreground hover:text-muted-foreground/80"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                    <span className="sr-only">
                      {showNewPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    </span>
                  </Button>
                </div>
              </div>
            )}

            {/* Confirmar contraseña (solo para autenticación local) */}
            {userData.authMethod === "local" && (
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-4 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwords.confirmPassword}
                    onChange={(e) =>
                      setPasswords({ ...passwords, confirmPassword: e.target.value })
                    }
                    className="pl-10 py-6"
                    placeholder="Confirma tu nueva contraseña"
                  />
                  <Button
                    type="button"
                    variant="link"
                    size="icon"
                    className="absolute right-0 top-1.5 h-10 w-10 text-muted-foreground hover:text-muted-foreground/80"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                    <span className="sr-only">
                      {showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    </span>
                  </Button>
                </div>
              </div>
            )}

            {/* Vinculación o desvinculación (solo si aplica) */}
            {userData.authMethod === "google" && (
              <Button
                variant="destructive"
                className="w-full py-5"
                onClick={handleUnlinkGoogle}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Desvincular cuenta de Google
              </Button>
            )}
            {userData.authMethod === "local" && (
              <Button
                variant="outline"
                className="w-full py-5"
                // onClick={handleLinkGoogle} // Placeholder para OAuth
              >
                <LogOut className="mr-2 h-4 w-4" />
                Vincular cuenta de Google
              </Button>
            )}

            {/* Botón de guardar cambios */}
            <Button
              className="w-full bg-primary hover:bg-primary/90 py-5"
              onClick={handleSaveChanges}
            >
              Guardar cambios
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}