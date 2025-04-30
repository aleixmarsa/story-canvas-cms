"use client";

import { useEffect, useState } from "react";
import SectionRenderer from "./SectionRenderer";
import type { DraftStoryPreviewData } from "@/types/story";
import { SectionContentByCategory } from "@/sections/section-categories";

type LivePreviewRendererProps = {
  initialStoryData: DraftStoryPreviewData;
};

const LivePreviewRenderer = ({
  initialStoryData,
}: LivePreviewRendererProps) => {
  const [storyData, setStoryData] = useState(initialStoryData);
  console.log("🚀 ~ storyData:", storyData);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "preview:update") {
        const updatedSection = event.data.payload;
        console.log(
          "🚀 ~ handleMessage ~ event.data.payload:",
          event.data.payload
        );
        setStoryData((prev) => ({
          ...prev,
          sections: prev.sections.map((section) =>
            section.id === updatedSection.id ? updatedSection : section
          ),
        }));
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const sortedSections = [...(storyData.sections ?? [])].sort(
    (a, b) => a.order - b.order
  );

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="space-y-10">
        {sortedSections.map((section) => {
          if (
            typeof section.content !== "object" ||
            section.content === null ||
            Array.isArray(section.content)
          ) {
            console.error("Invalid section content:", section.content);
            return (
              <div key={section.id} className="text-red-500">
                Invalid section content
              </div>
            );
          }

          return (
            <SectionRenderer
              key={section.id}
              type={section.type as keyof SectionContentByCategory}
              content={
                section.content as SectionContentByCategory[keyof SectionContentByCategory]
              }
            />
          );
        })}
      </div>
    </div>
  );
};

export default LivePreviewRenderer;
