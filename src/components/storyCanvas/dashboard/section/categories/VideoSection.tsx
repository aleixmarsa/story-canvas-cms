import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { VideoSectionProps } from "@/sections/validation/sections/video-section-schema";
import RichTextContent from "./fields/RichTextContent";
import Video from "./fields/Video";
import { applyAnimation } from "@/lib/animations/apply-animation";

gsap.registerPlugin(ScrollTrigger);

const VideoSection = ({
  video,
  title,
  description,
  videoSize,
  textAnimation,
  videoAnimation,
  scrollTrigger,
}: VideoSectionProps) => {
  const textRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const textElement = textRef.current;
      const videoElement = videoRef.current;
      if (
        !textElement ||
        !videoElement ||
        !textAnimation ||
        textAnimation?.animationType === "none"
      )
        return;

      const scroll =
        scrollTrigger && scrollTrigger.start !== "none" ? scrollTrigger : null;

      const timeline = gsap.timeline({
        scrollTrigger: scroll
          ? {
              trigger: textElement,
              start: scroll.start,
              end: scroll.end,
              scrub: scroll.scrub === "true",
            }
          : undefined,
      });

      if (textAnimation) applyAnimation(textElement, textAnimation, timeline);
      if (videoAnimation)
        applyAnimation(videoElement, videoAnimation, timeline);
    },
    { dependencies: [textAnimation, scrollTrigger], revertOnUpdate: true }
  );

  return (
    <div>
      <div ref={textRef}>
        <RichTextContent html={title} className="pb-4" />
        {description && <RichTextContent html={description} className="pb-6" />}
      </div>
      <div ref={videoRef}>
        <Video video={video} videoSize={videoSize} />
      </div>
    </div>
  );
};

export default VideoSection;
