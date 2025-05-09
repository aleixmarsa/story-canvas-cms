import z from "zod";
// Schema with UI
import { titleSectionSchemaWithUI } from "./ui/sections/title-section-ui";
import { paragraphSectionSchemaWithUI } from "./ui/sections/paragraph-section-ui";
import { imageSectionSchemaWithUI } from "./ui/sections/image-section-ui";
import { videoSectionSchemaWithUI } from "./ui/sections/video-section-ui";
import { paragraphAndImageSectionSchemaWithUI } from "./ui/sections/paragraph-and-image-section-ui";
import { chartSectionSchemaWithUI } from "./ui/sections/chart-section-schema-ui";

//Schemas
import { TitleSectionSchema } from "./validation/sections/title-section-schema";
import { ParagraphSectionSchema } from "./validation/sections/paragraph-section-schema";
import { ImageSectionSchema } from "./validation/sections/image-section-schema";
import { VideoSectionSchema } from "./validation/sections/video-section-schema";
import { ParagraphAndImageSectionSchema } from "./validation/sections/paragraph-and-image-section-schema";
import { ChartSectionSchema } from "./validation/sections/chart-section-schema";

//Props
import { TitleSectionProps } from "./validation/sections/title-section-schema";
import { ParagraphSectionProps } from "./validation/sections/paragraph-section-schema";
import { ImageSectionProps } from "./validation/sections/image-section-schema";
import { VideoSectionProps } from "./validation/sections/video-section-schema";
import { ParagraphAndImageSectionProps } from "./validation/sections/paragraph-and-image-section-schema";
import { ChartSectionProps } from "./validation/sections/chart-section-schema";

export type SectionSchemas =
  | TitleSectionSchema
  | ParagraphSectionSchema
  | ImageSectionSchema
  | VideoSectionSchema
  | ParagraphAndImageSectionSchema
  | ChartSectionSchema;

export type SectionSchemasWithUI =
  | typeof titleSectionSchemaWithUI
  | typeof paragraphSectionSchemaWithUI
  | typeof imageSectionSchemaWithUI
  | typeof videoSectionSchemaWithUI
  | typeof paragraphAndImageSectionSchemaWithUI
  | typeof chartSectionSchemaWithUI;

export const sectionCategoriesSchemasWithUI: Record<
  string,
  SectionSchemasWithUI
> = {
  TITLE: titleSectionSchemaWithUI,
  PARAGRAPH: paragraphSectionSchemaWithUI,
  IMAGE: imageSectionSchemaWithUI,
  VIDEO: videoSectionSchemaWithUI,
  PARAGRAPH_AND_IMAGE: paragraphAndImageSectionSchemaWithUI,
  CHART: chartSectionSchemaWithUI,
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
  PARAGRAPH_AND_IMAGE: ParagraphAndImageSectionProps;
  CHART: ChartSectionProps;
};
