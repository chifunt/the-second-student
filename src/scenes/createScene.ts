import { escapeHtml } from "../charts/chartUtils";
import type { SceneConfig, SceneRenderContext, StudentMode } from "./sceneTypes";

type SceneAnimate = NonNullable<SceneConfig["animate"]>;

export type VisualSceneMarkup = {
  id: string;
  mode: StudentMode;
  title: string;
  sceneClass: string;
  mood: "dark" | "bright" | "paper" | "paper-cold";
  screenLabel: string;
  body: string;
  animate?: SceneAnimate;
};

function renderScrollHint(
  sceneClass: string,
  context: SceneRenderContext | undefined,
): string {
  const sceneNumber = Number(sceneClass.match(/^s(\d+)$/)?.[1] ?? NaN);

  if (sceneNumber < 1 || sceneNumber > 9 || !context?.nextScene) {
    return "";
  }

  return `
    <button
      class="scroll-hint"
      type="button"
      data-target="${escapeHtml(context.nextScene.id)}"
      aria-label="Continue to ${escapeHtml(context.nextScene.title)}"
    >
      Continue<span class="scroll-hint__arrow"></span>
    </button>
  `;
}

export function createVisualScene(markup: VisualSceneMarkup): SceneConfig {
  return {
    id: markup.id,
    title: markup.title,
    mode: markup.mode,
    animate: markup.animate,
    render(container, context) {
      // Scene modules keep narrative markup close to the story beat; the shared
      // wrapper only adds stable hooks used by theming, navigation, and motion.
      container.classList.add(markup.sceneClass);
      container.dataset.mood = markup.mood;
      container.dataset.screenLabel = markup.screenLabel;
      container.innerHTML = `${markup.body}${renderScrollHint(
        markup.sceneClass,
        context,
      )}`;
    },
  };
}
