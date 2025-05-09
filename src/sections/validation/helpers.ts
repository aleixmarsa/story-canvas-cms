import { z } from "zod";

export const numberOrUndefined = z
  .union([z.number(), z.nan()])
  .transform((val) => {
    if (Number.isNaN(val) || val === undefined) return undefined;
    return typeof val === "string" ? Number(val) : val;
  })
  .refine((val) => val === undefined || !Number.isNaN(val), {
    message: "Expected number",
  });
