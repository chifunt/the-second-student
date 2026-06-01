import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { SceneConfig } from "../scenes/sceneTypes";
import { trackCleanup } from "./runtimeEffects";
import { getElementTop, getScrollTop } from "./scrollLock";

gsap.registerPlugin(ScrollToPlugin);

const NAVIGATION_EVENT = "second-student:navigate-to";
const NAVIGATION_SETTLED_EVENT = "second-student:navigation-settled";
const ENTRY_OVERLAY_STARTED_EVENT = "second-student:entry-overlay-started";
const ENTRY_OVERLAY_DISMISSED_EVENT = "second-student:entry-overlay-dismissed";
const SCROLL_DURATION_SECONDS = 0.85;
const WHEEL_THRESHOLD = 34;
const WHEEL_RESET_MS = 180;
const TOUCH_THRESHOLD = 44;
const SPLIT_STEPS = [0, 0.33, 0.66, 1] as const;
const LOCKED_KEYS = new Set([
  " ",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "End",
  "Home",
  "PageDown",
  "PageUp",
]);

type NavigationDirection = -1 | 1;

type NavigationRequest = {
  direction?: NavigationDirection;
  splitStep?: number;
  targetId?: string;
};

type SceneStop = {
  element: HTMLElement;
  id: string;
  index: number;
};

export function requestStoryNavigation(request: NavigationRequest): void {
  window.dispatchEvent(
    new CustomEvent<NavigationRequest>(NAVIGATION_EVENT, {
      detail: request,
    }),
  );
}

function getTrackingElement(element: HTMLElement): HTMLElement {
  const parent = element.parentElement;

  return parent?.classList.contains("pin-spacer") ? parent : element;
}

function shouldIgnoreInputTarget(target: EventTarget | null): boolean {
  const element = target instanceof Element ? target : null;

  return Boolean(
    element?.closest(
      ".about-drawer, .evidence-card, [data-native-scroll], input, textarea, select",
    ),
  );
}

function findClosestSceneIndex(stops: readonly SceneStop[]): number {
  const viewportCenter = window.innerHeight / 2;
  let bestIndex = 0;
  let bestDistance = Number.POSITIVE_INFINITY;

  stops.forEach((stop) => {
    const rect = getTrackingElement(stop.element).getBoundingClientRect();
    const distance = Math.abs(rect.top + rect.height / 2 - viewportCenter);

    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = stop.index;
    }
  });

  return bestIndex;
}

function getSplitTrigger(splitScene: HTMLElement | undefined): ScrollTrigger | undefined {
  if (!splitScene) {
    return undefined;
  }

  return ScrollTrigger.getAll().find(
    (trigger) => trigger.trigger === splitScene && Boolean(trigger.vars.pin),
  );
}

function getSplitProgress(splitScene: HTMLElement | undefined): number {
  const trigger = getSplitTrigger(splitScene);

  if (!trigger || trigger.end === trigger.start) {
    return 0;
  }

  return Math.min(
    1,
    Math.max(0, (getScrollTop() - trigger.start) / (trigger.end - trigger.start)),
  );
}

function getClosestSplitStep(splitScene: HTMLElement | undefined): number {
  const progress = getSplitProgress(splitScene);
  let closestStep = 0;
  let closestDistance = Number.POSITIVE_INFINITY;

  SPLIT_STEPS.forEach((stepProgress, step) => {
    const distance = Math.abs(progress - stepProgress);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestStep = step;
    }
  });

  return closestStep;
}

function getSplitStepTop(splitScene: HTMLElement, step: number): number {
  const trigger = getSplitTrigger(splitScene);
  const progress = SPLIT_STEPS[Math.min(Math.max(step, 0), SPLIT_STEPS.length - 1)];

  if (!trigger) {
    return getElementTop(splitScene);
  }

  return trigger.start + (trigger.end - trigger.start) * progress;
}

function setSplitCompletion(splitScene: HTMLElement | undefined, step: number): void {
  if (!splitScene) {
    return;
  }

  const isComplete = step >= SPLIT_STEPS.length - 1;
  splitScene.classList.toggle("split-experience-complete", isComplete);
  splitScene.classList.toggle("scene-animation-complete", isComplete);
}

function updateHash(id: string): void {
  const nextUrl = `${window.location.pathname}${window.location.search}#${id}`;

  if (window.location.hash !== `#${id}`) {
    window.history.replaceState(null, "", nextUrl);
  }
}

function dispatchSettled(stop: SceneStop, splitStep?: number): void {
  window.dispatchEvent(
    new CustomEvent(NAVIGATION_SETTLED_EVENT, {
      detail: {
        id: stop.id,
        index: stop.index,
        splitStep,
      },
    }),
  );
}

function scrollImmediatelyTo(stop: SceneStop): void {
  window.scrollTo(0, getElementTop(stop.element));
  updateHash(stop.id);
  dispatchSettled(stop);
}

export function setupSceneSnap(
  scenes: readonly SceneConfig[],
  reduceMotion: boolean,
): void {
  const stops = scenes
    .map((scene, index) => {
      const element = document.getElementById(scene.id);

      return element ? { element, id: scene.id, index } : null;
    })
    .filter((stop): stop is SceneStop => Boolean(stop));
  const splitStop = stops.find((stop) => stop.element.classList.contains("s7"));
  let activeIndex = findClosestSceneIndex(stops);
  let activeSplitStep =
    activeIndex === splitStop?.index ? getClosestSplitStep(splitStop.element) : 0;
  let isMoving = false;
  let wheelDelta = 0;
  let wheelTimer = 0;
  let touchStartY: number | undefined;
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
    updateHash(stop.id);
    ScrollTrigger.update();
    dispatchSettled(stop, stop.index === splitStop?.index ? activeSplitStep : undefined);
  };

  const scrollToStop = (stop: SceneStop, splitStep?: number) => {
    if (reduceMotion) {
      scrollImmediatelyTo(stop);
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
    const clampedIndex = Math.min(Math.max(index, 0), stops.length - 1);
    const stop = stops[clampedIndex];

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

  const handleWheel = (event: WheelEvent) => {
    if (shouldIgnoreInputTarget(event.target)) {
      return;
    }

    event.preventDefault();

    if (isNavigationBlocked()) {
      return;
    }

    wheelDelta += event.deltaY;
    window.clearTimeout(wheelTimer);
    wheelTimer = window.setTimeout(() => {
      wheelDelta = 0;
    }, WHEEL_RESET_MS);

    if (Math.abs(wheelDelta) < WHEEL_THRESHOLD) {
      return;
    }

    const direction = wheelDelta > 0 ? 1 : -1;
    wheelDelta = 0;
    navigateByDirection(direction);
  };

  const handleKey = (event: KeyboardEvent) => {
    if (!LOCKED_KEYS.has(event.key) || shouldIgnoreInputTarget(event.target)) {
      return;
    }

    event.preventDefault();

    if (isNavigationBlocked()) {
      return;
    }

    const direction: NavigationDirection =
      event.key === "ArrowUp" ||
      event.key === "ArrowLeft" ||
      event.key === "PageUp" ||
      event.key === "Home"
        ? -1
        : 1;

    if (event.key === "Home") {
      navigateToIndex(0, -1);
      return;
    }

    if (event.key === "End") {
      navigateToIndex(stops.length - 1, 1);
      return;
    }

    navigateByDirection(direction);
  };

  const handleTouchStart = (event: TouchEvent) => {
    if (shouldIgnoreInputTarget(event.target)) {
      touchStartY = undefined;
      return;
    }

    touchStartY = event.touches[0]?.clientY;
  };

  const handleTouchMove = (event: TouchEvent) => {
    if (touchStartY === undefined || shouldIgnoreInputTarget(event.target)) {
      return;
    }

    event.preventDefault();
  };

  const handleTouchEnd = (event: TouchEvent) => {
    if (touchStartY === undefined || shouldIgnoreInputTarget(event.target)) {
      touchStartY = undefined;
      return;
    }

    const endY = event.changedTouches[0]?.clientY;
    const delta = typeof endY === "number" ? touchStartY - endY : 0;
    touchStartY = undefined;

    if (Math.abs(delta) < TOUCH_THRESHOLD || isNavigationBlocked()) {
      return;
    }

    navigateByDirection(delta > 0 ? 1 : -1);
  };

  const syncActiveFromScroll = () => {
    activeIndex = findClosestSceneIndex(stops);
    activeSplitStep =
      activeIndex === splitStop?.index ? getClosestSplitStep(splitStop.element) : 0;
  };

  const handleOverlayStarted = (event: Event) => {
    const id = (event as CustomEvent<{ id?: string }>).detail?.id;

    activeOverlaySceneId = id === stops[activeIndex]?.id ? id : undefined;
  };

  const handleOverlayDismissed = (event: Event) => {
    const id = (event as CustomEvent<{ id?: string }>).detail?.id;

    if (id === activeOverlaySceneId) {
      activeOverlaySceneId = undefined;
    }
  };

  window.addEventListener(NAVIGATION_EVENT, handleRequest);
  window.addEventListener(ENTRY_OVERLAY_STARTED_EVENT, handleOverlayStarted);
  window.addEventListener(ENTRY_OVERLAY_DISMISSED_EVENT, handleOverlayDismissed);
  trackCleanup(() => window.removeEventListener(NAVIGATION_EVENT, handleRequest));
  trackCleanup(() => {
    window.removeEventListener(ENTRY_OVERLAY_STARTED_EVENT, handleOverlayStarted);
    window.removeEventListener(ENTRY_OVERLAY_DISMISSED_EVENT, handleOverlayDismissed);
  });

  if (reduceMotion) {
    return;
  }

  window.addEventListener("wheel", handleWheel, {
    capture: true,
    passive: false,
  });
  window.addEventListener("touchstart", handleTouchStart, {
    capture: true,
    passive: true,
  });
  window.addEventListener("touchmove", handleTouchMove, {
    capture: true,
    passive: false,
  });
  window.addEventListener("touchend", handleTouchEnd, {
    capture: true,
    passive: false,
  });
  document.addEventListener("keydown", handleKey, true);
  ScrollTrigger.addEventListener("refresh", syncActiveFromScroll);

  trackCleanup(() => {
    window.clearTimeout(wheelTimer);
    window.removeEventListener("wheel", handleWheel, true);
    window.removeEventListener("touchstart", handleTouchStart, true);
    window.removeEventListener("touchmove", handleTouchMove, true);
    window.removeEventListener("touchend", handleTouchEnd, true);
    document.removeEventListener("keydown", handleKey, true);
    ScrollTrigger.removeEventListener("refresh", syncActiveFromScroll);
  });

  window.requestAnimationFrame(() => {
    const hashStop = stops.find((stop) => window.location.hash === `#${stop.id}`);
    const activeStop = hashStop ?? stops[findClosestSceneIndex(stops)];

    if (activeStop) {
      activeIndex = activeStop.index;
      activeSplitStep =
        activeStop.index === splitStop?.index
          ? getClosestSplitStep(splitStop.element)
          : 0;
      window.scrollTo(0, getElementTop(activeStop.element));
      updateHash(activeStop.id);
      ScrollTrigger.update();
      dispatchSettled(
        activeStop,
        activeStop.index === splitStop?.index ? activeSplitStep : undefined,
      );
    }
  });
}
