import type { SpeechResult } from "./speech";

export function buildSrt(timings: SpeechResult[]) {
  const origin = timings[0].startMs;
  return timings
    .map((t, i) => {
      const start = t.startMs - origin;
      const rawEnd =
        i < timings.length - 1
          ? timings[i + 1].startMs - origin
          : t.endMs - origin;
      const end = Math.max(rawEnd, start);
      return `${i + 1}\n${fmtSrt(start)} --> ${fmtSrt(end)}\n${t.text}`;
    })
    .join("\n\n");
}

export function fmtSrt(ms: number) {
  const total = Math.round(ms);
  const pad = (n: number, w: number) => String(n).padStart(w, "0");
  const h = Math.floor(total / 3_600_000);
  const m = Math.floor((total % 3_600_000) / 60_000);
  const s = Math.floor((total % 60_000) / 1000);
  const f = total % 1000;
  return `${pad(h, 2)}:${pad(m, 2)}:${pad(s, 2)},${pad(f, 3)}`;
}
