import type { SceneConfig, StudentMode } from "./sceneTypes";

type SceneAnimate = NonNullable<SceneConfig["animate"]>;

export type SceneMarkup = {
  eyebrow: string;
  title: string;
  dek: string;
  action: string;
  primary: string;
  aside?: string;
};

export function createStaticScene(
  id: string,
  mode: StudentMode,
  markup: SceneMarkup,
  animate?: SceneAnimate,
): SceneConfig {
  return {
    id,
    title: markup.title,
    mode,
    animate,
    render(container) {
      // Scene modules own narrative layout; keeping the shell here gives
      // animation and accessibility hooks a stable contract across scenes.
      container.innerHTML = `
        <div class="scene__inner">
          <div class="scene__copy">
            <p class="scene__eyebrow">${markup.eyebrow}</p>
            <h2 id="${id}-title">${markup.title}</h2>
            <p class="scene__dek">${markup.dek}</p>
            <p class="scene__action">${markup.action}</p>
          </div>
          <div class="scene__stage">
            ${markup.primary}
            ${markup.aside ? `<aside class="scene__aside">${markup.aside}</aside>` : ""}
          </div>
        </div>
      `;
    },
  };
}

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
      container.classList.add(markup.sceneClass);
      container.dataset.mood = markup.mood;
      container.dataset.screenLabel = markup.screenLabel;
      container.innerHTML = markup.body;
    },
  };
}
