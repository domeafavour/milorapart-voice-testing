import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

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
      <header className="anim-rise flex flex-col gap-2">
        <p className="eyebrow">Browser Api · Web Speech</p>
        <h1 className="font-display text-5xl font-semibold uppercase leading-none tracking-wide text-fg">
          Browser<span className="text-amber">.</span>
        </h1>
        <p className="max-w-md text-sm leading-relaxed text-steel">
          Test local browser voices against the AI synth on the other tab.
        </p>
      </header>

      <form
        className="panel anim-rise flex flex-col gap-5 p-6"
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
          <div className="flex flex-col gap-1.5">
            <label htmlFor="voice" className="label">
              Voice
              <span className="normal-case tracking-normal text-steel">
                {voices.length} found
              </span>
            </label>
            <select
              id="voice"
              className="input select"
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
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="rate" className="label">
              Rate
              <span className="normal-case tracking-normal text-amber">
                {rate.toFixed(2)}×
              </span>
            </label>
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
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="text" className="label">
            Text
          </label>
          <textarea
            id="text"
            ref={inputRef}
            rows={2}
            className="input"
            placeholder="text to speak"
          />
        </div>
        <div className="flex items-center justify-between gap-4">
          <button
            type="submit"
            className="btn-primary"
            disabled={pending || reading}
          >
            Speak
          </button>
          <div className="flex items-center gap-5">
            {reading ? (
              <span className="rec">
                <span className="eq" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </span>
                on air
              </span>
            ) : null}
            <span className="mono-readout tabular-nums">
              {(readTime / 1000).toFixed(2)}s
            </span>
          </div>
        </div>
      </form>
    </div>
  );
}