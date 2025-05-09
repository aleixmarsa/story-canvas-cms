import { TitleSectionProps } from "@/sections/validation/sections/title-section-schema";
import RichTextContent from "./fields/RichTextContent";
const TitleSection = ({ text, textPadding }: TitleSectionProps) => {
  const inlineStyle: React.CSSProperties = {
    paddingTop: textPadding?.top ? `${textPadding.top}px` : undefined,
    paddingBottom: textPadding?.bottom ? `${textPadding.bottom}px` : undefined,
    paddingLeft: textPadding?.left ? `${textPadding.left}px` : undefined,
    paddingRight: textPadding?.right ? `${textPadding.right}px` : undefined,
  };
  return (
    <div className={`py-8 `} style={inlineStyle}>
      <RichTextContent html={text} />
    </div>
  );
};

export default TitleSection;
