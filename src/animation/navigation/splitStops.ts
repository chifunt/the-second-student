import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getElementTop, getScrollTop } from "../scrollLock";

export const SPLIT_STEPS = [0, 0.33, 0.66, 1] as const;

function getSplitTrigger(splitScene: HTMLElement | undefined): ScrollTrigger | undefined {
  if (!splitScene) {
    return undefined;
  }

  return ScrollTrigger.getAll().find(
    (trigger) => trigger.trigger === splitScene && Boolean(trigger.vars.pin),
  );
}

function getSplitProgress(splitScene: HTMLElement | undefined): number {
  const trigger = getSplitTrigger(splitScene);

  if (!trigger || trigger.end === trigger.start) {
    return 0;
  }

  return Math.min(
    1,
    Math.max(0, (getScrollTop() - trigger.start) / (trigger.end - trigger.start)),
  );
}

export function getClosestSplitStep(splitScene: HTMLElement | undefined): number {
  const progress = getSplitProgress(splitScene);
  let closestStep = 0;
  let closestDistance = Number.POSITIVE_INFINITY;

  SPLIT_STEPS.forEach((stepProgress, step) => {
    const distance = Math.abs(progress - stepProgress);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestStep = step;
    }
  });

  return closestStep;
}

export function getSplitStepTop(splitScene: HTMLElement, step: number): number {
  const trigger = getSplitTrigger(splitScene);
  const progress = SPLIT_STEPS[Math.min(Math.max(step, 0), SPLIT_STEPS.length - 1)];

  if (!trigger) {
    return getElementTop(splitScene);
  }

  return trigger.start + (trigger.end - trigger.start) * progress;
}

export function setSplitCompletion(
  splitScene: HTMLElement | undefined,
  step: number,
): void {
  if (!splitScene) {
    return;
  }

  const isComplete = step >= SPLIT_STEPS.length - 1;
  splitScene.classList.toggle("split-experience-complete", isComplete);
  splitScene.classList.toggle("scene-animation-complete", isComplete);
}
