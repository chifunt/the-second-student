import { addProgressiveChat } from "./progressiveChat";
import { baseReveal, sceneContentPosition } from "./timelineCore";

export function animateTitleScene(container: HTMLElement) {
  return baseReveal(container);
}

export function animateDeliberateWorkflowScene(container: HTMLElement) {
  const timeline = baseReveal(container);
  const contentStart = sceneContentPosition(container);
  const chatStart = contentStart + 0.32;
  const chatDuration = addProgressiveChat(
    timeline,
    container,
    ".studio-stream",
    chatStart,
  );

  timeline
    .to(
      container.querySelector(".file.active"),
      {
        duration: 0.26,
        repeat: 1,
        scale: 1.025,
        transformOrigin: "left center",
        yoyo: true,
      },
      contentStart + 0.18,
    )
    .to(
      container.querySelector(".quote-note"),
      {
        autoAlpha: 1,
        duration: 0.45,
        y: 0,
      },
      chatStart + chatDuration + 0.22,
    );

  return timeline;
}

export function animateBoundaryScene(container: HTMLElement) {
  const timeline = baseReveal(container);
  const contentStart = sceneContentPosition(container);

  timeline
    .from(
      container.querySelectorAll(".sug, .sug-amber"),
      {
        backgroundColor: "rgba(255,255,255,0)",
        duration: 0.5,
        stagger: 0.08,
      },
      contentStart + 0.35,
    )
    .to(
      container.querySelector(".accept-all"),
      {
        duration: 0.28,
        repeat: 1,
        scale: 1.045,
        transformOrigin: "center",
        yoyo: true,
      },
      contentStart + 0.72,
    );

  return timeline;
}

export function animateSkillGapScene(container: HTMLElement) {
  const timeline = baseReveal(container);
  const contentStart = sceneContentPosition(container);

  timeline.to(
    container.querySelectorAll(".vle-card"),
    {
      borderLeftColor: "#e6a23c",
      duration: 0.18,
      stagger: 0.035,
      repeat: 1,
      yoyo: true,
    },
    contentStart + 0.28,
  );

  return timeline;
}
