"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LogOut } from "lucide-react";
import Link from "next/link";

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    console.log("Logging out...");
    router.push("/login");
  };

  return (
    <aside className="w-64 h-screen bg-muted flex flex-col space-y-6">
      <div className="h-20  content-center px-8">
        <h1 className="w-full justify-start pl-0 text-lg font-semibold text-left ">
          Story Canvas
        </h1>
      </div>
      <ScrollArea className="grow px-4">
        <Button
          asChild
          variant="ghost"
          className={`w-full justify-start text-left ${
            pathname.includes("/admin/dashboard") ? " bg-white  " : ""
          }`}
        >
          <Link href="/admin/dashboard">Dashboard</Link>
        </Button>
      </ScrollArea>
      <div className="mt-6 pt-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-left cursor-pointer text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
