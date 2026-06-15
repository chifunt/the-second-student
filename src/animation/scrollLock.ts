export function getScrollTop(): number {
  return Math.max(
    window.scrollY,
    document.documentElement.scrollTop,
    document.body.scrollTop,
  );
}

function getScrollElement(element: HTMLElement): HTMLElement {
  const parent = element.parentElement;

  return parent?.classList.contains("pin-spacer") ? parent : element;
}

export function getElementTop(element: HTMLElement): number {
  const scrollElement = getScrollElement(element);

  return scrollElement.getBoundingClientRect().top + getScrollTop();
}
