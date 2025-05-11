import { z } from "zod";

export const createScrollTriggerSchema = () =>
  z
    .object({
      start: z.string().min(1, "Start is required").optional(),
      end: z.string().min(1, "End is required").optional(),
      scrub: z.enum(["true", "false"]).optional(),
    })
    .superRefine(({ start, end }, ctx) => {
      if ((start && !end) || (end && !start)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "ScrollTrigger settings are required when using ScrollTrigger",
        });
      }
    })
    .optional();
