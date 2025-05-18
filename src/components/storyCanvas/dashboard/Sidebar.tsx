"use client";

import { ScrollText, User2, BookOpen, FileCode } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { NavUser } from "@/components/storyCanvas/dashboard/NavUser";
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
import { ROUTES } from "@/lib/constants/story-canvas";
import { CurrentUser } from "@/types/auth";
import { logout } from "@/lib/actions/auth/login";
import { LogOut } from "lucide-react";
import { useStories } from "@/lib/swr/useStories";
import { Separator } from "@/components/ui/separator";
export function DashboardSidebar({
  user,
  ...props
}: {
  user: CurrentUser | null;
} & React.ComponentProps<typeof Sidebar>) {
  const { stories, isLoading, isError } = useStories();

  const handleLogout = async () => {
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
                  <Image
                    src="/story-canvas-logo.svg"
                    alt="Logo"
                    width={26}
                    height={26}
                    className="mx-auto dark:invert"
                    priority
                  />
                </div>
                <div className="grid flex-1 text-left text-lg leading-tight">
                  <span className="truncate font-medium">StoryCanvas</span>
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

              {!isLoading && !isError && (
                <SidebarMenuSub>
                  {stories.map((story) => (
                    <SidebarMenuSubItem key={story.id}>
                      <SidebarMenuSubButton asChild>
                        <Link
                          href={`${ROUTES.stories}/${story.currentDraft?.slug}`}
                          className="truncate"
                        >
                          {story.currentDraft?.title}
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
            <Separator className="my-2" />
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={"Swagger"}>
                <Link
                  href={ROUTES.swagger}
                  className="font-medium"
                  target="_blank"
                >
                  <FileCode className="h-4 w-4" />
                  Swagger
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {process.env.NEXT_PUBLIC_DOCS_URL && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={"Documentation"}>
                  <a
                    href={process.env.NEXT_PUBLIC_DOCS_URL}
                    target="_blank"
                    className="font-medium"
                  >
                    <BookOpen className="h-4 w-4" />
                    Documentation
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
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
