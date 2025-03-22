/* eslint-disable @next/next/no-img-element */
import { ModeToggle } from "@/components/theme/mode-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Bell,
  Fullscreen,
  Search,
} from "lucide-react";
import { Session } from "next-auth";

interface NavbarProps {
  session: Session;
}

function Navbar({session}: NavbarProps) {

  const handleToggleFullscreen = () => {
    // Si no estamos en fullscreen, lo activamos
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Error al intentar poner en fullscreen:", err);
      });
    } else {
      // Si ya estamos en fullscreen, lo desactivamos
      document.exitFullscreen().catch((err) => {
        console.error("Error al intentar salir de fullscreen:", err);
      });
    }
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-card/40 p-6 rounded-t-lg backdrop-blur-sm">
      <SidebarTrigger className="hover:cursor-pointer" />
      <div className="relative w-full max-w-sm hidden md:block">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar..."
          className="w-full pl-8 focus-visible:ring-primary"
        />
      </div>
      <div className="ml-auto flex items-center gap-4 text-muted-foreground">
        <ModeToggle />
        <Button variant="ghost" size="icon" className="hover:cursor-pointer" onClick={handleToggleFullscreen}>
          <Fullscreen className="h-5 w-5" />
          <span className="sr-only">Fullscreen</span>
        </Button>
        <Button variant="ghost" size="icon" className="relative hover:cursor-pointer">
          <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
            3
          </span>
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notificaciones</span>
        </Button>
        <div className="flex items-center gap-2">
          <img
            src="https://icons.veryicon.com/png/o/miscellaneous/user-avatar/user-avatar-male-5.png"
            width={36}
            height={36}
            alt="Anna Adame"
            className="rounded-full"
          />
          <div className="hidden text-sm md:block">
            <div className="font-medium text-primary">{session.user.name}</div>
            <div className="text-xs text-muted-foreground">{session.user.role}</div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
