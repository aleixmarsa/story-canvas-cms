import { getDraftStoryBySlug } from "@/lib/dal/stories";
import { notFound } from "next/navigation";
import LivePreviewRenderer from "@/components/storyCanvas/dashboard/preview/LivePreviewRenderer";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export default async function PreviewPage({ params }: { params: Params }) {
  const { slug } = await params;

  const story = await getDraftStoryBySlug(slug);

  if (!story) return notFound();

  return <LivePreviewRenderer initialStoryData={story} />;
}
