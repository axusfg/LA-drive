import { useState, useEffect, useRef } from "react";

function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function useCountUp(target: number, duration = 1000): number {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);
  const prevTarget = useRef<number | null>(null);

  useEffect(() => {
    if (prevTarget.current === target) return;
    prevTarget.current = target;

    if (target === 0) {
      setValue(0);
      return;
    }

    const start = performance.now();

    function tick(now: number) {
      const t = Math.min((now - start) / duration, 1);
      setValue(easeOut(t) * target);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setValue(target);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return value;
}
