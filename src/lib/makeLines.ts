export function makeLines(raw: string) {
  return raw
    .trim()
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}
