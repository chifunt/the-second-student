import { addProgressiveChat } from "./progressiveChat";
import { playSelectionSweep } from "./selectionSweep";
import { baseReveal, sceneContentPosition } from "./timelineCore";

function getCursorTargetDelta(container: HTMLElement): { x: number; y: number } {
  const reader = container.querySelector<HTMLElement>(".s2-reader");
  const cursor = container.querySelector<HTMLElement>(".cursor");
  const copyItem = container.querySelector<HTMLElement>(".context-menu .copy");

  if (!reader || !cursor || !copyItem) {
    return { x: 0, y: 0 };
  }

  const readerBox = reader.getBoundingClientRect();
  const copyBox = copyItem.getBoundingClientRect();
  const targetLeft = copyBox.left - readerBox.left + Math.min(58, copyBox.width * 0.34);
  const targetTop = copyBox.top - readerBox.top + copyBox.height / 2 - 2;

  return {
    x: targetLeft - cursor.offsetLeft,
    y: targetTop - cursor.offsetTop,
  };
}

export function animateEmailScene(container: HTMLElement) {
  const timeline = baseReveal(container);
  const contentStart = sceneContentPosition(container);
  const targetRow = container.querySelector(".email-list .row.target");

  timeline
    .to(
      targetRow,
      {
        duration: 0.28,
        repeat: 1,
        scale: 1.012,
        transformOrigin: "left center",
        yoyo: true,
      },
      contentStart + 0.18,
    )
    .to(
      container.querySelector(".email-reader"),
      {
        boxShadow: "0 0 0 1px rgba(230, 162, 60, 0.24), 0 22px 56px rgba(0, 0, 0, 0.24)",
        duration: 0.32,
        repeat: 1,
        yoyo: true,
      },
      contentStart + 0.32,
    );

  return timeline;
}

export function animatePanicButtonScene(container: HTMLElement) {
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
        force3D: true,
        x: () => getCursorTargetDelta(container).x,
        y: () => getCursorTargetDelta(container).y,
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

  return timeline;
}

export function animatePanicChatScene(container: HTMLElement) {
  const timeline = baseReveal(container);
  addProgressiveChat(
    timeline,
    container,
    ".chat-stream",
    sceneContentPosition(container, 0.32),
  );

  return timeline;
}

export function animateDependencyScene(container: HTMLElement) {
  const timeline = baseReveal(container);
  const contentStart = sceneContentPosition(container);
  const themes = container.querySelector(".dep-themes");
  const themeChips = container.querySelectorAll(".dep-themes .chip");
  const privateNote = container.querySelector(".dep-private-note");
  const chatDuration = addProgressiveChat(
    timeline,
    container,
    ".dep-stream",
    contentStart + 0.28,
  );

  if (themes) {
    timeline.to(
      themes,
      {
        autoAlpha: 1,
        duration: 0.3,
        y: 0,
      },
      contentStart + chatDuration + 0.42,
    );
  }

  timeline
    .to(
      themeChips,
      {
        autoAlpha: 1,
        duration: 0.3,
        stagger: 0.04,
        y: 0,
      },
      contentStart + chatDuration + 0.55,
    )
    .to(
      privateNote,
      {
        autoAlpha: 1,
        duration: 0.35,
        y: 0,
      },
      contentStart + chatDuration + 0.82,
    );

  return timeline;
}

export function animateCompanionScene(container: HTMLElement) {
  const timeline = baseReveal(container);
  const contentStart = sceneContentPosition(container);

  addProgressiveChat(timeline, container, ".phone-stream", contentStart + 0.58);

  return timeline;
}
