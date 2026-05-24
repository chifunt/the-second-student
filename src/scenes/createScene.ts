import type { SceneConfig, StudentMode } from "./sceneTypes";

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

export function createVisualScene(markup: VisualSceneMarkup): SceneConfig {
  return {
    id: markup.id,
    title: markup.title,
    mode: markup.mode,
    animate: markup.animate,
    render(container) {
      // Scene modules keep narrative markup close to the story beat; the shared
      // wrapper only adds stable hooks used by theming, navigation, and motion.
      container.classList.add(markup.sceneClass);
      container.dataset.mood = markup.mood;
      container.dataset.screenLabel = markup.screenLabel;
      container.innerHTML = markup.body;
    },
  };
}
