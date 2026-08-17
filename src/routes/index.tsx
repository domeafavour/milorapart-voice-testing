import { useSpeakersQuery } from "#/hooks/useSpeakersQuery";
import {
  useVoiceUrlQuery,
  type VoiceUrlQueryParams,
} from "#/hooks/useVoiceUrlQuery";
import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [params, setParams] = useState<VoiceUrlQueryParams>({
    speaker: "",
    text: "",
  });

  const selectRef = useRef<HTMLSelectElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const speakersQuery = useSpeakersQuery();
  const urlQuery = useVoiceUrlQuery(params, {
    enabled: !!params.speaker && !!params.text,
  });
  return (
    <div className="p-8 flex flex-col gap-4">
      <form
        className="flex flex-row gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          setParams({
            speaker: selectRef.current!.value,
            text: inputRef.current!.value,
          });
        }}
      >
        <div className="flex flex-col gap-3">
          <h2 className="text-base font-semibold">Speaker</h2>
          <select
            ref={selectRef}
            className="rounded border border-solid border-gray-200 px-2 py-1.5 h-10 text-sm"
          >
            {speakersQuery.data?.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="text-base font-semibold">Text</h2>
          <input
            placeholder="text to speech"
            ref={inputRef}
            className="rounded border border-solid border-gray-200 px-2 py-1.5 h-10 text-sm"
          />
        </div>
        <button
          className="rounded border border-solid border-gray-200 px-2 py-1.5 h-10 mt-auto bg-[revert] text-sm font-bold"
          disabled={speakersQuery.isLoading || urlQuery.isLoading}
        >
          GENERATE
        </button>
      </form>
      {urlQuery.data ? (
        <audio
          key={params.speaker + "_" + params.text}
          src={urlQuery.data}
          controls
          autoPlay
        />
      ) : urlQuery.isLoading ? (
        <div className="font-mono text-base">generating...</div>
      ) : null}
    </div>
  );
}
