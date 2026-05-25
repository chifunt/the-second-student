import { sceneTimeline } from "./timelineCore";

export function animateSplitExperienceScene(container: HTMLElement): void {
  let hasCompleted = false;
  const timelineRef: { current?: ReturnType<typeof sceneTimeline> } = {};
  const completeScene = (): void => {
    if (hasCompleted) {
      return;
    }

    hasCompleted = true;
    container.classList.add("split-experience-complete");
    timelineRef.current?.progress(1).pause();

    requestAnimationFrame(() => {
      // Once the mirror scene has landed, remove the long pinned spacer so
      // backward scrolling returns to normal page movement instead of replaying
      // an invisible scrub range.
      timelineRef.current?.scrollTrigger?.kill(true);
    });
  };

  const timeline = sceneTimeline(container, {
    end: "+=220%",
    onEnterBack: () => {
      if (hasCompleted) {
        timelineRef.current?.progress(1);
      }
    },
    onLeave: completeScene,
    onUpdate: (self) => {
      if (hasCompleted && self.progress < 1) {
        timelineRef.current?.progress(1);
      }
    },
    pin: true,
    scrub: 0.8,
    start: "top top",
  });
  timelineRef.current = timeline;

  timeline
    .fromTo(
      container.querySelector(".split-side--deliberate"),
      {
        autoAlpha: 0,
        y: 22,
      },
      {
        autoAlpha: 1,
        duration: 0.55,
        y: 0,
      },
      0.45,
    )
    .to(
      container.querySelectorAll(".split-chart .seg--neutral, .split-chart .seg--risk"),
      {
        autoAlpha: 0.35,
        duration: 0.45,
      },
      0.55,
    )
    .to(
      container.querySelector(".split-chart .seg--support"),
      {
        duration: 0.45,
        filter: "drop-shadow(0 0 18px rgba(47, 142, 139, 0.55))",
        scaleY: 1.08,
      },
      0.55,
    )
    .fromTo(
      container.querySelector(".split-side--reactive"),
      {
        autoAlpha: 0,
        y: 22,
      },
      {
        autoAlpha: 1,
        duration: 0.55,
        y: 0,
      },
      1.45,
    )
    .to(
      container.querySelector(".split-side--deliberate"),
      {
        autoAlpha: 0.68,
        duration: 0.45,
        filter: "blur(1px)",
      },
      1.6,
    )
    .to(
      container.querySelectorAll(
        ".split-chart .seg--support, .split-chart .seg--neutral",
      ),
      {
        autoAlpha: 0.35,
        duration: 0.45,
        filter: "none",
        scaleY: 1,
      },
      1.6,
    )
    .to(
      container.querySelector(".split-chart .seg--risk"),
      {
        autoAlpha: 1,
        duration: 0.45,
        filter: "drop-shadow(0 0 18px rgba(107, 91, 138, 0.65))",
        scaleY: 1.08,
      },
      1.6,
    )
    .to(
      container.querySelectorAll(".split-side, .split-chart .seg"),
      {
        autoAlpha: 1,
        duration: 0.55,
        filter: "none",
        scaleY: 1,
      },
      2.35,
    )
    .to(
      container.querySelector(".split-final-caption"),
      {
        autoAlpha: 1,
        duration: 0.45,
        y: 0,
      },
      2.55,
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
      container.querySelector(".s10-outro"),
      {
        autoAlpha: 0,
        duration: 0.35,
        y: 18,
      },
      0.6,
    );
}
