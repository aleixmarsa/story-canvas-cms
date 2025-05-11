export const ANIMATION_TYPES = {
  none: "none",
  fade: "fade",
  slideUp: "slide-up",
  slideDown: "slide-down",
  slideLeft: "slide-left",
  slideRight: "slide-right",
  zoomIn: "zoom-in",
  zoomOut: "zoom-out",
  flipHorizontal: "flip-horizontal",
  flipVertical: "flip-vertical",
  bounceIn: "bounce-in",
  elasticIn: "elastic-in",
} as const;

export const ANIMATION_TYPES_VALUES = Object.values(ANIMATION_TYPES) as [
  string,
  ...string[]
];

export const EASE_TYPES = [
  "none",
  "power1",
  "power1.in",
  "power1.out",
  "power1.inOut",
  "power2",
  "power2.in",
  "power2.out",
  "power2.inOut",
  "power3",
  "power3.in",
  "power3.out",
  "power3.inOut",
  "power4",
  "power4.in",
  "power4.out",
  "power4.inOut",
  "back",
  "back.in",
  "back.out",
  "back.inOut",
  "bounce",
  "bounce.in",
  "bounce.out",
  "bounce.inOut",
  "circ",
  "circ.in",
  "circ.out",
  "circ.inOut",
  "elastic",
  "elastic.in",
  "elastic.out",
  "elastic.inOut",
  "expo",
  "expo.in",
  "expo.out",
  "expo.inOut",
  "sine",
  "sine.in",
  "sine.out",
  "sine.inOut",
] as const;

export type AnimationTypes =
  (typeof ANIMATION_TYPES)[keyof typeof ANIMATION_TYPES];

export type EasingTypes = (typeof EASE_TYPES)[number];
