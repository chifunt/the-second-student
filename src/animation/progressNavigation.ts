import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { SceneConfig } from "../scenes/sceneTypes";

export function setupProgressDots(
  scenes: readonly SceneConfig[],
  reduceMotion: boolean,
): void {
  const dots = Array.from(
    document.querySelectorAll<HTMLButtonElement>(".progress button"),
  );

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const target = document.getElementById(dot.dataset.target ?? "");
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
      onEnter: () => dots[index]?.classList.add("active"),
      onEnterBack: () => dots[index]?.classList.add("active"),
      onLeave: () => dots[index]?.classList.remove("active"),
      onLeaveBack: () => dots[index]?.classList.remove("active"),
    });
  });
}
