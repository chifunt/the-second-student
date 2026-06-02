import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { SceneConfig } from "../../scenes/sceneTypes";
import { trackCleanup } from "../runtimeEffects";
import { getElementTop } from "../scrollLock";
import {
  ENTRY_OVERLAY_DISMISSED_EVENT,
  ENTRY_OVERLAY_STARTED_EVENT,
  NAVIGATION_EVENT,
} from "./events";
import type {
  EntryOverlayDetail,
  NavigationDirection,
  NavigationRequest,
} from "./events";
import { setupNavigationInput } from "./input";
import {
  dispatchNavigationSettled,
  findClosestSceneIndex,
  getSceneStops,
  scrollImmediatelyToStop,
  updateSceneHash,
} from "./sceneStops";
import type { SceneStop } from "./sceneStops";
import {
  getClosestSplitStep,
  getSplitStepTop,
  setSplitCompletion,
  SPLIT_STEPS,
} from "./splitStops";

gsap.registerPlugin(ScrollToPlugin);

const SCROLL_DURATION_SECONDS = 0.85;

export function requestStoryNavigation(request: NavigationRequest): void {
  window.dispatchEvent(
    new CustomEvent<NavigationRequest>(NAVIGATION_EVENT, {
      detail: request,
    }),
  );
}

export function setupGuidedNavigation(
  scenes: readonly SceneConfig[],
  reduceMotion: boolean,
): void {
  const stops = getSceneStops(scenes);
  const splitStop = stops.find((stop) => stop.element.classList.contains("s7"));
  let activeIndex = findClosestSceneIndex(stops);
  let activeSplitStep =
    activeIndex === splitStop?.index ? getClosestSplitStep(splitStop.element) : 0;
  let isMoving = false;
  let activeOverlaySceneId: string | undefined;

  const isNavigationBlocked = (): boolean =>
    isMoving ||
    document.body.classList.contains("scroll-locked") ||
    activeOverlaySceneId === stops[activeIndex]?.id;

  const settleAt = (stop: SceneStop, splitStep?: number) => {
    isMoving = false;
    activeIndex = stop.index;
    activeSplitStep =
      stop.index === splitStop?.index
        ? (splitStep ?? getClosestSplitStep(splitStop.element))
        : 0;
    setSplitCompletion(
      splitStop?.element,
      stop.index === splitStop?.index ? activeSplitStep : 0,
    );
    updateSceneHash(stop.id);
    ScrollTrigger.update();
    dispatchNavigationSettled(
      stop,
      stop.index === splitStop?.index ? activeSplitStep : undefined,
    );
  };

  const scrollToStop = (stop: SceneStop, splitStep?: number) => {
    if (reduceMotion) {
      scrollImmediatelyToStop(stop);
      return;
    }

    const targetTop =
      stop.index === splitStop?.index && splitStop
        ? getSplitStepTop(splitStop.element, splitStep ?? 0)
        : getElementTop(stop.element);

    isMoving = true;
    document.documentElement.classList.add("guided-scroll-moving");
    gsap.to(window, {
      duration: SCROLL_DURATION_SECONDS,
      ease: "power2.inOut",
      onComplete: () => {
        document.documentElement.classList.remove("guided-scroll-moving");
        settleAt(stop, splitStep);
      },
      onInterrupt: () => {
        document.documentElement.classList.remove("guided-scroll-moving");
        isMoving = false;
      },
      onUpdate: () => ScrollTrigger.update(),
      overwrite: true,
      scrollTo: {
        autoKill: false,
        y: Math.round(targetTop),
      },
    });
  };

  const navigateToIndex = (
    index: number,
    direction: NavigationDirection = 1,
    splitStep?: number,
  ) => {
    const stop = stops[Math.min(Math.max(index, 0), stops.length - 1)];

    if (!stop) {
      return;
    }

    if (stop.index === splitStop?.index) {
      scrollToStop(stop, splitStep ?? (direction < 0 ? SPLIT_STEPS.length - 1 : 0));
      return;
    }

    scrollToStop(stop);
  };

  const navigateByDirection = (direction: NavigationDirection) => {
    if (isNavigationBlocked()) {
      return;
    }

    if (activeIndex === splitStop?.index) {
      const nextSplitStep = activeSplitStep + direction;

      if (nextSplitStep >= 0 && nextSplitStep < SPLIT_STEPS.length) {
        navigateToIndex(activeIndex, direction, nextSplitStep);
        return;
      }
    }

    navigateToIndex(activeIndex + direction, direction);
  };

  const syncActiveFromScroll = () => {
    activeIndex = findClosestSceneIndex(stops);
    activeSplitStep =
      activeIndex === splitStop?.index ? getClosestSplitStep(splitStop.element) : 0;
  };

  const handleRequest = (event: Event) => {
    const request = (event as CustomEvent<NavigationRequest>).detail;

    if (isNavigationBlocked()) {
      return;
    }

    if (request.targetId) {
      const targetStop = stops.find((stop) => stop.id === request.targetId);

      if (targetStop) {
        const direction = targetStop.index < activeIndex ? -1 : 1;
        navigateToIndex(targetStop.index, direction, request.splitStep);
      }
      return;
    }

    if (request.direction) {
      navigateByDirection(request.direction);
    }
  };

  const handleOverlayStarted = (event: Event) => {
    const id = (event as CustomEvent<EntryOverlayDetail>).detail?.id;

    // Only the overlay for the current scene may block navigation. Any stale
    // overlay event is ignored so it cannot freeze another scene.
    activeOverlaySceneId = id === stops[activeIndex]?.id ? id : undefined;
  };

  const handleOverlayDismissed = (event: Event) => {
    const id = (event as CustomEvent<EntryOverlayDetail>).detail?.id;

    if (id === activeOverlaySceneId) {
      activeOverlaySceneId = undefined;
    }
  };

  window.addEventListener(NAVIGATION_EVENT, handleRequest);
  window.addEventListener(ENTRY_OVERLAY_STARTED_EVENT, handleOverlayStarted);
  window.addEventListener(ENTRY_OVERLAY_DISMISSED_EVENT, handleOverlayDismissed);
  trackCleanup(() => {
    window.removeEventListener(NAVIGATION_EVENT, handleRequest);
    window.removeEventListener(ENTRY_OVERLAY_STARTED_EVENT, handleOverlayStarted);
    window.removeEventListener(ENTRY_OVERLAY_DISMISSED_EVENT, handleOverlayDismissed);
  });

  if (!reduceMotion) {
    setupNavigationInput({
      isBlocked: isNavigationBlocked,
      navigateByDirection,
      navigateToIndex,
      onRefresh: syncActiveFromScroll,
      stopCount: stops.length,
    });
  }

  window.requestAnimationFrame(() => {
    const hashStop = stops.find((stop) => window.location.hash === `#${stop.id}`);
    const activeStop = hashStop ?? stops[findClosestSceneIndex(stops)];

    if (!activeStop) {
      return;
    }

    activeIndex = activeStop.index;
    activeSplitStep =
      activeStop.index === splitStop?.index ? getClosestSplitStep(splitStop.element) : 0;
    window.scrollTo(0, getElementTop(activeStop.element));
    updateSceneHash(activeStop.id);
    ScrollTrigger.update();
    dispatchNavigationSettled(
      activeStop,
      activeStop.index === splitStop?.index ? activeSplitStep : undefined,
    );
  });
}
