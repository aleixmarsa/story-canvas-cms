"use client";

import { useEffect } from "react";
import { Feather, ScrollText } from "lucide-react";
import Link from "next/link";
import { NavUser } from "@/components/nav-user";
import { useCmsStore } from "@/stores/cms-store";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { stories, setStories } = useCmsStore();

  useEffect(() => {
    if (stories.length === 0) {
      const fetchStories = async () => {
        const res = await fetch("/api/stories");
        const data = await res.json();
        setStories(data);
      };
      fetchStories();
    }
  }, [stories.length, setStories]);

  const user = {
    name: "Aleix",
    email: "aleix.marsa@gmail.com",
    avatar: "AM",
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/admin/dashboard">
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Feather className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-lg leading-tight">
                  <span className="truncate font-medium">Story Canvas</span>
                </div>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={"Stories"}>
                <Link href="/admin/dashboard" className="font-medium">
                  <ScrollText className="h-4 w-4" />
                  Stories
                </Link>
              </SidebarMenuButton>

              {stories.length > 0 && (
                <SidebarMenuSub>
                  {stories.map((story) => (
                    <SidebarMenuSubItem key={story.id}>
                      <SidebarMenuSubButton asChild>
                        <Link href={`/admin/dashboard/${story.slug}`}>
                          {story.title}
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              )}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
