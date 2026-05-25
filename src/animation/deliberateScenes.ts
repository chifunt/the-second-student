import { baseReveal } from "./timelineCore";

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
      container.querySelectorAll(".threshold-summary > div, .threshold-note, .rung"),
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
