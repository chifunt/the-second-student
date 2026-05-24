import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Cancelable } from "./runtimeEffects";
import { trackLoop } from "./runtimeEffects";

function countUp(element: HTMLElement): Cancelable {
  const target = Number(element.dataset.target ?? "0");
  const suffix = element.dataset.suffix ?? "";
  const duration = Number(element.dataset.duration ?? "1200");
  const delay = Number(element.dataset.delay ?? "120");
  const start = performance.now() + delay;
  let cancelled = false;

  function frame(now: number): void {
    if (cancelled) {
      return;
    }

    if (now < start) {
      element.textContent = `0${suffix}`;
      window.requestAnimationFrame(frame);
      return;
    }

    const progress = Math.min(1, (now - start) / duration);
    const eased = 1 - (1 - progress) ** 3;
    element.textContent = `${Math.round(target * eased)}${suffix}`;

    if (progress < 1) {
      window.requestAnimationFrame(frame);
    } else {
      element.textContent = `${target}${suffix}`;
    }
  }

  window.requestAnimationFrame(frame);

  return {
    cancel() {
      cancelled = true;
    },
  };
}

export function setupCountUps(): void {
  document.querySelectorAll<HTMLElement>("[data-countup]").forEach((element) => {
    ScrollTrigger.create({
      trigger: element,
      start: "top 90%",
      once: true,
      onEnter: () => {
        trackLoop(countUp(element));
      },
    });
  });
}
