import { useCallback, useEffect, useRef } from "react";

export function useWakeLock() {
  const lockRef = useRef<WakeLockSentinel | null>(null);
  const activeRef = useRef(false);

  const request = useCallback(async () => {
    activeRef.current = true;
    if (!("wakeLock" in navigator) || lockRef.current) return;
    try {
      const lock = await navigator.wakeLock.request("screen");
      if (!activeRef.current) {
        await lock.release();
        return;
      }
      lockRef.current = lock;
    } catch {
      // Brewing continues when wake lock is unavailable or denied.
    }
  }, []);

  const release = useCallback(() => {
    activeRef.current = false;
    const lock = lockRef.current;
    lockRef.current = null;
    if (lock) void lock.release().catch(() => undefined);
  }, []);

  useEffect(() => () => release(), [release]);
  return { request, release };
}
