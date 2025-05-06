"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { AnimationTypes } from "@/sections/validation/animation-field-schema";

type AnimatedSectionProps = {
  animation?: {
    type?: AnimationTypes;
    delay?: number;
    duration?: number;
    easing?: string;
  };
  children: React.ReactNode;
};

export const AnimatedSection = ({
  animation,
  children,
}: AnimatedSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  console.log("🚀 ~ animation:", animation);

  useEffect(() => {
    if (!sectionRef.current || animation?.type === "none") return;

    const config = {
      duration: animation?.duration ?? 0.5,
      delay: animation?.delay ?? 0,
      ease: animation?.easing ?? "power1.out",
    };

    switch (animation?.type) {
      case "fade":
        gsap.fromTo(
          sectionRef.current,
          { opacity: 0 },
          { opacity: 1, ...config }
        );
        break;
      case "slide-up":
        gsap.fromTo(
          sectionRef.current,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, ...config }
        );
        break;
      case "zoom-in":
        gsap.fromTo(
          sectionRef.current,
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, ...config }
        );
        break;
    }
  }, [animation]);

  return <div ref={sectionRef}>{children}</div>;
};
