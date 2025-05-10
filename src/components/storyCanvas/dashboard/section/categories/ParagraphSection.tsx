import { ParagraphSectionProps } from "@/sections/validation/sections/paragraph-section-schema";
import RichTextContent from "./fields/RichTextContent";

const ParagraphSection = ({ body, textPadding }: ParagraphSectionProps) => {
  const inlineStyle: React.CSSProperties = {
    paddingTop: textPadding?.top ? `${textPadding.top}px` : undefined,
    paddingBottom: textPadding?.bottom ? `${textPadding.bottom}px` : undefined,
    paddingLeft: textPadding?.left ? `${textPadding.left}px` : undefined,
    paddingRight: textPadding?.right ? `${textPadding.right}px` : undefined,
  };

  return (
    <div className="py-8" style={inlineStyle}>
      <RichTextContent html={body} />
    </div>
  );
};

export default ParagraphSection;
