import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { SceneConfig } from "../scenes/sceneTypes";

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

  function updateFromViewport(): void {
    const viewportCenter = window.innerHeight / 2;
    const sceneRects = scenes
      .map((scene, index) => {
        const element = document.getElementById(scene.id);

        if (!element) {
          return null;
        }

        const rect = element.getBoundingClientRect();
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
      const target = document.getElementById(dot.dataset.target ?? "");
      target?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    });
  });

  document.querySelectorAll<HTMLButtonElement>(".scroll-hint").forEach((hint) => {
    hint.addEventListener("click", () => {
      const target = document.getElementById(hint.dataset.target ?? "");
      target?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
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
