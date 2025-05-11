import { ANIMATION_TYPES } from "@/sections/validation/fields/animation-field-schema";

type AnimationConfig = {
  animationType: string;
  duration?: number;
  delay?: number;
  easing?: string;
};

export function applyAnimation(
  target: HTMLElement,
  animation: AnimationConfig,
  timeline: gsap.core.Timeline
) {
  const baseConfig = {
    duration: animation.duration ?? 0.5,
    delay: animation.delay ?? 0,
    ease: animation.easing ?? "power1.out",
  };

  const config: Partial<typeof baseConfig> = { ...baseConfig };
  if (
    animation.animationType === ANIMATION_TYPES.bounceIn ||
    animation.animationType === ANIMATION_TYPES.elasticIn
  ) {
    delete config.ease;
  }

  switch (animation.animationType) {
    case ANIMATION_TYPES.fade:
      timeline.fromTo(target, { opacity: 0 }, { opacity: 1, ...config });
      break;

    case ANIMATION_TYPES.slideUp:
      timeline.fromTo(
        target,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, ...config }
      );
      break;

    case ANIMATION_TYPES.slideDown:
      timeline.fromTo(
        target,
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, ...config }
      );
      break;

    case ANIMATION_TYPES.slideLeft:
      timeline.fromTo(
        target,
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, ...config }
      );
      break;

    case ANIMATION_TYPES.slideRight:
      timeline.fromTo(
        target,
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, ...config }
      );
      break;

    case ANIMATION_TYPES.zoomIn:
      timeline.fromTo(
        target,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, ...config }
      );
      break;

    case ANIMATION_TYPES.zoomOut:
      timeline.fromTo(
        target,
        { scale: 1.2, opacity: 0 },
        { scale: 1, opacity: 1, ...config }
      );
      break;
    case ANIMATION_TYPES.flipHorizontal:
      timeline.fromTo(
        target,
        { rotationY: 90, opacity: 0 },
        {
          rotationY: 0,
          opacity: 1,
          transformPerspective: 800,
          ...config,
        }
      );
      break;

    case ANIMATION_TYPES.flipVertical:
      timeline.fromTo(
        target,
        { rotationX: 90, opacity: 0 },
        {
          rotationX: 0,
          opacity: 1,
          transformPerspective: 800,
          ...config,
        }
      );
      break;

    case ANIMATION_TYPES.bounceIn:
      timeline.fromTo(
        target,
        { y: -100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "bounce.out",
          ...config,
        }
      );
      break;

    case ANIMATION_TYPES.elasticIn:
      timeline.fromTo(
        target,
        { scale: 0.5, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          ease: "elastic.out(1, 0.3)",
          ...config,
        }
      );
      break;

    default:
      break;
  }
}
