import type { SceneConfig } from "../../scenes/sceneTypes";
import { getElementTop } from "../scrollLock";
import { NAVIGATION_SETTLED_EVENT } from "./events";
import type { NavigationSettledDetail } from "./events";

export type SceneStop = {
  element: HTMLElement;
  id: string;
  index: number;
};

export function getTrackingElement(element: HTMLElement): HTMLElement {
  const parent = element.parentElement;

  return parent?.classList.contains("pin-spacer") ? parent : element;
}

export function getSceneStops(scenes: readonly SceneConfig[]): SceneStop[] {
  return scenes
    .map((scene, index) => {
      const element = document.getElementById(scene.id);

      return element ? { element, id: scene.id, index } : null;
    })
    .filter((stop): stop is SceneStop => Boolean(stop));
}

export function findClosestSceneIndex(stops: readonly SceneStop[]): number {
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

export function updateSceneHash(id: string): void {
  const nextUrl = `${window.location.pathname}${window.location.search}#${id}`;

  if (window.location.hash !== `#${id}`) {
    window.history.replaceState(null, "", nextUrl);
  }
}

export function dispatchNavigationSettled(stop: SceneStop, splitStep?: number): void {
  window.dispatchEvent(
    new CustomEvent<NavigationSettledDetail>(NAVIGATION_SETTLED_EVENT, {
      detail: {
        id: stop.id,
        index: stop.index,
        splitStep,
      },
    }),
  );
}

export function scrollImmediatelyToStop(stop: SceneStop): void {
  window.scrollTo(0, getElementTop(stop.element));
  updateSceneHash(stop.id);
  dispatchNavigationSettled(stop);
}
