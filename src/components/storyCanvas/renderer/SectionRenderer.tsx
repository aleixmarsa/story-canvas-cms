import { SectionContentByCategory } from "@/sections/section-categories";

import TitleSection from "../dashboard/section/categories/TitleSection";
import ParagraphSection from "../dashboard/section/categories/ParagraphSection";
import ImageSection from "../dashboard/section/categories/ImageSection";
import VideoSection from "../dashboard/section/categories/VideoSection";
import ParagraphAndImageSection from "../dashboard/section/categories/ParagraphAndImageSection";
import ChartSection from "../dashboard/section/categories/ChartSection";
import CallToActionSection from "../dashboard/section/categories/CallToActionSection";
import { StyledSectionWrapper } from "../dashboard/section/categories/StyledSectionWrapper";

type SectionRendererProps<T extends keyof SectionContentByCategory> = {
  type: T;
  content: SectionContentByCategory[T];
};

const SectionRenderer = <T extends keyof SectionContentByCategory>({
  type,
  content,
}: SectionRendererProps<T>) => {
  const sectionComponent = () => {
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
      case "PARAGRAPH_AND_IMAGE":
        return (
          <ParagraphAndImageSection
            {...(content as SectionContentByCategory["PARAGRAPH_AND_IMAGE"])}
          />
        );
      case "CHART":
        return (
          <ChartSection {...(content as SectionContentByCategory["CHART"])} />
        );
      case "CALL_TO_ACTION":
        return (
          <CallToActionSection
            {...(content as SectionContentByCategory["CALL_TO_ACTION"])}
          />
        );
      default:
        return <div className="text-red-500">Unknown section type: {type}</div>;
    }
  };
  return (
    <StyledSectionWrapper {...content}>
      {sectionComponent()}
    </StyledSectionWrapper>
  );
};

export default SectionRenderer;
