"use client";

import React, { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { useDashboardStore } from "@/stores/dashboard-store";
import { SectionType } from "@prisma/client";
import SectionTypeForm from "./SectionTypeForm";
import { sectionSchemas } from "@/lib/validation/section-schemas";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants/storyCanvas";
import { toast } from "sonner";
import { updateSectionVersion } from "@/lib/actions/section-version/update-section-verstion";

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
    useDashboardStore();
  const formSubmitRef = useRef<(() => void) | undefined>(undefined);
  const router = useRouter();
  const [externalError, setExternalError] = useState<{
    field: keyof z.infer<(typeof sectionSchemas)[SectionType]["schema"]>;
    message: string;
  } | null>(null);

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

  const submitHandler = async <T extends SectionType>(
    data: z.infer<(typeof sectionSchemas)[T]["schema"]>
  ) => {
    const selectedStoryId = selectedStory?.id;
    const { name, order, createdBy, ...content } = data;

    if (!type || !selectedStoryId || !selectedSection?.currentDraft?.id) {
      throw new Error("Missing type, story ID or section ID");
    }

    try {
      const result = await updateSectionVersion(
        selectedSection.currentDraft.id,
        {
          name,
          order,
          createdBy,
          content,
          type,
          storyId: selectedStoryId,
          sectionId: selectedSection.id,
        }
      );

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
      if (!result.section) {
        toast.error("Failed to find updated section");
        return false;
      }

      const updatedSection = result.section;

      if (
        updatedSection?.currentDraft?.name !==
        selectedSection?.currentDraft?.name
      ) {
        router.replace(
          `${ROUTES.stories}/${selectedStory.currentDraft?.slug}/${updatedSection?.currentDraft?.slug}`
        );
      }

      updateSection(updatedSection);
      selectSection(updatedSection);
      toast.success("Section updated successfully");
      return true;
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("An unknown error occurred while updating the section");
      }
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
