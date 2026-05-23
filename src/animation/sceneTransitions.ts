import gsap from "gsap";
import { animateCharts } from "./chartAnimations";
import { animateFakeCursor } from "./cursorTimeline";
import { revealSceneCopy } from "./textReveal";

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
      start: options.start ?? "top 72%",
      end: options.end ?? "bottom 28%",
      once: !options.scrub,
      pin: options.pin,
      scrub: options.scrub,
    },
  });
}

function revealStage(timeline: gsap.core.Timeline, container: HTMLElement): void {
  timeline.from(
    container.querySelector(".scene__stage"),
    {
      autoAlpha: 0,
      duration: 0.75,
      scale: 0.98,
      y: 24,
    },
    0.12,
  );
}

function standardReveal(container: HTMLElement): gsap.core.Timeline {
  const timeline = sceneTimeline(container);
  revealSceneCopy(timeline, container);
  revealStage(timeline, container);
  // Charts render statically first, then animate through stable .bar-fill hooks
  // so the story remains readable when motion is disabled.
  animateCharts(timeline, container, 0.35);
  return timeline;
}

export function animateTitleScene(container: HTMLElement): void {
  const timeline = standardReveal(container);

  timeline.from(
    container.querySelector(".email-row--unread"),
    {
      boxShadow: "0 0 0 rgba(230, 162, 60, 0)",
      duration: 0.9,
      repeat: 1,
      yoyo: true,
    },
    0.7,
  );
}

export function animateEmailScene(container: HTMLElement): void {
  const timeline = standardReveal(container);

  timeline
    .from(
      container.querySelectorAll(".mail-list__item"),
      {
        autoAlpha: 0,
        duration: 0.45,
        stagger: 0.07,
        x: -22,
      },
      0.25,
    )
    .from(
      container.querySelector(".mail-pane"),
      {
        autoAlpha: 0,
        duration: 0.55,
        x: 24,
      },
      0.45,
    );
}

export function animatePanicButtonScene(container: HTMLElement): void {
  const timeline = standardReveal(container);

  animateFakeCursor(timeline, container, 0.25);
  timeline
    .from(
      container.querySelector(".selected-text"),
      {
        backgroundColor: "rgba(230, 162, 60, 0)",
        duration: 0.55,
      },
      0.42,
    )
    .from(
      container.querySelector(".context-menu"),
      {
        autoAlpha: 0,
        duration: 0.35,
        scale: 0.96,
        transformOrigin: "top left",
      },
      0.72,
    )
    .from(
      container.querySelector(".clipboard-preview"),
      {
        autoAlpha: 0,
        duration: 0.45,
        y: 18,
      },
      0.95,
    );
}

export function animatePanicChatScene(container: HTMLElement): void {
  const timeline = standardReveal(container);

  timeline
    .from(
      container.querySelector(".pasted-card"),
      {
        autoAlpha: 0,
        duration: 0.45,
        y: 16,
      },
      0.28,
    )
    .from(
      container.querySelectorAll(".bubble"),
      {
        autoAlpha: 0,
        duration: 0.5,
        stagger: 0.16,
        y: 18,
      },
      0.5,
    );
}

export function animateDeliberateWorkflowScene(container: HTMLElement): void {
  const timeline = standardReveal(container);

  timeline
    .from(
      container.querySelectorAll(".workspace-grid > section"),
      {
        autoAlpha: 0,
        duration: 0.5,
        stagger: 0.08,
        y: 22,
      },
      0.28,
    )
    .from(
      container.querySelector(".structured-prompt"),
      {
        autoAlpha: 0,
        duration: 0.45,
        y: 16,
      },
      0.68,
    )
    .from(
      container.querySelector(".quote-card"),
      {
        autoAlpha: 0,
        duration: 0.45,
        rotate: -1.5,
        y: 14,
      },
      0.85,
    );
}

export function animateBoundaryScene(container: HTMLElement): void {
  const timeline = standardReveal(container);

  timeline
    .from(
      container.querySelectorAll(".margin-note"),
      {
        autoAlpha: 0,
        duration: 0.45,
        stagger: 0.12,
        x: 20,
      },
      0.42,
    )
    .from(
      container.querySelector(".button-danger"),
      {
        boxShadow: "0 0 0 rgba(185, 74, 72, 0)",
        duration: 0.65,
        repeat: 1,
        yoyo: true,
      },
      0.8,
    );
}

export function animateSkillGapScene(container: HTMLElement): void {
  const timeline = standardReveal(container);

  timeline
    .from(
      container.querySelector(".vle-search"),
      {
        autoAlpha: 0,
        duration: 0.45,
        y: -12,
      },
      0.22,
    )
    .from(
      container.querySelectorAll(".vle-cards article"),
      {
        autoAlpha: 0,
        duration: 0.45,
        stagger: 0.08,
        y: 18,
      },
      0.4,
    )
    .from(
      container.querySelector(".guidance-alert"),
      {
        autoAlpha: 0,
        duration: 0.45,
        y: 14,
      },
      0.72,
    );
}

export function animateDependencyScene(container: HTMLElement): void {
  const timeline = standardReveal(container);

  timeline
    .from(
      container.querySelectorAll(".chat-shell--crowded .bubble"),
      {
        autoAlpha: 0,
        duration: 0.38,
        stagger: 0.11,
        y: 16,
      },
      0.32,
    )
    .from(
      container.querySelectorAll(".thread-tags span"),
      {
        autoAlpha: 0,
        duration: 0.35,
        stagger: 0.06,
        y: 10,
      },
      0.9,
    );
}

export function animateCompanionScene(container: HTMLElement): void {
  const timeline = standardReveal(container);

  timeline
    .from(
      container.querySelector(".phone-frame"),
      {
        autoAlpha: 0,
        duration: 0.75,
        filter: "blur(12px)",
        y: 28,
      },
      0.16,
    )
    .from(
      container.querySelectorAll(".phone-chat .bubble, .phone-chat .quote-card"),
      {
        autoAlpha: 0,
        duration: 0.55,
        stagger: 0.16,
        y: 18,
      },
      0.55,
    );
}

export function animateFinalPaywallScene(container: HTMLElement): void {
  // Pinning is reserved for the ending because the interruption is the
  // narrative beat; earlier scenes should keep normal scroll momentum.
  const timeline = sceneTimeline(container, {
    end: "+=80%",
    pin: true,
    scrub: 0.6,
    start: "top top",
  });

  revealSceneCopy(timeline, container);
  revealStage(timeline, container);
  animateCharts(timeline, container, 0.3);

  timeline
    .from(
      container.querySelectorAll(".final-chat .bubble"),
      {
        autoAlpha: 0,
        duration: 0.5,
        stagger: 0.16,
        y: 18,
      },
      0.2,
    )
    .from(
      container.querySelector(".paywall-modal"),
      {
        autoAlpha: 0,
        duration: 0.35,
        scale: 0.92,
        y: 24,
      },
      0.68,
    )
    .from(
      container.querySelector(".final-line"),
      {
        autoAlpha: 0,
        duration: 0.35,
        y: 14,
      },
      0.9,
    );
}
