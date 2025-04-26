// app/preview/[slug]/page.tsx

import { getDraftStoryBySlug } from "@/lib/dal/stories";
import { notFound } from "next/navigation";
import LivePreviewRenderer from "@/components/storyCanvas/dashboard/preview/LivePreviewRenderer";

export const dynamic = "force-dynamic";

interface PreviewPageProps {
  params: { slug: string };
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { slug } = await params;

  const story = await getDraftStoryBySlug(slug);

  if (!story) return notFound();

  return <LivePreviewRenderer initialStoryData={story} />;
}
