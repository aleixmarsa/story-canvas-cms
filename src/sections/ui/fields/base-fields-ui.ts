import type { FieldMeta } from "@/types/section-fields";
import type { BaseFields } from "@/sections/validation/fields/base-fields-schema";

export const baseUIData: Record<keyof BaseFields, FieldMeta> = {
  name: {
    label: "Name",
    type: "text",
    required: true,
    placeholder: "Name of the section",
  },
  createdBy: {
    label: "Created by",
    type: "text",
    required: true,
    placeholder: "Author of this section",
  },
};

export const baseUI = {
  data: baseUIData,
  style: {},
  animation: {},
};
