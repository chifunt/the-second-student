import gsap from "gsap";
import { animateCharts } from "./chartAnimations";

// ScrollTrigger may initialize timelines before a scene is reached; disabling
// immediate render keeps static/reduced-motion content from being hidden early.
gsap.defaults({ immediateRender: false });

export type TimelineOptions = {
  pin?: boolean;
  scrub?: number | boolean;
  start?: string;
  end?: string;
  onEnterBack?: () => void;
  onLeave?: () => void;
  onUpdate?: (self: { progress: number }) => void;
};

const DATA_FOCUS_HOLD_SECONDS = 3;
const DATA_FOCUS_RELEASE_SECONDS = 0.65;
const DATA_FOCUS_CONTENT_DELAY = 0.16;

export const DATA_FOCUS_CONTENT_START =
  DATA_FOCUS_HOLD_SECONDS + DATA_FOCUS_RELEASE_SECONDS + DATA_FOCUS_CONTENT_DELAY;

export function sceneTimeline(
  container: HTMLElement,
  options: TimelineOptions = {},
): gsap.core.Timeline {
  return gsap.timeline({
    defaults: {
      duration: 0.7,
      ease: "power2.out",
    },
    scrollTrigger: {
      trigger: container,
      start: options.start ?? "top 70%",
      end: options.end ?? "bottom 30%",
      once: !options.scrub,
      onEnterBack: options.onEnterBack,
      onLeave: options.onLeave,
      onUpdate: options.onUpdate,
      pin: options.pin,
      scrub: options.scrub,
    },
  });
}

export function sceneContentPosition(container: HTMLElement, offset = 0): number {
  return (container.dataset.dataFocus ? DATA_FOCUS_CONTENT_START : 0) + offset;
}

export function playDataFocus(
  timeline: gsap.core.Timeline,
  container: HTMLElement,
  position = 0,
): void {
  const target = container.querySelector<HTMLElement>("[data-focus-target]");
  const wash = container.querySelector<HTMLElement>(".data-focus-wash");

  if (!target || !wash) {
    return;
  }

  timeline
    .add(() => container.classList.add("data-focus-active"), position)
    .set(wash, { autoAlpha: 1 }, position)
    .to(
      wash,
      {
        autoAlpha: 0,
        duration: DATA_FOCUS_RELEASE_SECONDS,
        onComplete: () => {
          container.classList.remove("data-focus-active");
          container.classList.add("data-focus-released");
        },
      },
      position + DATA_FOCUS_HOLD_SECONDS,
    )
    .fromTo(
      target,
      {
        scale: container.dataset.dataFocus === "soft" ? 1.012 : 1.025,
        y: container.dataset.dataFocus === "soft" ? -2 : -5,
      },
      {
        duration: 0.8,
        scale: 1,
        y: 0,
      },
      position + 0.08,
    );
}

export function baseReveal(container: HTMLElement): gsap.core.Timeline {
  const hasDataFocus = Boolean(container.dataset.dataFocus);
  const timeline = sceneTimeline(container, {
    start: hasDataFocus ? "top 5%" : undefined,
  });
  const sceneInner = container.querySelector(".scene-inner");

  if (!hasDataFocus) {
    timeline.from(sceneInner, {
      autoAlpha: 0,
      duration: 0.8,
      scale: 0.985,
      y: 26,
    });
  }

  playDataFocus(timeline, container, 0.02);
  animateCharts(timeline, container, hasDataFocus ? 0.18 : 0.25);

  return timeline;
}

export function revealMessages(
  timeline: gsap.core.Timeline,
  container: HTMLElement,
  selector = ".msg, .phone-bubble",
  position = 0.3,
): void {
  const messages = container.querySelectorAll(selector);

  if (messages.length > 0) {
    timeline.from(
      messages,
      {
        autoAlpha: 0,
        duration: 0.45,
        stagger: 0.14,
        y: 18,
      },
      sceneContentPosition(container, position),
    );
  }
}
