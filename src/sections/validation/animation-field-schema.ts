import { z } from "zod";

const animationTypes = ["fade", "slide-up", "zoom-in", "none"] as const;

export type AnimationTypes = (typeof animationTypes)[number];

export const animationSchema = z.object({
  type: z.enum(animationTypes).default("none"),
  delay: z.number().min(0).max(10).optional(), // en segons
  duration: z.number().min(0.1).max(10).optional(), // en segons
  easing: z.string().optional(), // p.ex. "ease-in-out"
});

export type AnimationSchema = typeof animationSchema;
export type AnimationProps = z.infer<typeof animationSchema>;
