export function getShouldReduceMotion(): boolean {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const motionOverride = new URLSearchParams(window.location.search).get("motion");

  return motionOverride === "off" || (motionOverride !== "on" && prefersReducedMotion);
}
