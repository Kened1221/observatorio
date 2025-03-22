// components/account/Security.tsx
"use client";

import { useState } from "react";
import { Key, AlertCircle, Check, X, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface Notification {
  show: boolean;
  message: string;
  type: "success" | "error" | "";
}

const Security = () => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [notification, setNotification] = useState<Notification>({
    show: false,
    message: "",
    type: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  // Estados para controlar la visibilidad de cada campo
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setNotification({
        show: true,
        message: "Las contraseñas no coinciden",
        type: "error"
      });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setNotification({
        show: true,
        message: "La contraseña debe tener al menos 8 caracteres",
        type: "error"
      });
      return;
    }

    setIsLoading(true);

    // Llamada a un endpoint para actualizar la contraseña
    const res = await fetch("/api/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(passwordData)
    });

    if (res.ok) {
      setNotification({
        show: true,
        message: "Contraseña actualizada correctamente",
        type: "success"
      });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      setShowPasswordForm(false);
    } else {
      setNotification({
        show: true,
        message: "Error al actualizar la contraseña",
        type: "error"
      });
    }
    setIsLoading(false);
  };

  const closeNotification = () => {
    setNotification({ show: false, message: "", type: "" });
  };

  return (
    <div className="px-4 py-5 sm:p-6">
      <h2 className="text-lg font-medium text-primary-foreground">Seguridad de la Cuenta</h2>
      <div className="mt-5">
        <dl className="divide-y divide-border">
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-secondary-foreground">Contraseña</dt>
            <dd className="mt-1 text-sm text-primary-foreground sm:mt-0 sm:col-span-2 flex items-center justify-between">
              <div className="flex items-center">
                <Key className="w-4 h-4 mr-2" />
                <span>••••••••••••</span>
              </div>
              <Button
                variant="secondary"
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className="inline-flex items-center px-3 py-1.5"
              >
                {showPasswordForm ? "Cancelar" : "Cambiar contraseña"}
              </Button>
            </dd>
          </div>
          {showPasswordForm && (
            <div className="py-4">
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                {/* Campo: Contraseña actual */}
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-secondary-foreground">
                    Contraseña actual
                  </label>
                  <div className="relative">
                    <Input
                      type={showCurrent ? "text" : "password"}
                      name="currentPassword"
                      id="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      required
                      className="mt-1 block w-full pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                {/* Campo: Nueva contraseña */}
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-secondary-foreground">
                    Nueva contraseña
                  </label>
                  <div className="relative">
                    <Input
                      type={showNew ? "text" : "password"}
                      name="newPassword"
                      id="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                      className="mt-1 block w-full pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                {/* Campo: Confirmar nueva contraseña */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-secondary-foreground">
                    Confirmar nueva contraseña
                  </label>
                  <div className="relative">
                    <Input
                      type={showConfirm ? "text" : "password"}
                      name="confirmPassword"
                      id="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                      className="mt-1 block w-full pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowPasswordForm(false)}
                    className="inline-flex items-center px-4 py-2"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" variant="default" className="inline-flex items-center px-4 py-2">
                    Guardar cambios
                  </Button>
                </div>
              </form>
            </div>
          )}
        </dl>
      </div>

      {notification.show && (
        <div
          className={`mt-4 px-4 py-3 rounded-lg flex items-center space-x-3 ${
            notification.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {notification.type === "success" ? (
            <Check className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <p>{notification.message}</p>
          <button onClick={closeNotification} className="ml-auto">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {isLoading && (
        <div className="mt-4">
          <p>Cambiando contraseña...</p>
        </div>
      )}
    </div>
  );
};

export default Security;
