import { SectionContentByCategory } from "@/sections/section-categories";

import TitleSection from "../section/categories/TitleSection";
import ParagraphSection from "../section/categories/ParagraphSection";
import ImageSection from "../section/categories/ImageSection";
import VideoSection from "../section/categories/VideoSection";

type SectionRendererProps<T extends keyof SectionContentByCategory> = {
  type: T;
  content: SectionContentByCategory[T];
};

const SectionRenderer = <T extends keyof SectionContentByCategory>({
  type,
  content,
}: SectionRendererProps<T>) => {
  console.log("🚀 ~ type:", type);

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
    default:
      return <div className="text-red-500">Unknown section type: {type}</div>;
  }
};

export default SectionRenderer;
