"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useCmsStore } from "@/stores/cms-store";
import { SectionType } from "@prisma/client";
import SectionTypeForm from "./SectionTypeForm";
import { sectionSchemas } from "@/lib/validation/sectionSchemas";
import { JsonValue } from "@prisma/client/runtime/client";

type EditSectionFormProps = {
  section: {
    id: number;
    name: string;
    order: number;
    type: SectionType;
    content: JsonValue;
  };
  onCancelNavigateTo: string;
};

const EditSectionForm = ({
  section,
  onCancelNavigateTo,
}: EditSectionFormProps) => {
  const { updateSection, selectedStory } = useCmsStore();
  const [externalError, setExternalError] = useState<{
    field: keyof z.infer<(typeof sectionSchemas)[SectionType]["schema"]>;
    message: string;
  } | null>(null);

  const router = useRouter();
  const { name, order, type, content } = section;

  const contentObject =
    typeof content === "object" && content !== null ? content : {};
  const defaultValues = { name, order, ...contentObject };

  const handleSubmit = async <T extends SectionType>(
    data: z.infer<(typeof sectionSchemas)[T]["schema"]>
  ) => {
    const selectedStoryId = selectedStory?.id;
    if (!type || !selectedStoryId) {
      throw new Error("Section type or story ID is not selected");
    }

    const { name, order, ...content } = data;

    try {
      const res = await fetch(`/api/sections/${section.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          order,
          content,
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
        throw new Error("Failed to update section");
      }

      const updated = await res.json();
      updateSection(updated);
      router.push(`/admin/dashboard/${selectedStory.slug}`);
    } catch (error) {
      console.error("Error updating section:", error);
    }
  };

  return (
    <div className="space-y-4 max-w-lg">
      <SectionTypeForm
        type={type}
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        onCancelNavigateTo={onCancelNavigateTo}
        externalError={externalError}
        onSubmitButtonLabel="Update Section"
      />
    </div>
  );
};

export default EditSectionForm;
