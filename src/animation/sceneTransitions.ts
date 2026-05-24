import gsap from "gsap";
import { animateCharts } from "./chartAnimations";

gsap.defaults({ immediateRender: false });

type TimelineOptions = {
  pin?: boolean;
  scrub?: number | boolean;
  start?: string;
  end?: string;
};

function sceneTimeline(
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

function baseReveal(container: HTMLElement): gsap.core.Timeline {
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

function revealMessages(
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

export function animateTitleScene(container: HTMLElement): void {
  const timeline = baseReveal(container);

  timeline.from(
    container.querySelectorAll(".s0-density .tick.lit"),
    {
      autoAlpha: 0,
      duration: 0.22,
      stagger: 0.006,
      y: 8,
    },
    0.3,
  );
}

export function animateEmailScene(container: HTMLElement): void {
  const timeline = baseReveal(container);

  timeline
    .from(
      container.querySelectorAll(".email-list .row"),
      {
        autoAlpha: 0,
        duration: 0.35,
        stagger: 0.05,
        x: -18,
      },
      0.18,
    )
    .from(
      container.querySelector(".email-reader"),
      {
        autoAlpha: 0,
        duration: 0.55,
        x: 24,
      },
      0.32,
    );
}

export function animatePanicButtonScene(container: HTMLElement): void {
  const timeline = baseReveal(container);

  timeline
    .fromTo(
      container.querySelector(".cursor"),
      { autoAlpha: 0, x: -24, y: -18 },
      { autoAlpha: 1, duration: 0.25, x: 0, y: 0 },
      0.15,
    )
    .to(
      container.querySelector(".cursor"),
      {
        duration: 1.9,
        ease: "power1.inOut",
        left: "86%",
        top: "72%",
      },
      0.45,
    )
    .to(
      container.querySelector(".context-menu"),
      {
        autoAlpha: 1,
        duration: 0.35,
        y: 0,
      },
      2.35,
    )
    .to(
      container.querySelector(".s2-overlay .callout"),
      {
        autoAlpha: 1,
        duration: 0.45,
        y: 0,
      },
      2.7,
    );
}

export function animatePanicChatScene(container: HTMLElement): void {
  const timeline = baseReveal(container);
  revealMessages(timeline, container, ".chat-stream .msg", 0.32);
}

export function animateDeliberateWorkflowScene(container: HTMLElement): void {
  const timeline = baseReveal(container);

  timeline
    .from(
      container.querySelectorAll(".file"),
      {
        autoAlpha: 0,
        duration: 0.3,
        stagger: 0.04,
        x: -12,
      },
      0.18,
    )
    .from(
      container.querySelectorAll(".studio-stream .msg, .quote-note"),
      {
        autoAlpha: 0,
        duration: 0.45,
        stagger: 0.14,
        y: 18,
      },
      0.32,
    );
}

export function animateBoundaryScene(container: HTMLElement): void {
  const timeline = baseReveal(container);

  timeline
    .from(
      container.querySelectorAll(".sug, .sug-amber"),
      {
        backgroundColor: "rgba(255,255,255,0)",
        duration: 0.5,
        stagger: 0.08,
      },
      0.35,
    )
    .from(
      container.querySelectorAll(".rung"),
      {
        autoAlpha: 0,
        duration: 0.35,
        stagger: 0.07,
        x: 18,
      },
      0.48,
    );
}

export function animateSkillGapScene(container: HTMLElement): void {
  const timeline = baseReveal(container);

  timeline.from(
    container.querySelectorAll(".vle-card"),
    {
      autoAlpha: 0,
      duration: 0.35,
      stagger: 0.06,
      y: 16,
    },
    0.28,
  );
}

export function animateDependencyScene(container: HTMLElement): void {
  const timeline = baseReveal(container);
  revealMessages(timeline, container, ".dep-stream .msg", 0.28);

  timeline.from(
    container.querySelectorAll(".chip, .quote-card"),
    {
      autoAlpha: 0,
      duration: 0.35,
      stagger: 0.05,
      y: 12,
    },
    0.82,
  );
}

export function animateCompanionScene(container: HTMLElement): void {
  const timeline = baseReveal(container);

  timeline
    .from(
      container.querySelector(".phone"),
      {
        autoAlpha: 0,
        duration: 0.75,
        filter: "blur(12px)",
        y: 32,
      },
      0.14,
    )
    .from(
      container.querySelectorAll(".phone-bubble"),
      {
        autoAlpha: 0,
        duration: 0.45,
        stagger: 0.18,
        y: 18,
      },
      0.48,
    );
}

export function animateFinalPaywallScene(container: HTMLElement): void {
  const timeline = sceneTimeline(container);

  timeline
    .from(
      container.querySelectorAll(".reflect-body .msg"),
      {
        autoAlpha: 0,
        duration: 0.45,
        stagger: 0.15,
        y: 18,
      },
      0,
    )
    .to(
      container.querySelector(".continue-btn"),
      {
        autoAlpha: 1,
        duration: 0.3,
        y: 0,
      },
      0.32,
    )
    .from(
      container.querySelectorAll(".ghost-card"),
      {
        autoAlpha: 0,
        duration: 0.25,
        stagger: 0.04,
        y: 12,
      },
      0.45,
    )
    .from(
      container.querySelector(".s9-outro"),
      {
        autoAlpha: 0,
        duration: 0.35,
        y: 18,
      },
      0.6,
    );
}
