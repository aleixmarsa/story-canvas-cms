"use client";

import React, { useEffect, useRef } from "react";
import { z } from "zod";
import { useCmsStore } from "@/stores/cms-store";
import { SectionType } from "@prisma/client";
import SectionTypeForm from "./SectionTypeForm";
import { sectionSchemas } from "@/lib/validation/section-schemas";
import { useRouter } from "next/navigation";
import { SectionWithVersions } from "@/types/section";

type EditSectionFormProps = {
  formRef: React.MutableRefObject<(() => void) | undefined>;
  onDirtyChange: (dirty: boolean) => void;
  onSubmittingChange?: (submitting: boolean) => void;
};

const EditSectionForm = ({
  formRef,
  onDirtyChange,
  onSubmittingChange,
}: EditSectionFormProps) => {
  const { updateSection, selectedStory, selectedSection, selectSection } =
    useCmsStore();
  const formSubmitRef = useRef<(() => void) | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    formRef.current = async () => {
      if (formSubmitRef.current) {
        formSubmitRef.current();
      }
    };
  }, [formRef]);

  if (!selectedSection) return null;
  const { currentDraft: currentSectionDraft } = selectedSection;
  if (!currentSectionDraft) return null;
  const { name, order, type, content, createdBy } = currentSectionDraft;

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
    const { name, order, createdBy, ...content } = data;
    if (!type || !selectedStoryId) {
      throw new Error("Section type or story ID is not selected");
    }

    try {
      const res = await fetch(
        `/api/section-versions/${selectedSection?.currentDraft?.id}`,
        {
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
        }
      );

      if (res.status === 409) {
        externalError = {
          field: "name",
          message: "This name is already in use",
        };
        return false;
      }

      if (!res.ok) {
        throw new Error("Failed to update section");
      }

      const updatedSection: SectionWithVersions = await res.json();
      if (!updatedSection) {
        throw new Error("Failed to update story");
      }
      // Update the URL if the name has changed
      if (
        updatedSection?.currentDraft?.name !==
        selectedSection?.currentDraft?.name
      ) {
        router.replace(
          `/admin/dashboard/${selectedStory.currentDraft?.id}/${updatedSection?.currentDraft?.slug}`
        );
      }
      updateSection(updatedSection);
      selectSection(updatedSection);
      return true;
    } catch (error) {
      console.error("Error updating section:", error);
      return false;
    }
  };

  return (
    <div className="space-y-4 max-w-lg">
      <SectionTypeForm
        type={type}
        defaultValues={defaultValues}
        onSubmit={submitHandler}
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
