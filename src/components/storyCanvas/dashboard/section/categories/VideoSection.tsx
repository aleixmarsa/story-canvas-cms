import { VideoSectionProps } from "@/sections/validation/sections/video-section-schema";
import RichTextContent from "./fields/RichTextContent";

const VideoSection = ({ video, title }: VideoSectionProps) => {
  if (!video) return null;

  const videoUrl = typeof video === "string" ? video : video.url;
  return (
    <div className="py-8 text-center">
      <div className="mb-4">
        {video ? (
          <video
            className="mx-auto rounded-lg shadow-md"
            controls
            src={videoUrl}
            poster={videoUrl}
            width="600"
            height="400"
            preload="metadata"
            onError={(e) => {
              console.error("Video loading error:", e);
            }}
          />
        ) : (
          <></>
        )}
      </div>

      <RichTextContent html={title} />
    </div>
  );
};

export default VideoSection;
