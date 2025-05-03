import z from "zod";
// Schema with UI
import { titleSectionSchemaWithUI } from "./ui/title-section-ui";
import { paragraphSectionSchemaWithUI } from "./ui/paragraph-section-ui";
import { imageSectionSchemaWithUI } from "./ui/image-section-ui";
import { videoSectionSchemaWithUI } from "./ui/video-section-ui";
import { paragraphAndImageSectionSchemaWithUI } from "./ui/paragraph-and-image-section-ui";
import { chartSectionSchemaWithUI } from "./ui/chart-section-schema-ui";

//Schemas
import { TitleSectionSchema } from "./validation/title-section-schema";
import { ParagraphSectionSchema } from "./validation/paragraph-section-schema";
import { ImageSectionSchema } from "./validation/image-section-schema";
import { VideoSectionSchema } from "./validation/video-section-schema";
import { ParagraphAndImageSectionSchema } from "./validation/paragraph-and-image-section-schema";
import { ChartSectionSchema } from "./validation/chart-section-schema";

//Props
import { TitleSectionProps } from "./validation/title-section-schema";
import { ParagraphSectionProps } from "./validation/paragraph-section-schema";
import { ImageSectionProps } from "./validation/image-section-schema";
import { VideoSectionProps } from "./validation/video-section-schema";
import { ParagraphAndImageSectionProps } from "./validation/paragraph-and-image-section-schema";
import { ChartSectionProps } from "./validation/chart-section-schema";

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
