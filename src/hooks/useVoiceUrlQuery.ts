import { queryOptions, useQuery } from "@tanstack/react-query";

export type VoiceUrlQueryParams = {
  speaker: string;
  text: string;
};

export const voiceUrlQueryKey = (params: VoiceUrlQueryParams) => [
  "__query__",
  "voiceUrl",
  params,
];

export const voiceUrlQueryOptions = (params: VoiceUrlQueryParams) =>
  queryOptions({
    queryKey: voiceUrlQueryKey(params),
    queryFn: async () => {
      const s = new URLSearchParams(params);
      const response = await fetch(
        "https://api.milorapart.top/apis/AIvoice" + "?" + s.toString(),
      );
      const json = await response.json();
      return json.url as string;
    },
  });

type VoiceUrlQueryOptions = Partial<ReturnType<typeof voiceUrlQueryOptions>>;

export function useVoiceUrlQuery(
  params: VoiceUrlQueryParams,
  options?: VoiceUrlQueryOptions,
) {
  return useQuery({ ...voiceUrlQueryOptions(params), ...options });
}
