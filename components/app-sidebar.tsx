"use client";

import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavMenus } from "@/constants/nav";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { LayoutGrid, Play, Radio } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open } = useSidebar();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Link href="/" className="flex items-center">
                <Image src="/logo.png" alt="Verdicto" width={32} height={32} />
                <span className="text-2xl font-bold ml-2">Verdicto</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <div className={cn("pb-12")}>
          <div className="space-y-4 py-4">
            <div className={cn("transition-all", !open ? "" : "px-3 py-2")}>
              <div className="space-y-1">
                <Button variant="secondary" className="w-full justify-start">
                  <Play className="mr-2 h-4 w-4" />
                  Listen Now
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <LayoutGrid className="mr-2 h-4 w-4" />
                  Browse
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Radio className="mr-2 h-4 w-4" />
                  Radio
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
