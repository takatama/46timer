import lottie, { type AnimationItem } from "lottie-web";
import { useEffect, useRef } from "react";

export function PourAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    animationRef.current?.destroy();
    animationRef.current = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: "/assets/lottie/pour.json",
    });
    return () => {
      animationRef.current?.destroy();
      animationRef.current = null;
    };
  }, []);

  return <div ref={containerRef} style={{ width: 104, height: 86 }} aria-hidden="true" />;
}
