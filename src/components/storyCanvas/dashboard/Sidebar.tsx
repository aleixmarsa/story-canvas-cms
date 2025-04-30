"use client";

import { useEffect } from "react";
import { Feather, ScrollText, User2 } from "lucide-react";
import Link from "next/link";
import { NavUser } from "@/components/storyCanvas/dashboard/NavUser";
import { useDashboardStore } from "@/stores/dashboard-store";
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
import { ROUTES } from "@/lib/constants/storyCanvas";
import { CurrentUser } from "@/types/auth";
import { logout } from "@/lib/actions/auth/login";
import { LogOut } from "lucide-react";

export function DashboardSidebar({
  user,
  ...props
}: {
  user: CurrentUser | null;
} & React.ComponentProps<typeof Sidebar>) {
  const { stories, setStories } = useDashboardStore();

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

  const handleLogout = async () => {
    useDashboardStore.persist.clearStorage();
    await logout();
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href={ROUTES.dashboard}>
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
                <Link href={ROUTES.stories} className="font-medium">
                  <ScrollText className="h-4 w-4" />
                  Stories
                </Link>
              </SidebarMenuButton>

              {stories.length > 0 && (
                <SidebarMenuSub>
                  {stories.map((story) => (
                    <SidebarMenuSubItem key={story.id}>
                      <SidebarMenuSubButton asChild>
                        <Link
                          href={`${ROUTES.stories}/${story.currentDraft?.slug}`}
                        >
                          {story.currentDraft?.slug}
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              )}
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Users">
                <Link href={ROUTES.users} className="font-medium">
                  <User2 className="h-4 w-4" />
                  Users
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {user ? (
          <NavUser user={user} />
        ) : (
          <div
            className="flex items-center gap-2 px-1 py-1.5 text-left text-sm  cursor-pointer"
            onClick={handleLogout}
          >
            <LogOut />
            Log out
          </div>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
