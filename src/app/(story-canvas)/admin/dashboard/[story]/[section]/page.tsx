"use client";

import { useCmsStore } from "@/stores/cms-store";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import EditSectionForm from "@/components/storyCanvas/dashboard/section/EditSectionForm";
import { SectionType } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/client";

const EditSectionPage = () => {
  const { sections, selectedStory } = useCmsStore();
  const { section: sectionSlug } = useParams();
  const router = useRouter();

  const [section, setSection] = useState<{
    id: number;
    name: string;
    order: number;
    type: SectionType;
    content: JsonValue;
  } | null>(null);

  useEffect(() => {
    if (!sectionSlug) {
      router.push("/admin/dashboard");
      return;
    }

    const found = sections.find((s) => s.slug === sectionSlug);
    if (!found) {
      router.push("/admin/dashboard");
      return;
    }
    const { id, name, order, type, content } = found;
    setSection({
      id,
      name,
      order,
      type,
      content,
    });
  }, [sectionSlug, sections, router]);

  if (!section || !selectedStory) return null;

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Edit Section</h1>
      <EditSectionForm
        section={section}
        onCancelNavigateTo={`/admin/dashboard/${selectedStory.slug}`}
      />
    </div>
  );
};

export default EditSectionPage;
