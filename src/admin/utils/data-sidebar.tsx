import { SidebarMenuGroup } from "../types/sidebar-types";
import {
  BookOpen,
  DollarSign,
  FileText,
  HeartPulse,
  Home,
  LayoutDashboard,
  Lock,
  Newspaper,
  Shield,
  ShieldCheck,
  User,
  UserCircle,
  UserRoundCheck,
  Users,
} from "lucide-react";

export const sidebarMenus: SidebarMenuGroup[] = [
  {
    title: "Menú",
    menu: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        url: "/admin",
      },
    ],
  },
  {
    title: "Temáticas",
    menu: [
      {
        label: "Salud y Nutrición",
        icon: HeartPulse,
        url: "",
        items: [
          {
            label: "Protección Social",
            icon: Shield,
            url: "/admin/issue/health-and-nutrition",
          },
          {
            label: "Educación",
            icon: BookOpen,
            url: "/admin/issue/health-and-nutrition/ed",
          },
          {
            label: "Salud y Nutrición",
            icon: Home,
            url: "/admin/issue/health-and-nutrition/sa",
          },
        ],
      },
      {
        label: "Educación",
        icon: BookOpen,
        url: "/admin/issue/education",
      },
      {
        label: "Protección Social",
        icon: Shield,
        url: "/admin/issue/social-protection",
      },
      {
        label: "Servicios Básicos",
        icon: Home,
        url: "/admin/issue/basic-services",
      },
      {
        label: "Desarrollo Económico y Empleo",
        icon: DollarSign,
        url: "/admin/issue/economic-development",
      },
      {
        label: "Incluir para crecer",
        icon: Users,
        url: "/admin/issue/include-to-grow",
      },
      {
        label: "Normas e información",
        icon: FileText,
        url: "/admin/issue/rules-and-information",
      },
      {
        label: "Notas de Actualidad",
        icon: Newspaper,
        url: "/admin/issue/present",
      },
      {
        label: "Participación ciudadana",
        icon: UserRoundCheck,
        url: "/admin/issue/citizen-participation",
      },
    ],
  },
  {
    title: "Acceso",
    menu: [
      {
        label: "Usuarios",
        icon: User,
        url: "/admin/access/users",
      },
      {
        label: "Roles",
        icon: ShieldCheck,
        url: "/admin/access/role",
      },
      {
        label: "Permisos",
        icon: Lock,
        url: "/admin/access/permissions",
      },
    ],
  },
  {
    title: "Configuración",
    menu: [
      {
        label: "Cuenta",
        icon: UserCircle,
        url: "/admin/account",
      },
    ],
  },
];
