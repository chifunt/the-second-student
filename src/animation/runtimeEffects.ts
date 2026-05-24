export type Cancelable = {
  cancel: () => void;
};

const activeTimers: number[] = [];
const activeLoops: Cancelable[] = [];

export function clearRuntimeEffects(): void {
  activeTimers.splice(0).forEach((timer) => window.clearTimeout(timer));
  activeLoops.splice(0).forEach((loop) => loop.cancel());
}

export function schedule(callback: () => void, delay: number): void {
  activeTimers.push(window.setTimeout(callback, delay));
}

export function trackLoop(loop: Cancelable): void {
  activeLoops.push(loop);
}
