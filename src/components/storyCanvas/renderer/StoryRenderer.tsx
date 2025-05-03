"use client";

import SectionRenderer from "./SectionRenderer";
import type { RenderStoryData } from "@/types/story";
import { SectionContentByCategory } from "@/sections/section-categories";

type Props = {
  sections: RenderStoryData["sections"];
};

const StoryRenderer = ({ sections }: Props) => {
  const sortedSections = [...(sections ?? [])].sort(
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

export default StoryRenderer;
