import { z } from "zod";

export const stylesFields = {
  backgroundImage: z.string().url().optional(),
  fontColor: z
    .string()
    .regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/, {
      message: "Invalid hex color code",
    })
    .optional(),
  fontSize: z.enum(["small", "medium", "large"]).optional(),
};

export const stylesSchema = z.object(stylesFields);

export type StylesFields = z.infer<typeof stylesSchema>;
