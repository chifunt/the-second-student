import { schedule, trackLoop } from "./runtimeEffects";

export function setupFakeTyping(): void {
  document.querySelectorAll<HTMLElement>("[data-fake-type]").forEach((element) => {
    const text = element.dataset.fakeType ?? "";
    let index = 0;
    let cancelled = false;

    function tick(): void {
      if (cancelled) {
        return;
      }

      element.textContent = text.slice(0, index);
      index = index >= text.length ? 0 : index + 1;
      schedule(tick, index === 0 ? 2400 : 70);
    }

    schedule(tick, 1200);
    trackLoop({ cancel: () => (cancelled = true) });
  });
}
