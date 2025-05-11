import type { FieldMeta } from "@/types/section-fields";

export const fieldScrolltrigger = <T extends string>(
  key: T,
  label: string
): Record<T, FieldMeta> => {
  const fieldMeta: FieldMeta = {
    label,
    type: "composite",
    fields: {
      start: {
        label: "Start",
        type: "select",
        options: [
          { label: "none", value: "none" },
          { label: "top bottom", value: "top bottom" },
          { label: "bottom bottom", value: "bottom bottom" },
          { label: "50% bottom", value: "50% bottom" },
        ],
        default: "none",
      },
      end: {
        label: "End",
        type: "select",
        options: [
          { label: "none", value: "none" },
          { label: "bottom bottom", value: "bottom bottom" },
          { label: "top top", value: "top top" },
          { label: "top 50%", value: "top 50%" },
          { label: "50% 50%", value: "50% 50%" },
        ],
        default: "none",
      },
      scrub: {
        label: "Scrub",
        type: "radio",
        options: [
          { label: "Yes", value: "true" },
          { label: "No", value: "false" },
        ],
        default: "false",
      },
    },
  };

  return { [key]: fieldMeta } as Record<T, FieldMeta>;
};
