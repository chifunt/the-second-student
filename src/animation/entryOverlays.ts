import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { SceneConfig } from "../scenes/sceneTypes";
import { schedule, trackCleanup } from "./runtimeEffects";

const ENTRY_OVERLAY_HOLD_MS = 3000;
const ENTRY_OVERLAY_START_TOLERANCE_PX = 120;

function isSceneSettledAtViewportTop(container: HTMLElement): boolean {
  return (
    Math.abs(container.getBoundingClientRect().top) <= ENTRY_OVERLAY_START_TOLERANCE_PX
  );
}

function dismissEntryOverlay(
  scene: SceneConfig,
  container: HTMLElement,
  reduceMotion: boolean,
): void {
  if (container.classList.contains("entry-overlay-dismissed")) {
    return;
  }

  container.classList.remove("entry-overlay-pending");
  container.classList.remove("entry-overlay-active");
  container.classList.add("entry-overlay-dismissed");

  if (
    reduceMotion ||
    !scene.animate ||
    container.dataset.entryAnimationReady === "true"
  ) {
    return;
  }

  container.dataset.entryAnimationReady = "true";
  scene.animate(container);
  ScrollTrigger.refresh();
  ScrollTrigger.update();
}

export function setupEntryOverlays(
  scenes: readonly SceneConfig[],
  reduceMotion: boolean,
): Set<string> {
  const deferredScenes = new Set<string>();

  scenes.forEach((scene) => {
    const container = document.getElementById(scene.id);
    const overlay = container?.querySelector<HTMLElement>(".scene-entry-overlay");

    if (!container || !overlay) {
      return;
    }

    container.classList.remove("entry-overlay-active", "entry-overlay-dismissed");
    container.classList.add("entry-overlay-pending");
    delete container.dataset.entryAnimationReady;

    if (reduceMotion) {
      container.classList.remove("entry-overlay-pending");
      container.classList.add("entry-overlay-dismissed");
      return;
    }

    const shouldDeferAnimation = !reduceMotion && Boolean(container.dataset.dataFocus);

    // Data-first scenes should not animate under the entry overlay. The pinned
    // split scene is initialized up front so ScrollTrigger owns its geometry
    // before the user reaches it.
    if (shouldDeferAnimation) {
      deferredScenes.add(scene.id);
    } else if (!reduceMotion && scene.animate) {
      container.dataset.entryAnimationReady = "true";
    }

    const trapScroll = (event: Event) => {
      if (container.classList.contains("entry-overlay-active")) {
        event.preventDefault();
      }
    };

    overlay.addEventListener("wheel", trapScroll, {
      passive: false,
    });
    overlay.addEventListener("touchmove", trapScroll, {
      passive: false,
    });
    trackCleanup(() => {
      overlay.removeEventListener("wheel", trapScroll);
      overlay.removeEventListener("touchmove", trapScroll);
    });

    let started = false;
    let pollTimer = 0;

    const startOverlay = () => {
      if (started || !isSceneSettledAtViewportTop(container)) {
        return;
      }

      started = true;
      window.clearInterval(pollTimer);
      container.classList.remove("entry-overlay-pending");
      container.classList.add("entry-overlay-active");
      schedule(
        () => dismissEntryOverlay(scene, container, reduceMotion),
        ENTRY_OVERLAY_HOLD_MS,
      );
    };

    window.addEventListener("scroll", startOverlay, { passive: true });
    window.addEventListener("resize", startOverlay, { passive: true });
    trackCleanup(() => {
      window.removeEventListener("scroll", startOverlay);
      window.removeEventListener("resize", startOverlay);
    });

    pollTimer = window.setInterval(startOverlay, 100);
    trackCleanup(() => window.clearInterval(pollTimer));

    const trigger = ScrollTrigger.create({
      trigger: container,
      // The entry slate is allowed to block scroll briefly, so it must only
      // start after snap has settled the scene instead of while it is half-way in.
      start: "top top+=10",
      end: "bottom top",
      onEnter: startOverlay,
      onEnterBack: startOverlay,
      onUpdate: startOverlay,
    });
    trackCleanup(() => trigger.kill());

    const bounds = container.getBoundingClientRect();
    if (
      isSceneSettledAtViewportTop(container) &&
      bounds.bottom > window.innerHeight * 0.3
    ) {
      startOverlay();
    }
  });

  return deferredScenes;
}
