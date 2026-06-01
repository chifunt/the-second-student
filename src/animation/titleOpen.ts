import { getScrollTop } from "./scrollLock";
import { requestStoryNavigation } from "./sceneSnap";

export function setupTitleOpen(reduceMotion: boolean): void {
  const titleScene = document.querySelector<HTMLElement>(".s0");
  const button = document.querySelector<HTMLButtonElement>(".s0-open");
  const next = document.querySelector<HTMLElement>(".s1");

  if (!titleScene || !button || !next) {
    return;
  }

  const startsOnTitle =
    !window.location.hash || window.location.hash === `#${titleScene.id}`;

  if (!reduceMotion && startsOnTitle && getScrollTop() < 8) {
    document.body.classList.add("scroll-locked");
  }

  button.addEventListener("click", () => {
    titleScene.classList.add("opened");
    document.body.classList.remove("scroll-locked");

    if (reduceMotion) {
      next.scrollIntoView({ behavior: "auto" });
      return;
    }

    requestStoryNavigation({ targetId: next.id });
  });
}
