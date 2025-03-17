import { sidebarMenus } from "@/admin/utils/data-sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
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
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AppSidebar({
  hoveredItem,
  setHoveredItem,
}: {
  hoveredItem: string | null;
  setHoveredItem: (item: string | null) => void;
}) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const pathname = usePathname();

  const handleMouseEnter = (item: string) => {
    if (
      isCollapsed &&
      sidebarMenus.some((group) =>
        group.menu.some((menuItem) => menuItem.label === item && menuItem.items)
      )
    ) {
      setHoveredItem(item);
    }
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  return (
    <>
      <Sidebar
        className="rounded-lg border border-border shadow-sm relative h-full"
        collapsible="icon"
      >
        <SidebarHeader className="flex items-center border-b rounded-t-lg">
          {!isCollapsed ? (
            <div className="flex items-center gap-4 font-semibold p-6">
              <Image
                src={"/admin/logos/logo.png"}
                alt="logo"
                width={40}
                height={20}
              />
              <span className="text-xl font-bold">Observatorio Regional</span>
            </div>
          ) : (
            <div className="p-2">
              <Image
                src={"/admin/logos/logo.png"}
                alt="logo"
                width={20}
                height={20}
              />
            </div>
          )}
        </SidebarHeader>
        <SidebarContent className="bg-card text-primary rounded-b-lg">
          {sidebarMenus.map((menubar, index) => (
            <SidebarGroup key={index}>
              {!isCollapsed && (
                <SidebarGroupLabel className="px-6 text-xs font-semibold uppercase text-muted-foreground">
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
                          <div>
                            <CollapsibleTrigger asChild>
                              <SidebarMenuButton
                                tooltip={item.items ? undefined : item.label}
                                className={`hover:bg-indigo-500 hover:text-white ${
                                  isActive
                                    ? "bg-indigo-500 text-white"
                                    : "data-[active=true]:bg-indigo-600/20 data-[active=true]:text-white"
                                } hover:cursor-pointer`}
                                onMouseEnter={() => handleMouseEnter(item.label)}
                                onMouseLeave={handleMouseLeave}
                              >
                                {item.icon && <item.icon width={16} />}
                                {!isCollapsed && <span>{item.label}</span>}
                                <ChevronDown className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                              </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <SidebarMenuSub className="rounded-2xl">
                                {item.items.map((subitem, j) => {
                                  const isSubItemActive = subitem.url === pathname;
                                  return (
                                    <Link
                                      href={subitem.url}
                                      key={j}
                                      className={`px-2 py-1 text-xs flex items-center gap-2 rounded-lg ${
                                        isSubItemActive
                                          ? "bg-indigo-500 text-white"
                                          : "hover:bg-indigo-500 hover:text-white"
                                      }`}
                                    >
                                      {subitem.icon && <subitem.icon width={16} />}
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
                            className={`hover:bg-indigo-500 hover:text-white ${
                              isActive
                                ? "bg-indigo-500 text-white"
                                : "data-[active=true]:bg-indigo-600/20 data-[active=true]:text-white"
                            } hover:cursor-pointer`}
                            onMouseEnter={() => handleMouseEnter(item.label)}
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
        <SidebarRail />
      </Sidebar>

      {/* Hover menu for items with subitems */}
      {hoveredItem &&
        isCollapsed &&
        sidebarMenus.some((group) =>
          group.menu.some((item) => item.label === hoveredItem && item.items)
        ) && (
          <div
            className="absolute left-[48px] top-[120px] z-50 w-48 rounded-md border bg-card py-1 shadow-lg"
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
                        ? "bg-indigo-500 text-white"
                        : "hover:bg-indigo-500 hover:text-white"
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