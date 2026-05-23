import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { SceneConfig } from "../scenes/sceneTypes";

gsap.registerPlugin(ScrollTrigger);

export function setupScroll(scenes: readonly SceneConfig[]): void {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  document.documentElement.classList.remove("reduced-motion", "scroll-animation-ready");

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const motionOverride = new URLSearchParams(window.location.search).get("motion");
  // The query override is only for QA because Codex/browser environments often
  // report reduced motion even when we need to verify ScrollTrigger behavior.
  const shouldReduceMotion =
    motionOverride === "off" || (motionOverride !== "on" && prefersReducedMotion);

  if (shouldReduceMotion) {
    document.documentElement.classList.add("reduced-motion");
    return;
  }

  document.documentElement.classList.add("scroll-animation-ready");

  for (const scene of scenes) {
    const container = document.getElementById(scene.id);

    if (container && scene.animate) {
      scene.animate(container);
    }
  }

  ScrollTrigger.refresh();
}
