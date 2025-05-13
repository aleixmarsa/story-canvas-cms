"use client";

import { useState, useEffect } from "react";
import type { RenderStoryData } from "@/types/story";
import StoryRenderer from "../../renderer/StoryRenderer";
import { usePreviewChannel } from "@/hooks/use-preview-iframe";
import { LIVE_PREVIEW_MESSAGES } from "@/lib/constants/story-canvas";
import { RenderSectionData } from "@/types/section";
import { getPreviewData } from "@/lib/preview-storage/preview-storage";

type Props = {
  initialStoryData: RenderStoryData;
};

const LivePreviewRenderer = ({ initialStoryData }: Props) => {
  const [storyData, setStoryData] = useState(initialStoryData);

  useEffect(() => {
    // Check if there is any new section data in local storage.
    // This means that a user is sorting, edition or creating a section.
    const sortedPreviewData =
      getPreviewData<RenderSectionData[]>("sort-sections");
    if (sortedPreviewData) {
      setStoryData((prev) => ({
        ...prev,
        sections: sortedPreviewData,
      }));
    }
    const updatedPreviewData =
      getPreviewData<RenderSectionData>("edit-section");
    if (updatedPreviewData) {
      setStoryData((prev) => ({
        ...prev,
        sections: prev.sections.map((section) =>
          section.id === updatedPreviewData.id ? updatedPreviewData : section
        ),
      }));
    }

    const newPreviewData = getPreviewData<RenderSectionData>("new-section");
    if (newPreviewData) {
      setStoryData((prev) => {
        const exists = prev.sections.some(
          (section) => section.id === newPreviewData.id
        );

        return {
          ...prev,
          sections: exists
            ? prev.sections.map((section) =>
                section.id === newPreviewData.id ? newPreviewData : section
              )
            : [...prev.sections, newPreviewData],
        };
      });
    }
  }, []);

  usePreviewChannel((msg) => {
    switch (msg.type) {
      case LIVE_PREVIEW_MESSAGES.updateSingleSection: {
        const updatedSection = msg.payload as RenderSectionData;
        setStoryData((prev) => ({
          ...prev,
          sections: prev.sections.map((section) =>
            section.id === updatedSection.id ? updatedSection : section
          ),
        }));
        break;
      }

      case LIVE_PREVIEW_MESSAGES.updateAllSections: {
        const updatedSections = msg.payload as RenderSectionData[];
        setStoryData((prev) => ({
          ...prev,
          sections: updatedSections,
        }));
        break;
      }

      case LIVE_PREVIEW_MESSAGES.createSingleSection: {
        const newSection = msg.payload as RenderSectionData;
        setStoryData((prev) => {
          const exists = prev.sections.some(
            (section) => section.id === newSection.id
          );

          return {
            ...prev,
            sections: exists
              ? prev.sections.map((section) =>
                  section.id === newSection.id ? newSection : section
                )
              : [...prev.sections, newSection],
          };
        });
        break;
      }

      case LIVE_PREVIEW_MESSAGES.deleteSection: {
        const deletedSectionId = msg.payload.sectionId;
        setStoryData((prev) => ({
          ...prev,
          sections: prev.sections.filter(
            (section) => section.id !== deletedSectionId
          ),
        }));
        break;
      }

      default:
        console.warn("Missatge no reconegut:", msg);
        break;
    }
  });

  return <StoryRenderer sections={storyData.sections} />;
};

export default LivePreviewRenderer;
