import { useCallback, useEffect, useRef } from "react";
import type { Language } from "../routing";

export type Voice = "male" | "female";
type Message = "first" | "next" | "finish";

const suffixes: Record<Message, string> = {
  first: "first-step",
  next: "next-step",
  finish: "finish",
};

export function useAudioGuidance(
  language: Language,
  voice: Voice,
  soundOn: boolean,
) {
  const audioSetsRef = useRef(new Map<string, Record<Message, HTMLAudioElement>>());

  const getAudioSet = useCallback((nextLanguage: Language, nextVoice: Voice) => {
    const key = `${nextLanguage}:${nextVoice}`;
    const existing = audioSetsRef.current.get(key);
    if (existing) return existing;
    const audioSet = Object.fromEntries(
      Object.entries(suffixes).map(([message, suffix]) => {
        const audio = new Audio(`/audio/${nextLanguage}-${nextVoice}-${suffix}.wav`);
        audio.load();
        return [message, audio];
      }),
    ) as Record<Message, HTMLAudioElement>;
    audioSetsRef.current.set(key, audioSet);
    return audioSet;
  }, []);

  useEffect(() => {
    getAudioSet(language, voice);
  }, [getAudioSet, language, voice]);

  useEffect(() => () => {
    audioSetsRef.current.forEach((audioSet) => {
      Object.values(audioSet).forEach((audio) => audio.pause());
    });
  }, []);

  const play = useCallback((message: Message) => {
    if (!soundOn) return;
    const audio = getAudioSet(language, voice)[message];
    audio.currentTime = 0;
    void audio.play().catch(() => undefined);
  }, [getAudioSet, language, soundOn, voice]);

  return {
    playFirst: useCallback(() => play("first"), [play]),
    playNext: useCallback(() => play("next"), [play]),
    playFinish: useCallback(() => play("finish"), [play]),
  };
}
