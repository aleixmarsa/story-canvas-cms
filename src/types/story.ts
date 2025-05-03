import { Story, StoryVersion } from "@prisma/client";
import { RenderSectionData } from "./section";
/**
 * StoryWithVersions represents a Story that includes its
 * current draft and published version objects (via relation includes).
 */
export type StoryWithVersions = Story & {
  currentDraft: StoryVersion | null;
  publishedVersion: StoryVersion | null;
};

/**
 * StoryDraft is a type used when working directly with a StoryVersion
 * that also includes the parent Story (useful in editing or preview context).
 */
export type StoryDraft = StoryVersion & {
  story: Story;
};

/**
 * Represents render data for a Story,
 */
export type RenderStoryData = Pick<
  StoryVersion,
  "title" | "description" | "theme" | "slug"
> & {
  sections: RenderSectionData[];
};
