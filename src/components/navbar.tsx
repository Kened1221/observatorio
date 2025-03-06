"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown, Home } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo y título */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/placeholder.svg?height=50&width=50"
                alt="Logo Ayacucho"
                width={50}
                height={50}
                className="h-12 w-auto"
              />
              <div className="hidden md:block">
                <h1 className="text-sm font-bold text-primary md:text-base">
                  Política Regional
                </h1>
                <h2 className="text-xs font-medium md:text-sm">
                  INCLUIR PARA CRECER AYACUCHO
                </h2>
              </div>
            </Link>
          </div>

          {/* Menú de navegación para escritorio */}
          <div className="hidden items-center space-x-1 md:flex">
            <Link
              href="/"
              className="flex items-center px-3 py-2 text-sm hover:text-primary"
            >
              <Home className="mr-1 h-4 w-4" />
              Inicio
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center text-sm"
                >
                  ¿Cuánto somos? <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Población</DropdownMenuItem>
                <DropdownMenuItem>Estadísticas</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center text-sm"
                >
                  ¿Dónde estamos? <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Ubicación</DropdownMenuItem>
                <DropdownMenuItem>Mapa</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center text-sm"
                >
                  ¿Cómo estamos? <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Indicadores</DropdownMenuItem>
                <DropdownMenuItem>Informes</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center text-sm"
                >
                  Normas e informes <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Documentos</DropdownMenuItem>
                <DropdownMenuItem>Normativa</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href="/notas"
              className="px-3 py-2 text-sm hover:text-primary"
            >
              Notas de actualidad
            </Link>

            <Link
              href="/participacion"
              className="px-3 py-2 text-sm hover:text-primary"
            >
              Participación ciudadana
            </Link>
          </div>

          {/* Botón de menú móvil */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <div className="mt-4 space-y-2 pb-4 md:hidden">
            <Link
              href="/"
              className="flex items-center rounded-md px-4 py-2 text-sm hover:bg-muted"
              onClick={() => setIsMenuOpen(false)}
            >
              <Home className="mr-2 h-4 w-4" />
              Inicio
            </Link>
            <div className="rounded-md px-4 py-2 text-sm hover:bg-muted">
              ¿Cuánto somos?
            </div>
            <div className="rounded-md px-4 py-2 text-sm hover:bg-muted">
              ¿Dónde estamos?
            </div>
            <div className="rounded-md px-4 py-2 text-sm hover:bg-muted">
              ¿Cómo estamos?
            </div>
            <div className="rounded-md px-4 py-2 text-sm hover:bg-muted">
              Normas e informes
            </div>
            <Link
              href="/notas"
              className="block rounded-md px-4 py-2 text-sm hover:bg-muted"
              onClick={() => setIsMenuOpen(false)}
            >
              Notas de actualidad
            </Link>
            <Link
              href="/participacion"
              className="block rounded-md px-4 py-2 text-sm hover:bg-muted"
              onClick={() => setIsMenuOpen(false)}
            >
              Participación ciudadana
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
