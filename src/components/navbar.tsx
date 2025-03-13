/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const getActiveClass = (href: string) =>
    pathname === href ? "bg-gray-200 text-primary" : "";

  const toggleMenu = () => {
    if (isMenuOpen) {
      setIsAnimating(true);
      setTimeout(() => {
        setIsMenuOpen(false);
        setIsAnimating(false);
      }, 500);
    } else {
      setIsMenuOpen(true);
    }
  };

  const handleLinkClick = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsMenuOpen(false);
      setIsAnimating(false);
    }, 500);
  };

  // Cerrar el menú al cambiar de ruta
  useEffect(() => {
    if (isMenuOpen) {
      setIsAnimating(true);
      setTimeout(() => {
        setIsMenuOpen(false);
        setIsAnimating(false);
      }, 500);
    }
  }, [pathname]);

  // Detectar scroll para modificar la posición y el estilo del navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`sticky z-50 w-[80%] mx-auto h-20 md:h-24 bg-red-600/80 backdrop-blur-sm text-white shadow-sm flex items-center transition-all duration-300 ${
        isScrolled ? "top-0 rounded-none w-full" : isMenuOpen? "top-6 rounded-t-[3rem]" : "top-6 rounded-full"
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo y Título */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/logos/inicio_oscuro.png"
                alt="Logo Ayacucho"
                width={150}
                height={50}
                className="h-10 md:h-12 w-auto"
              />
              <div className="hidden 2xl:block text-center">
                <p className="font-bold text-white text-sm md:text-lg">
                  Política Regional
                </p>
                <p className="text-xs md:text-sm font-medium">
                  INCLUIR PARA CRECER AYACUCHO
                </p>
              </div>
            </Link>
          </div>

          {/* Menú de navegación de escritorio */}
          <div className="hidden lg:flex items-center space-x-2 font-bold">
            <div
              className={`hover:bg-white hover:text-primary rounded-md p-1 ${getActiveClass(
                "/"
              )}`}
            >
              <Link href="/" className="flex items-center px-3 py-1 text-sm">
                <Home className="mr-1 h-4 w-4" />
                Inicio
              </Link>
            </div>
            <div
              className={`hover:bg-white hover:text-primary rounded-md p-1 ${getActiveClass(
                "/dashboard/cuantos-somos"
              )}`}
            >
              <Link
                href="/dashboard/cuantos-somos"
                className="px-3 py-2 text-sm"
              >
                ¿Cuánto somos?
              </Link>
            </div>
            <div
              className={`hover:bg-white hover:text-primary rounded-md p-1 ${getActiveClass(
                "/dashboard/donde-estamos"
              )}`}
            >
              <Link
                href="/dashboard/donde-estamos"
                className="px-3 py-2 text-sm"
              >
                ¿Dónde estamos?
              </Link>
            </div>
            <div
              className={`hover:bg-white hover:text-primary rounded-md p-1 ${getActiveClass(
                "/dashboard/como-estamos"
              )}`}
            >
              <Link
                href="/dashboard/como-estamos"
                className="px-3 py-2 text-sm"
              >
                ¿Cómo estamos?
              </Link>
            </div>
            <div
              className={`hover:bg-white hover:text-primary rounded-md p-1 ${getActiveClass(
                "/dashboard/normas-informes"
              )}`}
            >
              <Link
                href="/dashboard/normas-informes"
                className="px-3 py-2 text-sm"
              >
                Normas e informes
              </Link>
            </div>
            <div
              className={`hover:bg-white hover:text-primary rounded-md p-1 ${getActiveClass(
                "/dashboard/notas-actualidad"
              )}`}
            >
              <Link
                href="/dashboard/notas-actualidad"
                className="px-3 py-2 text-sm"
              >
                Notas de actualidad
              </Link>
            </div>
            <div
              className={`hover:bg-white hover:text-primary rounded-md p-1 ${getActiveClass(
                "/dashboard/participacion-ciudadana"
              )}`}
            >
              <Link
                href="/dashboard/participacion-ciudadana"
                className="px-3 py-2 text-sm"
              >
                Participación ciudadana
              </Link>
            </div>
          </div>

          {/* Botón de menú móvil */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Menú móvil */}
        <div
          className={`
            absolute 
            top-full 
            left-0 
            right-0 
            z-50 
            lg:hidden
            transform transition-all duration-500 ease-in-out
            ${
              !isMenuOpen && !isAnimating
                ? "pointer-events-none -translate-y-full opacity-0"
                : "pointer-events-auto translate-y-0 opacity-100"
            }
          `}
        >
          <div
            className={`
              bg-white 
              text-[#3C3C3C] 
              font-bold 
              rounded-b-md 
              shadow-md 
              py-4 
              max-h-[calc(100vh-5rem)] 
              overflow-y-auto 
              transition-all duration-500 ease-in-out transform
              ${
                isAnimating && !isMenuOpen
                  ? "scale-95 -translate-x-4"
                  : "scale-100 translate-x-0"
              }
            `}
          >
            <Link
              href="/"
              className={`flex items-center rounded-md px-4 py-2 text-sm hover:bg-gray-100 ${
                getActiveClass("/") ? "bg-gray-200 text-primary" : ""
              }`}
              onClick={handleLinkClick}
            >
              <Home className="mr-2 h-4 w-4" />
              Inicio
            </Link>
            <Link
              href="/dashboard/cuantos-somos"
              className={`block rounded-md px-4 py-2 text-sm hover:bg-gray-100 ${
                getActiveClass("/dashboard/cuantos-somos")
                  ? "bg-gray-200 text-primary"
                  : ""
              }`}
              onClick={handleLinkClick}
            >
              ¿Cuánto somos?
            </Link>
            <Link
              href="/dashboard/donde-estamos"
              className={`block rounded-md px-4 py-2 text-sm hover:bg-gray-100 ${
                getActiveClass("/dashboard/donde-estamos")
                  ? "bg-gray-200 text-primary"
                  : ""
              }`}
              onClick={handleLinkClick}
            >
              ¿Dónde estamos?
            </Link>
            <Link
              href="/dashboard/como-estamos"
              className={`block rounded-md px-4 py-2 text-sm hover:bg-gray-100 ${
                getActiveClass("/dashboard/como-estamos")
                  ? "bg-gray-200 text-primary"
                  : ""
              }`}
              onClick={handleLinkClick}
            >
              ¿Cómo estamos?
            </Link>
            <Link
              href="/dashboard/normas-informes"
              className={`block rounded-md px-4 py-2 text-sm hover:bg-gray-100 ${
                getActiveClass("/dashboard/normas-informes")
                  ? "bg-gray-200 text-primary"
                  : ""
              }`}
              onClick={handleLinkClick}
            >
              Normas e informes
            </Link>
            <Link
              href="/dashboard/notas-actualidad"
              className={`block rounded-md px-4 py-2 text-sm hover:bg-gray-100 ${
                getActiveClass("/dashboard/notas-actualidad")
                  ? "bg-gray-200 text-primary"
                  : ""
              }`}
              onClick={handleLinkClick}
            >
              Notas de actualidad
            </Link>
            <Link
              href="/dashboard/participacion-ciudadana"
              className={`block rounded-md px-4 py-2 text-sm hover:bg-gray-100 ${
                getActiveClass("/dashboard/participacion-ciudadana")
                  ? "bg-gray-200 text-primary"
                  : ""
              }`}
              onClick={handleLinkClick}
            >
              Participación ciudadana
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
