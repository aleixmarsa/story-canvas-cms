import z from "zod";
import { titleSectionSchemaWithUI } from "./ui/title-section-ui";
import { paragraphSectionSchemaWithUI } from "./ui/paragraph-section-ui";
import { imageSectionSchemaWithUI } from "./ui/image-section-ui";
import { videoSectionSchemaWithUI } from "./ui/video-section-ui";
import { TitleSectionSchema } from "./validation/title-section-schema";
import { ParagraphSectionSchema } from "./validation/paragraph-section-schema";
import { ImageSectionSchema } from "./validation/image-section-schema";
import { VideoSectionSchema } from "./validation/video-section-schema";

export type SectionSchemas =
  | TitleSectionSchema
  | ParagraphSectionSchema
  | ImageSectionSchema
  | VideoSectionSchema;

export type SectionSchemasWithUI =
  | typeof titleSectionSchemaWithUI
  | typeof paragraphSectionSchemaWithUI
  | typeof imageSectionSchemaWithUI
  | typeof videoSectionSchemaWithUI;

export const sectionCategoriesSchemasWithUI: Record<
  string,
  SectionSchemasWithUI
> = {
  TITLE: titleSectionSchemaWithUI,
  PARAGRAPH: paragraphSectionSchemaWithUI,
  IMAGE: imageSectionSchemaWithUI,
  VIDEO: videoSectionSchemaWithUI,
};
export const SectionCategoryEnum = z.enum(
  Object.keys(sectionCategoriesSchemasWithUI) as [
    keyof typeof sectionCategoriesSchemasWithUI,
    ...[]
  ]
);

export type SectionCategoriesSchemasWithUI =
  typeof sectionCategoriesSchemasWithUI;

export type SectionCategory = z.infer<typeof SectionCategoryEnum>;
