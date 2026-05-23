export function revealSceneCopy(
  timeline: gsap.core.Timeline,
  container: HTMLElement,
): void {
  timeline.from(
    container.querySelectorAll(".scene__eyebrow, .scene__copy h2, .scene__dek, .scene__action"),
    {
      autoAlpha: 0,
      duration: 0.7,
      stagger: 0.08,
      y: 22,
    },
    0,
  );
}
