import { SectionContentByCategory } from "@/sections/section-categories";

import TitleSection from "../section/categories/TitleSection";
import ParagraphSection from "../section/categories/ParagraphSection";
import ImageSection from "../section/categories/ImageSection";
import VideoSection from "../section/categories/VideoSection";
import TextAndImageSection from "../section/categories/TextAndImageSection";
import ChartSection from "../section/categories/ChartSection";

type SectionRendererProps<T extends keyof SectionContentByCategory> = {
  type: T;
  content: SectionContentByCategory[T];
};

const SectionRenderer = <T extends keyof SectionContentByCategory>({
  type,
  content,
}: SectionRendererProps<T>) => {
  switch (type) {
    case "TITLE":
      return (
        <TitleSection {...(content as SectionContentByCategory["TITLE"])} />
      );
    case "PARAGRAPH":
      return (
        <ParagraphSection
          {...(content as SectionContentByCategory["PARAGRAPH"])}
        />
      );
    case "IMAGE":
      return (
        <ImageSection {...(content as SectionContentByCategory["IMAGE"])} />
      );
    case "VIDEO":
      return (
        <VideoSection {...(content as SectionContentByCategory["VIDEO"])} />
      );
    case "TEXT_AND_IMAGE":
      return (
        <TextAndImageSection
          {...(content as SectionContentByCategory["TEXT_AND_IMAGE"])}
        />
      );
    case "CHART":
      return (
        <ChartSection {...(content as SectionContentByCategory["CHART"])} />
      );
    default:
      return <div className="text-red-500">Unknown section type: {type}</div>;
  }
};

export default SectionRenderer;
