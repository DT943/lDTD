import { useEffect, useRef, useState } from "react";
import { animate, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ChevronLeft } from "lucide-react";
import type { Navigate } from "../data/mockData";

export function Counter({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const reduced = useReducedMotion();
  const previous = useRef(0);
  useEffect(() => {
    if (reduced) {
      setDisplay(value);
      previous.current = value;
      return;
    }
    const controls = animate(previous.current, value, {
      duration: 1.25,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    previous.current = value;
    return () => controls.stop();
  }, [value, reduced]);
  return (
    <span className="tabular-nums">
      <span aria-hidden="true">{display.toLocaleString("en-US")}</span>
      <span className="sr-only">{value.toLocaleString("en-US")}</span>
    </span>
  );
}

export function Progress({ points }: { points: number }) {
  const reduced = useReducedMotion();
  return (
    <div
      className="progress-track"
      role="progressbar"
      aria-label="Progress to Gold"
      aria-valuenow={points}
      aria-valuemin={0}
      aria-valuemax={8000}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min((points / 8000) * 100, 100)}%` }}
        transition={{ duration: reduced ? 0 : 1.3, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

export function PageHeading({
  title,
  accent,
  subtitle,
}: {
  title: string;
  accent: string;
  subtitle: string;
}) {
  return (
    <div className="page-heading">
      <h1 tabIndex={-1}>
        {title} <em>{accent}</em>
      </h1>
      <p>{subtitle}</p>
    </div>
  );
}

export function BackButton({ navigate }: { navigate: Navigate }) {
  return (
    <button className="back-button" onClick={() => navigate("home")}>
      <ChevronLeft size={16} /> Back to my world
    </button>
  );
}

export function RoundArrow({ label }: { label: string }) {
  return (
    <span className="round-arrow" aria-label={label}>
      <ArrowUpRight size={25} strokeWidth={1.3} />
    </span>
  );
}
