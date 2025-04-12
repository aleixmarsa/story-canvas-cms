import { Section, SectionVersion } from "@prisma/client";

/**
 * SetionWithVersions represents a Section that includes its
 * current draft and published version objects (via relation includes).
 */
export type SectionWithVersions = Section & {
  currentDraft: SectionVersion | null;
  publishedVersion: SectionVersion | null;
};

/**
 * SectionDraft is a type used when working directly with a SectionVersion
 * that also includes the parent Section (useful in editing or preview context).
 */
export type SectionDraft = SectionVersion & {
  story: Section;
};
