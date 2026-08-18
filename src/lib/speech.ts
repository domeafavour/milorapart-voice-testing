export interface SpeechResult {
  text: string;
  startMs: number;
  endMs: number;
  success: boolean;
}

export function speech(
  text: string,
  options?: {
    rate: number;
    voice?: SpeechSynthesisVoice | null;
  },
) {
  const { rate = 1, voice } = options ?? {};
  window.speechSynthesis.cancel();

  return new Promise<SpeechResult>((resolve) => {
    const ssu = new SpeechSynthesisUtterance(text);
    ssu.rate = rate;
    if (voice) {
      ssu.voice = voice;
    }
    let startMs = 0;
    ssu.addEventListener("start", () => {
      startMs = performance.now();
    });
    ssu.addEventListener("end", () => {
      resolve({ text, startMs, endMs: performance.now(), success: true });
    });
    ssu.addEventListener("error", () => {
      resolve({ text, startMs, endMs: performance.now(), success: false });
    });
    window.speechSynthesis.speak(ssu);
  });
}
