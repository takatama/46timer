import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useBrewTimer } from "./useBrewTimer";

const steps = [
  { timeSec: 0, isFinish: false },
  { timeSec: 45, isFinish: false },
  { timeSec: 210, isFinish: true },
];

describe("useBrewTimer", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("starts, pauses, and resets", () => {
    const { result } = renderHook(() => useBrewTimer(steps, 1));
    act(() => result.current.start());
    expect(result.current.status).toBe("running");
    act(() => result.current.pause());
    expect(result.current.status).toBe("paused");
    act(() => result.current.reset());
    expect(result.current.status).toBe("idle");
    expect(result.current.currentTime).toBe(0);
  });

  it("notifies exactly once when crossing five seconds before a step", () => {
    const onPreNotify = vi.fn();
    const { result } = renderHook(() => useBrewTimer(steps, 1, { onPreNotify }));
    act(() => result.current.start());
    const startTime = performance.now();
    vi.spyOn(performance, "now").mockReturnValue(startTime + 40_100);
    act(() => vi.advanceTimersByTime(100));
    expect(onPreNotify).toHaveBeenCalledOnce();
    expect(onPreNotify).toHaveBeenCalledWith({ nextStepIndex: 1, isFinish: false });
    vi.restoreAllMocks();
  });
});
