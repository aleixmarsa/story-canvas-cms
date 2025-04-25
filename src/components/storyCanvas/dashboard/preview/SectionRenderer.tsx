import { DraftSectionPreviewData } from "@/types/section";

const SectionRenderer = ({ section }: { section: DraftSectionPreviewData }) => {
  const { type, content, name } = section;

  switch (type) {
    case "TITLE":
      return (
        <div>
          <h1 className="text-2xl font-semibold">{content?.text || name}</h1>
        </div>
      );
    case "PARAGRAPH":
      return (
        <div className="text-base whitespace-pre-line text-muted-foreground">
          {content?.body}
        </div>
      );
    case "IMAGE":
      return (
        <div>
          <img
            src={content?.url}
            alt={content?.alt ?? ""}
            className="rounded-md shadow-md"
          />
          {content?.caption && (
            <p className="text-sm text-center mt-2 text-muted-foreground">
              {content.caption}
            </p>
          )}
        </div>
      );
    case "VIDEO":
      return (
        <div className="aspect-video">
          <iframe
            src={content?.embedUrl}
            title={content?.title ?? "Video"}
            allowFullScreen
            className="w-full h-full rounded-md shadow-md"
          />
        </div>
      );
    default:
      return (
        <div className="text-red-500">
          Unknown section type: <code>{type}</code>
        </div>
      );
  }
};

export default SectionRenderer;
