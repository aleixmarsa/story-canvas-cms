"use client";

import { useDashboardStore } from "@/stores/dashboard-store";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import EditSectionForm from "@/components/storyCanvas/dashboard/section/EditSectionForm";
import DashboardHeader from "@/components/storyCanvas/dashboard/DashboardHeader";
import { ROUTES } from "@/lib/constants/storyCanvas";
import { toast } from "sonner";
import { publishSection } from "@/lib/actions/section-version/publish-section-version";
import LivePreviewPanel from "@/components/storyCanvas/dashboard/preview/LivePreviewPanel";

const EditSectionPage = () => {
  const {
    sections,
    selectedStory,
    selectedSection,
    selectSection,
    updateSection,
  } = useDashboardStore();
  const { section: sectionSlug } = useParams();
  const router = useRouter();
  const [formIsDirty, setFormIsDirty] = useState(false);
  const [formIsSubmitting, setFormIsSubmitting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const formRef = useRef<(() => void) | undefined>(undefined);

  const handlePublishSection = async () => {
    setIsPublishing(true);
    try {
      if (!selectedSection?.currentDraftId) {
        throw new Error("Missing section ID");
      }

      const result = await publishSection(selectedSection.currentDraftId);

      if ("error" in result) {
        throw new Error(result.error);
      }

      updateSection(result.section);
      toast.success("Section published successfully", {
        description: `Your section is now live!`,
      });
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("An unknown error occurred while publishing the section");
      }
    } finally {
      setIsPublishing(false);
    }
  };

  useEffect(() => {
    if (!sectionSlug) return;
    const found = sections.find((s) => s.currentDraft?.slug === sectionSlug);
    if (found) {
      selectSection(found);
    }
  }, [sections, sectionSlug]);

  useEffect(() => {
    if (!sectionSlug) return;
    const found = sections.find((s) => s.currentDraft?.slug === sectionSlug);
    if (!found) {
      router.push(ROUTES.dashboard);
    }
  }, [sectionSlug]);

  if (!selectedStory) return null;

  const handleSaveDraft = async () => {
    if (formRef.current) {
      await formRef.current();
    }
  };

  if (!selectedSection) return null;
  const sectionDraftData = selectedSection?.currentDraft;

  return (
    <>
      <DashboardHeader
        title="Edit Section"
        breadcrumbs={[
          { label: "Dashboard", href: ROUTES.dashboard },
          {
            label: selectedStory.currentDraft?.title ?? "Untitled",
            href: `${ROUTES.stories}/${selectedStory.currentDraft?.slug}`,
          },
        ]}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublishSection}
        saveDisabled={!formIsDirty}
        isSaving={formIsSubmitting}
        publishButtonLabel="Publish Section"
        isPublishing={isPublishing}
      />
      <div className="px-6">
        <EditSectionForm
          formRef={formRef}
          onDirtyChange={setFormIsDirty}
          onSubmittingChange={setFormIsSubmitting}
        />
      </div>
      <div className="px-6 mt-8">
        <LivePreviewPanel
          slug={selectedStory.currentDraft?.slug ?? ""}
          draftData={sectionDraftData}
        />
      </div>
    </>
  );
};

export default EditSectionPage;
