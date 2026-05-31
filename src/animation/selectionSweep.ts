import { schedule } from "./runtimeEffects";

const LINE_GAP_MS = 22;

function getLineDuration(line: HTMLElement): number {
  const length = (line.textContent ?? "").trim().length;

  return Math.min(Math.max(length * 2.8, 110), 280);
}

function prepareSelectionBody(body: HTMLElement): void {
  if (body.dataset.prepped === "true") {
    return;
  }

  const blocks = body.querySelectorAll<HTMLElement>(":scope > p, :scope .signature p");

  blocks.forEach((block) => {
    const wrapper = document.createElement("span");

    wrapper.className = "s2-select-line";
    wrapper.style.setProperty("--s2-selection-duration", `${getLineDuration(block)}ms`);

    while (block.firstChild) {
      wrapper.appendChild(block.firstChild);
    }

    block.appendChild(wrapper);
  });

  body.dataset.prepped = "true";
}

function resetSelection(lines: HTMLElement[], body: HTMLElement): void {
  body.classList.remove("is-selecting", "is-selected");
  lines.forEach((line) => line.classList.remove("s2-select-line--active"));
}

export function playSelectionSweep(container: HTMLElement): void {
  const body = container.querySelector<HTMLElement>(".email-body");

  if (!body) {
    return;
  }

  prepareSelectionBody(body);
  const lines = Array.from(body.querySelectorAll<HTMLElement>(".s2-select-line"));
  let elapsed = 0;

  resetSelection(lines, body);
  body.classList.add("is-selecting");

  lines.forEach((line) => {
    const duration = getLineDuration(line);
    line.style.setProperty("--s2-selection-duration", `${duration}ms`);
    schedule(() => line.classList.add("s2-select-line--active"), elapsed);
    elapsed += duration + LINE_GAP_MS;
  });

  schedule(() => {
    body.classList.remove("is-selecting");
    body.classList.add("is-selected");
  }, elapsed);
}

export function setupSelectionSweep(reduceMotion: boolean): void {
  const scene = document.querySelector<HTMLElement>(".s2");
  const body = scene?.querySelector<HTMLElement>(".email-body");

  if (!body) {
    return;
  }

  prepareSelectionBody(body);
  const lines = Array.from(body.querySelectorAll<HTMLElement>(".s2-select-line"));

  resetSelection(lines, body);
  lines.forEach((line) => line.classList.toggle("s2-select-line--active", reduceMotion));
  body.classList.toggle("is-selected", reduceMotion);
}
