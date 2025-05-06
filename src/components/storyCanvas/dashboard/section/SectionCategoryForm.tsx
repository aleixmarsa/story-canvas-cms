"use client";

import { useEffect } from "react";
import { useForm, useWatch, Controller } from "react-hook-form";
import { debounce } from "lodash";
import type {
  SectionCategory,
  SectionCategoriesSchemasWithUI,
} from "@/sections/section-categories";
import { sectionCategoriesSchemasWithUI } from "@/sections/section-categories";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import FormErrorMessage from "../../FormErrorMessage";
import { zodResolver } from "@hookform/resolvers/zod";
import { RenderSectionData } from "@/types/section";
import RichTextEditor from "./categories/fields/RichTextEditor";
import { SectionDraftMetadata } from "@/lib/dal/draft";
import MediaUploader from "./categories/fields/MediaUploader";
import type { MediaFieldTypes } from "@/types/section-fields";
import type { MediaField } from "@/sections/validation/media-field-schema";
import { usePreviewIframe } from "@/hooks/use-preview-iframe";
import type { AnimationProps } from "@/sections/validation/animation-field-schema";

interface SectionFormProps<T extends SectionCategory> {
  type: T;
  defaultValues?: z.infer<SectionCategoriesSchemasWithUI[T]["schema"]>;
  onSubmitButtonLabel: string;
  onSubmit: (
    data: z.infer<SectionCategoriesSchemasWithUI[T]["schema"]>
  ) => Promise<boolean>;
  externalError?: {
    field: keyof z.infer<
      SectionCategoriesSchemasWithUI[SectionCategory]["schema"]
    >;
    message: string;
  } | null;
  formSubmitRef?: React.MutableRefObject<(() => void) | undefined>;
  onDirtyChange?: (dirty: boolean) => void;
  onSubmittingChange?: (submitting: boolean) => void;
  section?: SectionDraftMetadata;
}

const SectionCategoryForm = <T extends SectionCategory>({
  type,
  defaultValues,
  onSubmit,
  externalError,
  formSubmitRef,
  onDirtyChange,
  onSubmittingChange,
  section,
}: SectionFormProps<T>) => {
  const { ui } = sectionCategoriesSchemasWithUI[type];
  const schema = sectionCategoriesSchemasWithUI[type].schema as z.ZodType<
    z.infer<SectionCategoriesSchemasWithUI[T]["schema"]>
  >;
  type FormData = z.infer<typeof schema>;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    setError,
    reset,
    control,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // Setup the iframe reference to send messages to the live preview
  const iframeRef = usePreviewIframe();

  const fieldNames = Object.keys(ui) as (keyof FormData)[];

  // Watch the form fields to detect changes
  // This is used to send the updated section data to the iframe for live preview
  const watchedValues = useWatch({
    control,
    name: fieldNames,
  });

  // This function is used to send the updated section data to the iframe for live preview
  const sendPreviewUpdate = debounce((data: RenderSectionData) => {
    if (!iframeRef.current?.contentWindow) return;
    iframeRef.current.contentWindow.postMessage(
      {
        type: "preview:single_section_update",
        payload: {
          ...data,
          type,
        },
      },
      "*"
    );
  }, 300);

  // Send the updated section data to the iframe for live preview
  useEffect(() => {
    if (!watchedValues || !section) return;

    const watchedSection: { [key: string]: string | AnimationProps } = {};

    fieldNames.forEach((key, i) => {
      const value = watchedValues[i];

      // Handle special cases for animation
      if (
        key === "animation" &&
        typeof value === "object" &&
        value !== null &&
        "type" in value
      ) {
        watchedSection[key] = {
          ...value,
          delay: Number(value.delay),
          duration: Number(value.duration),
        };
      } else {
        watchedSection[key] = value as string;
      }
    });

    const name = watchedSection.name;

    const previewDraftSectionData: RenderSectionData = {
      id: section.currentDraftId || 0,
      name: name as string,
      order: section.currentDraft?.order || 0,
      type,
      content: watchedSection,
    };

    sendPreviewUpdate(previewDraftSectionData);
  }, [watchedValues, sendPreviewUpdate]);

  const internalSubmitHandler = async (data: FormData) => {
    // Calls the onSubmit function from the parent component
    try {
      const success = await onSubmit(data);
      // Resets the form after submission to deactivate the dirty state
      if (success) {
        reset(data);
      }
    } catch (error) {
      console.error("Failed to submit section form:", error);
    }
  };

  useEffect(() => {
    if (formSubmitRef) {
      formSubmitRef.current = handleSubmit(internalSubmitHandler);
    }
  }, [formSubmitRef, handleSubmit, onSubmit]);

  // Notifies the parent component about when the form has been modified
  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  // Notifies the parent component about when the form is submitting
  useEffect(() => {
    onSubmittingChange?.(isSubmitting);
  }, [isSubmitting, onSubmittingChange]);

  useEffect(() => {
    if (externalError) {
      setError(externalError.field, {
        type: "manual",
        message: externalError.message,
      });
    }
  }, [externalError, setError]);

  const renderField = (
    key: keyof typeof ui,
    config: (typeof ui)[typeof key]
  ) => {
    console.log("🚀 ~ key:", key);
    console.log("🚀 ~ config:", config);

    const error = errors[key]?.message as string;
    const id = String(key);
    let inputElement: React.ReactNode;

    if (!config) {
      return null;
    }

    switch (config.type) {
      case "textarea":
        inputElement = (
          <Textarea
            id={id}
            placeholder={config.placeholder}
            {...register(key)}
            data-testid={`create-section-${key}-input`}
          />
        );
        break;
      case "number":
        inputElement = (
          <Input
            id={id}
            type="number"
            placeholder={config.placeholder}
            {...register(key, { valueAsNumber: true })}
            data-testid={`create-section-${key}-input`}
          />
        );
        break;
      case "richtext":
        inputElement = (
          <Controller
            name={key as keyof typeof ui}
            control={control}
            render={({ field }) => (
              <RichTextEditor
                value={(field.value as string) ?? ""}
                onChange={field.onChange}
              />
            )}
          />
        );
        break;
      case "image":
      case "video":
        inputElement = (
          <Controller
            name={key}
            control={control}
            render={({ field }) => {
              const value = field.value;
              const isValidMediaField =
                value &&
                typeof value === "object" &&
                "url" in value &&
                "publicId" in value;

              return (
                <MediaUploader
                  onUpload={field.onChange}
                  currentValue={
                    isValidMediaField ? (value as MediaField) : undefined
                  }
                  type={config.type as MediaFieldTypes}
                />
              );
            }}
          />
        );
        break;
      case "radio":
        inputElement = (
          <Controller
            name={key as keyof FormData}
            control={control}
            render={({ field }) => (
              <RadioGroup
                onValueChange={field.onChange}
                value={(field.value as string) ?? ""}
                className="flex gap-4"
              >
                {(config.options ?? []).map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-2"
                  >
                    <RadioGroupItem
                      value={option.value}
                      id={`${id}-${option.value}`}
                    />
                    <Label htmlFor={`${id}-${option.value}`}>
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          />
        );
        break;
      case "composite":
        inputElement = (
          <div className="space-y-2">
            {Object.entries(config.fields).map(([subKey, subConfig]) => (
              <div key={`${key}.${subKey}`} className="ml-4">
                {renderField(`${key}.${subKey}` as keyof typeof ui, subConfig)}
              </div>
            ))}
          </div>
        );
        break;
      case "text":
      case "url":
      default:
        inputElement = (
          <Input
            id={id}
            type={config.type}
            placeholder={config.placeholder}
            {...register(key)}
            data-testid={`create-section-${key}-input`}
          />
        );
    }

    return (
      <div key={id} className="flex flex-col gap-1.5">
        <Label
          htmlFor={id}
          className="font-medium"
          aria-required={config.required}
          required={config.required}
        >
          {config.label}
        </Label>
        {inputElement}
        {error && <FormErrorMessage error={error} />}
      </div>
    );
  };

  useEffect(() => {
    if (externalError) {
      setError(externalError.field, {
        type: "manual",
        message: externalError.message,
      });
    }
  }, [externalError, setError]);

  return (
    <form onSubmit={handleSubmit(internalSubmitHandler)} className="space-y-4">
      {(Object.keys(ui) as (keyof typeof ui)[]).map((key) =>
        renderField(key, ui[key])
      )}
    </form>
  );
};

export default SectionCategoryForm;
