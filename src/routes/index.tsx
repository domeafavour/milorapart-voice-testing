import { useSpeakersQuery } from "#/hooks/useSpeakersQuery";
import {
  useVoiceUrlQuery,
  type VoiceUrlQueryParams,
} from "#/hooks/useVoiceUrlQuery";
import { AudioPlayer } from "#/components/AudioPlayer";
import { PageHeader } from "#/components/PageHeader";
import {
  Button,
  Equalizer,
  Field,
  Input,
  Label,
  Panel,
  Readout,
  Textarea,
  panelClass,
} from "#/components/ui";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useRef, useState } from "react";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const [params, setParams] = useState<VoiceUrlQueryParams>({
    speaker: "",
    text: "",
  });

  const speakerRef = useRef<HTMLInputElement | null>(null);
  const textRef = useRef<HTMLTextAreaElement | null>(null);

  const speakersQuery = useSpeakersQuery();
  const urlQuery = useVoiceUrlQuery(params, {
    enabled: !!params.speaker && !!params.text,
  });

  const readout = urlQuery.isLoading
    ? "synth running…"
    : speakersQuery.isLoading
      ? "loading voices…"
      : urlQuery.data
        ? "ready"
        : `${speakersQuery.data?.length ?? 0} voices`;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="AI Voice · Milorapart"
        title={
          <>
            Synth<span className="text-amber">.</span>
          </>
        }
      >
        Generate AI speech from the Milorapart API and audition the result.
      </PageHeader>

      <form
        className={`${panelClass} animate-rise flex flex-col gap-5 p-6`}
        style={{ animationDelay: "80ms" }}
        onSubmit={(e) => {
          e.preventDefault();
          setParams({
            speaker: speakerRef.current!.value.trim(),
            text: textRef.current!.value.trim(),
          });
        }}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field>
            <Label htmlFor="speaker">Speaker</Label>
            <Input
              id="speaker"
              ref={speakerRef}
              list="speakers"
              placeholder="pick a voice…"
              autoComplete="off"
            />
            <datalist id="speakers">
              {speakersQuery.data?.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </Field>
          <Field>
            <Label htmlFor="text">Text</Label>
            <Textarea
              id="text"
              ref={textRef}
              rows={2}
              placeholder="text to synthesize"
            />
          </Field>
        </div>
        <div className="flex items-center justify-between gap-4">
          <Button
            type="submit"
            disabled={speakersQuery.isLoading || urlQuery.isLoading}
          >
            Generate
          </Button>
          <Readout>{readout}</Readout>
        </div>
      </form>

      {urlQuery.isLoading ? (
        <Panel className="animate-rise flex items-center justify-between p-6">
          <span className="flex items-center gap-3">
            <Equalizer />
            <Readout>generating…</Readout>
          </span>
          <Readout>api synth</Readout>
        </Panel>
      ) : null}

      {urlQuery.isError && !urlQuery.data ? (
        <Panel className="animate-rise flex items-center justify-between p-6">
          <Readout tone="rec">failed to reach the voice API</Readout>
          <Readout>!! error</Readout>
        </Panel>
      ) : null}

      {urlQuery.data ? (
        <AudioPlayer
          source={urlQuery.data}
          speaker={params.speaker}
          text={params.text}
        />
      ) : null}

      <Outlet />
    </div>
  );
}