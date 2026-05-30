import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { SceneConfig } from "../scenes/sceneTypes";
import { setupCountUps } from "./countUp";
import { setupDensityTicks } from "./densityTicks";
import { setupEntryOverlays } from "./entryOverlays";
import { setupEvidenceDetails } from "./evidenceDetails";
import { setupFakeTyping } from "./fakeTyping";
import { getShouldReduceMotion } from "./motionPreference";
import { setupProgressiveChats } from "./progressiveChat";
import { setupProgressDots } from "./progressNavigation";
import { clearRuntimeEffects } from "./runtimeEffects";
import { setupSceneSnap } from "./sceneSnap";
import { setupSelectionSweep } from "./selectionSweep";
import { setupAboutDrawer, setupInteractiveDetails } from "./storyInteractions";
import { setupTitleOpen } from "./titleOpen";

gsap.registerPlugin(ScrollTrigger);

export function setupScroll(scenes: readonly SceneConfig[]): void {
  // ScrollTrigger owns animation state, but not the DOM. Re-running setup should
  // rebuild animation hooks without hiding content or duplicating timers.
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  clearRuntimeEffects();
  document.documentElement.classList.remove("reduced-motion", "scroll-animation-ready");
  document.body.classList.remove("scroll-locked");
  document
    .querySelectorAll<HTMLElement>(".data-focus-active, .data-focus-released")
    .forEach((element) =>
      element.classList.remove("data-focus-active", "data-focus-released"),
    );

  const shouldReduceMotion = getShouldReduceMotion();

  setupDensityTicks();
  setupAboutDrawer();
  setupEvidenceDetails();
  setupInteractiveDetails();
  setupFakeTyping();
  setupProgressiveChats(shouldReduceMotion);
  setupProgressDots(scenes, shouldReduceMotion);
  setupTitleOpen(shouldReduceMotion);
  const deferredScenes = setupEntryOverlays(scenes, shouldReduceMotion);

  if (shouldReduceMotion) {
    document.documentElement.classList.add("reduced-motion");
    document.querySelector<HTMLElement>(".s0")?.classList.add("opened");
    return;
  }

  document.documentElement.classList.add("scroll-animation-ready");
  setupCountUps();
  setupSelectionSweep(false);

  for (const scene of scenes) {
    const container = document.getElementById(scene.id);

    if (container && scene.animate && !deferredScenes.has(scene.id)) {
      scene.animate(container);
    }
  }

  setupSceneSnap(scenes, shouldReduceMotion);
  ScrollTrigger.refresh();
}
