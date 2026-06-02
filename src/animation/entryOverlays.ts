import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { SceneConfig } from "../scenes/sceneTypes";
import {
  ENTRY_OVERLAY_DISMISSED_EVENT,
  ENTRY_OVERLAY_STARTED_EVENT,
  NAVIGATION_SETTLED_EVENT,
} from "./navigation/events";
import type { NavigationSettledDetail } from "./navigation/events";
import { schedule, trackCleanup } from "./runtimeEffects";
import { getElementTop, lockScrollAt } from "./scrollLock";

const ENTRY_OVERLAY_HOLD_MS = 3000;

function prearmDataFocus(container: HTMLElement): void {
  const wash = container.querySelector<HTMLElement>(".data-focus-wash");
  const target = container.querySelector<HTMLElement>("[data-focus-target]");

  container.classList.remove("data-focus-active", "data-focus-released");
  container.classList.add("data-focus-prearmed");
  wash?.style.removeProperty("opacity");
  wash?.style.removeProperty("visibility");
  target?.style.removeProperty("transform");
}

function playDeferredSceneAnimation(container: HTMLElement): void {
  window.requestAnimationFrame(() => {
    ScrollTrigger.refresh();
    ScrollTrigger.getAll().forEach((trigger) => {
      if (trigger.trigger === container && trigger.animation && !trigger.vars.scrub) {
        trigger.animation.play(0);
      }
    });
  });
}

function restartDeferredAnimation(
  animation: void | {
    paused?: (value: boolean) => unknown;
    progress?: (value: number) => unknown;
    restart: (includeDelay?: boolean, suppressEvents?: boolean) => unknown;
    timeScale?: (value?: number) => number | unknown;
  },
): void {
  if (!animation) {
    return;
  }

  window.setTimeout(() => {
    animation.progress?.(0);
    animation.timeScale?.(1);
    animation.paused?.(false);
    animation.restart(true, false);
  }, 120);
}

function dismissEntryOverlay(
  scene: SceneConfig,
  container: HTMLElement,
  reduceMotion: boolean,
  unlockScroll?: () => void,
): void {
  if (container.classList.contains("entry-overlay-dismissed")) {
    unlockScroll?.();
    return;
  }

  container.classList.remove("entry-overlay-pending");
  container.classList.remove("entry-overlay-active");
  container.classList.add("entry-overlay-dismissed");
  unlockScroll?.();
  window.dispatchEvent(
    new CustomEvent(ENTRY_OVERLAY_DISMISSED_EVENT, {
      detail: { id: scene.id },
    }),
  );

  if (
    reduceMotion ||
    !scene.animate ||
    container.dataset.entryAnimationReady === "true"
  ) {
    return;
  }

  container.dataset.entryAnimationReady = "true";
  const animation = scene.animate(container);
  ScrollTrigger.refresh();
  ScrollTrigger.update();
  restartDeferredAnimation(animation);
  playDeferredSceneAnimation(container);
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
      prearmDataFocus(container);
    } else if (!reduceMotion && scene.animate) {
      container.dataset.entryAnimationReady = "true";
    }

    let started = false;
    let unlockOverlayScroll: (() => void) | undefined;
    const startOverlay = () => {
      if (started) {
        return;
      }

      started = true;
      unlockOverlayScroll = lockScrollAt(getElementTop(container));
      container.classList.remove("entry-overlay-pending");
      container.classList.add("entry-overlay-active");
      window.dispatchEvent(
        new CustomEvent(ENTRY_OVERLAY_STARTED_EVENT, {
          detail: { id: scene.id },
        }),
      );
      schedule(
        () => dismissEntryOverlay(scene, container, reduceMotion, unlockOverlayScroll),
        ENTRY_OVERLAY_HOLD_MS,
      );
    };

    const startOverlayFromNavigation = (event: Event) => {
      const detail = (event as CustomEvent<NavigationSettledDetail>).detail;

      if (detail?.id === scene.id) {
        startOverlay();
      }
    };

    // Overlays must be subordinate to guided navigation; raw scroll observers can
    // start an offscreen overlay and block the visible scene.
    window.addEventListener(NAVIGATION_SETTLED_EVENT, startOverlayFromNavigation);
    trackCleanup(() => {
      window.removeEventListener(NAVIGATION_SETTLED_EVENT, startOverlayFromNavigation);
    });
  });

  return deferredScenes;
}
