import type { FieldMeta } from "@/types/section-fields";
import type { BaseFields } from "@/lib/validation/section-base-fields-schema";

export const baseUI: Record<keyof BaseFields, FieldMeta> = {
  name: {
    label: "Name",
    type: "text",
    required: true,
    placeholder: "Name of the section",
  },
  order: {
    label: "Order",
    type: "number",
    required: true,
    placeholder: "Order number",
  },
  createdBy: {
    label: "Created by",
    type: "text",
    required: true,
    placeholder: "Author of this section",
  },
};
