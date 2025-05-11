import { z } from "zod";
import {
  ANIMATION_TYPES_VALUES,
  EASE_TYPES,
} from "../fields/animation-field-schema";

export const createAnimationSchema = () =>
  z
    .object({
      animationType: z.enum(ANIMATION_TYPES_VALUES),
      delay: z.number().min(0).max(10).optional(),
      duration: z.number().min(0).max(10).optional(),
      easing: z.enum(EASE_TYPES).optional(),
    })
    .optional();
