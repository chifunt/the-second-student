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

  scenes.forEach((scene, index) => {
    const element = document.getElementById(scene.id);

    if (!element) {
      return;
    }

    ScrollTrigger.create({
      trigger: element,
      start: "top center",
      end: "bottom center",
      onEnter: () => activate(index),
      onEnterBack: () => activate(index),
    });
  });
}
