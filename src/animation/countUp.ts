import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Cancelable } from "./runtimeEffects";
import { trackLoop } from "./runtimeEffects";

function countUp(element: HTMLElement): Cancelable {
  const target = Number(element.dataset.target ?? "0");
  const suffix = element.dataset.suffix ?? "";
  const duration = Number(element.dataset.duration ?? "1200");
  const delay = Number(element.dataset.delay ?? "120");
  const start = performance.now() + delay;
  let frameId = 0;
  let cancelled = false;
  let previousText = "";

  function frame(now: number): void {
    if (cancelled) {
      return;
    }

    if (now < start) {
      const nextText = `0${suffix}`;

      if (nextText !== previousText) {
        element.textContent = nextText;
        previousText = nextText;
      }
      frameId = window.requestAnimationFrame(frame);
      return;
    }

    const progress = Math.min(1, (now - start) / duration);
    const eased = 1 - (1 - progress) ** 3;
    const nextText = `${Math.round(target * eased)}${suffix}`;

    if (nextText !== previousText) {
      element.textContent = nextText;
      previousText = nextText;
    }

    if (progress < 1) {
      frameId = window.requestAnimationFrame(frame);
    } else {
      element.textContent = `${target}${suffix}`;
    }
  }

  frameId = window.requestAnimationFrame(frame);

  return {
    cancel() {
      cancelled = true;
      window.cancelAnimationFrame(frameId);
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
