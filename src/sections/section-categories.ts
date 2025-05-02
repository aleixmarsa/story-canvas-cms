import z from "zod";
import { titleSectionSchemaWithUI } from "./ui/title-section-ui";
import { paragraphSectionSchemaWithUI } from "./ui/paragraph-section-ui";
import { imageSectionSchemaWithUI } from "./ui/image-section-ui";
import { videoSectionSchemaWithUI } from "./ui/video-section-ui";
import { textAndImageSectionSchemaWithUI } from "./ui/text-and-image-section-ui";
import { TitleSectionSchema } from "./validation/title-section-schema";
import { ParagraphSectionSchema } from "./validation/paragraph-section-schema";
import { ImageSectionSchema } from "./validation/image-section-schema";
import { VideoSectionSchema } from "./validation/video-section-schema";
import { TextAndImageSectionSchema } from "./validation/text-and-image-section-schema";
import { TitleSectionProps } from "./validation/title-section-schema";
import { ParagraphSectionProps } from "./validation/paragraph-section-schema";
import { ImageSectionProps } from "./validation/image-section-schema";
import { VideoSectionProps } from "./validation/video-section-schema";
import { TextAndImageSectionProps } from "./validation/text-and-image-section-schema";

export type SectionSchemas =
  | TitleSectionSchema
  | ParagraphSectionSchema
  | ImageSectionSchema
  | VideoSectionSchema
  | TextAndImageSectionSchema;

export type SectionSchemasWithUI =
  | typeof titleSectionSchemaWithUI
  | typeof paragraphSectionSchemaWithUI
  | typeof imageSectionSchemaWithUI
  | typeof videoSectionSchemaWithUI
  | typeof textAndImageSectionSchemaWithUI;

export const sectionCategoriesSchemasWithUI: Record<
  string,
  SectionSchemasWithUI
> = {
  TITLE: titleSectionSchemaWithUI,
  PARAGRAPH: paragraphSectionSchemaWithUI,
  IMAGE: imageSectionSchemaWithUI,
  VIDEO: videoSectionSchemaWithUI,
  TEXT_AND_IMAGE: textAndImageSectionSchemaWithUI,
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

export type SectionContentByCategory = {
  TITLE: TitleSectionProps;
  PARAGRAPH: ParagraphSectionProps;
  IMAGE: ImageSectionProps;
  VIDEO: VideoSectionProps;
  TEXT_AND_IMAGE: TextAndImageSectionProps;
};
