"use client";

import * as React from "react";
import { Key } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function VerifyCodePage() {
  return (
    <div className="flex h-screen bg-background">
      <div className="flex w-full h-full justify-center flex-col p-4 lg:w-1/2">
        <div className="flex flex-1 items-center justify-center">
          <Card className="mx-auto w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-sm">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-primary">
                Verificar código
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Ingresa el código que recibiste en tu correo electrónico.
              </p>
            </div>

            <CardContent className="space-y-4 p-0">
              <div className="space-y-2">
                <Label htmlFor="code">Código de verificación</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-4 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="code"
                    type="text"
                    placeholder="Ingresa el código"
                    className="pl-10 py-6"
                  />
                </div>
              </div>

              <Button className="w-full bg-primary hover:bg-primary/90 hover:cursor-pointer py-5">
                Verificar código
              </Button>

              <div className="mt-4 text-center">
                <Link href="/auth/identify" className="text-sm text-blue-500 hover:underline">
                  Volver a enviar el código
                </Link>
              </div>
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
            Panel de administración con diseño moderno y características avanzadas
          </p>
        </div>
      </div>
    </div>
  );
}