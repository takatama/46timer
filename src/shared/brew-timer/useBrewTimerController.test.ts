import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useBrewTimerController } from "./useBrewTimerController";

const steps = [{ timeSec: 0, isFinish: false }, { timeSec: 45, isFinish: false }, { timeSec: 210, isFinish: true }];

describe("useBrewTimerController", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("cancels startup and allows one clean retry", () => {
    const wakeLock = { request: vi.fn(), release: vi.fn() };
    const onStart = vi.fn();
    const { result } = renderHook(() => useBrewTimerController({ steps, speedMultiplier: 1, startDelayMs: 5000, wakeLock, onStart }));
    act(() => result.current.toggle());
    expect(result.current.previewStepIndex).toBe(0);
    act(() => result.current.toggle());
    act(() => vi.advanceTimersByTime(6000));
    expect(result.current.timer.status).toBe("idle");
    act(() => result.current.toggle());
    expect(onStart).toHaveBeenCalledTimes(2);
    act(() => vi.advanceTimersByTime(5000));
    expect(result.current.timer.status).toBe("running");
  });
});
