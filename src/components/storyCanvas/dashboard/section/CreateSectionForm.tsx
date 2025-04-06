"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useCmsStore } from "@/stores/cms-store";
import { SectionType } from "@prisma/client";
import SectionTypeForm from "./SectionTypeForm";
import { sectionSchemas } from "@/lib/validation/sectionSchemas";
import { Select } from "@/components/ui/select";
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const CreateSectionForm = () => {
  const [selectedType, setSelectedType] = useState<SectionType | null>(null);
  const { addSection, selectedStory } = useCmsStore();
  const [externalError, setExternalError] = useState<{
    field: keyof z.infer<(typeof sectionSchemas)[SectionType]["schema"]>;
    message: string;
  } | null>(null);

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
      const res = await fetch("/api/sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storyId: selectedStoryId,
          name,
          order,
          createdBy,
          content,
          type: selectedType,
        }),
      });

      if (res.status === 409) {
        setExternalError({
          field: "name",
          message: "This name is already in use",
        });
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to create section");
      }

      const newSection = await res.json();
      console.log("New section created:", newSection);
      addSection(newSection);
      setSelectedType(null);
      router.push(`/admin/dashboard/${selectedStory.currentDraft?.slug}`);
    } catch (error) {
      console.error("Error creating section:", error);
    }
  };

  return (
    <div className="space-y-4 max-w-lg">
      <div className="space-y-2">
        <Select onValueChange={handleTypeSelect}>
          <SelectTrigger>
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
            onCancelNavigateTo={`/admin/dashboard/${selectedStory?.currentDraft?.slug}`}
            externalError={externalError}
            onSubmitButtonLabel="Create Section"
          />
        </div>
      )}
    </div>
  );
};

export default CreateSectionForm;
