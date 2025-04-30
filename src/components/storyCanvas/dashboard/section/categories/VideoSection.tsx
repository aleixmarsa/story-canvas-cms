import { VideoSectionProps } from "@/sections/validation/video-section-schema";

const VideoSection = ({ embedUrl, title }: VideoSectionProps) => {
  return (
    <section className="py-8 text-center">
      <iframe
        className="w-full max-w-3xl mx-auto aspect-video rounded-lg shadow-md"
        src={embedUrl}
        title={title}
        allowFullScreen
      />
      <h2 className="mt-4 text-xl font-semibold">{title}</h2>
    </section>
  );
};

export default VideoSection;
