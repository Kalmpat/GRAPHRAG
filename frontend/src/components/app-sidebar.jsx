import "react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboardIcon,
  House,
  FileText,
  Waypoints,
  Settings2Icon,
  CircleHelpIcon,
} from "lucide-react";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      id: "dashboard",
      title: "Dashboard",
      url: "#",
      icon: <LayoutDashboardIcon />,
    },
    {
      id: "home",
      title: "Home",
      url: "#",
      icon: <House />,
    },
    {
      id: "documents",
      title: "Documents",
      url: "#",
      icon: <FileText />,
    },
  ],

  navSecondary: [
    {
      id: "settings",
      title: "Settings",
      url: "#",
      icon: <Settings2Icon />,
    },
    {
      id: "help",
      title: "Get Help",
      url: "#",
      icon: <CircleHelpIcon />,
    },
  ],
  documents: [],
};
export function AppSidebar({ activeTab, setActiveTab, ...props }) {
  return (
    <Sidebar variant="inset" collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<a href="#" />}
            >
              <Waypoints className="size-5!" />
              <span className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-blue-700 via-blue-500 to-sky-400 dark:from-blue-600 dark:via-blue-400 dark:to-sky-300 bg-clip-text text-transparent drop-shadow-sm">
                GRAPHRAG
              </span>{" "}
              {/* NEXUSRAG */}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={data.navMain}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <NavSecondary
          items={data.navSecondary}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          className="mt-auto"
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
