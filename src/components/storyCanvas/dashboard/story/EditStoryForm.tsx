"use client";

import { useState, useEffect, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { storySchema, StoryFormData } from "@/lib/validation/story-schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FormErrorMessage from "../FormErrorMessage";
import { useRouter } from "next/navigation";
import { useCmsStore } from "@/stores/cms-store";
import { StoryVersion } from "@prisma/client";

type EditStoryFormProps = {
  setDirty?: (dirty: boolean) => void;
  setIsSubmitting?: (submitting: boolean) => void;
};

const EditStoryForm = forwardRef<HTMLFormElement, EditStoryFormProps>(
  ({ setDirty, setIsSubmitting }, ref) => {
    const [submitError, setSubmitError] = useState<string | null>(null);
    const { updateStory, selectedStory, selectStory } = useCmsStore();
    const router = useRouter();
    const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting, isDirty },
      setError,
      reset,
    } = useForm<StoryFormData>({
      resolver: zodResolver(storySchema),
      defaultValues: {
        title: selectedStory?.currentDraft?.title,
        slug: selectedStory?.currentDraft?.slug,
        createdBy: selectedStory?.currentDraft?.createdBy,
        storyId: selectedStory?.id,
      },
    });

    useEffect(() => {
      if (selectedStory?.currentDraft) {
        reset({
          title: selectedStory.currentDraft.title,
          slug: selectedStory.currentDraft.slug,
          createdBy: selectedStory.currentDraft.createdBy,
          storyId: selectedStory.id,
        });
      }
    }, [selectedStory, reset]);

    useEffect(() => {
      if (setDirty) setDirty(isDirty);
    }, [isDirty, setDirty]);

    useEffect(() => {
      if (setIsSubmitting) setIsSubmitting(isSubmitting);
    }, [isSubmitting, setIsSubmitting]);

    const onSubmit = async (data: StoryFormData) => {
      setSubmitError(null);
      try {
        //Add the story ID to the data
        const res = await fetch(
          `/api/story-versions/${selectedStory?.currentDraftId}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }
        );

        if (res.status === 409) {
          setError("slug", {
            type: "manual",
            message: "This slug is already in use",
          });
          return;
        }

        if (!res.ok) {
          throw new Error("Failed to update story");
        }

        const updatedStoryVersion: StoryVersion = await res.json();
        if (!updatedStoryVersion) {
          throw new Error("Failed to update story");
        }
        // Update the URL if the slug has changed
        if (data.slug !== selectedStory?.currentDraft?.slug) {
          router.replace(`/admin/dashboard/${data.slug}/edit`);
        }

        // Update the story in the store
        if (selectedStory) {
          const updatedStory = {
            ...selectedStory,
            currentDraft: updatedStoryVersion,
          };
          updateStory(updatedStory);
          selectStory(updatedStory);
        }

        // Reset the form with the updated data to reset the dirty state
        reset(data);
      } catch (err) {
        console.error(err);
        setSubmitError("Failed to update story. Please try again.");
      }
    };

    return (
      <form
        ref={ref}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 max-w-lg"
      >
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" {...register("title" as const)} />
          {errors.title && <FormErrorMessage error={errors.title.message} />}
        </div>

        <div>
          <Label htmlFor="createdBy">Created By</Label>
          <Input id="createdBy" {...register("createdBy" as const)} />
          {errors.createdBy && (
            <FormErrorMessage error={errors.createdBy.message} />
          )}
        </div>

        <div>
          <Label htmlFor="slug">Slug (URL)</Label>
          <Input id="slug" {...register("slug" as const)} />
          {errors.slug && <FormErrorMessage error={errors.slug.message} />}
        </div>

        {submitError && <FormErrorMessage error={submitError} textRight />}
      </form>
    );
  }
);
EditStoryForm.displayName = "EditStoryForm";
export default EditStoryForm;
