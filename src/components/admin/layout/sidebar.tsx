import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Badge,
  BarChart3,
  Calendar,
  ChevronDown,
  CircleDot,
  FileText,
  Gauge,
  Grid3X3,
  HelpCircle,
  Home,
  Layers,
  LayoutDashboard,
  LineChart,
  Mail,
  Map,
  MessageSquare,
  Package,
  PieChart,
  Share2,
  ShoppingCart,
  Ticket,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function AppSidebar({
  hoveredItem,
  setHoveredItem,
}: {
  hoveredItem: string | null;
  setHoveredItem: (item: string | null) => void;
}) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const handleMouseEnter = (item: string) => {
    if (isCollapsed) {
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
        <SidebarHeader className="flex h-16 items-center border-b px-6 rounded-t-lg">
          <div className="flex items-center gap-2 font-semibold">
            {!isCollapsed ? (
              <>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white">
                  <CircleDot className="h-5 w-5" />
                </div>
                <span className="text-xl font-bold">VELZON</span>
              </>
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white">
                <CircleDot className="h-5 w-5" />
              </div>
            )}
          </div>
        </SidebarHeader>
        <SidebarContent className="bg-[#2a3042] text-gray-300 rounded-b-lg">
          {!isCollapsed && (
            <SidebarGroup>
              <SidebarGroupLabel className="px-6 text-xs font-semibold uppercase text-gray-400">
                Menu
              </SidebarGroupLabel>
            </SidebarGroup>
          )}

          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                className="hover:bg-indigo-600/20 hover:text-white data-[active=true]:bg-indigo-600/20 data-[active=true]:text-white"
                onMouseEnter={() => handleMouseEnter("dashboards")}
                onMouseLeave={handleMouseLeave}
              >
                <LayoutDashboard className="h-5 w-5" />
                <span>Dashboards</span>
                <ChevronDown className="ml-auto h-4 w-4" />
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                className="hover:bg-indigo-600/20 hover:text-white"
                onMouseEnter={() => handleMouseEnter("apps")}
                onMouseLeave={handleMouseLeave}
              >
                <Grid3X3 className="h-5 w-5" />
                <span>Apps</span>
                <ChevronDown className="ml-auto h-4 w-4" />
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton className="hover:bg-indigo-600/20 hover:text-white">
                <Layers className="h-5 w-5" />
                <span>Layouts</span>
                <Badge className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-[10px]">
                  Hot
                </Badge>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          {!isCollapsed && (
            <SidebarGroup>
              <SidebarGroupLabel className="px-6 text-xs font-semibold uppercase text-gray-400">
                Pages
              </SidebarGroupLabel>
            </SidebarGroup>
          )}

          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                className="hover:bg-indigo-600/20 hover:text-white"
                onMouseEnter={() => handleMouseEnter("authentication")}
                onMouseLeave={handleMouseLeave}
              >
                <User className="h-5 w-5" />
                <span>Authentication</span>
                <ChevronDown className="ml-auto h-4 w-4" />
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                className="hover:bg-indigo-600/20 hover:text-white"
                onMouseEnter={() => handleMouseEnter("pages")}
                onMouseLeave={handleMouseLeave}
              >
                <FileText className="h-5 w-5" />
                <span>Pages</span>
                <ChevronDown className="ml-auto h-4 w-4" />
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton className="hover:bg-indigo-600/20 hover:text-white">
                <Home className="h-5 w-5" />
                <span>Landing</span>
                <ChevronDown className="ml-auto h-4 w-4" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          {!isCollapsed && (
            <SidebarGroup>
              <SidebarGroupLabel className="px-6 text-xs font-semibold uppercase text-gray-400">
                Components
              </SidebarGroupLabel>
            </SidebarGroup>
          )}

          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="hover:bg-indigo-600/20 hover:text-white">
                <Package className="h-5 w-5" />
                <span>Base UI</span>
                <ChevronDown className="ml-auto h-4 w-4" />
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton className="hover:bg-indigo-600/20 hover:text-white">
                <Layers className="h-5 w-5" />
                <span>Advance UI</span>
                <ChevronDown className="ml-auto h-4 w-4" />
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton className="hover:bg-indigo-600/20 hover:text-white">
                <Package className="h-5 w-5" />
                <span>Widgets</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton className="hover:bg-indigo-600/20 hover:text-white">
                <FileText className="h-5 w-5" />
                <span>Forms</span>
                <ChevronDown className="ml-auto h-4 w-4" />
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton className="hover:bg-indigo-600/20 hover:text-white">
                <BarChart3 className="h-5 w-5" />
                <span>Tables</span>
                <ChevronDown className="ml-auto h-4 w-4" />
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton className="hover:bg-indigo-600/20 hover:text-white">
                <PieChart className="h-5 w-5" />
                <span>Charts</span>
                <ChevronDown className="ml-auto h-4 w-4" />
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton className="hover:bg-indigo-600/20 hover:text-white">
                <HelpCircle className="h-5 w-5" />
                <span>Icons</span>
                <ChevronDown className="ml-auto h-4 w-4" />
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton className="hover:bg-indigo-600/20 hover:text-white">
                <Map className="h-5 w-5" />
                <span>Maps</span>
                <ChevronDown className="ml-auto h-4 w-4" />
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton className="hover:bg-indigo-600/20 hover:text-white">
                <Share2 className="h-5 w-5" />
                <span>Multi Level</span>
                <ChevronDown className="ml-auto h-4 w-4" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>

      {/* Hover menu for Apps */}
      {hoveredItem === "apps" && isCollapsed && (
        <div
          className="absolute left-[60px] top-[120px] z-50 w-48 rounded-md border bg-white py-1 shadow-lg"
          onMouseEnter={() => setHoveredItem("apps")}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <div className="px-3 py-2 text-sm font-medium">Apps</div>
          <div className="border-t"></div>
          <Link
            href="#"
            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
          >
            <Calendar className="h-4 w-4" />
            <span>Calendar</span>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Chat</span>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
          >
            <Mail className="h-4 w-4" />
            <span>Email</span>
            <ChevronDown className="ml-auto h-3 w-3" />
          </Link>
          <Link
            href="#"
            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Ecommerce</span>
            <ChevronDown className="ml-auto h-3 w-3" />
          </Link>
          <Link
            href="#"
            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
          >
            <FileText className="h-4 w-4" />
            <span>Projects</span>
            <ChevronDown className="ml-auto h-3 w-3" />
          </Link>
          <Link
            href="#"
            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
          >
            <Ticket className="h-4 w-4" />
            <span>Tasks</span>
            <ChevronDown className="ml-auto h-3 w-3" />
          </Link>
          <Link
            href="#"
            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
          >
            <Users className="h-4 w-4" />
            <span>CRM</span>
            <ChevronDown className="ml-auto h-3 w-3" />
          </Link>
          <Link
            href="#"
            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
          >
            <LineChart className="h-4 w-4" />
            <span>Crypto</span>
            <ChevronDown className="ml-auto h-3 w-3" />
          </Link>
          <Link
            href="#"
            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
          >
            <FileText className="h-4 w-4" />
            <span>Invoices</span>
            <ChevronDown className="ml-auto h-3 w-3" />
          </Link>
          <Link
            href="#"
            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
          >
            <HelpCircle className="h-4 w-4" />
            <span>Support Tickets</span>
            <ChevronDown className="ml-auto h-3 w-3" />
          </Link>
          <Link
            href="#"
            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>NFT Marketplace</span>
            <ChevronDown className="ml-auto h-3 w-3" />
          </Link>
          <Link
            href="#"
            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
          >
            <FileText className="h-4 w-4" />
            <span>File Manager</span>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
          >
            <FileText className="h-4 w-4" />
            <span>To Do</span>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
          >
            <Gauge className="h-4 w-4" />
            <span>Jobs</span>
            <ChevronDown className="ml-auto h-3 w-3" />
          </Link>
          <Link
            href="#"
            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
          >
            <Key className="h-4 w-4" />
            <span>API Key</span>
          </Link>
        </div>
      )}
    </>
  );
}

function Key(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </svg>
  )
}
