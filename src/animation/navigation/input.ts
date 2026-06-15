import { ScrollTrigger } from "gsap/ScrollTrigger";
import { trackCleanup } from "../runtimeEffects";
import type { NavigationDirection } from "./events";

const WHEEL_THRESHOLD = 34;
const WHEEL_RESET_MS = 180;
const TOUCH_THRESHOLD = 44;
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

type NavigationInputOptions = {
  isBlocked: () => boolean;
  navigateByDirection: (direction: NavigationDirection) => void;
  navigateToIndex: (index: number, direction?: NavigationDirection) => void;
  onRefresh: () => void;
  stopCount: number;
};

function shouldIgnoreInputTarget(target: EventTarget | null): boolean {
  const element = target instanceof Element ? target : null;

  return Boolean(
    element?.closest(
      ".about-drawer, .evidence-card, [data-native-scroll], input, textarea, select",
    ),
  );
}

export function setupNavigationInput({
  isBlocked,
  navigateByDirection,
  navigateToIndex,
  onRefresh,
  stopCount,
}: NavigationInputOptions): void {
  let wheelDelta = 0;
  let wheelTimer = 0;
  let touchStartY: number | undefined;

  const handleWheel = (event: WheelEvent) => {
    if (shouldIgnoreInputTarget(event.target)) {
      return;
    }

    event.preventDefault();

    if (isBlocked()) {
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

    if (isBlocked()) {
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
      navigateToIndex(stopCount - 1, 1);
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

    if (Math.abs(delta) < TOUCH_THRESHOLD || isBlocked()) {
      return;
    }

    navigateByDirection(delta > 0 ? 1 : -1);
  };

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
  ScrollTrigger.addEventListener("refresh", onRefresh);

  trackCleanup(() => {
    window.clearTimeout(wheelTimer);
    window.removeEventListener("wheel", handleWheel, true);
    window.removeEventListener("touchstart", handleTouchStart, true);
    window.removeEventListener("touchmove", handleTouchMove, true);
    window.removeEventListener("touchend", handleTouchEnd, true);
    document.removeEventListener("keydown", handleKey, true);
    ScrollTrigger.removeEventListener("refresh", onRefresh);
  });
}
