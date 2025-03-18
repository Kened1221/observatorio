import { LucideIcon } from "lucide-react";

interface SidebarSubItem {
  label: string;
  icon: LucideIcon;
  url: string;
}

// Interfaz para los ítems principales (puede tener submenús)
interface SidebarItem {
  label: string;
  icon: LucideIcon;
  url: string;
  items?: SidebarSubItem[];
}

// Interfaz para los grupos de menú
export interface SidebarMenuGroup {
  title: string;
  menu: SidebarItem[];
}
