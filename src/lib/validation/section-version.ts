import { z } from "zod";
import { SectionCategoryEnum } from "@/sections/section-categories";
import { baseFields } from "@/sections/validation/fields/base-fields-schema";

export const createSectionVersionSchema = baseFields.extend({
  storyId: z.number().min(1),
  type: SectionCategoryEnum,
  content: z.record(z.any()),
  comment: z.string().optional(),
});

export type SectionFormData = z.infer<typeof createSectionVersionSchema>;

export const updateSectionVersionSchema = createSectionVersionSchema.omit({
  createdBy: true,
});
