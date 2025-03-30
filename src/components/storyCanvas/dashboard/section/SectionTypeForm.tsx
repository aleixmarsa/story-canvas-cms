import React from "react";
import { SectionType } from "@prisma/client";
import { sectionSchemas } from "@/lib/validation/sectionSchemas";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import FormErrorMessage from "../FormErrorMessage";

interface SectionFormProps<T extends SectionType> {
  type: T;
  defaultValues?: z.infer<(typeof sectionSchemas)[T]["schema"]>;
  onSubmit: (data: z.infer<(typeof sectionSchemas)[T]["schema"]>) => void;
}

const SectionTypeForm = <T extends SectionType>({
  type,
  defaultValues,
  onSubmit,
}: SectionFormProps<T>) => {
  const schemaWithUI = sectionSchemas[type];
  const schema = schemaWithUI.schema;
  const ui = schemaWithUI.ui;

  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {(Object.keys(ui) as Array<keyof typeof FormData>).map((key) => {
        const config = ui[key];
        const fieldError = errors[key]?.message as string;

        let fieldElement: React.ReactNode;

        switch (config.type) {
          case "textarea":
            fieldElement = (
              <Textarea
                id={String(key)}
                placeholder={config.placeholder}
                {...register(key)}
              />
            );
            break;
          case "number":
            fieldElement = (
              <Input
                id={String(key)}
                type="number"
                placeholder={config.placeholder}
                {...register(key, { valueAsNumber: true })}
              />
            );
            break;
          case "text":
          case "url":
          default:
            fieldElement = (
              <Input
                id={String(key)}
                type={config.type}
                placeholder={config.placeholder}
                {...register(key)}
              />
            );
        }

        return (
          <div key={String(key)} className="flex flex-col gap-1">
            <label className="font-medium" htmlFor={String(key)}>
              {config.label}
            </label>
            {fieldElement}
            {fieldError && <FormErrorMessage error={fieldError} />}
          </div>
        );
      })}

      <div className="flex justify-end space-x-2">
        <Button type="submit">Create Section</Button>
        <Button type="button" variant="secondary">
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default SectionTypeForm;
