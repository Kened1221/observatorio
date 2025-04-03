"use client";

import * as React from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaGoogle } from "react-icons/fa6";
import { loginAction } from "@/actions/auth";
import { signIn } from "next-auth/react";

export default function LoginWithImagePage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await loginAction({
      email,
      password,
    });

    if (result.success) {
      router.push(callbackUrl);
    } else {
      setError(result.message || "Error al iniciar sesión");
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    await signIn("google", { redirect: false, callbackUrl });
    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-background">
      <div className="flex w-full h-full justify-center flex-col p-4 lg:w-1/2">
        <div className="flex flex-1 items-center justify-center">
          <Card className="mx-auto w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-sm">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-primary">
                Bienvenido!
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Inicia sesión para continuar.
              </p>
              {error && (
                <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
              )}
            </div>

            <CardContent className="space-y-4 p-0">
              <form onSubmit={handleCredentialsLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-4 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Ingresa tu correo"
                      className="pl-10 py-6"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Contraseña</Label>
                    <Link
                      href="/auth/identify"
                      className="text-xs text-blue-500 hover:underline"
                    >
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-4 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Ingresa tu contraseña"
                      className="pl-10 py-6"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="link"
                      size="icon"
                      className="absolute right-0 top-1.5 h-10 w-10 text-muted-foreground hover:text-muted-foreground/80 hover:cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                      <span className="sr-only">
                        {showPassword
                          ? "Ocultar contraseña"
                          : "Mostrar contraseña"}
                      </span>
                    </Button>
                  </div>
                </div>

                <Button
                  className={`w-full bg-primary hover:bg-primary/90 hover:cursor-pointer py-5
                  ${loading ? "opacity-70" : ""}
                  `}
                  disabled={loading}
                  type="submit"
                >
                  {loading ? "Cargando..." : "Iniciar sesión"}
                </Button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">O</span>
                </div>
              </div>

              <form action={handleGoogleLogin} className="grid">
                <Button
                  type="submit"
                  variant="outline"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 hover:cursor-pointer py-6"
                >
                  <FaGoogle />
                  <span>{loading ? "Cargando..." : "Iniciar Sesión con Google"}</span>
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="relative hidden w-1/2 lg:block">
        <svg width="0" height="0">
          <defs>
            <clipPath id="wave-clip" clipPathUnits="objectBoundingBox">
              <path d="M 0.1 0 H 1 V 1 H 0.1 C 0.2 0.9, 0.0 0.7, 0.1 0.5 C 0.2 0.3, 0.0 0.1, 0.1 0 Z" />
            </clipPath>
          </defs>
        </svg>
        <div
          className="absolute inset-0 bg-slate-900"
          style={{
            clipPath: "url(#wave-clip)",
          }}
        >
          <Image
            src={"/adm/logos/login-background.jpg"}
            alt="back-admin"
            width={1000}
            height={1000}
            className="w-full h-full object-cover opacity-50"
          />
        </div>
        <div
          className="relative flex h-full flex-col items-center justify-center p-8"
          style={{
            clipPath: "url(#wave-clip)",
          }}
        >
          <Image
            src={"/adm/logos/logo.png"}
            alt="logo"
            width={100}
            height={300}
            className="mb-8 flex items-center justify-center"
          />
          <h1 className="mb-4 text-3xl font-bold text-primary-foreground text-center">
            Observatorio Regional <br /> Administrador{" "}
          </h1>
          <p className="mb-8 text-center text-gray-300">
            Panel de administración con diseño moderno y características
            avanzadas
          </p>
        </div>
      </div>
    </div>
  );
}
