import { useEffect, useState } from "react";

export function useVoices() {
  const [voices, setVoices] = useState(() => speechSynthesis.getVoices());

  useEffect(() => {
    const load = () => setVoices(speechSynthesis.getVoices());
    load();
    speechSynthesis.addEventListener("voiceschanged", load);
    return () => {
      speechSynthesis.removeEventListener("voiceschanged", load);
    };
  }, []);
  return voices;
}
