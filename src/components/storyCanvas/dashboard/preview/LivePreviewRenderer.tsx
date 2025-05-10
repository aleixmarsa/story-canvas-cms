"use client";

import { useEffect, useState } from "react";
import type { RenderStoryData } from "@/types/story";
import StoryRenderer from "../../renderer/StoryRenderer";

type Props = {
  initialStoryData: RenderStoryData;
};

const LivePreviewRenderer = ({ initialStoryData }: Props) => {
  const [storyData, setStoryData] = useState(initialStoryData);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "preview:single_section_update") {
        const updatedSection = event.data.payload;
        setStoryData((prev) => ({
          ...prev,
          sections: prev.sections.map((section) =>
            section.id === updatedSection.id ? updatedSection : section
          ),
        }));
      }
      if (event.data.type === "preview:sections_update") {
        const updatedSections = event.data.payload;
        setStoryData((prev) => ({
          ...prev,
          sections: updatedSections,
        }));
      }
      if (event.data.type === "preview:single_section_create") {
        const newSection = event.data.payload;
        setStoryData((prev) => {
          // Check if a section with the same ID already exists
          const exists = prev.sections.some(
            (section) => section.id === newSection.id
          );

          // If it exists, replace the existing section (it means it is in process of creation)
          // If it doesn't exist, append the new section to the list
          return {
            ...prev,
            sections: exists
              ? prev.sections.map((section) =>
                  section.id === newSection.id ? newSection : section
                )
              : [...prev.sections, newSection],
          };
        });
      }

      if (event.data.type === "preview:delete_section") {
        const deletedSectionId = event.data.payload.sectionId;
        setStoryData((prev) => ({
          ...prev,
          sections: prev.sections.filter(
            (section) => section.id !== deletedSectionId
          ),
        }));
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return <StoryRenderer sections={storyData.sections} />;
};

export default LivePreviewRenderer;
