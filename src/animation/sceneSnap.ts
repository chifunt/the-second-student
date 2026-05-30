import type { SceneConfig } from "../scenes/sceneTypes";
import { trackCleanup } from "./runtimeEffects";

const SNAP_SETTLE_MS = 140;
const SNAP_ANIMATION_MS = 520;
const SNAP_DEAD_ZONE_PX = 3;

function getDocumentTop(element: Element): number {
  return element.getBoundingClientRect().top + window.scrollY;
}

function isSplitSceneScrollRange(): boolean {
  const splitScene = document.querySelector<HTMLElement>(".s7");

  if (!splitScene) {
    return false;
  }

  const pinWrapper = splitScene.parentElement?.classList.contains("pin-spacer")
    ? splitScene.parentElement
    : splitScene;
  const top = getDocumentTop(pinWrapper);
  const scrollableEnd =
    top + pinWrapper.getBoundingClientRect().height - window.innerHeight;

  return (
    window.scrollY >= top - SNAP_DEAD_ZONE_PX &&
    window.scrollY <= scrollableEnd + SNAP_DEAD_ZONE_PX
  );
}

export function setupSceneSnap(
  scenes: readonly SceneConfig[],
  reduceMotion: boolean,
): void {
  if (reduceMotion) {
    return;
  }

  const snapCandidates = scenes
    .map((scene) => document.getElementById(scene.id))
    .filter((element): element is HTMLElement => Boolean(element))
    .filter((element) => !element.classList.contains("s7"));

  if (snapCandidates.length === 0) {
    return;
  }

  let settleTimer = 0;
  let releaseTimer = 0;
  let isSnapping = false;

  const clearTimers = () => {
    window.clearTimeout(settleTimer);
    window.clearTimeout(releaseTimer);
  };

  const queueSnap = () => {
    if (isSnapping) {
      return;
    }

    window.clearTimeout(settleTimer);
    settleTimer = window.setTimeout(snapToClosestScene, SNAP_SETTLE_MS);
  };

  const releaseSnap = () => {
    isSnapping = false;
    queueSnap();
  };

  const shouldSkipSnap = () =>
    document.body.classList.contains("scroll-locked") ||
    Boolean(document.querySelector(".entry-overlay-active")) ||
    isSplitSceneScrollRange();

  function snapToClosestScene(): void {
    if (shouldSkipSnap()) {
      return;
    }

    const currentY = window.scrollY;
    const closest = snapCandidates.reduce(
      (nearest, element) => {
        const top = getDocumentTop(element);
        const distance = Math.abs(top - currentY);

        return distance < nearest.distance ? { distance, top } : nearest;
      },
      { distance: Number.POSITIVE_INFINITY, top: currentY },
    );

    if (closest.distance <= SNAP_DEAD_ZONE_PX) {
      return;
    }

    isSnapping = true;
    window.scrollTo({ top: closest.top, behavior: "smooth" });
    window.clearTimeout(releaseTimer);
    releaseTimer = window.setTimeout(releaseSnap, SNAP_ANIMATION_MS);
  }

  window.addEventListener("scroll", queueSnap, { passive: true });
  window.addEventListener("resize", queueSnap, { passive: true });
  trackCleanup(() => {
    clearTimers();
    window.removeEventListener("scroll", queueSnap);
    window.removeEventListener("resize", queueSnap);
  });
}
