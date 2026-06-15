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

  const queueFrame = () => {
    window.setTimeout(() => frame(performance.now()), 16);
  };

  function frame(now: number): void {
    if (cancelled) {
      return;
    }

    if (now < start) {
      element.textContent = `0${suffix}`;
      queueFrame();
      return;
    }

    const progress = Math.min(1, (now - start) / duration);
    const eased = 1 - (1 - progress) ** 3;
    element.textContent = `${Math.round(target * eased)}${suffix}`;

    if (progress < 1) {
      queueFrame();
    } else {
      element.textContent = `${target}${suffix}`;
    }
  }

  queueFrame();

  return {
    cancel() {
      cancelled = true;
    },
  };
}

function isElementInCountRange(element: HTMLElement): boolean {
  const bounds = element.getBoundingClientRect();

  return bounds.top < window.innerHeight * 0.9 && bounds.bottom > 0;
}

export function setupCountUps(): void {
  document.querySelectorAll<HTMLElement>("[data-countup]").forEach((element) => {
    element.textContent = `0${element.dataset.suffix ?? ""}`;
    let started = false;

    const startCount = () => {
      if (started) {
        return;
      }

      started = true;
      trackLoop(countUp(element));
    };

    ScrollTrigger.create({
      trigger: element,
      start: "top 90%",
      once: true,
      onEnter: startCount,
    });

    if (element.closest(".s0") || isElementInCountRange(element)) {
      startCount();
    }

    window.requestAnimationFrame(() => {
      if (isElementInCountRange(element)) {
        startCount();
      }
    });
  });
}
