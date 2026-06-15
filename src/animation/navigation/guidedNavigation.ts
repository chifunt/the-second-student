import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { SceneConfig } from "../../scenes/sceneTypes";
import { trackCleanup } from "../runtimeEffects";
import { getElementTop } from "../scrollLock";
import { ENTRY_OVERLAY_DISMISSED_EVENT, NAVIGATION_EVENT } from "./events";
import type { NavigationDirection, NavigationRequest } from "./events";
import {
  dispatchNavigationSettled,
  findClosestSceneIndex,
  getSceneStops,
  getTrackingElement,
  scrollImmediatelyToStop,
  updateSceneHash,
} from "./sceneStops";
import type { SceneStop } from "./sceneStops";
import { getClosestSplitStep, setSplitCompletion } from "./splitStops";

const SCROLL_SETTLE_MS = 160;
const SETTLE_TOLERANCE_PX = 2;
const SNAP_CORRECTION_MS = 900;

export function requestStoryNavigation(request: NavigationRequest): void {
  window.dispatchEvent(
    new CustomEvent<NavigationRequest>(NAVIGATION_EVENT, {
      detail: request,
    }),
  );
}

function getSettledStop(stops: readonly SceneStop[]): SceneStop | undefined {
  return stops.find((stop) => {
    if (stop.element.classList.contains("s7")) {
      const sceneRect = stop.element.getBoundingClientRect();
      const trackingRect = getTrackingElement(stop.element).getBoundingClientRect();

      return (
        Math.abs(sceneRect.top) <= SETTLE_TOLERANCE_PX &&
        trackingRect.bottom > window.innerHeight / 2
      );
    }

    const rect = getTrackingElement(stop.element).getBoundingClientRect();

    return Math.abs(rect.top) <= SETTLE_TOLERANCE_PX;
  });
}

function scrollToStop(stop: SceneStop, reduceMotion: boolean): void {
  if (reduceMotion) {
    scrollImmediatelyToStop(stop);
    return;
  }

  window.scrollTo({
    behavior: "smooth",
    top: getElementTop(stop.element),
  });
}

function getStopDistanceFromViewport(stop: SceneStop): number {
  const rect = getTrackingElement(stop.element).getBoundingClientRect();

  if (stop.element.classList.contains("s7")) {
    return Math.abs(rect.top);
  }

  const viewportCenter = window.innerHeight / 2;

  return Math.abs(rect.top + rect.height / 2 - viewportCenter);
}

export function setupGuidedNavigation(
  scenes: readonly SceneConfig[],
  reduceMotion: boolean,
): void {
  const stops = getSceneStops(scenes);
  const splitStop = stops.find((stop) => stop.element.classList.contains("s7"));
  let activeIndex = findClosestSceneIndex(stops);
  let isInitializing = true;
  let isCorrectingSnap = false;
  let correctionTimer = 0;
  const overlayDismissTimers: number[] = [];
  let settleTimer = 0;

  // This module coordinates native snap events and programmatic button/dot
  // navigation. Wheel, touch, and keyboard scrolling stay browser-owned.
  document.documentElement.classList.remove("guided-scroll-moving");
  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }

  const settleAt = (stop: SceneStop): void => {
    window.clearTimeout(correctionTimer);
    isCorrectingSnap = false;
    activeIndex = stop.index;
    const splitStep =
      stop.index === splitStop?.index ? getClosestSplitStep(splitStop.element) : 0;

    setSplitCompletion(splitStop?.element, splitStep);
    updateSceneHash(stop.id);
    ScrollTrigger.update();
    dispatchNavigationSettled(
      stop,
      stop.index === splitStop?.index ? splitStep : undefined,
    );
  };

  const settleIfAligned = (): boolean => {
    if (isInitializing) {
      return false;
    }

    const stop = getSettledStop(stops);

    if (stop) {
      settleAt(stop);
      return true;
    }

    return false;
  };

  const isInsideSplitRange = (): boolean => {
    if (!splitStop) {
      return false;
    }

    const rect = getTrackingElement(splitStop.element).getBoundingClientRect();
    const viewportCenter = window.innerHeight / 2;

    return rect.top <= SETTLE_TOLERANCE_PX && rect.bottom > viewportCenter;
  };

  const correctSnapIfNeeded = (): void => {
    if (
      reduceMotion ||
      isCorrectingSnap ||
      document.body.classList.contains("scroll-locked") ||
      isInsideSplitRange()
    ) {
      return;
    }

    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    stops.forEach((stop) => {
      const distance = getStopDistanceFromViewport(stop);

      if (distance < closestDistance) {
        closestIndex = stop.index;
        closestDistance = distance;
      }
    });

    const targetStop = stops[closestIndex];

    if (!targetStop) {
      return;
    }

    isCorrectingSnap = true;
    activeIndex = targetStop.index;
    scrollToStop(targetStop, false);
    correctionTimer = window.setTimeout(() => {
      isCorrectingSnap = false;
      if (!settleIfAligned()) {
        scheduleSettleCheck();
      }
    }, SNAP_CORRECTION_MS);
  };

  const scheduleSettleCheck = (): void => {
    window.clearTimeout(settleTimer);
    settleTimer = window.setTimeout(() => {
      if (!settleIfAligned()) {
        correctSnapIfNeeded();
      }
    }, SCROLL_SETTLE_MS);
  };

  const navigateToIndex = (index: number, direction: NavigationDirection = 1): void => {
    if (document.body.classList.contains("scroll-locked")) {
      return;
    }

    const stop = stops[Math.min(Math.max(index, 0), stops.length - 1)];

    if (!stop) {
      return;
    }

    activeIndex = stop.index;
    scrollToStop(stop, reduceMotion);

    if (reduceMotion) {
      return;
    }

    scheduleSettleCheck();
    if (direction < 0) {
      ScrollTrigger.update();
    }
  };

  const handleRequest = (event: Event): void => {
    const request = (event as CustomEvent<NavigationRequest>).detail;

    if (request.targetId) {
      const targetStop = stops.find((stop) => stop.id === request.targetId);

      if (targetStop) {
        const direction = targetStop.index < activeIndex ? -1 : 1;
        navigateToIndex(targetStop.index, direction);
      }
      return;
    }

    if (request.direction) {
      navigateToIndex(activeIndex + request.direction, request.direction);
    }
  };

  const handleScroll = (): void => {
    ScrollTrigger.update();
    scheduleSettleCheck();
  };

  const handleOverlayDismissed = (): void => {
    [260, 960].forEach((delay) => {
      overlayDismissTimers.push(window.setTimeout(scheduleSettleCheck, delay));
    });
  };

  window.addEventListener(NAVIGATION_EVENT, handleRequest);
  window.addEventListener(ENTRY_OVERLAY_DISMISSED_EVENT, handleOverlayDismissed);
  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("scrollend", settleIfAligned);
  ScrollTrigger.addEventListener("refresh", settleIfAligned);

  trackCleanup(() => {
    window.clearTimeout(settleTimer);
    window.clearTimeout(correctionTimer);
    overlayDismissTimers.forEach((timer) => window.clearTimeout(timer));
    window.removeEventListener(NAVIGATION_EVENT, handleRequest);
    window.removeEventListener(ENTRY_OVERLAY_DISMISSED_EVENT, handleOverlayDismissed);
    window.removeEventListener("scroll", handleScroll);
    window.removeEventListener("scrollend", settleIfAligned);
    ScrollTrigger.removeEventListener("refresh", settleIfAligned);
  });

  window.requestAnimationFrame(() => {
    const hashStop = stops.find((stop) => window.location.hash === `#${stop.id}`);
    const activeStop = hashStop ?? stops[findClosestSceneIndex(stops)];

    if (!activeStop) {
      return;
    }

    activeIndex = activeStop.index;
    ScrollTrigger.refresh();

    if (hashStop) {
      window.scrollTo({
        behavior: "auto",
        top: getElementTop(hashStop.element),
      });
    }

    window.requestAnimationFrame(() => {
      isInitializing = false;
      ScrollTrigger.refresh();
      settleIfAligned();
      scheduleSettleCheck();
    });
  });
}
