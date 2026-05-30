import { addProgressiveChat } from "./progressiveChat";
import { playSelectionSweep } from "./selectionSweep";
import { baseReveal, sceneContentPosition } from "./timelineCore";

function getCursorTarget(container: HTMLElement): { left: number; top: number } {
  const reader = container.querySelector<HTMLElement>(".s2-reader");
  const copyItem = container.querySelector<HTMLElement>(".context-menu .copy");

  if (!reader || !copyItem) {
    return { left: 0, top: 0 };
  }

  const readerBox = reader.getBoundingClientRect();
  const copyBox = copyItem.getBoundingClientRect();

  return {
    left: copyBox.left - readerBox.left + Math.min(58, copyBox.width * 0.34),
    top: copyBox.top - readerBox.top + copyBox.height / 2 - 2,
  };
}

export function animateEmailScene(container: HTMLElement): void {
  const timeline = baseReveal(container);
  const contentStart = sceneContentPosition(container);

  timeline
    .from(
      container.querySelectorAll(".email-list .row"),
      {
        autoAlpha: 0,
        duration: 0.35,
        stagger: 0.05,
        x: -18,
      },
      contentStart + 0.18,
    )
    .from(
      container.querySelector(".email-reader"),
      {
        autoAlpha: 0,
        duration: 0.55,
        x: 24,
      },
      contentStart + 0.32,
    );
}

export function animatePanicButtonScene(container: HTMLElement): void {
  const timeline = baseReveal(container);
  const contentStart = sceneContentPosition(container);
  const cursor = container.querySelector(".cursor");
  const contextMenu = container.querySelector(".context-menu");
  const copyItem = container.querySelector(".context-menu .copy");

  timeline
    .fromTo(
      cursor,
      { autoAlpha: 0, x: -24, y: -18 },
      { autoAlpha: 1, duration: 0.25, x: 0, y: 0 },
      contentStart + 0.15,
    )
    .to(
      cursor,
      {
        duration: 1.9,
        ease: "power1.inOut",
        left: () => `${getCursorTarget(container).left}px`,
        top: () => `${getCursorTarget(container).top}px`,
      },
      contentStart + 0.45,
    )
    .add(() => playSelectionSweep(container), contentStart + 0.45)
    .fromTo(
      contextMenu,
      {
        autoAlpha: 0,
        y: 8,
      },
      {
        autoAlpha: 1,
        duration: 0.35,
        y: 0,
      },
      contentStart + 2.35,
    )
    .to(
      copyItem,
      { duration: 0.12, scale: 0.985, transformOrigin: "center" },
      contentStart + 2.62,
    )
    .to(copyItem, { duration: 0.18, scale: 1 }, contentStart + 2.74)
    .to(
      container.querySelector(".s2-overlay .callout"),
      {
        autoAlpha: 1,
        duration: 0.45,
        y: 0,
      },
      contentStart + 2.7,
    );
}

export function animatePanicChatScene(container: HTMLElement): void {
  const timeline = baseReveal(container);
  addProgressiveChat(
    timeline,
    container,
    ".chat-stream",
    sceneContentPosition(container, 0.32),
  );
}

export function animateDependencyScene(container: HTMLElement): void {
  const timeline = baseReveal(container);
  const contentStart = sceneContentPosition(container);
  const chatDuration = addProgressiveChat(
    timeline,
    container,
    ".dep-stream",
    contentStart + 0.28,
  );

  timeline.from(
    container.querySelectorAll(".chip, .quote-card"),
    {
      autoAlpha: 0,
      duration: 0.35,
      stagger: 0.05,
      y: 12,
    },
    contentStart + chatDuration + 0.5,
  );
}

export function animateCompanionScene(container: HTMLElement): void {
  const timeline = baseReveal(container);
  const contentStart = sceneContentPosition(container);

  timeline.from(
    container.querySelector(".phone"),
    {
      autoAlpha: 0,
      duration: 0.75,
      filter: "blur(12px)",
      y: 32,
    },
    contentStart + 0.14,
  );

  addProgressiveChat(timeline, container, ".phone-stream", contentStart + 0.58);
}
