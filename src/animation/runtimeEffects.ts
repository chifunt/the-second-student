export type Cancelable = {
  cancel: () => void;
};

const activeTimers: number[] = [];
const activeLoops: Cancelable[] = [];
const activeCleanups: Array<() => void> = [];

export function clearRuntimeEffects(): void {
  activeTimers.splice(0).forEach((timer) => window.clearTimeout(timer));
  activeLoops.splice(0).forEach((loop) => loop.cancel());
  activeCleanups.splice(0).forEach((cleanup) => cleanup());
}

export function schedule(callback: () => void, delay: number): void {
  activeTimers.push(window.setTimeout(callback, delay));
}

export function trackLoop(loop: Cancelable): void {
  activeLoops.push(loop);
}

export function trackCleanup(cleanup: () => void): void {
  activeCleanups.push(cleanup);
}
