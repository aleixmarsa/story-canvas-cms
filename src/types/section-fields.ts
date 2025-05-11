import { z } from "zod";

export const FIELD_TYPES = {
  text: "text",
  number: "number",
  textarea: "textarea",
  url: "url",
  richtext: "richtext",
  radio: "radio",
  select: "select",
  image: "image",
  video: "video",
  animation: "animation",
  color: "color",
  composite: "composite",
  checkbox: "checkbox",
} as const;

export type FieldTypes = (typeof FIELD_TYPES)[keyof typeof FIELD_TYPES];
export type MediaFieldTypes = Extract<FieldTypes, "image" | "video">;

type BaseFieldMeta<T extends FieldTypes = FieldTypes> = {
  label: string;
  type: T;
  required?: boolean;
};

type SimpleFieldMeta = BaseFieldMeta<FieldTypes> & {
  default?: number | string | boolean;
  placeholder?: string;
};

export type WithOptionsFieldMeta = BaseFieldMeta<
  typeof FIELD_TYPES.radio | typeof FIELD_TYPES.select
> & {
  options: { label: string; value: string }[];
  default?: string;
};

export type CompositeFieldMeta = BaseFieldMeta<typeof FIELD_TYPES.composite> & {
  fields: Record<string, FieldMeta>;
};

export type FieldMeta =
  | SimpleFieldMeta
  | WithOptionsFieldMeta
  | CompositeFieldMeta;

export type SchemaWithUI<T extends z.ZodTypeAny> = {
  schema: T;
  ui: {
    data: Partial<{ [K in keyof z.infer<T>]: FieldMeta }>;
    style: Partial<{ [K in keyof z.infer<T>]: FieldMeta }>;
    animation: Partial<{ [K in keyof z.infer<T>]: FieldMeta }>;
  };
};
