"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { applyAnimation } from "@/lib/animations/apply-animation";
import { CallToActionSectionProps } from "@/sections/validation/sections/call-to-action-schema";

gsap.registerPlugin(ScrollTrigger);

const CallToActionSection = ({
  label,
  url,
  newTab,
  button,
  buttonPadding,
  buttonAnimation,
  scrollTrigger,
}: CallToActionSectionProps) => {
  const buttonRef = useRef<HTMLAnchorElement>(null);

  useGSAP(
    () => {
      const buttonElement = buttonRef.current;
      if (
        !buttonElement ||
        !buttonAnimation ||
        buttonAnimation?.animationType === "none"
      )
        return;

      const scroll =
        scrollTrigger && scrollTrigger.start !== "none" ? scrollTrigger : null;

      const timeline = gsap.timeline({
        scrollTrigger: scroll
          ? {
              trigger: buttonElement,
              start: scroll.start,
              end: scroll.end,
              scrub: scroll.scrub === "true",
            }
          : undefined,
      });

      applyAnimation(buttonElement, buttonAnimation, timeline);
    },
    { dependencies: [buttonAnimation, scrollTrigger], revertOnUpdate: true }
  );

  const buttonStyle: React.CSSProperties = {
    backgroundColor: button?.buttonColor || "#000000",
    paddingTop: buttonPadding?.top ? `${buttonPadding.top}px` : undefined,
    paddingBottom: buttonPadding?.bottom
      ? `${buttonPadding.bottom}px`
      : undefined,
    paddingLeft: buttonPadding?.left ? `${buttonPadding.left}px` : undefined,
    paddingRight: buttonPadding?.right ? `${buttonPadding.right}px` : undefined,
    borderRadius: button?.buttonBorderRadius
      ? `${button.buttonBorderRadius}px`
      : undefined,
    color: button?.labelColor || "#ffffff",
    fontSize: button?.labelSize ? `${button.labelSize}px` : "16px",
  };

  return (
    <a
      href={url}
      target={newTab ? "_blank" : "_self"}
      rel="noopener noreferrer"
      style={buttonStyle}
      className="flex items-center justify-center text-center"
      ref={buttonRef}
    >
      {label}
    </a>
  );
};

export default CallToActionSection;
