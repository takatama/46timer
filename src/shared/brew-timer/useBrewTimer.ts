import { useCallback, useEffect, useRef, useState } from "react";
import { getCurrentStepIndex } from "./timerMath";
import type { TimerCallbacks, TimerStatus, TimerStep } from "./types";

const TICK_INTERVAL_MS = 100;
const PRE_NOTIFY_SECONDS = 5;

export function useBrewTimer(
  steps: readonly TimerStep[],
  speedMultiplier: number,
  callbacks: TimerCallbacks = {},
) {
  const [status, setStatus] = useState<TimerStatus>("idle");
  const [elapsedMs, setElapsedMs] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastTickRef = useRef<number | null>(null);
  const stateRef = useRef({ elapsedMs: 0, lastAnnouncedStep: -1, lastFinishAnnounced: false });
  const callbacksRef = useRef(callbacks);
  const stepsRef = useRef(steps);
  const speedRef = useRef(speedMultiplier);
  callbacksRef.current = callbacks;
  stepsRef.current = steps;
  speedRef.current = speedMultiplier;

  const currentTime = elapsedMs / 1000;
  const currentStepIndex = getCurrentStepIndex(steps, currentTime);
  const finalTime = steps[steps.length - 1]?.timeSec ?? 0;

  const stopInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    lastTickRef.current = null;
  }, []);

  const tick = useCallback(() => {
    const now = performance.now();
    const state = stateRef.current;
    const currentSteps = stepsRef.current;
    const final = currentSteps[currentSteps.length - 1]?.timeSec ?? 0;
    if (lastTickRef.current === null) lastTickRef.current = now;
    const previousTime = state.elapsedMs / 1000;
    const deltaSeconds = Math.max(0, (now - lastTickRef.current) / 1000);
    lastTickRef.current = now;
    state.elapsedMs = Math.min(final * 1000, state.elapsedMs + deltaSeconds * Math.max(1, speedRef.current) * 1000);
    const nextTime = state.elapsedMs / 1000;
    setElapsedMs(state.elapsedMs);

    const currentIndex = getCurrentStepIndex(currentSteps, nextTime);
    const nextStep = currentSteps[currentIndex + 1];
    const crossedStepIndex = currentSteps.findIndex(
      (step) => previousTime < step.timeSec && step.timeSec <= nextTime,
    );
    if (crossedStepIndex >= 0) callbacksRef.current.onStepCrossed?.(crossedStepIndex);

    if (nextStep) {
      const crossedPreNotify = nextStep.timeSec - previousTime > PRE_NOTIFY_SECONDS
        && nextStep.timeSec - nextTime <= PRE_NOTIFY_SECONDS;
      if (crossedPreNotify && state.lastAnnouncedStep !== currentIndex + 1) {
        state.lastAnnouncedStep = currentIndex + 1;
        callbacksRef.current.onPreNotify?.({
          nextStepIndex: currentIndex + 1,
          isFinish: nextStep.isFinish,
        });
      }
    }

    if (nextTime >= final) {
      setStatus("finished");
      stopInterval();
    }
  }, [stopInterval]);

  const start = useCallback(() => {
    stopInterval();
    lastTickRef.current = performance.now();
    setStatus("running");
    intervalRef.current = setInterval(tick, TICK_INTERVAL_MS);
  }, [stopInterval, tick]);

  const pause = useCallback(() => {
    stopInterval();
    setStatus("paused");
  }, [stopInterval]);

  const reset = useCallback(() => {
    stopInterval();
    stateRef.current = { elapsedMs: 0, lastAnnouncedStep: -1, lastFinishAnnounced: false };
    setElapsedMs(0);
    setStatus("idle");
  }, [stopInterval]);

  useEffect(() => () => stopInterval(), [stopInterval]);
  return { status, currentTime, currentStepIndex, finalTime, start, pause, reset };
}
