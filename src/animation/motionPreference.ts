export function getShouldReduceMotion(): boolean {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const motionOverride = new URLSearchParams(window.location.search).get("motion");

  return motionOverride === "off" || (motionOverride !== "on" && prefersReducedMotion);
}

export function getShouldUsePerformanceLite(reduceMotion: boolean): boolean {
  const params = new URLSearchParams(window.location.search);
  const performanceOverride = params.get("performance");
  const navigatorWithMemory = navigator as Navigator & {
    deviceMemory?: number;
  };
  const lowCoreCount =
    typeof navigator.hardwareConcurrency === "number" &&
    navigator.hardwareConcurrency > 0 &&
    navigator.hardwareConcurrency <= 4;
  const lowMemory =
    typeof navigatorWithMemory.deviceMemory === "number" &&
    navigatorWithMemory.deviceMemory <= 4;

  if (performanceOverride === "full") {
    return false;
  }

  return performanceOverride === "lite" || reduceMotion || lowCoreCount || lowMemory;
}
