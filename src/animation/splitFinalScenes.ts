import { addProgressiveChat } from "./progressiveChat";
import { playDataFocus, sceneContentPosition, sceneTimeline } from "./timelineCore";

export function animateSplitExperienceScene(container: HTMLElement) {
  const updateCompletion = (progress: number): void => {
    const isComplete = progress >= 0.98;
    container.classList.toggle("split-experience-complete", isComplete);
    container.classList.toggle("scene-animation-complete", isComplete);
  };
  const markPinSpacer = (): void => {
    const parent = container.parentElement;

    // The stable spacer is the snap anchor; the pinned scene itself stays
    // outside native snap so ScrollTrigger can own the internal scrub.
    if (parent?.classList.contains("pin-spacer")) {
      parent.classList.add("split-experience-pin-spacer");
    }
  };
  const timeline = sceneTimeline(container, {
    end: "+=220%",
    onLeave: () => updateCompletion(1),
    onUpdate: (self) => updateCompletion(self.progress),
    pin: true,
    scrub: 0.8,
    start: "top top",
  });

  markPinSpacer();
  window.requestAnimationFrame(markPinSpacer);

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

  return timeline;
}

export function animateFinalPaywallScene(container: HTMLElement) {
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

  return timeline;
}
