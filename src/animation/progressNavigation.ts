import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { SceneConfig } from "../scenes/sceneTypes";
import { requestStoryNavigation } from "./navigation/guidedNavigation";

export function setupProgressDots(
  scenes: readonly SceneConfig[],
  reduceMotion: boolean,
): void {
  const progress = document.querySelector<HTMLElement>(".progress");
  const dots = Array.from(
    document.querySelectorAll<HTMLButtonElement>(".progress button"),
  );

  function activate(index: number): void {
    dots.forEach((dot) => dot.classList.remove("active"));
    dots[index]?.classList.add("active");
    progress?.classList.toggle("is-visible", index > 0);
  }

  function getTrackingRect(element: HTMLElement): DOMRect {
    const pinSpacer = element.parentElement;

    if (element.classList.contains("s7") && pinSpacer?.classList.contains("pin-spacer")) {
      return pinSpacer.getBoundingClientRect();
    }

    return element.getBoundingClientRect();
  }

  function updateFromViewport(): void {
    const viewportCenter = window.innerHeight / 2;
    const sceneRects = scenes
      .map((scene, index) => {
        const element = document.getElementById(scene.id);

        if (!element) {
          return null;
        }

        const rect = getTrackingRect(element);
        return {
          distance: Math.abs(rect.top + rect.height / 2 - viewportCenter),
          index,
          intersectsCenter: rect.top <= viewportCenter && rect.bottom >= viewportCenter,
        };
      })
      .filter((sceneRect): sceneRect is NonNullable<typeof sceneRect> =>
        Boolean(sceneRect),
      );

    const centeredScene =
      sceneRects.find((sceneRect) => sceneRect.intersectsCenter) ??
      sceneRects.toSorted((a, b) => a.distance - b.distance)[0];

    if (centeredScene) {
      activate(centeredScene.index);
    }
  }

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const targetId = dot.dataset.target;

      if (!targetId) {
        return;
      }

      if (reduceMotion) {
        document.getElementById(targetId)?.scrollIntoView({ behavior: "auto" });
        return;
      }

      requestStoryNavigation({ targetId });
    });
  });

  document.querySelectorAll<HTMLButtonElement>(".scroll-hint").forEach((hint) => {
    hint.addEventListener("click", () => {
      const targetId = hint.dataset.target;

      if (!targetId) {
        return;
      }

      if (reduceMotion) {
        document.getElementById(targetId)?.scrollIntoView({ behavior: "auto" });
        return;
      }

      requestStoryNavigation({ targetId });
    });
  });

  ScrollTrigger.create({
    start: 0,
    end: "max",
    onRefresh: updateFromViewport,
    onUpdate: updateFromViewport,
  });

  updateFromViewport();
}
