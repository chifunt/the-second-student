import { addProgressiveChat } from "./progressiveChat";
import { playDataFocus, sceneContentPosition, sceneTimeline } from "./timelineCore";

export function animateSplitExperienceScene(container: HTMLElement): void {
  let hasCompleted = false;
  const timelineRef: { current?: ReturnType<typeof sceneTimeline> } = {};
  const completeScene = (): void => {
    if (hasCompleted) {
      return;
    }

    hasCompleted = true;
    container.classList.add("split-experience-complete");
    timelineRef.current?.progress(1);
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
    start: "top 2%",
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
  const contentStart = sceneContentPosition(container);
  const chatDuration = addProgressiveChat(
    timeline,
    container,
    ".reflect-body",
    contentStart,
    { completeClass: "chat-progressive-complete" },
  );

  playDataFocus(timeline, container, 0);

  timeline.from(
    container.querySelector(".continue-btn"),
    {
      duration: 0.34,
      scale: 0.96,
      y: 12,
    },
    contentStart + chatDuration + 0.18,
  );
}
