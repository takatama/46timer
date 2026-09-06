import lottie, { type AnimationItem } from "lottie-web";
import { useEffect, useRef, useCallback } from "react";
import styles from "./LottiePlayer.module.css";

interface Props {
  animationKeys: string[];
  onComplete?: () => void;
}

const lottieAssetPaths: Record<string, string> = {
  pour: "/assets/lottie/pour.json",
};

export function buildLottieQueue(actionType: string): string[] {
  if (actionType === "bloom") return ["pour"];
  if (actionType === "pour") return ["pour"];
  return [];
}

export function LottiePlayer({ animationKeys, onComplete }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<AnimationItem | null>(null);
  const queueRef = useRef<string[]>([]);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const destroyInstance = useCallback(() => {
    if (instanceRef.current) {
      instanceRef.current.destroy();
      instanceRef.current = null;
    }
  }, []);

  const playNext = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    destroyInstance();

    const nextKey = queueRef.current.shift();
    if (!nextKey) {
      onCompleteRef.current?.();
      return;
    }

    const path = lottieAssetPaths[nextKey];
    if (!path) {
      onCompleteRef.current?.();
      return;
    }

    instanceRef.current = lottie.loadAnimation({
      container,
      renderer: "svg",
      loop: false,
      autoplay: true,
      path,
    });

    instanceRef.current.addEventListener("complete", () => {
      if (queueRef.current.length > 0) {
        playNext();
      } else {
        onCompleteRef.current?.();
      }
    });
  }, [destroyInstance]);

  useEffect(() => {
    queueRef.current = [...animationKeys];
    playNext();

    return () => {
      destroyInstance();
      queueRef.current = [];
    };
  }, [animationKeys, playNext, destroyInstance]);

  return <div className={styles.lottie} ref={containerRef} />;
}
