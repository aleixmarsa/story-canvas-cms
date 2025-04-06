"use client";

import React, { useEffect, useRef } from "react";
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
    createdBy: string;
    type: SectionType;
    content: JsonValue;
  };
  onCancelNavigateTo: string;
  formRef: React.MutableRefObject<(() => void) | undefined>;
  onDirtyChange: (dirty: boolean) => void;
  onSubmittingChange?: (submitting: boolean) => void;
};

const EditSectionForm = ({
  section,
  onCancelNavigateTo,
  formRef,
  onDirtyChange,
  onSubmittingChange,
}: EditSectionFormProps) => {
  const { updateSection, selectedStory } = useCmsStore();
  const { name, order, type, content, createdBy } = section;
  const formSubmitRef = useRef<(() => void) | undefined>(undefined);
  const contentObject =
    typeof content === "object" && content !== null ? content : {};
  const defaultValues = { name, order, createdBy, ...contentObject };

  // Placeholder to store any field-level error
  let externalError: {
    field: keyof z.infer<(typeof sectionSchemas)[SectionType]["schema"]>;
    message: string;
  } | null = null;

  const submitHandler = async <T extends SectionType>(
    data: z.infer<(typeof sectionSchemas)[T]["schema"]>
  ) => {
    const selectedStoryId = selectedStory?.id;
    if (!type || !selectedStoryId) {
      throw new Error("Section type or story ID is not selected");
    }

    const { name, order, createdBy, ...content } = data;

    try {
      const res = await fetch(`/api/sections/${section.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storyId: selectedStoryId,
          type,
          name,
          order,
          createdBy,
          content,
        }),
      });

      if (res.status === 409) {
        externalError = {
          field: "name",
          message: "This name is already in use",
        };
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to update section");
      }

      const updated = await res.json();
      updateSection(updated);
    } catch (error) {
      console.error("Error updating section:", error);
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
      <SectionTypeForm
        type={type}
        defaultValues={defaultValues}
        onSubmit={submitHandler}
        onCancelNavigateTo={onCancelNavigateTo}
        externalError={externalError}
        onSubmitButtonLabel="Update Section"
        formSubmitRef={formSubmitRef}
        onDirtyChange={onDirtyChange}
        onSubmittingChange={onSubmittingChange}
      />
    </div>
  );
};

export default EditSectionForm;
