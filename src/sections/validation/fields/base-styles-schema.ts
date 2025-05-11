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

export const SECTION_HEIGHT = {
  auto: "auto",
  full: "100vh",
  content: "fit-content",
};

export const SECTION_HEIGHT_VALUES = Object.values(SECTION_HEIGHT) as [
  string,
  ...string[]
];

export const ALIGN_ITEMS = {
  top: "flex-start",
  center: "center",
  bottom: "flex-end",
};
export const JUSTIFY_CONTENT = {
  left: "flex-start",
  center: "center",
  right: "flex-end",
};

export const JUSTIFY_VALUES = Object.values(JUSTIFY_CONTENT) as [
  string,
  ...string[]
];

export const ALIGN_VALUES = Object.values(ALIGN_ITEMS) as [string, ...string[]];

export const stylesFieldsSchema = {
  sectionLayout: z
    .object({
      height: z.enum(SECTION_HEIGHT_VALUES).optional(),
      justifyContent: z.enum(JUSTIFY_VALUES).optional(),
      alignItems: z.enum(ALIGN_VALUES).optional(),
    })
    .optional(),

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
