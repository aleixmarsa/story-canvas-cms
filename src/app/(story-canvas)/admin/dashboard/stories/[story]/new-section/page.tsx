"use client";
import DashboardHeader from "@/components/storyCanvas/dashboard/DashboardHeader";
import CreateSectionForm from "@/components/storyCanvas/dashboard/section/CreateSectionForm";
import { useDashboardStore } from "@/stores/dashboard-store";
import { useRef, useState } from "react";
import { ROUTES } from "@/lib/constants/storyCanvas";
import { Loader2 } from "lucide-react";

const NewSectionPage = () => {
  const { selectedStory } = useDashboardStore();
  const formRef = useRef<(() => void) | undefined>(undefined);
  const [formIsDirty, setFormIsDirty] = useState(false);
  const [formIsSubmitting, setFormIsSubmitting] = useState(false);

  const handleSaveDraft = async () => {
    if (formRef.current) {
      await formRef.current();
    }
  };
  if (!selectedStory)
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="animate-spin" />
      </div>
    );
  return (
    <>
      <DashboardHeader
        title="New Section"
        breadcrumbs={[
          { label: "Dashboard", href: ROUTES.dashboard },
          {
            label: selectedStory.currentDraft?.title ?? "Untitled",
            href: `${ROUTES.stories}/${selectedStory.currentDraft?.slug}`,
          },
        ]}
        onSaveDraft={handleSaveDraft}
        saveDisabled={!formIsDirty}
        isSaving={formIsSubmitting}
      />
      <div className="px-6">
        <CreateSectionForm
          formRef={formRef}
          onDirtyChange={setFormIsDirty}
          onSubmittingChange={setFormIsSubmitting}
        />
      </div>
    </>
  );
};

export default NewSectionPage;
