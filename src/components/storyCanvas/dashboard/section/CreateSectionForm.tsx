"use client";
import { z } from "zod";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import SectionCategoryForm from "./SectionCategoryForm";
import type {
  SectionCategory,
  SectionCategoriesSchemasWithUI,
} from "@/sections/section-categories";
import { sectionCategoriesSchemasWithUI } from "@/sections/section-categories";
import { Select } from "@/components/ui/select";
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ROUTES } from "@/lib/constants/story-canvas";
import { toast } from "sonner";
import { createSection } from "@/lib/actions/sections/create-section";
import { SectionDraftMetadata, StoryDraftMetadata } from "@/lib/dal/draft";
import { useSections } from "@/lib/swr/useSections";
import {
  startHeartbeat,
  clearOtherPreviewModes,
} from "@/lib/preview-storage/preview-storage";

const CreateSectionForm = ({
  onDirtyChange,
  onSubmittingChange,
  formRef,
  story,
}: {
  formRef: React.MutableRefObject<(() => void) | undefined>;
  onDirtyChange: (dirty: boolean) => void;
  onSubmittingChange?: (submitting: boolean) => void;
  story: StoryDraftMetadata;
}) => {
  const { mutate: mutateSections } = useSections();

  const [selectedType, setSelectedType] = useState<SectionCategory | null>(
    null
  );
  const [externalError, setExternalError] = useState<{
    field: keyof z.infer<
      SectionCategoriesSchemasWithUI[SectionCategory]["schema"]
    >;
    message: string;
  } | null>(null);
  const formSubmitRef = useRef<(() => void) | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    formRef.current = async () => {
      if (formSubmitRef.current) {
        formSubmitRef.current();
      }
    };
  }, [formRef]);

  useEffect(() => {
    // Start the heartbeat for the new-section mode
    // and clear other preview modes
    const stop = startHeartbeat("new-section");
    clearOtherPreviewModes("new-section");
    return () => stop();
  }, []);

  const handleTypeSelect = (value: string) => {
    setSelectedType(value as SectionCategory);
  };

  const handleSubmit = async <T extends SectionCategory>(
    data: z.infer<SectionCategoriesSchemasWithUI[T]["schema"]>
  ) => {
    const selectedStoryId = story.id;
    if (!selectedType || !selectedStoryId) {
      throw new Error("Section type or story ID is not selected");
    }

    const { name, createdBy, ...content } = data;

    try {
      const formData = new FormData();
      formData.set("storyId", selectedStoryId.toString());
      formData.set("name", name);
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

      if (!result.section.currentDraft) {
        throw new Error("Missing currentDraft in created section");
      }

      const section: SectionDraftMetadata = {
        id: result.section.id,
        publishedAt: result.section.publishedAt,
        currentDraftId: result.section.currentDraft.id,
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

      setSelectedType(null);
      mutateSections(
        (prev) =>
          prev && Array.isArray(prev) ? [...prev, section] : [section],
        {
          revalidate: false,
        }
      );
      toast.success("Section created successfully");
      router.push(`${ROUTES.stories}/${story.currentDraft?.slug}`);
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

  return (
    <div className="space-y-4 max-w-lg">
      <div className="space-y-2">
        <Select onValueChange={handleTypeSelect}>
          <SelectTrigger data-testid="section-type-select">
            <SelectValue placeholder="Select section type" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(sectionCategoriesSchemasWithUI).map((type) => (
              <SelectItem key={type} value={type}>
                {type.replaceAll("_", " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {selectedType && (
        <div className="space-y-4">
          <SectionCategoryForm
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
