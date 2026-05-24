export function setupDensityTicks(): void {
  document.querySelectorAll<HTMLElement>(".s0-density").forEach((element) => {
    if (element.dataset.ready === "true") {
      return;
    }

    const fill = Number(element.dataset.fill ?? "100");
    const fragment = document.createDocumentFragment();

    for (let index = 0; index < 100; index += 1) {
      const tick = document.createElement("span");
      tick.className = index < fill ? "tick lit" : "tick";
      fragment.appendChild(tick);
    }

    element.appendChild(fragment);
    element.dataset.ready = "true";
  });
}
