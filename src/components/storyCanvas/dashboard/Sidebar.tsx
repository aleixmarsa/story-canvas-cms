"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCmsStore } from "@/stores/cms-store";
import { LogOut } from "lucide-react";
import Link from "next/link";

const Sidebar = () => {
  const router = useRouter();

  const {
    stories,
    sections,
    selectedStory,
    selectedSection,
    setStories,
    selectSection,
  } = useCmsStore();

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

  const handleLogout = () => {
    console.log("Logging out...");
    router.push("/login");
  };

  return (
    <aside className="w-64 h-screen border-r bg-muted p-6 flex flex-col">
      <Link
        className="text-lg font-semibold text-left mb-6  cursor-pointer hover:underline"
        href="/admin/dashboard"
      >
        Story Canvas
      </Link>

      <ScrollArea className="grow pr-2">
        <ul className="space-y-4">
          {stories.map((story) => (
            <li key={story.id}>
              <Link
                href={`/admin/dashboard/${story.slug}`}
                className="text-sm font-medium text-muted-foreground hover:underline"
              >
                {story.title}
              </Link>

              {selectedStory?.id === story.id && sections.length > 0 && (
                <ul className="mt-2 pl-4 space-y-1">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <Button
                        variant={
                          selectedSection?.id === section.id
                            ? "default"
                            : "ghost"
                        }
                        size="sm"
                        className="w-full justify-start text-left"
                        onClick={() => selectSection(section)}
                      >
                        {section.name}
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
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
