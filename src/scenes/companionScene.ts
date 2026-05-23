import { animateCompanionScene } from "../animation/sceneTransitions";
import { renderDivergingBar } from "../charts/divergingBar";
import { renderProgressBars } from "../charts/progressBars";
import { stats } from "../data/surveyStats";
import { renderWindowChrome } from "../ui/windowChrome";
import { createStaticScene } from "./createScene";

export const companionScene = createStaticScene(
  "companion-scene",
  "reactive",
  {
    eyebrow: "02:13",
    title: "Company at 2AM",
    dek: "The chat is no longer just academic support. It is company in a room that feels too quiet.",
    action: "Student action: asks the assistant to stay while they finish.",
    primary: renderWindowChrome({
      title: "Mobile companion chat",
      meta: "student_047 / phone",
      body: `
      <div class="phone-frame">
        <div class="phone-status">
          <span>02:13</span>
          <span>deadline mode</span>
        </div>
        <div class="phone-chat">
          <p class="bubble bubble--user">can you just stay while i finish this</p>
          <p class="bubble bubble--assistant">First, breathe. I can keep you company while you work through the next paragraph.</p>
          <p class="bubble bubble--user">dont solve it. just keep me on task</p>
          <p class="quote-card">"It keeps me company."</p>
        </div>
        <div class="phone-input">message...</div>
      </div>
    `,
    }),
    aside: `
    ${renderProgressBars(
      [
        {
          label: "Use AI for companionship, advice or loneliness",
          value: stats.loneliness.companionshipUse,
        },
      ],
      { title: "Companionship use", tone: "mixed" },
    )}
    ${renderDivergingBar(
      {
        lessLabel: "less lonely",
        lessValue: stats.loneliness.lessLonely,
        neutralLabel: "no impact",
        neutralValue: stats.loneliness.noImpact,
        moreLabel: "more lonely",
        moreValue: stats.loneliness.moreLonely,
      },
      { title: "Effect on loneliness", tone: "mixed" },
    )}
  `,
  },
  animateCompanionScene,
);
