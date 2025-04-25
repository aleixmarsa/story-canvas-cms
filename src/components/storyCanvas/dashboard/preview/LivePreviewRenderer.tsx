"use client";

import { useEffect, useState } from "react";
import SectionRenderer from "./SectionRenderer";
import type { DraftStoryPreviewData } from "@/types/story";

type LivePreviewRendererProps = {
  initialStoryData: DraftStoryPreviewData;
};

const LivePreviewRenderer = ({
  initialStoryData,
}: LivePreviewRendererProps) => {
  const [storyData, setStoryData] = useState(initialStoryData);

  //   useEffect(() => {
  //     const handleMessage = (event: MessageEvent) => {
  //       if (event.data.type === "preview:update") {
  //         setStoryData(event.data.payload);
  //       }
  //     };
  //     window.addEventListener("message", handleMessage);
  //     return () => window.removeEventListener("message", handleMessage);
  //   }, []);

  const sortedSections = [...(storyData.sections ?? [])].sort(
    (a, b) => a.order - b.order
  );

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="space-y-10">
        {sortedSections.map((section) => (
          <SectionRenderer key={section.id} section={section} />
        ))}
      </div>
    </div>
  );
};

export default LivePreviewRenderer;
