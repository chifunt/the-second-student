import { ScrollTrigger } from "gsap/ScrollTrigger";
import { schedule } from "./runtimeEffects";

export function setupSelectionSweep(reduceMotion: boolean): void {
  const scene = document.querySelector<HTMLElement>(".s2");
  const body = scene?.querySelector<HTMLElement>(".email-body");

  if (!scene || !body || body.dataset.prepped === "true") {
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

  ScrollTrigger.create({
    trigger: scene,
    start: "top 45%",
    once: true,
    onEnter: () => {
      const chars = Array.from(body.querySelectorAll<HTMLElement>(".s2-char"));

      if (reduceMotion) {
        body.classList.add("is-selected");
        return;
      }

      chars.forEach((char, index) => {
        schedule(() => char.classList.add("sel"), 500 + index * 5);
      });
      schedule(() => body.classList.add("is-selected"), 500 + chars.length * 5);
    },
  });
}
