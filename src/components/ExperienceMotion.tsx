import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

const MotionContext = createContext({ enabled: true, toggle: () => {} });

export function ExperienceMotion({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    try {
      return !reduced && localStorage.getItem("flycham-motion-v1") !== "paused";
    } catch {
      return !reduced;
    }
  });
  useEffect(() => {
    document.documentElement.classList.toggle("motion-paused", !enabled);
  }, [enabled]);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => {
      if (preference.matches) setEnabled(false);
    };
    preference.addEventListener("change", change);
    return () => preference.removeEventListener("change", change);
  }, []);
  function toggle() {
    const next = !enabled;
    setEnabled(next);
    try {
      localStorage.setItem("flycham-motion-v1", next ? "enabled" : "paused");
    } catch {
      /* Motion control also works without storage. */
    }
  }
  return (
    <MotionContext.Provider value={{ enabled, toggle }}>
      {children}
    </MotionContext.Provider>
  );
}

export function useExperienceMotion() {
  return useContext(MotionContext);
}
