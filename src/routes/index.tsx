import { useSpeakersQuery } from "#/hooks/useSpeakersQuery";
import {
  useVoiceUrlQuery,
  type VoiceUrlQueryParams,
} from "#/hooks/useVoiceUrlQuery";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useEffect, useRef, useState, type MouseEvent } from "react";

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
      <header className="anim-rise flex flex-col gap-2">
        <p className="eyebrow">AI Voice · Milorapart</p>
        <h1 className="font-display text-5xl font-semibold uppercase leading-none tracking-wide text-fg">
          Synth<span className="text-amber">.</span>
        </h1>
        <p className="max-w-md text-sm leading-relaxed text-steel">
          Generate AI speech from the Milorapart API and audition the result.
        </p>
      </header>

      <form
        className="panel anim-rise flex flex-col gap-5 p-6"
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
          <div className="flex flex-col gap-1.5">
            <label htmlFor="speaker" className="label">
              Speaker
            </label>
            <input
              id="speaker"
              ref={speakerRef}
              list="speakers"
              className="input"
              placeholder="pick a voice…"
              autoComplete="off"
            />
            <datalist id="speakers">
              {speakersQuery.data?.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="text" className="label">
              Text
            </label>
            <textarea
              id="text"
              ref={textRef}
              rows={2}
              className="input"
              placeholder="text to synthesize"
            />
          </div>
        </div>
        <div className="flex items-center justify-between gap-4">
          <button
            type="submit"
            className="btn-primary"
            disabled={speakersQuery.isLoading || urlQuery.isLoading}
          >
            Generate
          </button>
          <span className="mono-readout">{readout}</span>
        </div>
      </form>

      {urlQuery.isLoading ? (
        <section className="panel anim-rise flex items-center justify-between p-6">
          <span className="flex items-center gap-3">
            <span className="eq" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
              <span />
            </span>
            <span className="mono-readout">generating…</span>
          </span>
          <span className="mono-readout">api synth</span>
        </section>
      ) : null}

      {urlQuery.isError && !urlQuery.data ? (
        <section className="panel anim-rise flex items-center justify-between p-6">
          <span className="mono-readout text-rec">
            failed to reach the voice API
          </span>
          <span className="mono-readout">!! error</span>
        </section>
      ) : null}

      {urlQuery.data ? (
        <Player
          source={urlQuery.data}
          speaker={params.speaker}
          text={params.text}
        />
      ) : null}

      <Outlet />
    </div>
  );
}

function Player({
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
      className="panel anim-rise flex flex-col gap-4 p-6"
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
          className="btn-play"
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? <PauseIcon /> : <PlayIcon />}
        </button>
        <div className="flex flex-1 items-center gap-4">
          <div
            ref={trackRef}
            onClick={seek}
            className="player-track flex-1"
            aria-label="Seek"
          >
            <div
              className="player-fill"
              style={{ width: `${duration ? (current / duration) * 100 : 0}%` }}
            />
          </div>
          <span className="mono-readout w-24 text-right tabular-nums">
            {fmt(current)} / {fmt(duration)}
          </span>
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