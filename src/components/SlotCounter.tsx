import { useEffect, useRef } from "react";

/**
 * A single digit column that scrolls vertically through 0-9 to land on the target digit.
 * Higher-place digits (tens, hundreds) get a longer stagger delay so the ones place
 * settles first, like a real slot machine.
 */
function DigitReel({
  digit,
  placeIndex,
  baseDuration,
}: {
  digit: number;
  placeIndex: number;
  baseDuration: number;
}) {
  const reelRef = useRef<HTMLDivElement>(null);

  // Stagger: ones place finishes at baseDuration, each higher place adds delay
  const staggerPerPlace = 150; // ms extra per place
  const duration = baseDuration + placeIndex * staggerPerPlace;

  useEffect(() => {
    const el = reelRef.current;
    if (!el) return;

    // Reset to top instantly
    el.style.transition = "none";
    el.style.transform = "translateY(0)";

    // Force reflow then animate
    void el.offsetHeight;

    // The reel contains digits 0-9, each cell is 1.2em tall
    // We scroll down to reveal the target digit
    const cellHeight = 1.2; // em
    const targetOffset = digit * cellHeight;

    el.style.transition = `transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1)`;
    el.style.transform = `translateY(-${targetOffset}em)`;

    return;
  }, [digit, duration]);

  return (
    <span
      className="slot-digit-window"
      style={{
        display: "inline-block",
        height: "1.2em",
        overflow: "hidden",
        verticalAlign: "top",
        lineHeight: "1.2em",
      }}
    >
      <div
        ref={reelRef}
        className="slot-digit-reel"
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
          <span
            key={d}
            style={{
              height: "1.2em",
              lineHeight: "1.2em",
              textAlign: "center",
              display: "block",
            }}
          >
            {d}
          </span>
        ))}
      </div>
    </span>
  );
}

interface SlotCounterProps {
  value: number;
  duration?: number;
}

/**
 * Slot-machine style rolling counter. Splits a number into individual digits,
 * each rendered as a vertical reel that scrolls to the correct value.
 * Ones place settles first, then tens, then hundreds.
 */
export default function SlotCounter({ value, duration = 1500 }: SlotCounterProps) {
  const digits = String(Math.max(0, Math.round(value)))
    .split("")
    .map(Number);

  const totalPlaces = digits.length;

  return (
    <span className="slot-counter" style={{ display: "inline-flex" }}>
      {digits.map((d, i) => {
        // i=0 is the most significant digit (highest place)
        // placeIndex should be highest for the most significant digit
        const placeIndex = totalPlaces - 1 - i;
        return (
          <DigitReel
            key={`${totalPlaces}-${i}`}
            digit={d}
            placeIndex={placeIndex}
            baseDuration={duration}
          />
        );
      })}
    </span>
  );
}
