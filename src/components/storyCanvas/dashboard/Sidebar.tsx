"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCmsStore } from "@/stores/cms-store";
import { LogOut } from "lucide-react";

export default function Sidebar() {
  const router = useRouter();

  const {
    stories,
    sections,
    selectedStory,
    selectedSection,
    setStories,
    setSections,
    selectStory,
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

  const handleStorySelect = async (storyId: number) => {
    const story = stories.find((s) => s.id === storyId);
    if (!story || selectedStory?.id === story.id) return;

    selectStory(story);

    const res = await fetch(`/api/sections?storyId=${story.id}`);
    const data = await res.json();
    setSections(data);

    router.push(`/admin/dashboard/${story.slug}`);
  };

  const handleGoHome = () => {
    selectStory(null);
    selectSection(null);
    router.push("/admin/dashboard");
  };

  const handleLogout = () => {
    console.log("Logging out...");
    router.push("/login");
  };

  return (
    <aside className="w-64 h-screen border-r bg-muted p-6 flex flex-col">
      <button
        onClick={handleGoHome}
        className="text-lg font-semibold text-left mb-6  cursor-pointer hover:underline"
      >
        Story Canvas
      </button>

      <ScrollArea className="grow pr-2">
        <ul className="space-y-4">
          {stories.map((story) => (
            <li key={story.id}>
              <Button
                variant={selectedStory?.id === story.id ? "default" : "ghost"}
                className="w-full justify-start text-left font-medium hover:bg-muted/50"
                onClick={() => handleStorySelect(story.id)}
              >
                {story.title}
              </Button>

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
                        {section.type}
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
}
