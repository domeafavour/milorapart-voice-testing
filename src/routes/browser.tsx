import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { PageHeader } from "#/components/PageHeader";
import {
  Button,
  Equalizer,
  Field,
  Label,
  Readout,
  Rec,
  Select,
  Textarea,
  panelClass,
} from "#/components/ui";

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
  const [reading, setReading] = useState(false);
  const [pending, setPending] = useState(false);
  const [readTime, setReadTime] = useState(0);
  const [rate, setRate] = useState(1);
  const [voices, setVoices] = useState(() => speechSynthesis.getVoices());
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const startTimeRef = useRef(0);

  useEffect(() => {
    if (!reading) return;
    const id = setInterval(
      () => setReadTime(Date.now() - startTimeRef.current),
      100,
    );
    return () => clearInterval(id);
  }, [reading]);

  useEffect(() => {
    const load = () => setVoices(speechSynthesis.getVoices());
    load();
    const t = setTimeout(load, 1000);
    speechSynthesis.addEventListener("voiceschanged", load);
    return () => {
      clearTimeout(t);
      speechSynthesis.removeEventListener("voiceschanged", load);
    };
  }, []);

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
          const text = inputRef.current!.value.trim();
          if (!text) return;
          setPending(true);
          window.speechSynthesis.cancel();
          const ssu = new SpeechSynthesisUtterance(text);
          ssu.rate = rate;
          const selectedVoice = voices.find(
            (voice) => voice.name === voiceName,
          );
          if (selectedVoice) {
            ssu.voice = selectedVoice;
          }
          startTimeRef.current = Date.now();
          ssu.addEventListener("start", () => {
            startTimeRef.current = Date.now();
            setPending(false);
            setReading(true);
          });
          ssu.addEventListener("end", () => {
            setReading(false);
            setPending(false);
            setReadTime(Date.now() - startTimeRef.current);
          });
          ssu.addEventListener("error", () => {
            setReading(false);
            setPending(false);
          });
          window.speechSynthesis.speak(ssu);
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
          <Label htmlFor="text">Text</Label>
          <Textarea
            id="text"
            ref={inputRef}
            rows={2}
            placeholder="text to speak"
          />
        </Field>
        <div className="flex items-center justify-between gap-4">
          <Button type="submit" disabled={pending || reading}>
            Speak
          </Button>
          <div className="flex items-center gap-5">
            {reading ? (
              <Rec>
                <Equalizer size="sm" />
                on air
              </Rec>
            ) : null}
            <Readout className="tabular-nums">
              {(readTime / 1000).toFixed(2)}s
            </Readout>
          </div>
        </div>
      </form>
    </div>
  );
}