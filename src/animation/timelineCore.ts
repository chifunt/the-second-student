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
};

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
      pin: options.pin,
      scrub: options.scrub,
    },
  });
}

export function baseReveal(container: HTMLElement): gsap.core.Timeline {
  const timeline = sceneTimeline(container);

  timeline.from(container.querySelector(".scene-inner"), {
    autoAlpha: 0,
    duration: 0.8,
    scale: 0.985,
    y: 26,
  });
  animateCharts(timeline, container, 0.25);

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
      position,
    );
  }
}
