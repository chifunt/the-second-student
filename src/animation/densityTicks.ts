import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Cancelable } from "./runtimeEffects";
import { trackLoop } from "./runtimeEffects";

const DENSITY_DURATION_MS = 1400;
const DENSITY_DELAY_MS = 300;

function setLitTicks(ticks: HTMLElement[], litCount: number): void {
  ticks.forEach((tick, index) => {
    tick.classList.toggle("lit", index < litCount);
  });
}

function animateDensityTicks(element: HTMLElement): Cancelable {
  const fill = Number(element.dataset.fill ?? "100");
  const ticks = Array.from(element.querySelectorAll<HTMLElement>(".tick"));
  const start = performance.now() + DENSITY_DELAY_MS;
  let cancelled = false;

  const queueFrame = () => {
    window.setTimeout(() => frame(performance.now()), 16);
  };

  function frame(now: number): void {
    if (cancelled) {
      return;
    }

    if (now < start) {
      setLitTicks(ticks, 0);
      queueFrame();
      return;
    }

    const progress = Math.min(1, (now - start) / DENSITY_DURATION_MS);
    const eased = 1 - (1 - progress) ** 3;
    setLitTicks(ticks, Math.round(fill * eased));

    if (progress < 1) {
      queueFrame();
    } else {
      setLitTicks(ticks, fill);
    }
  }

  queueFrame();

  return {
    cancel() {
      cancelled = true;
    },
  };
}

function isElementInDensityRange(element: HTMLElement): boolean {
  const bounds = element.getBoundingClientRect();

  return bounds.top < window.innerHeight * 0.9 && bounds.bottom > 0;
}

export function setupDensityTicks(reduceMotion = false): void {
  document.querySelectorAll<HTMLElement>(".s0-density").forEach((element) => {
    const fill = Number(element.dataset.fill ?? "100");

    if (element.dataset.ready !== "true") {
      const fragment = document.createDocumentFragment();

      for (let index = 0; index < 100; index += 1) {
        const tick = document.createElement("span");
        tick.className = "tick";
        fragment.appendChild(tick);
      }

      element.appendChild(fragment);
      element.dataset.ready = "true";
    }

    const ticks = Array.from(element.querySelectorAll<HTMLElement>(".tick"));
    setLitTicks(ticks, reduceMotion ? fill : 0);

    if (reduceMotion) {
      return;
    }

    let started = false;
    const startDensity = () => {
      if (started) {
        return;
      }

      started = true;
      trackLoop(animateDensityTicks(element));
    };

    ScrollTrigger.create({
      trigger: element,
      start: "top 90%",
      once: true,
      onEnter: startDensity,
    });

    if (element.closest(".s0") || isElementInDensityRange(element)) {
      startDensity();
    }

    window.requestAnimationFrame(() => {
      if (isElementInDensityRange(element)) {
        startDensity();
      }
    });
  });
}
