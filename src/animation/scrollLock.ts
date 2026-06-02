import { trackCleanup } from "./runtimeEffects";

const LOCKED_KEYS = new Set([
  " ",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "End",
  "Home",
  "PageDown",
  "PageUp",
]);

let activeUnlock: (() => void) | undefined;

export function getScrollTop(): number {
  return Math.max(
    window.scrollY,
    document.documentElement.scrollTop,
    document.body.scrollTop,
  );
}

export function setScrollTop(top: number): void {
  window.scrollTo(0, top);
  document.documentElement.scrollTop = top;
  document.body.scrollTop = top;
}

function getScrollElement(element: HTMLElement): HTMLElement {
  const parent = element.parentElement;

  return parent?.classList.contains("pin-spacer") ? parent : element;
}

export function getElementTop(element: HTMLElement): number {
  const scrollElement = getScrollElement(element);

  return scrollElement.getBoundingClientRect().top + getScrollTop();
}

export function lockScrollAt(top: number): () => void {
  activeUnlock?.();

  let locked = true;
  let frame = 0;
  const html = document.documentElement;
  const body = document.body;
  const previousHtmlBehavior = html.style.scrollBehavior;
  const previousBodyBehavior = body.style.scrollBehavior;

  html.style.scrollBehavior = "auto";
  body.style.scrollBehavior = "auto";
  body.classList.add("scroll-pinned");

  const pin = () => {
    if (locked) {
      setScrollTop(top);
    }
  };

  const prevent = (event: Event) => {
    event.preventDefault();
    pin();
  };

  const preventKey = (event: KeyboardEvent) => {
    if (LOCKED_KEYS.has(event.key)) {
      event.preventDefault();
      pin();
    }
  };

  const onScroll = () => {
    window.cancelAnimationFrame(frame);
    frame = window.requestAnimationFrame(pin);
  };

  const options = { capture: true, passive: false } as const;

  window.addEventListener("wheel", prevent, options);
  window.addEventListener("touchmove", prevent, options);
  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("keydown", preventKey, true);
  pin();

  const unlock = () => {
    if (!locked) {
      return;
    }

    locked = false;
    window.cancelAnimationFrame(frame);
    window.removeEventListener("wheel", prevent, options);
    window.removeEventListener("touchmove", prevent, options);
    window.removeEventListener("scroll", onScroll);
    document.removeEventListener("keydown", preventKey, true);
    html.style.scrollBehavior = previousHtmlBehavior;
    body.style.scrollBehavior = previousBodyBehavior;
    body.classList.remove("scroll-pinned");
    setScrollTop(top);
    window.dispatchEvent(new CustomEvent("second-student:scroll-unlocked"));

    if (activeUnlock === unlock) {
      activeUnlock = undefined;
    }
  };

  activeUnlock = unlock;
  trackCleanup(unlock);

  return unlock;
}
