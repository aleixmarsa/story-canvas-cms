import { z } from "zod";
import { numberOrUndefined } from "../helpers";

export const BACKGROUND_SIZE_VALUES = ["auto", "cover", "contain"] as const;
export const BACKGROUND_POSITION_VALUES = [
  "left",
  "right",
  "top",
  "bottom",
  "center",
] as const;

export const stylesFieldsSchema = {
  sectionBackground: z
    .object({
      image: z
        .string()
        .transform((val) => (val?.trim() === "" ? undefined : val))
        .refine(
          (val) => val === undefined || z.string().url().safeParse(val).success,
          {
            message: "Invalid URL",
          }
        )
        .optional(),
      color: z
        .string()
        .regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/, {
          message: "Invalid hex color code",
        })
        .optional(),
      size: z.enum(BACKGROUND_SIZE_VALUES).optional(),
      position: z.enum(BACKGROUND_POSITION_VALUES).optional(),
    })
    .optional(),

  sectionPadding: z
    .object({
      top: numberOrUndefined.optional(),
      bottom: numberOrUndefined.optional(),
      left: numberOrUndefined.optional(),
      right: numberOrUndefined.optional(),
    })
    .optional(),
  sectionMargin: z
    .object({
      top: numberOrUndefined.optional(),
      bottom: numberOrUndefined.optional(),
      left: numberOrUndefined.optional(),
      right: numberOrUndefined.optional(),
    })
    .optional(),
};

export const stylesSchema = z.object(stylesFieldsSchema);

export type StylesFields = z.infer<typeof stylesSchema>;
