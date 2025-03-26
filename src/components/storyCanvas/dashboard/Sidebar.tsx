"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useCmsStore } from "@/stores/cms-store";

export default function Sidebar() {
  const {
    stories,
    sections,
    selectedStory,
    selectedSection,
    setStories,
    setSections,
    selectStory,
    selectSection,
    resetSelection,
    resetStoryAndSection,
  } = useCmsStore();

  // Loads project once
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

  // Fetches only if selected story is different to avoid unnecessary fetches
  const handleStorySelect = async (storyId: number) => {
    if (selectedStory?.id === storyId) return;
    const story = stories.find((s) => s.id === storyId);
    if (!story) return;
    selectStory(story);

    const res = await fetch(`/api/sections?storyId=${story.id}`);
    const data = await res.json();
    setSections(data);
  };

  return (
    <aside className="w-64 border-r px-4 py-8 space-y-4">
      <ul className="ml-4 mt-2 space-y-2">
        {stories.map((story) => (
          <li key={story.id}>
            <Button
              variant={selectedStory?.id === story.id ? "default" : "outline"}
              className="w-full justify-start cursor-pointer"
              onClick={() => handleStorySelect(story.id)}
            >
              {story.title}
            </Button>

            {selectedStory?.id === story.id && (
              <ul className="ml-4 mt-2 space-y-2">
                {sections.map((section) => (
                  <li key={section.id}>
                    <Button
                      variant={
                        selectedSection?.id === section.id
                          ? "default"
                          : "outline"
                      }
                      className="w-full justify-start cursor-pointer"
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
    </aside>
  );
}
