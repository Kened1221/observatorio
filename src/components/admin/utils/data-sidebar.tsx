import { getUserModules } from "@/actions/dashboard-actions";
import { SidebarMenuGroup } from "@/admin/types/sidebar-types";
import {
  BookOpen,
  DollarSign,
  FileText,
  HeartPulse,
  Home,
  LayoutDashboard,
  Newspaper,
  Shield,
  ShieldCheck,
  User,
  UserCircle,
  UserRoundCheck,
  Users,
} from "lucide-react";
import { Session } from "next-auth";

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
        url: "/admin/issue/health-and-nutrition",
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
        url: "/admin/users",
      },
      {
        label: "Roles",
        icon: ShieldCheck,
        url: "/admin/role",
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

const moduleToUrlMap: { [key: string]: string } = {
  dasboard: "/admin",
  salud_nutricion: "/admin/issue/health-and-nutrition",
  educacion: "/admin/issue/education",
  proteccion_social: "/admin/issue/social-protection",
  servicios_basicos: "/admin/issue/basic-services",
  desarrollo_economico: "/admin/issue/economic-development",
  politica_incluir: "/admin/issue/include-to-grow",
  normas_informes: "/admin/issue/rules-and-information",
  notas_actualidad: "/admin/issue/present",
  participacion_ciudadana: "/admin/issue/citizen-participation",
};

export async function getFilteredMenus(
  session: Session
): Promise<SidebarMenuGroup[]> {
  try {
    const modules = await getUserModules(session);
    console.log("Módulos recibidos en getFilteredMenus:", modules);

    const filteredMenus: SidebarMenuGroup[] = sidebarMenus
      .map((group) => {
        if (group.title === "Configuración") {
          return group;
        }

        if (group.title === "Acceso" && session.user.role === "Admin") {
          return group;
        }

        const filteredMenu = group.menu.filter((item) => {
          const isIncluded = modules.includes(
            Object.keys(moduleToUrlMap).find(
              (key) => moduleToUrlMap[key] === item.url
            ) || ""
          );
          console.log(
            `Verificando menú ${item.label} (${item.url}): ${
              isIncluded ? "Incluido" : "Excluido"
            }`
          );
          return isIncluded;
        });

        return {
          ...group,
          menu: filteredMenu,
        };
      })
      .filter((group) => group.menu.length > 0);

    console.log(
      "Filtered Sidebar Menus:",
      JSON.stringify(filteredMenus, null, 2)
    );
    return filteredMenus;
  } catch (error) {
    console.error("Error en getFilteredMenus:", error);
    return [sidebarMenus.find((group) => group.title === "Configuración")!];
  }
}
