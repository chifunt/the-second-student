import { addProgressiveChat } from "./progressiveChat";
import { baseReveal, sceneContentPosition } from "./timelineCore";

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

export function animateDeliberateWorkflowScene(container: HTMLElement): void {
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
    .from(
      container.querySelectorAll(".file"),
      {
        autoAlpha: 0,
        duration: 0.3,
        stagger: 0.04,
        x: -12,
      },
      contentStart + 0.18,
    )
    .from(
      container.querySelector(".quote-note"),
      {
        autoAlpha: 0,
        duration: 0.45,
        y: 18,
      },
      chatStart + chatDuration + 0.22,
    );
}

export function animateBoundaryScene(container: HTMLElement): void {
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
    .from(
      container.querySelectorAll(".threshold-summary > div, .threshold-note, .rung"),
      {
        autoAlpha: 0,
        duration: 0.35,
        stagger: 0.07,
        x: 18,
      },
      contentStart + 0.48,
    );
}

export function animateSkillGapScene(container: HTMLElement): void {
  const timeline = baseReveal(container);
  const contentStart = sceneContentPosition(container);

  timeline.from(
    container.querySelectorAll(".vle-card"),
    {
      autoAlpha: 0,
      duration: 0.35,
      stagger: 0.06,
      y: 16,
    },
    contentStart + 0.28,
  );
}
