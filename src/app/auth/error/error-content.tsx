"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthError() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get("error");
  const message = searchParams.get("message");

  let errorMessage = "Ha ocurrido un error al intentar iniciar sesión.";
  if (error === "AccessDenied" && message) {
    errorMessage = decodeURIComponent(message);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/auth/login");
    }, 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-pink-100 via-blue-100 to-purple-100">
      <div className="text-center">
        {/* Ilustración (puedes usar una imagen o un SVG) */}
        <Image
          src={'/adm/logos/logo.png'}
          alt="logo"
          width={300}
          height={100}
          className="mx-auto mb-4"
        />

        {/* Título */}
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
          ¡Oops! Error de Autenticación
        </h1>

        {/* Mensaje */}
        <p className="text-lg md:text-xl text-gray-600 mb-6">
          {errorMessage}
        </p>

        {/* Redirección */}
        <p className="text-gray-500 mb-4">
          Serás redirigido al inicio de sesión en 5 segundos...
        </p>
        <Button
          onClick={() => router.push("/auth/login")}
          className="px-6 py-2 transition text-white"
        >
          Volver ahora
        </Button>
      </div>
    </div>
  );
}