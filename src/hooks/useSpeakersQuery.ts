import { queryOptions, useQuery } from "@tanstack/react-query";

export const speakersQueryKey = () => ["__query__", "speakers"];

export const speakersQueryOptions = () =>
  queryOptions({
    queryKey: speakersQueryKey(),
    queryFn: async () => {
      const response = await fetch(
        "https://api.milorapart.top/apis/AIvoice/?type=list",
      );
      const json = await response.json();
      return json.speakers as string[];
    },
  });

type SpeakersQueryOptions = Partial<ReturnType<typeof speakersQueryOptions>>;

export function useSpeakersQuery(options?: SpeakersQueryOptions) {
  return useQuery({ ...speakersQueryOptions(), ...options });
}
