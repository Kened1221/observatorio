"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // useEffect para establecer que el componente está montado solo en el cliente
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Mientras no esté montado (en SSR), renderizamos un placeholder o un estado por defecto
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon"  className="hover:cursor-pointer">
        <Sun className="h-5 w-5" /> {/* Estado por defecto */}
      </Button>
    );
  }

  // Una vez montado, renderizamos según el tema actual
  return (
    <Button variant="ghost" size="icon"  onClick={toggleTheme} className="hover:cursor-pointer">
      {theme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
}