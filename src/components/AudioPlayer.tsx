import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Readout, panelClass } from "./ui";

export function AudioPlayer({
  source,
  speaker,
  text,
}: {
  source: string;
  speaker: string;
  text: string;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    setPlaying(false);
    setCurrent(0);
    setDuration(0);
  }, [source]);

  const progress = duration ? Math.min((current / duration) * 100, 100) : 0;

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) void el.play();
    else el.pause();
  };

  const seek = (e: MouseEvent<HTMLDivElement>) => {
    const el = audioRef.current;
    const track = trackRef.current;
    if (!el || !track || !duration) return;
    const rect = track.getBoundingClientRect();
    const ratio = Math.min(
      Math.max((e.clientX - rect.left) / rect.width, 0),
      1,
    );
    el.currentTime = ratio * duration;
  };

  return (
    <section
      className={`${panelClass} animate-rise flex flex-col gap-4 p-6`}
      style={{ animationDelay: "160ms" }}
    >
      <audio
        ref={audioRef}
        src={source}
        preload="metadata"
        className="hidden"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
      />
      <p className="font-mono text-xs tracking-[0.12em] text-steel">
        <span className="text-amber">{speaker}</span>
        <span className="mx-2 text-line">/</span>
        <span className="line-clamp-1">{text}</span>
      </p>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={toggle}
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-amber text-[#1a1203] transition hover:scale-105 hover:brightness-105"
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? <PauseIcon /> : <PlayIcon />}
        </button>
        <div className="flex flex-1 items-center gap-4">
          <div
            ref={trackRef}
            onClick={seek}
            className="relative h-2 flex-1 cursor-pointer rounded-full bg-[#1d2430]"
            aria-label="Seek"
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#f5c34d] to-amber"
              style={{ width: `${progress}%` }}
            />
            <span
              className="absolute top-1/2 size-2.5 -translate-y-1/2 rounded-full bg-amber shadow-[0_0_10px_rgb(255_178_36/0.6)]"
              style={{ left: `calc(${progress}% - 5px)` }}
            />
          </div>
          <Readout className="w-24 text-right tabular-nums">
            {fmt(current)} / {fmt(duration)}
          </Readout>
        </div>
      </div>
    </section>
  );
}

function PlayIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 translate-x-px"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8 5.5v13l11-6.5-11-6.5Z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M7 5h3.4v14H7V5Zm6.6 0H17v14h-3.4V5Z" />
    </svg>
  );
}

function fmt(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";
  const s = Math.floor(seconds);
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, "0")}`;
}