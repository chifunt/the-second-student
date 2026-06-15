import { escapeHtml } from "../charts/chartUtils";
import type { SceneConfig, SceneRenderContext, StudentMode } from "./sceneTypes";

type SceneAnimate = NonNullable<SceneConfig["animate"]>;

type SceneEntryAvatar = {
  src: string;
  alt: string;
};

export type VisualSceneMarkup = {
  id: string;
  mode: StudentMode;
  title: string;
  sceneClass: string;
  mood: "dark" | "bright" | "paper" | "paper-cold";
  screenLabel: string;
  body: string;
  dataFocus?: boolean | "soft";
  entryOverlay?: {
    title: string;
    subject: string;
    meta: string;
    avatars?: readonly SceneEntryAvatar[];
  };
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

function renderDataFocusBody(markup: VisualSceneMarkup): string {
  if (!markup.dataFocus) {
    return markup.body;
  }

  const wash = `<div class="data-focus-wash data-focus-wash--${markup.dataFocus === "soft" ? "soft" : "standard"}" aria-hidden="true"></div>`;

  return markup.body.replace(/(<div class="scene-inner[^"]*">)/, `$1${wash}`);
}

function renderTypedLine(text: string, className: string): string {
  return `<span class="${className}" style="--chars: ${text.length}">${escapeHtml(
    text,
  )}</span>`;
}

function renderEntryAvatars(avatars: readonly SceneEntryAvatar[] | undefined): string {
  if (!avatars?.length) {
    return "";
  }

  return `
    <span class="scene-entry-avatars" aria-hidden="true">
      ${avatars
        .map(
          (avatar) => `
            <img src="${escapeHtml(avatar.src)}" alt="" />
          `,
        )
        .join("")}
    </span>
  `;
}

function renderEntryOverlay(
  overlay: VisualSceneMarkup["entryOverlay"] | undefined,
): string {
  if (!overlay) {
    return "";
  }

  return `
    <div class="scene-entry-overlay" aria-label="Scene opening">
      <div class="scene-entry-card">
        <p class="scene-entry-kicker">session restored</p>
        <h2>${renderTypedLine(overlay.title, "scene-entry-type")}</h2>
        <div class="scene-entry-persona">
          ${renderEntryAvatars(overlay.avatars)}
          <p class="scene-entry-subject">${renderTypedLine(
            overlay.subject,
            "scene-entry-type scene-entry-type--subject",
          )}</p>
        </div>
        <p class="scene-entry-meta">${escapeHtml(overlay.meta)}</p>
        <div class="scene-entry-timer" aria-hidden="true">
          <span class="scene-entry-timer__bar"></span>
        </div>
      </div>
    </div>
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
      if (markup.dataFocus) {
        container.dataset.dataFocus = markup.dataFocus === "soft" ? "soft" : "true";
      }
      if (markup.entryOverlay) {
        container.dataset.entryOverlay = "true";
      }
      container.innerHTML = `${renderDataFocusBody(markup)}${renderEntryOverlay(
        markup.entryOverlay,
      )}${renderScrollHint(markup.sceneClass, context)}`;
    },
  };
}
