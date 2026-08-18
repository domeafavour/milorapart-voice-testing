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
  const [readTime, setReadTime] = useState(0);
  const [rate, setRate] = useState(1);
  const [voices, setVoices] = useState(() => speechSynthesis.getVoices());
  const inputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    setTimeout(() => {
      setVoices(speechSynthesis.getVoices());
    }, 1000);
  }, []);

  return (
    <div className="flex flex-col gap4">
      <form
        className="flex flex-row gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          setReading(true);
          window.speechSynthesis.cancel();
          const ssu = new SpeechSynthesisUtterance(
            inputRef.current!.value.trim(),
          );
          ssu.rate = rate;
          const selectedVoice = voices.find(
            (voice) => voice.name === voiceName,
          );
          if (selectedVoice) {
            ssu.voice = selectedVoice;
          }
          let startTime = Date.now();
          ssu.addEventListener("start", () => {
            startTime = Date.now();
          });
          ssu.addEventListener("end", () => {
            setReading(false);
            setReadTime(Date.now() - startTime);
          });
          ssu.addEventListener("error", () => {
            setReading(false);
          });
          window.speechSynthesis.speak(ssu);
        }}
      >
        <select
          className="border rounded h-8"
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
        <div>
          <input
            type="range"
            min={0.5}
            step={0.05}
            max={2}
            value={rate}
            onChange={(e) => {
              setRate(e.target.valueAsNumber);
            }}
          />
          <span>{rate}</span>
        </div>

        <input
          ref={inputRef}
          className="border rounded h-8 px-2"
          placeholder="text to speech"
        />
        <span>{(readTime / 1000).toFixed(2)}</span>
        <button disabled={reading} className="h-8 bg-[revert] px-2 rounded">
          speech
        </button>
      </form>
    </div>
  );
}
