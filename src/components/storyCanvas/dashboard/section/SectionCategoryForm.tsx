"use client";

import React, { useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FormErrorMessage from "../../FormErrorMessage";
import { zodResolver } from "@hookform/resolvers/zod";
import { RenderSectionData } from "@/types/section";
import RichTextEditor from "./categories/fields/RichTextEditor";
import { SectionDraftMetadata } from "@/lib/dal/draft";
import MediaUploader from "./categories/fields/MediaUploader";
import type { MediaFieldTypes } from "@/types/section-fields";
import type { MediaField } from "@/sections/validation/fields/media-field-schema";
import { usePreviewIframe } from "@/hooks/use-preview-iframe";
import type { AnimationFields } from "@/sections/validation/fields/animation-field-schema";
import { FieldMeta } from "@/types/section-fields";

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

  type Errors = typeof errors;

  // Setup the iframe reference to send messages to the live preview
  const iframeRef = usePreviewIframe();

  const fieldNames = [
    ...Object.keys(ui.data),
    ...Object.keys(ui.style),
    ...Object.keys(ui.animation),
  ] as (keyof FormData)[];

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

    const watchedSection: { [key: string]: string | AnimationFields } = {};

    fieldNames.forEach((key, i) => {
      const value = watchedValues[i];

      // Handle special cases for animation

      watchedSection[key] = value as string;
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

  const renderField = ({
    config,
    key,
    subkey,
    compositeErrors,
  }: {
    config: FieldMeta;
    key: keyof FormData;
    subkey?: keyof FormData;
    compositeErrors?: Errors;
  }) => {
    const error =
      compositeErrors && subkey
        ? (compositeErrors[subkey]?.message as string)
        : (errors[key]?.message as string);

    const compositeError = errors[key];

    let finalKey = key;

    if (subkey) {
      finalKey = `${key}.${subkey}` as keyof FormData;
    }

    const id = String(finalKey);
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
            {...register(finalKey)}
            data-testid={`create-section-${finalKey}-input`}
          />
        );
        break;
      case "number":
        inputElement = (
          <Input
            id={id}
            type="number"
            defaultValue={Number(config.default) || ""}
            placeholder={config.placeholder}
            {...register(finalKey, { valueAsNumber: true })}
            data-testid={`create-section-${key}-input`}
          />
        );
        break;
      case "richtext":
        inputElement = (
          <Controller
            name={key}
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
            name={finalKey}
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
            name={finalKey as keyof FormData}
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
                    <Label
                      htmlFor={`${id}-${option.value}`}
                      className="font-light"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          />
        );
        break;
      case "select":
        inputElement = (
          <Controller
            name={finalKey}
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={config.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {(config.options ?? []).map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        );
        break;
      case "composite":
        inputElement = (
          <div className="ml-4 space-y-2 grid grid-cols-2 gap-4">
            {Object.entries(config.fields).map(([subKey, subConfig]) => (
              <div key={`${key}.${subKey}`}>
                {renderField({
                  config: subConfig,
                  key,
                  subkey,
                  compositeErrors: compositeError,
                })}
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
            {...register(finalKey)}
            data-testid={`create-section-${finalKey}-input`}
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
    <form onSubmit={handleSubmit(internalSubmitHandler)}>
      <Tabs defaultValue={Object.keys(ui)[0]} className="space-y-2">
        <TabsList className="w-full">
          {Object.keys(ui).map((key) => {
            return (
              <TabsTrigger key={key} value={key}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {Object.entries(ui).map(([key, value]) => {
          return (
            <TabsContent key={key} value={key} className="space-y-4">
              {Object.entries(value).map(([key, config]) => {
                if (!config) return null;
                return renderField({
                  config,
                  key: key as keyof FormData,
                });
              })}
            </TabsContent>
          );
        })}
      </Tabs>
    </form>
  );
};

export default SectionCategoryForm;
