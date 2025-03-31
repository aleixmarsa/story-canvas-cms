import { useEffect } from "react";
import { SectionType } from "@prisma/client";
import { sectionSchemas } from "@/lib/validation/sectionSchemas";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import FormErrorMessage from "../FormErrorMessage";
import Link from "next/link";
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
}

const SectionTypeForm = <T extends SectionType>({
  type,
  defaultValues,
  onSubmit,
  onCancelNavigateTo,
  externalError,
  onSubmitButtonLabel,
}: SectionFormProps<T>) => {
  const { schema, ui } = sectionSchemas[type];
  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

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

      <div className="flex justify-end space-x-2">
        <Button type="submit">{onSubmitButtonLabel}</Button>
        <Button type="button" asChild variant="secondary">
          <Link href={onCancelNavigateTo}>Cancel</Link>
        </Button>
      </div>
    </form>
  );
};

export default SectionTypeForm;
