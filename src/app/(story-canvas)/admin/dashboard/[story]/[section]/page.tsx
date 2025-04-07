"use client";

import { useCmsStore } from "@/stores/cms-store";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import EditSectionForm from "@/components/storyCanvas/dashboard/section/EditSectionForm";
import { SectionType } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/client";
import DashboardHeader from "@/components/storyCanvas/dashboard/DashboardHeader";

const EditSectionPage = () => {
  const { sections, selectedStory } = useCmsStore();
  const { section: sectionIdParam } = useParams();
  const sectionId = Number(sectionIdParam);
  const router = useRouter();
  const [section, setSection] = useState<{
    id: number;
    name: string;
    order: number;
    createdBy: string;
    type: SectionType;
    content: JsonValue;
    currentDraftId: number | null;
  } | null>(null);
  const [formIsDirty, setFormIsDirty] = useState(false);
  const [formIsSubmitting, setFormIsSubmitting] = useState(false);

  const formRef = useRef<(() => void) | undefined>(undefined);

  useEffect(() => {
    const found = sections.find((s) => s.id === sectionId);
    if (!found || !found.currentDraft) {
      router.push("/admin/dashboard");
      return;
    }

    const { id, currentDraft, currentDraftId } = found;
    const { name, order, type, content, createdBy } = currentDraft;

    setSection({
      id,
      name,
      order,
      createdBy,
      type,
      content,
      currentDraftId,
    });
  }, [sectionId, sections, router]);

  const handleSaveDraft = async () => {
    if (formRef.current) {
      await formRef.current();
    }
  };

  if (!section || !selectedStory) return null;

  return (
    <>
      <DashboardHeader
        title="Edit Section"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin/dashboard" },
          {
            label: selectedStory.currentDraft?.title ?? "Untitled",
            href: `/admin/dashboard/${selectedStory.currentDraft?.slug}`,
          },
        ]}
        onSaveDraft={handleSaveDraft}
        onPublish={() => {}}
        saveDisabled={!formIsDirty}
        isSaving={formIsSubmitting}
      />
      <div className="px-6">
        <EditSectionForm
          section={section}
          formRef={formRef}
          onDirtyChange={setFormIsDirty}
          onSubmittingChange={setFormIsSubmitting}
        />
      </div>
    </>
  );
};

export default EditSectionPage;
