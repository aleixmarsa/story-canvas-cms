"use client";

import { useEffect, useState } from "react";
import type { RenderStoryData } from "@/types/story";
import StoryRenderer from "../../renderer/StoryRenderer";

type Props = {
  initialStoryData: RenderStoryData;
};

const LivePreviewRenderer = ({ initialStoryData }: Props) => {
  const [storyData, setStoryData] = useState(initialStoryData);
  console.log("🚀 ~ LivePreviewRenderer ~ storyData:", storyData.sections);

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
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return <StoryRenderer sections={storyData.sections} />;
};

export default LivePreviewRenderer;
