import type Lenis from "lenis";

/** Mutable motion state shared by the provider, scenes and link handling. */
export const motion: { lenis: Lenis | null; introDelay: number } = {
  lenis: null,
  introDelay: 0.15,
};

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
