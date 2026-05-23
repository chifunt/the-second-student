export function animateFakeCursor(
  timeline: gsap.core.Timeline,
  container: HTMLElement,
  position = 0.25,
): void {
  const cursor = container.querySelector(".fake-cursor");

  if (!cursor) {
    return;
  }

  timeline
    .from(
      cursor,
      {
        autoAlpha: 0,
        duration: 0.25,
        x: -80,
        y: 40,
      },
      position,
    )
    .to(
      cursor,
      {
        duration: 0.7,
        ease: "power1.inOut",
        x: 26,
        y: -18,
      },
      position + 0.18,
    );
}
