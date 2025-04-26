import { useEffect } from "react";
import type {
  SectionCategory,
  SectionCategoriesSchemasWithUI,
} from "@/sections/section-categories";
import { sectionCategoriesSchemasWithUI } from "@/sections/section-categories";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import FormErrorMessage from "../../FormErrorMessage";
import { Label } from "@radix-ui/react-label";

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
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const internalSubmitHandler = async (data: FormData) => {
    // Calls the onSubmit function from the parent component
    try {
      const success = await onSubmit(data);
      // Resets the form after submission to deactivate the dirty state
      if (success) {
        reset(data);
      }
    } catch (error) {
      console.log("🚀 ~ internalSubmitHandler ~ error:", error);
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
            required={config.required}
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
            required={config.required}
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
            required={config.required}
          />
        );
    }

    return (
      <div key={id} className="flex flex-col gap-1">
        <Label
          htmlFor={id}
          className="font-medium"
          aria-required={config.required}
        >
          {config.label}
          {config.required && <span className="text-red-500 ml-0.5">*</span>}
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {(Object.keys(ui) as (keyof typeof ui)[]).map((key) =>
        renderField(key, ui[key])
      )}
    </form>
  );
};

export default SectionCategoryForm;
