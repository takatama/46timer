import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Language } from "../routing";
import { useAudioGuidance } from "./useAudioGuidance";

describe("useAudioGuidance", () => {
  const audioByPath = new Map<string, { play: ReturnType<typeof vi.fn>; pause: ReturnType<typeof vi.fn>; load: ReturnType<typeof vi.fn>; currentTime: number }>();

  beforeEach(() => {
    audioByPath.clear();
    vi.stubGlobal("Audio", class {
      play = vi.fn(() => Promise.resolve());
      pause = vi.fn();
      load = vi.fn();
      currentTime = 0;
      constructor(path: string) { audioByPath.set(path, this); }
    });
  });
  afterEach(() => vi.unstubAllGlobals());

  it("uses first at startup and the new URL language for the next cue", async () => {
    const { result, rerender } = renderHook(
      ({ language }: { language: Language }) => useAudioGuidance(language, "female", true),
      { initialProps: { language: "ja" } },
    );
    const japaneseFirst = audioByPath.get("/audio/ja-female-first-step.wav")!;
    act(() => result.current.playFirst());
    await waitFor(() => expect(japaneseFirst.play).toHaveBeenCalledOnce());

    rerender({ language: "en" });
    expect(japaneseFirst.pause).not.toHaveBeenCalled();
    const englishNext = audioByPath.get("/audio/en-female-next-step.wav")!;
    act(() => result.current.playNext());
    await waitFor(() => expect(englishNext.play).toHaveBeenCalledOnce());
  });
});
