import { VideoSectionProps } from "@/sections/validation/sections/video-section-schema";

const VideoSection = ({ video, title }: VideoSectionProps) => {
  return (
    <div className="py-8 text-center">
      <video
        className="mx-auto rounded-lg shadow-md"
        controls
        src={video.url}
        poster={video.url}
        width="600"
        height="400"
        preload="metadata"
        onError={(e) => {
          console.error("Video loading error:", e);
        }}
      />
      <h2 className="mt-4 text-xl font-semibold">{title}</h2>
    </div>
  );
};

export default VideoSection;
