import { useEffect } from "react";
import { SectionType } from "@prisma/client";
import { sectionSchemas } from "@/lib/validation/sectionSchemas";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import FormErrorMessage from "../FormErrorMessage";
import FormButtons from "../FormButtons";

interface SectionFormProps<T extends SectionType> {
  type: T;
  defaultValues?: z.infer<(typeof sectionSchemas)[T]["schema"]>;
  onSubmitButtonLabel: string;
  onSubmit: (data: z.infer<(typeof sectionSchemas)[T]["schema"]>) => void;
  onCancelNavigateTo: string;
  externalError?: {
    field: keyof z.infer<(typeof sectionSchemas)[SectionType]["schema"]>;
    message: string;
  } | null;
  formSubmitRef?: React.MutableRefObject<(() => void) | undefined>;
  onDirtyChange?: (dirty: boolean) => void;
  onSubmittingChange?: (submitting: boolean) => void;
}

const SectionTypeForm = <T extends SectionType>({
  type,
  defaultValues,
  onSubmit,
  onCancelNavigateTo,
  externalError,
  onSubmitButtonLabel,
  formSubmitRef,
  onDirtyChange,
  onSubmittingChange,
}: SectionFormProps<T>) => {
  const { schema, ui } = sectionSchemas[type];
  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    if (formSubmitRef) {
      formSubmitRef.current = handleSubmit(onSubmit);
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
    key: keyof typeof FormData,
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
          />
        );
    }

    return (
      <div key={id} className="flex flex-col gap-1">
        <label htmlFor={id} className="font-medium">
          {config.label}
        </label>
        {inputElement}
        {error && <FormErrorMessage error={error} />}
      </div>
    );
  };

  useEffect(() => {
    if (externalError) {
      setError(externalError.field as string, {
        type: "manual",
        message: externalError.message,
      });
    }
  }, [externalError, setError]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {(Object.keys(ui) as Array<keyof typeof FormData>).map((key) =>
        renderField(key, ui[key])
      )}
      {/* <FormButtons
        submitButtonLabel={onSubmitButtonLabel}
        isSubmitting={isSubmitting}
        onCancelNavigateTo={onCancelNavigateTo}
      /> */}
    </form>
  );
};

export default SectionTypeForm;
