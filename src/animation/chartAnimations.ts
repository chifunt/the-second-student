export function animateCharts(
  timeline: gsap.core.Timeline,
  container: HTMLElement,
  position = 0.25,
): void {
  const bars = container.querySelectorAll(".bar-fill");
  const gapLines = container.querySelectorAll(".gap-chart__line");
  const gapDots = container.querySelectorAll(".gap-chart__actual, .gap-chart__expected");
  const ladderRungs = container.querySelectorAll(".ladder-chart__rung");
  const pictogramIcons = container.querySelectorAll(".pictogram__icon");
  const heroConcernParts = container.querySelectorAll(
    ".hero-concern__dial, .hero-concern__strip",
  );
  const workflowItems = container.querySelectorAll(
    ".workflow-map__zone, .workflow-map__item",
  );

  if (bars.length > 0) {
    timeline.from(
      bars,
      {
        duration: 0.75,
        scaleX: 0,
        stagger: 0.05,
        transformOrigin: "left center",
      },
      position,
    );
  }

  if (gapLines.length > 0) {
    timeline.from(
      gapLines,
      {
        duration: 0.7,
        scaleX: 0,
        stagger: 0.12,
        transformOrigin: "left center",
      },
      position,
    );
  }

  if (gapDots.length > 0) {
    timeline.from(
      gapDots,
      {
        duration: 0.45,
        scale: 0,
        stagger: 0.06,
        transformOrigin: "center",
      },
      position + 0.18,
    );
  }

  if (ladderRungs.length > 0) {
    timeline.from(
      ladderRungs,
      {
        autoAlpha: 0,
        duration: 0.45,
        stagger: 0.08,
        x: -18,
      },
      position,
    );
  }

  if (pictogramIcons.length > 0) {
    timeline.from(
      pictogramIcons,
      {
        autoAlpha: 0,
        duration: 0.28,
        scale: 0.72,
        stagger: {
          amount: 0.7,
          from: "start",
          grid: "auto",
        },
        transformOrigin: "center",
      },
      position,
    );
  }

  if (heroConcernParts.length > 0) {
    timeline.from(
      heroConcernParts,
      {
        autoAlpha: 0,
        duration: 0.45,
        stagger: 0.08,
        y: 14,
      },
      position,
    );
  }

  if (workflowItems.length > 0) {
    timeline.from(
      workflowItems,
      {
        autoAlpha: 0,
        duration: 0.4,
        stagger: 0.08,
        y: 16,
      },
      position,
    );
  }
}
