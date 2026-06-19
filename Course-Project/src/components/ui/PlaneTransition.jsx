// [CO2: ES6 Modules / Modular Design] - Importing dependencies
import { useEffect, useRef } from "react";

/**
 * PlaneTransition
 * A transparent plane + contrail that flies across the screen.
 * No background change — the current page shows through underneath.
 *
 * Props:
 *   active  – boolean: trigger the flight
 *   onDone  – called ~1.2s later so parent can switch the step
 */
// [CO1: Component-Driven Architecture] - Self-contained transition component reusable across different layout steps
export default function PlaneTransition({ active, onDone }) {
  const timerRef = useRef(null);

  // [CO3: Side-Effect Management] - Handling asynchronous navigation timer callbacks within component lifecycle
  useEffect(() => {
    if (active) {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        onDone?.();
      }, 1200);
    }
    return () => clearTimeout(timerRef.current);
  }, [active]);

  if (!active) return null;

  return (
    /* Transparent full-screen hit-blocker so clicks don't fire during transition */
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 9998,
      pointerEvents: "all",
      background: "transparent",
      overflow: "hidden",
    }}>
      {/* Contrail — drawn first so plane renders on top */}
      <div style={{
        position: "absolute",
        top: "calc(50% - 2px)",
        left: 0,
        width: "100%",
        height: 4,
        borderRadius: 99,
        background: "linear-gradient(90deg, transparent 0%, rgba(255,140,0,0.5) 30%, rgba(255,255,255,0.8) 60%, transparent 100%)",
        filter: "blur(1.5px)",
        animation: "ptTrailOnly 1.0s 0.1s ease-in-out forwards",
        opacity: 0,
        transformOrigin: "left center",
      }} />

      {/* Second thinner contrail */}
      <div style={{
        position: "absolute",
        top: "calc(50% + 10px)",
        left: 0,
        width: "100%",
        height: 2,
        borderRadius: 99,
        background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 40%, transparent 100%)",
        filter: "blur(1px)",
        animation: "ptTrailOnly 1.0s 0.18s ease-in-out forwards",
        opacity: 0,
        transformOrigin: "left center",
      }} />

      {/* The Plane */}
      <div style={{
        position: "absolute",
        top: "50%",
        left: 0,
        transform: "translateY(-50%)",
        animation: "ptFlyAcross 1.1s 0s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        willChange: "transform, opacity",
        filter: "drop-shadow(0 6px 24px rgba(255,140,0,0.55)) drop-shadow(0 2px 8px rgba(0,0,0,0.18))",
      }}>
        <svg
          width="200"
          height="100"
          viewBox="0 0 200 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main fuselage */}
          <ellipse cx="105" cy="50" rx="82" ry="16" fill="white" />

          {/* Nose */}
          <path d="M187 50 Q205 50 198 42 L187 34 Z" fill="white" />

          {/* Cockpit windows */}
          <ellipse cx="178" cy="44" rx="6" ry="4" fill="#90CAF9" opacity="0.9" />
          <ellipse cx="167" cy="43" rx="5" ry="3.5" fill="#90CAF9" opacity="0.8" />

          {/* Cabin windows */}
          {[145, 132, 119, 106, 93, 80].map((x, i) => (
            <ellipse key={i} cx={x} cy="46" rx="4" ry="3" fill="#B3E5FC" opacity="0.7" />
          ))}

          {/* Main wing */}
          <path d="M115 52 L158 52 L138 90 L90 90 Z" fill="white" />
          <path d="M115 52 L158 52 L140 88 L93 88 Z" fill="#E8E8E8" />

          {/* Wing engine */}
          <ellipse cx="135" cy="76" rx="13" ry="6" fill="#BDBDBD" />
          <ellipse cx="135" cy="76" rx="9" ry="4" fill="#9E9E9E" />

          {/* Tail fin */}
          <path d="M22 50 L42 50 L42 26 L22 50 Z" fill="white" />

          {/* Horizontal stabilizers */}
          <path d="M22 50 L55 50 L46 66 L22 58 Z" fill="white" />
          <path d="M22 50 L55 50 L46 34 L22 42 Z" fill="white" />

          {/* Decorative stripes */}
          <path
            d="M32 47 Q105 42 188 46"
            stroke="#FF8C00"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M32 53 Q105 48 188 52"
            stroke="#FF4500"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.7"
          />

          {/* Nose engine glint */}
          <ellipse cx="190" cy="48" rx="3" ry="2" fill="rgba(255,140,0,0.4)" />
        </svg>
      </div>
    </div>
  );
}
