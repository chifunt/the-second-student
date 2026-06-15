import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { SceneConfig } from "../scenes/sceneTypes";
import {
  ENTRY_OVERLAY_DISMISSED_EVENT,
  ENTRY_OVERLAY_STARTED_EVENT,
  NAVIGATION_SETTLED_EVENT,
} from "./navigation/events";
import type { NavigationSettledDetail } from "./navigation/events";
import { getTrackingElement } from "./navigation/sceneStops";
import { trackCleanup } from "./runtimeEffects";

const ENTRY_OVERLAY_HOLD_MS = 3000;
const ENTRY_OVERLAY_TICK_MS = 50;
const SETTLED_TOLERANCE_PX = 2;

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

function isSceneSettled(container: HTMLElement): boolean {
  if (container.classList.contains("s7")) {
    const sceneRect = container.getBoundingClientRect();
    const trackingRect = getTrackingElement(container).getBoundingClientRect();

    return (
      Math.abs(sceneRect.top) <= SETTLED_TOLERANCE_PX &&
      trackingRect.bottom > window.innerHeight / 2
    );
  }

  const rect = getTrackingElement(container).getBoundingClientRect();

  return Math.abs(rect.top) <= SETTLED_TOLERANCE_PX;
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
): void {
  if (container.classList.contains("entry-overlay-dismissed")) {
    return;
  }

  container.classList.remove("entry-overlay-pending");
  container.classList.remove("entry-overlay-active");
  container.classList.remove("entry-overlay-paused");
  container.classList.add("entry-overlay-dismissed");
  container.style.setProperty("--entry-overlay-progress", "1");
  container.style.setProperty("--entry-overlay-duration", "0ms");
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
    const timerBar = overlay?.querySelector<HTMLElement>(".scene-entry-timer__bar");

    if (!container || !overlay) {
      return;
    }

    container.classList.remove(
      "entry-overlay-active",
      "entry-overlay-dismissed",
      "entry-overlay-paused",
    );
    container.classList.add("entry-overlay-pending");
    container.style.setProperty("--entry-overlay-progress", "0");
    container.style.setProperty("--entry-overlay-duration", `${ENTRY_OVERLAY_HOLD_MS}ms`);
    if (timerBar) {
      timerBar.style.transition = "none";
      timerBar.style.transform = "scaleX(0)";
    }
    delete container.dataset.entryAnimationReady;

    if (reduceMotion) {
      container.classList.remove("entry-overlay-pending");
      container.classList.add("entry-overlay-dismissed");
      container.style.setProperty("--entry-overlay-progress", "1");
      container.style.setProperty("--entry-overlay-duration", "0ms");
      if (timerBar) {
        timerBar.style.transition = "none";
        timerBar.style.transform = "scaleX(1)";
      }
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

    let hasStarted = false;
    let isRunning = false;
    let elapsedMs = 0;
    let startedAt = 0;
    let progressInterval = 0;
    let resumeWatchInterval = 0;
    const initialCheckTimers: number[] = [];
    const clearProgressInterval = (): void => {
      window.clearInterval(progressInterval);
      progressInterval = 0;
    };
    const clearResumeWatch = (): void => {
      window.clearInterval(resumeWatchInterval);
      resumeWatchInterval = 0;
    };

    const setTimerProgress = (value = elapsedMs): void => {
      const ratio = Math.min(1, value / ENTRY_OVERLAY_HOLD_MS);

      container.style.setProperty("--entry-overlay-progress", ratio.toFixed(4));
      if (timerBar) {
        timerBar.style.transition = "none";
        timerBar.style.transform = `scaleX(${ratio})`;
      }
    };

    const completeOverlay = (): void => {
      clearProgressInterval();
      isRunning = false;
      elapsedMs = ENTRY_OVERLAY_HOLD_MS;
      setTimerProgress();
      dismissEntryOverlay(scene, container, reduceMotion);
    };

    const renderRunningTimer = (): void => {
      if (!isRunning) {
        return;
      }

      if (!isSceneSettled(container)) {
        pauseOverlay();
        return;
      }

      const currentElapsed = Math.min(
        ENTRY_OVERLAY_HOLD_MS,
        elapsedMs + performance.now() - startedAt,
      );

      setTimerProgress(currentElapsed);

      if (currentElapsed >= ENTRY_OVERLAY_HOLD_MS) {
        completeOverlay();
        return;
      }
    };

    const pauseOverlay = (): void => {
      if (!isRunning || container.classList.contains("entry-overlay-dismissed")) {
        return;
      }

      elapsedMs = Math.min(
        ENTRY_OVERLAY_HOLD_MS,
        elapsedMs + performance.now() - startedAt,
      );
      isRunning = false;
      clearProgressInterval();
      setTimerProgress();
      container.style.setProperty("--entry-overlay-duration", "0ms");
      container.classList.remove("entry-overlay-active");
      container.classList.add("entry-overlay-paused");
      if (!resumeWatchInterval) {
        resumeWatchInterval = window.setInterval(() => {
          if (isSceneSettled(container)) {
            clearResumeWatch();
            resumeOverlay();
          }
        }, 120);
      }
    };

    const resumeOverlay = (): void => {
      if (
        isRunning ||
        container.classList.contains("entry-overlay-dismissed") ||
        elapsedMs >= ENTRY_OVERLAY_HOLD_MS
      ) {
        return;
      }

      if (!isSceneSettled(container)) {
        return;
      }

      const remainingMs = Math.max(0, ENTRY_OVERLAY_HOLD_MS - elapsedMs);

      if (remainingMs <= 0) {
        completeOverlay();
        return;
      }

      setTimerProgress();
      container.style.setProperty("--entry-overlay-duration", `${remainingMs}ms`);
      clearResumeWatch();
      container.classList.remove("entry-overlay-paused");
      container.classList.remove("entry-overlay-pending");
      container.classList.add("entry-overlay-active");
      if (timerBar) {
        timerBar.style.transition = "none";
      }
      startedAt = performance.now();
      isRunning = true;

      if (!hasStarted) {
        hasStarted = true;
        window.dispatchEvent(
          new CustomEvent(ENTRY_OVERLAY_STARTED_EVENT, {
            detail: { id: scene.id },
          }),
        );
      }

      renderRunningTimer();
      progressInterval = window.setInterval(renderRunningTimer, ENTRY_OVERLAY_TICK_MS);
    };

    const startOverlayFromNavigation = (event: Event) => {
      const detail = (event as CustomEvent<NavigationSettledDetail>).detail;

      if (detail?.id === scene.id) {
        resumeOverlay();
        return;
      }

      pauseOverlay();
    };

    const syncOverlayWithAlignment = () => {
      if (isSceneSettled(container)) {
        resumeOverlay();
      } else {
        pauseOverlay();
      }
    };

    const startIfInitiallySettled = () => {
      if (isSceneSettled(container)) {
        resumeOverlay();
      }
    };

    // Overlays must be subordinate to the settled scene event; raw scroll
    // observers only react to exact alignment or pause an already-running cue.
    window.addEventListener(NAVIGATION_SETTLED_EVENT, startOverlayFromNavigation);
    window.addEventListener("scroll", syncOverlayWithAlignment, { passive: true });
    window.addEventListener("scrollend", syncOverlayWithAlignment);
    [120, 420, 900].forEach((delay) => {
      initialCheckTimers.push(window.setTimeout(startIfInitiallySettled, delay));
    });
    trackCleanup(() => {
      clearProgressInterval();
      clearResumeWatch();
      initialCheckTimers.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener(NAVIGATION_SETTLED_EVENT, startOverlayFromNavigation);
      window.removeEventListener("scroll", syncOverlayWithAlignment);
      window.removeEventListener("scrollend", syncOverlayWithAlignment);
    });
  });

  return deferredScenes;
}
