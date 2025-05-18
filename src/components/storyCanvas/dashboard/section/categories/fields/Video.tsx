import {
  isYouTubeUrl,
  isVimeoUrl,
  getVimeoEmbedUrl,
  getYouTubeEmbedUrl,
} from "@/lib/utils";

type VideoProps = {
  video: string | undefined;
  videoSize?: {
    width?: number;
    height?: number;
  };
};

const Video = ({ video, videoSize }: VideoProps) => {
  if (!video) return null;
  if (isYouTubeUrl(video)) {
    const embedUrl = getYouTubeEmbedUrl(video);

    return embedUrl ? (
      <iframe
        className="mx-auto rounded-lg shadow-md w-full max-w-[600px] aspect-video"
        src={embedUrl}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        width={videoSize?.width || "auto"}
        height={videoSize?.height || "auto"}
      />
    ) : null;
  }
  if (isVimeoUrl(video)) {
    const embedUrl = getVimeoEmbedUrl(video);
    return embedUrl ? (
      <iframe
        className="mx-auto rounded-lg shadow-md w-full max-w-[600px] aspect-video"
        src={embedUrl}
        title="Vimeo video player"
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        width={videoSize?.width || "auto"}
        height={videoSize?.height || "auto"}
      />
    ) : null;
  }
  return video.length !== 0 ? (
    <video
      className="mx-auto rounded-lg shadow-md"
      controls
      src={video}
      poster={video}
      width="600"
      height="400"
      preload="metadata"
      style={{
        width: videoSize?.width || "auto",
        height: videoSize?.height || "auto",
      }}
    />
  ) : null;
};

export default Video;
