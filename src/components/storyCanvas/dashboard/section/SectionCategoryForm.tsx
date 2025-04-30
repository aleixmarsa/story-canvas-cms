"use client";

import { useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
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
import FormErrorMessage from "../../FormErrorMessage";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDashboardStore } from "@/stores/dashboard-store";
import { DraftSectionPreviewData } from "@/types/section";
import { JsonValue } from "@prisma/client/runtime/library";
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
}

const SectionCategoryForm = <T extends SectionCategory>({
  type,
  defaultValues,
  onSubmit,
  externalError,
  formSubmitRef,
  onDirtyChange,
  onSubmittingChange,
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

  const { selectedSection } = useDashboardStore();

  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Setup the iframe reference to send messages to the live preview
  useEffect(() => {
    iframeRef.current = window.parent.document.querySelector(
      'iframe[src*="/preview/"]'
    );
  }, []);

  const fieldNames = Object.keys(ui) as (keyof FormData)[];

  // Watch the form fields to detect changes
  // This is used to send the updated section data to the iframe for live preview
  const watchedValues = useWatch({
    control,
    name: fieldNames,
  });

  // This function is used to send the updated section data to the iframe for live preview
  const sendPreviewUpdate = debounce((data: DraftSectionPreviewData) => {
    if (!iframeRef.current?.contentWindow) return;
    iframeRef.current.contentWindow.postMessage(
      {
        type: "preview:update",
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
    if (!watchedValues || !selectedSection) return;
    const watchedSection: { [key: string]: JsonValue } = {};
    fieldNames.forEach((key, i) => {
      watchedSection[key] = watchedValues[i];
    });

    const { name, order } = watchedSection;

    const previewDraftSectionData: DraftSectionPreviewData = {
      id: selectedSection.currentDraftId || 0,
      name: name as string,
      order: order as number,
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
    const error = errors[key]?.message as string;
    const id = String(key);

    let inputElement: React.ReactNode;

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
      <div key={id} className="flex flex-col gap-1">
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
