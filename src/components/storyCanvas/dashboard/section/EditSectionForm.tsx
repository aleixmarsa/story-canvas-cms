"use client";

import React, { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants/story-canvas";
import { toast } from "sonner";
import { updateSectionVersion } from "@/lib/actions/section-version/update-section-version";
import type {
  SectionCategory,
  SectionCategoriesSchemasWithUI,
} from "@/sections/section-categories";
import SectionCategoryForm from "./SectionCategoryForm";
import { defaultContentByType } from "@/sections/lib/default-content-by-type";
import { SectionDraftMetadata, StoryDraftMetadata } from "@/lib/dal/draft";
import { useSections, Response } from "@/lib/swr/useSections";
import {
  startHeartbeat,
  clearOtherPreviewModes,
} from "@/lib/preview-storage/preview-storage";

type EditSectionFormProps = {
  formRef: React.MutableRefObject<(() => void) | undefined>;
  onDirtyChange: (dirty: boolean) => void;
  onSubmittingChange?: (submitting: boolean) => void;
  story: StoryDraftMetadata;
  section: SectionDraftMetadata;
  skipNotFoundRedirect: React.MutableRefObject<boolean>;
};

const EditSectionForm = ({
  formRef,
  onDirtyChange,
  onSubmittingChange,
  story,
  section,
  skipNotFoundRedirect,
}: EditSectionFormProps) => {
  const formSubmitRef = useRef<(() => void) | undefined>(undefined);
  const router = useRouter();
  const [externalError, setExternalError] = useState<{
    field: keyof z.infer<
      SectionCategoriesSchemasWithUI[SectionCategory]["schema"]
    >;
    message: string;
  } | null>(null);

  const { mutate: mutateSections } = useSections(story.id);

  useEffect(() => {
    formRef.current = async () => {
      if (formSubmitRef.current) {
        formSubmitRef.current();
      }
    };
  }, [formRef]);

  useEffect(() => {
    // Start the heartbeat for the edit-sections mode
    // and clear other preview modes
    const stop = startHeartbeat("edit-section");
    clearOtherPreviewModes("edit-section");
    return () => stop();
  }, []);

  if (!section) return null;
  const { currentDraft: currentSectionDraft } = section;
  if (!currentSectionDraft) return null;
  const { name, order, type, content, createdBy } = currentSectionDraft;

  const safeContentObject =
    typeof content === "object" && content !== null && !Array.isArray(content)
      ? content
      : {};

  const defaultsForType = defaultContentByType[type];

  const mergedContent = { ...defaultsForType, ...safeContentObject };

  const defaultValues = { ...mergedContent, name, order, createdBy };

  const submitHandler = async <T extends SectionCategory>(
    data: z.infer<SectionCategoriesSchemasWithUI[T]["schema"]>
  ) => {
    const selectedStoryId = story.id;
    const { name, createdBy, ...content } = data;

    if (!type || !selectedStoryId || !section.currentDraft.id) {
      throw new Error("Missing type, story ID or section ID");
    }

    try {
      const result = await updateSectionVersion(section.currentDraft.id, {
        name,
        createdBy,
        content,
        type,
        storyId: selectedStoryId,
        sectionId: section.id,
      });

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

      if (!result.section.currentDraft) {
        throw new Error("Missing current draft in section result");
      }
      const updatedSection: SectionDraftMetadata = {
        ...result.section,
        currentDraft: {
          id: result.section.currentDraft.id,
          name: result.section.currentDraft.name,
          type: result.section.currentDraft.type,
          order: result.section.currentDraft.order,
          content: result.section.currentDraft.content,
          updatedAt: result.section.currentDraft.updatedAt,
          slug: result.section.currentDraft.slug,
          createdBy: result.section.currentDraft.createdBy,
        },
      };

      mutateSections(
        (prev): Response => {
          if (prev && "success" in prev && prev.sections) {
            return {
              success: true,
              sections: prev.sections.map((s) =>
                s.id === section.id
                  ? { ...s, currentDraft: updatedSection.currentDraft }
                  : s
              ),
            };
          }
          // Fallback
          return {
            success: true,
            sections: [],
          };
        },
        { revalidate: false }
      );

      if (updatedSection?.currentDraft?.name !== section.currentDraft?.name) {
        skipNotFoundRedirect.current = true;
        router.replace(
          `${ROUTES.stories}/${story.currentDraft?.slug}/${updatedSection?.currentDraft?.slug}`
        );
      }

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
      <SectionCategoryForm
        type={type}
        defaultValues={defaultValues}
        onSubmit={submitHandler}
        externalError={externalError}
        onSubmitButtonLabel="Update Section"
        formSubmitRef={formSubmitRef}
        onDirtyChange={onDirtyChange}
        onSubmittingChange={onSubmittingChange}
        section={section}
      />
    </div>
  );
};

export default EditSectionForm;
