import { animatePanicButtonScene } from "../animation/sceneTransitions";
import { renderProgressBars } from "../charts/progressBars";
import { stats } from "../data/surveyStats";
import { renderWindowChrome } from "../ui/windowChrome";
import { createStaticScene } from "./createScene";

export const panicButtonScene = createStaticScene(
  "panic-button-scene",
  "reactive",
  {
    eyebrow: "Copy as coping",
    title: "Panic Button",
    dek: "The email becomes raw material for reassurance, pasted before it is understood.",
    action: "Student action: highlights the message and copies it into an AI chat.",
    primary: renderWindowChrome({
      title: "Selected text",
      meta: "Right-click menu open",
      body: `
        <div class="copy-workbench">
          <article class="copied-email">
            <p><span class="selected-text">Please review the attached guidance and respond by 17:00. You may wish to provide notes about your process, sources consulted, and any digital tools used.</span></p>
            <span class="fake-cursor" aria-hidden="true"></span>
          </article>
          <div class="context-menu" role="presentation">
            <span class="context-menu__active">Copy</span>
            <span>Ask assistant</span>
            <span>Search web</span>
          </div>
          <div class="clipboard-preview">
            <strong>Clipboard</strong>
            <p>Please explain what this means and tell me if I am in trouble.</p>
          </div>
        </div>
      `,
    }),
    aside: renderProgressBars(
      [
        {
          label: "Use GenAI to help with assessed work",
          value: stats.adoption.genAiAssessment,
        },
      ],
      { title: "Assessment work is already AI-mediated", tone: "mixed" },
    ),
  },
  animatePanicButtonScene,
);
