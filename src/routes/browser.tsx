import { PageHeader } from "#/components/PageHeader";
import { ReadLine } from "#/components/ReadLine";
import { SrtPanel } from "#/components/SrtPanel";
import {
  Button,
  Equalizer,
  Field,
  Label,
  Panel,
  Readout,
  Rec,
  Select,
  Textarea,
  panelClass,
} from "#/components/ui";
import { useVoices } from "#/hooks/useVoices";
import { buildSrt } from "#/lib/buildSrt";
import { makeLines } from "#/lib/makeLines";
import { speech, type SpeechResult } from "#/lib/speech";
import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";

export const Route = createFileRoute("/browser")({
  component: RouteComponent,
});

function RouteComponent() {
  const [voiceName, setVoiceName] = useState(() => {
    if (navigator.userAgent.includes("Edg/")) {
      return "Microsoft Yunxi Online (Natural) - Chinese (Mainland)";
    }
    return undefined;
  });
  const [rate, setRate] = useState(1);
  const voices = useVoices();
  const [activeLine, setActiveLine] = useState<number | null>(null);
  const [lines, setLines] = useState<string[]>([]);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const [readResults, setReadResults] = useState<SpeechResult[]>([]);
  const isPending = activeLine !== null;
  const voice = voices.find((v) => v.name === voiceName);
  const srt = readResults.length ? buildSrt(readResults) : "";

  async function speakAll() {
    const lines = makeLines(inputRef.current!.value);
    if (lines.length === 0) return;
    setActiveLine(null);
    setLines(lines);
    setReadResults([]);

    for (let i = 0; i < lines.length; i++) {
      setActiveLine(i);
      const lineToSpeak = lines[i];
      const result = await speech(lineToSpeak, { rate, voice });
      setReadResults((prev) => [...prev, result]);
    }

    setActiveLine(null);
  }

  const readTime = readResults.length
    ? readResults[readResults.length - 1].endMs - readResults[0].startMs
    : 0;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Browser Api · Web Speech"
        title={
          <>
            Browser<span className="text-amber">.</span>
          </>
        }
      >
        Test local browser voices against the AI synth on the other tab.
      </PageHeader>

      <form
        className={`${panelClass} animate-rise flex flex-col gap-5 p-6`}
        style={{ animationDelay: "80ms" }}
        onSubmit={(e) => {
          e.preventDefault();
          speakAll();
        }}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field>
            <Label htmlFor="voice">
              Voice
              <span className="normal-case tracking-normal text-steel">
                {voices.length} found
              </span>
            </Label>
            <Select
              id="voice"
              value={voiceName}
              onChange={(e) => {
                setVoiceName(e.target.value);
              }}
            >
              {voices.map((v) => (
                <option key={v.name} value={v.name}>
                  {v.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field>
            <Label htmlFor="rate">
              Rate
              <span className="normal-case tracking-normal text-amber">
                {rate.toFixed(2)}×
              </span>
            </Label>
            <input
              id="rate"
              type="range"
              min={0.5}
              step={0.05}
              max={2}
              value={rate}
              className="range self-end"
              onChange={(e) => {
                setRate(e.target.valueAsNumber);
              }}
            />
          </Field>
        </div>
        <Field>
          <Label htmlFor="text">
            Text
            <span className="normal-case tracking-normal text-steel">
              one line per utterance
            </span>
          </Label>
          <Textarea
            id="text"
            ref={inputRef}
            rows={4}
            placeholder={"one line per utterance\nempty lines are skipped"}
          />
        </Field>
        <div className="flex items-center justify-between gap-4">
          <Button type="submit" disabled={isPending || isPending}>
            Speak
          </Button>
          <div className="flex items-center gap-5">
            {isPending ? (
              <Rec>
                <Equalizer size="sm" />
                on air · line {(activeLine ?? 0) + 1}/{lines.length}
              </Rec>
            ) : null}
            <Readout className="tabular-nums">
              {(readTime / 1000).toFixed(2)}s
            </Readout>
          </div>
        </div>
      </form>

      {lines.length > 0 ? (
        <Panel className="animate-rise flex flex-col gap-3 p-6">
          <div className="flex items-center justify-between gap-4">
            <Readout className="tabular-nums">
              {isPending
                ? `line ${(activeLine ?? 0) + 1}/${lines.length}`
                : `${lines.length} lines`}
            </Readout>
          </div>
          <div className="flex max-h-[50vh] flex-col gap-1 overflow-y-auto pr-1">
            {lines.map((line, i) => (
              <ReadLine
                key={i}
                active={isPending && i === activeLine}
                isPending={isPending}
                index={i}
                text={line}
                onSpeak={() => {
                  setActiveLine(i);
                  speech(line, { rate, voice }).finally(() =>
                    setActiveLine(null),
                  );
                }}
              />
            ))}
          </div>
        </Panel>
      ) : null}

      {srt && !isPending ? <SrtPanel srt={srt} /> : null}
    </div>
  );
}
