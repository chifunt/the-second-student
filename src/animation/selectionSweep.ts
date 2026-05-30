import { schedule } from "./runtimeEffects";

const CHARACTER_DELAY_MS = 1.2;

function prepareSelectionBody(body: HTMLElement): void {
  if (body.dataset.prepped === "true") {
    return;
  }

  const walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  let current = walker.nextNode();

  while (current) {
    textNodes.push(current as Text);
    current = walker.nextNode();
  }

  textNodes.forEach((node) => {
    const fragment = document.createDocumentFragment();

    for (const character of node.textContent ?? "") {
      const span = document.createElement("span");
      span.className = "s2-char";
      span.textContent = character;
      fragment.appendChild(span);
    }

    node.replaceWith(fragment);
  });

  body.dataset.prepped = "true";
}

export function playSelectionSweep(container: HTMLElement): void {
  const body = container.querySelector<HTMLElement>(".email-body");

  if (!body) {
    return;
  }

  prepareSelectionBody(body);
  body.classList.remove("is-selected");
  body
    .querySelectorAll<HTMLElement>(".s2-char.sel")
    .forEach((char) => char.classList.remove("sel"));

  const chars = Array.from(body.querySelectorAll<HTMLElement>(".s2-char"));

  chars.forEach((char, index) => {
    schedule(() => char.classList.add("sel"), index * CHARACTER_DELAY_MS);
  });
  schedule(() => body.classList.add("is-selected"), chars.length * CHARACTER_DELAY_MS);
}

export function setupSelectionSweep(reduceMotion: boolean): void {
  const scene = document.querySelector<HTMLElement>(".s2");
  const body = scene?.querySelector<HTMLElement>(".email-body");

  if (!body) {
    return;
  }

  prepareSelectionBody(body);
  body
    .querySelectorAll<HTMLElement>(".s2-char.sel")
    .forEach((char) => char.classList.remove("sel"));
  body.classList.toggle("is-selected", reduceMotion);
}
