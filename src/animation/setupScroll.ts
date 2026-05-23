import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { SceneConfig } from "../scenes/sceneTypes";

gsap.registerPlugin(ScrollTrigger);

type Cancelable = {
  cancel: () => void;
};

const activeTimers: number[] = [];
const activeLoops: Cancelable[] = [];

function clearRuntimeEffects(): void {
  activeTimers.splice(0).forEach((timer) => window.clearTimeout(timer));
  activeLoops.splice(0).forEach((loop) => loop.cancel());
}

function schedule(callback: () => void, delay: number): void {
  activeTimers.push(window.setTimeout(callback, delay));
}

function setupDensityTicks(): void {
  document.querySelectorAll<HTMLElement>(".s0-density").forEach((element) => {
    if (element.dataset.ready === "true") {
      return;
    }

    const fill = Number(element.dataset.fill ?? "100");
    const fragment = document.createDocumentFragment();

    for (let index = 0; index < 100; index += 1) {
      const tick = document.createElement("span");
      tick.className = index < fill ? "tick lit" : "tick";
      fragment.appendChild(tick);
    }

    element.appendChild(fragment);
    element.dataset.ready = "true";
  });
}

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

function setupCountUps(): void {
  document.querySelectorAll<HTMLElement>("[data-countup]").forEach((element) => {
    ScrollTrigger.create({
      trigger: element,
      start: "top 90%",
      once: true,
      onEnter: () => {
        activeLoops.push(countUp(element));
      },
    });
  });
}

function setupProgressDots(scenes: readonly SceneConfig[], reduceMotion: boolean): void {
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

function setupTitleOpen(reduceMotion: boolean): void {
  const titleScene = document.querySelector<HTMLElement>(".s0");
  const button = document.querySelector<HTMLButtonElement>(".s0-open");
  const next = document.querySelector<HTMLElement>(".s1");

  if (!titleScene || !button || !next) {
    return;
  }

  if (!reduceMotion && window.scrollY < 8) {
    document.body.classList.add("scroll-locked");
  }

  button.addEventListener("click", () => {
    titleScene.classList.add("opened");
    document.body.classList.remove("scroll-locked");
    next.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  });
}

function setupSelectionSweep(reduceMotion: boolean): void {
  const scene = document.querySelector<HTMLElement>(".s2");
  const body = scene?.querySelector<HTMLElement>(".email-body");

  if (!scene || !body || body.dataset.prepped === "true") {
    return;
  }

  const walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  let current = walker.nextNode();

  while (current) {
    textNodes.push(current as Text);
    current = walker.nextNode();
  }

  textNodes.forEach((node) => {
    const fragment = document.createDocumentFragment();

    for (const character of node.textContent ?? "") {
      const span = document.createElement("span");
      span.className = "s2-char";
      span.textContent = character;
      fragment.appendChild(span);
    }

    node.replaceWith(fragment);
  });

  body.dataset.prepped = "true";

  ScrollTrigger.create({
    trigger: scene,
    start: "top 45%",
    once: true,
    onEnter: () => {
      const chars = Array.from(body.querySelectorAll<HTMLElement>(".s2-char"));

      if (reduceMotion) {
        body.classList.add("is-selected");
        return;
      }

      chars.forEach((char, index) => {
        schedule(() => char.classList.add("sel"), 500 + index * 5);
      });
      schedule(() => body.classList.add("is-selected"), 500 + chars.length * 5);
    },
  });
}

function setupFakeTyping(): void {
  document.querySelectorAll<HTMLElement>("[data-fake-type]").forEach((element) => {
    const text = element.dataset.fakeType ?? "";
    let index = 0;
    let cancelled = false;

    function tick(): void {
      if (cancelled) {
        return;
      }

      element.textContent = text.slice(0, index);
      index = index >= text.length ? 0 : index + 1;
      schedule(tick, index === 0 ? 2400 : 70);
    }

    schedule(tick, 1200);
    activeLoops.push({ cancel: () => (cancelled = true) });
  });
}

function setupAboutDrawer(): void {
  const toggle = document.querySelector<HTMLButtonElement>(".about-toggle");
  const drawer = document.querySelector<HTMLElement>(".about-drawer");
  const close = drawer?.querySelector<HTMLButtonElement>(".close");

  toggle?.addEventListener("click", () => drawer?.classList.toggle("open"));
  close?.addEventListener("click", () => drawer?.classList.remove("open"));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      drawer?.classList.remove("open");
    }
  });
}

function setupInteractiveDetails(): void {
  document.querySelectorAll<HTMLButtonElement>(".ladder .rung").forEach((rung) => {
    rung.addEventListener("click", () => {
      const alreadyOpen = rung.classList.contains("open");
      rung.parentElement
        ?.querySelectorAll(".rung")
        .forEach((item) => item.classList.remove("open"));

      if (!alreadyOpen) {
        rung.classList.add("open");
      }
    });
  });

  const finalScene = document.querySelector<HTMLElement>(".s9");
  finalScene?.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;

    if (target.closest(".continue-btn")) {
      finalScene.classList.add("gated");
      target.closest(".continue-btn")?.classList.add("used");
    }

    if (target.closest(".later")) {
      finalScene.classList.remove("gated");
    }
  });
}

export function setupScroll(scenes: readonly SceneConfig[]): void {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  clearRuntimeEffects();
  document.documentElement.classList.remove("reduced-motion", "scroll-animation-ready");
  document.body.classList.remove("scroll-locked");

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const motionOverride = new URLSearchParams(window.location.search).get("motion");
  const shouldReduceMotion =
    motionOverride === "off" || (motionOverride !== "on" && prefersReducedMotion);

  setupDensityTicks();
  setupAboutDrawer();
  setupInteractiveDetails();
  setupFakeTyping();
  setupProgressDots(scenes, shouldReduceMotion);
  setupTitleOpen(shouldReduceMotion);

  if (shouldReduceMotion) {
    document.documentElement.classList.add("reduced-motion");
    document.querySelector<HTMLElement>(".s0")?.classList.add("opened");
    return;
  }

  document.documentElement.classList.add("scroll-animation-ready");
  setupCountUps();
  setupSelectionSweep(false);

  for (const scene of scenes) {
    const container = document.getElementById(scene.id);

    if (container && scene.animate) {
      scene.animate(container);
    }
  }

  ScrollTrigger.refresh();
}
