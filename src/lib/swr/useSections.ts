import useSWR from "swr";
import { getDraftSections } from "../actions/draft/get-draft-sections-by-id";
export type Response = Awaited<ReturnType<typeof getDraftSections>>;

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch sections");
    return res.json();
  });

export const useSections = (storyId?: number) => {
  const shouldFetch = typeof storyId === "number";

  const { data, error, isLoading, mutate } = useSWR<Response>(
    shouldFetch ? `/api/stories/draft/${storyId}/sections` : null,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    sections: data ? data : [],
    isLoading,
    isError: !!error,
    mutate,
  };
};
