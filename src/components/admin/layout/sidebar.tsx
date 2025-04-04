import { sidebarMenus } from "@/admin/utils/data-sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { ChevronDown, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";

import { signOut } from "next-auth/react";
import { Session } from "next-auth";
import { closeSession } from "@/actions/auth";
import { sessionTokenUser } from "@/actions/user-actions";
import { useUserData } from "../utils/user-data";

export default function AppSidebar({
  hoveredItem,
  setHoveredItem,
  session,
}: {
  hoveredItem: string | null;
  setHoveredItem: (item: string | null) => void;
  session: Session;
}) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const pathname = usePathname();
  const [hoverPosition, setHoverPosition] = useState<number>(0);
  const menuRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const { browserId, isReady } = useUserData();

  const handleMouseEnter = (item: string, event: React.MouseEvent) => {
    if (
      isCollapsed &&
      sidebarMenus.some((group) =>
        group.menu.some((menuItem) => menuItem.label === item && menuItem.items)
      )
    ) {
      setHoveredItem(item);
      const target = event.currentTarget as HTMLDivElement;
      const rect = target.getBoundingClientRect();
      setHoverPosition(rect.top);
    }
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  const handleCloseSession = async () => {
    const idUser = session.user.id;
  
    if (!isReady || !browserId) return;
    const sessionTokenU = await sessionTokenUser({
      id: session.user.id,
      browserId,
    });
    setSessionToken(sessionTokenU ?? null);
  
    if (!sessionToken) {
      console.error("No se puede cerrar sesión: sessionToken no disponible");
      return;
    }
  
    try {
      const result = await closeSession({
        userId: idUser,
        sessionToken,
      });
      if (result.success) {
        localStorage.removeItem(`session-updated-${idUser}`);
        await signOut();
      } else {
        console.error("Error al cerrar sesión:", result.message);
      }
    } catch (error) {
      console.error("Error en handleCloseSession:", error);
    }
  };

  return (
    <>
      <Sidebar
        className="rounded-lg border border-border shadow-sm relative h-full"
        collapsible="icon"
      >
        <SidebarHeader className="flex items-center border-b rounded-t-lg ">
          {!isCollapsed ? (
            <div className="flex items-center gap-4 font-semibold p-6">
              <Image
                src={"/adm/logos/logo.png"}
                alt="logo"
                width={40}
                height={20}
              />
              <span className="text-xl font-bold">Observatorio Regional</span>
            </div>
          ) : (
            <div className="p-2">
              <Image
                src={"/adm/logos/logo.png"}
                alt="logo"
                width={20}
                height={20}
              />
            </div>
          )}
        </SidebarHeader>
        <SidebarContent className="bg-card text-primary-foreground rounded-b-lg">
          {sidebarMenus.map((menubar, index) => (
            <SidebarGroup key={index}>
              {!isCollapsed && (
                <SidebarGroupLabel className="px-6 text-xs font-semibold uppercase text-secondary-foreground">
                  {menubar.title}
                </SidebarGroupLabel>
              )}
              <SidebarMenu>
                {menubar.menu.map((item, i) => {
                  const isActive =
                    item.url === pathname ||
                    (item.items &&
                      item.items.some((subitem) => subitem.url === pathname));

                  return (
                    <SidebarMenuItem key={i}>
                      {item.items ? (
                        <Collapsible
                          asChild
                          className="group/collapsible hover:cursor-pointer"
                        >
                          <div
                            ref={(el) => {
                              if (el) menuRefs.current.set(item.label, el);
                            }}
                          >
                            <CollapsibleTrigger asChild>
                              <SidebarMenuButton
                                tooltip={item.items ? undefined : item.label}
                                className={`hover:bg-primary hover:text-white ${
                                  isActive
                                    ? "bg-primary text-white"
                                    : "data-[active=true]:bg-primary data-[active=true]:text-white"
                                } hover:cursor-pointer`}
                                onMouseEnter={(e) =>
                                  handleMouseEnter(item.label, e)
                                }
                                onMouseLeave={handleMouseLeave}
                              >
                                {item.icon && <item.icon width={16} />}
                                {!isCollapsed && <span>{item.label}</span>}
                                <ChevronDown className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                              </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <SidebarMenuSub>
                                {item.items.map((subitem, j) => {
                                  const isSubItemActive =
                                    subitem.url === pathname;
                                  return (
                                    <Link
                                      href={subitem.url}
                                      key={j}
                                      className={`px-2 py-1 text-xs flex items-center gap-2 rounded-lg ${
                                        isSubItemActive
                                          ? "bg-primary text-white"
                                          : "hover:bg-primary hover:text-white"
                                      }`}
                                    >
                                      {subitem.icon && (
                                        <subitem.icon width={16} />
                                      )}
                                      <span>{subitem.label}</span>
                                    </Link>
                                  );
                                })}
                              </SidebarMenuSub>
                            </CollapsibleContent>
                          </div>
                        </Collapsible>
                      ) : (
                        <Link href={item.url}>
                          <SidebarMenuButton
                            className={`hover:bg-primary hover:text-white ${
                              isActive
                                ? "bg-primary text-white"
                                : "data-[active=true]:bg-indigo-600/20 data-[active=true]:text-white"
                            } hover:cursor-pointer`}
                            onMouseEnter={(e) =>
                              handleMouseEnter(item.label, e)
                            }
                            onMouseLeave={handleMouseLeave}
                            tooltip={item.items ? undefined : item.label}
                          >
                            {item.icon && <item.icon width={16} />}
                            {!isCollapsed && <span>{item.label}</span>}
                          </SidebarMenuButton>
                        </Link>
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroup>
          ))}
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenuButton
            tooltip={"Cerrar sesión"}
            className="bg-destructive text-white hover:bg-destructive/90 hover:text-white flex items-center gap-2 justify-center hover:cursor-pointer"
            onClick={handleCloseSession}
          >
            <LogOut
              width={16}
              className={`transition-all duration-150 ${
                isCollapsed ? "rotate-180" : ""
              }`}
            />
            {!isCollapsed && <span>Cerrar sesión</span>}
          </SidebarMenuButton>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      {/* Hover menu for items with subitems */}
      {hoveredItem &&
        isCollapsed &&
        sidebarMenus.some((group) =>
          group.menu.some((item) => item.label === hoveredItem && item.items)
        ) && (
          <div
            className="absolute left-14 z-50 w-48 rounded-md border bg-card py-1 shadow-lg"
            style={{ top: `${hoverPosition}px` }}
            onMouseEnter={() => {
              const item = sidebarMenus
                .flatMap((group) => group.menu)
                .find((i) => i.label === hoveredItem);
              if (item?.items) setHoveredItem(hoveredItem);
            }}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div className="px-3 py-2 text-sm font-medium text-muted-foreground">
              {hoveredItem}
            </div>
            <div className="border-t"></div>
            {sidebarMenus
              .flatMap((group) => group.menu)
              .find((item) => item.label === hoveredItem)
              ?.items?.map((subitem, index) => {
                const isSubItemActive = subitem.url === pathname;
                return (
                  <Link
                    href={subitem.url}
                    key={index}
                    className={`flex items-center gap-2 m-2 px-3 py-2 text-sm rounded-lg ${
                      isSubItemActive
                        ? "bg-primary text-white"
                        : "hover:bg-primary hover:text-white"
                    }`}
                  >
                    {subitem.icon && <subitem.icon className="h-4 w-4" />}
                    <span>{subitem.label}</span>
                  </Link>
                );
              })}
          </div>
        )}
    </>
  );
}
