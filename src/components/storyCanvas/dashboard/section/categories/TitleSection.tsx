import { TitleSectionProps } from "@/sections/validation/sections/title-section-schema";

const TitleSection = ({ text, backgroundImage }: TitleSectionProps) => {
  return (
    <div className={`py-8 `}>
      {backgroundImage && (
        <div
          className="w-full h-64 bg-cover bg-center mb-4"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
      <h1>{text}</h1>
    </div>
  );
};

export default TitleSection;
