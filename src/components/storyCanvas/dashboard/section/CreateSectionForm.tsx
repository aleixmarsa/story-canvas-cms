"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useDashboardStore } from "@/stores/dashboard-store";
import { SectionType } from "@prisma/client";
import SectionTypeForm from "./SectionTypeForm";
import { sectionSchemas } from "@/lib/validation/section-schemas";
import { Select } from "@/components/ui/select";
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ROUTES } from "@/lib/constants/storyCanvas";
import { toast } from "sonner";
import { createSection } from "@/lib/actions/sections/create-section";

const CreateSectionForm = ({
  onDirtyChange,
  onSubmittingChange,
  formRef,
}: {
  formRef: React.MutableRefObject<(() => void) | undefined>;
  onDirtyChange: (dirty: boolean) => void;
  onSubmittingChange?: (submitting: boolean) => void;
}) => {
  const [selectedType, setSelectedType] = useState<SectionType | null>(null);
  const { addSection, selectedStory } = useDashboardStore();
  const [externalError, setExternalError] = useState<{
    field: keyof z.infer<(typeof sectionSchemas)[SectionType]["schema"]>;
    message: string;
  } | null>(null);
  const formSubmitRef = useRef<(() => void) | undefined>(undefined);
  const router = useRouter();

  const handleTypeSelect = (value: string) => {
    setSelectedType(value as SectionType);
  };

  const handleSubmit = async <T extends SectionType>(
    data: z.infer<(typeof sectionSchemas)[T]["schema"]>
  ) => {
    const selectedStoryId = selectedStory?.id;
    if (!selectedType || !selectedStoryId) {
      throw new Error("Section type or story ID is not selected");
    }

    const { name, order, createdBy, ...content } = data;

    try {
      const formData = new FormData();
      formData.set("storyId", selectedStoryId.toString());
      formData.set("name", name);
      formData.set("order", order.toString());
      formData.set("createdBy", createdBy);
      formData.set("content", JSON.stringify(content));
      formData.set("type", selectedType);

      const result = await createSection(formData);

      if ("error" in result) {
        if (result.type === "slug") {
          setExternalError({
            field: "name",
            message: "This name is already in use",
          });
          return false;
        }

        toast.error(result.error);
        return false;
      }

      addSection(result.section);
      setSelectedType(null);
      toast.success("Section created successfully");
      router.push(`${ROUTES.stories}/${selectedStory.currentDraft?.slug}`);
      return true;
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("An unknown error occurred while creating the section");
      }
      return false;
    }
  };

  useEffect(() => {
    formRef.current = async () => {
      if (formSubmitRef.current) {
        formSubmitRef.current();
      }
    };
  }, [formRef]);

  return (
    <div className="space-y-4 max-w-lg">
      <div className="space-y-2">
        <Select onValueChange={handleTypeSelect}>
          <SelectTrigger data-testid="section-type-select">
            <SelectValue placeholder="Select section type" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(sectionSchemas).map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {selectedType && (
        <div className="space-y-4">
          <SectionTypeForm
            type={selectedType}
            onSubmit={handleSubmit}
            externalError={externalError}
            onSubmitButtonLabel="Create Section"
            formSubmitRef={formSubmitRef}
            onDirtyChange={onDirtyChange}
            onSubmittingChange={onSubmittingChange}
          />
        </div>
      )}
    </div>
  );
};

export default CreateSectionForm;
