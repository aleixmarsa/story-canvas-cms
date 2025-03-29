import React from "react";
import { SectionType } from "@prisma/client";
import { sectionSchemas } from "@/lib/validation/sectionSchemas";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface SectionFormProps {
  type: SectionType;
  defaultValues?: Record<string, any>;
  onSubmit: (data: any) => void;
}

const SectionTypeForm = ({
  type,
  defaultValues,
  onSubmit,
}: SectionFormProps) => {
  const schemaWithUI = sectionSchemas[type];
  const schema = schemaWithUI.schema;
  const ui = schemaWithUI.ui;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {Object.entries(ui).map(([key, config]) => {
        const fieldError = errors[key as keyof typeof errors]?.message as
          | string
          | undefined;
        const isTextArea = config.type === "textarea";

        return (
          <div key={key} className="flex flex-col gap-1">
            <label className="font-medium" htmlFor={key}>
              {config.label}
            </label>
            {isTextArea ? (
              <Textarea
                id={key}
                placeholder={config.placeholder}
                {...register(key)}
              />
            ) : (
              <Input
                id={key}
                type={config.type}
                placeholder={config.placeholder}
                {...register(key)}
              />
            )}
            {fieldError && <p className="text-red-500 text-sm">{fieldError}</p>}
          </div>
        );
      })}

      <Button type="submit">Save Section</Button>
    </form>
  );
};

export default SectionTypeForm;
