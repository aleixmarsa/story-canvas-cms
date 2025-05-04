import useSWR from "swr";
import { getDraftSections } from "../actions/draft/get-draft-sections-by-id";
export type Response = Awaited<ReturnType<typeof getDraftSections>>;

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch sections");
    return res.json();
  });

export function useSections(storyId?: number) {
  const shouldFetch = typeof storyId === "number";

  const { data, error, isLoading, mutate } = useSWR<Response>(
    shouldFetch ? `/api/draft/stories/${storyId}/sections` : null,
    fetcher
  );

  const sectionsData = data?.sections;

  const orderedSections =
    sectionsData?.slice().sort((a, b) => {
      const orderA = a.currentDraft?.order ?? 0;
      const orderB = b.currentDraft?.order ?? 0;
      return orderA - orderB;
    }) ?? [];

  return {
    sections: orderedSections,
    isLoading,
    isError: !!error,
    mutate,
  };
}
