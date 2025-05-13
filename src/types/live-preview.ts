import { LIVE_PREVIEW_MESSAGES } from "@/lib/constants/story-canvas";
import { RenderSectionData } from "./section";
export type LivePreviewMessageType =
  (typeof LIVE_PREVIEW_MESSAGES)[keyof typeof LIVE_PREVIEW_MESSAGES];

export type PreviewMessage =
  | {
      type: typeof LIVE_PREVIEW_MESSAGES.updateAllSections;
      payload: RenderSectionData[];
    }
  | {
      type: typeof LIVE_PREVIEW_MESSAGES.updateSingleSection;
      payload: RenderSectionData;
    }
  | {
      type: typeof LIVE_PREVIEW_MESSAGES.createSingleSection;
      payload: RenderSectionData;
    }
  | {
      type: typeof LIVE_PREVIEW_MESSAGES.deleteSection;
      payload: { sectionId: number };
    };
