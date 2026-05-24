import { animateCompanionScene } from "../animation/sceneTransitions";
import { renderCompanionAnchor } from "../charts/companionAnchor";
import { renderDivergingBar } from "../charts/divergingBar";
import { copy } from "../data/copy";
import { stats } from "../data/surveyStats";
import { createVisualScene } from "./createScene";

export const companionScene = createVisualScene({
  id: "companion-scene",
  title: "Company at 2AM",
  mode: "reactive",
  sceneClass: "s8",
  mood: "dark",
  screenLabel: "08 Company at 2AM",
  animate: animateCompanionScene,
  body: `
    <div class="chyron"><span class="num">08</span><span class="sep">/</span><span>Company at 2AM</span></div>
    <div class="scene-inner">
      <div class="phone-stage">
        <div class="phone">
          <div class="notch"></div>
          <div class="phone-screen">
            <div class="phone-status"><span>02:13</span><span>4%</span></div>
            <div class="phone-header">
              <div class="ava">A</div>
              <div class="name">assist</div>
              <div class="status">always on - always here</div>
            </div>
            <div class="phone-stream">
              <div class="ts">- 2:13 AM -</div>
              <div class="phone-bubble user">can you just stay while i finish this</div>
              <div class="phone-bubble bot"><div class="first-line">It is not stupid. You are not being dramatic.</div><span>I can stay while you work. First, breathe. Then do the next small thing.</span></div>
              <div class="phone-bubble user blink">i think i'm losing it</div>
              <div class="phone-bubble bot">You are not losing it. You are tired and the deadline is real. Tell me what's open in front of you - one document, one sentence - and we'll start there.</div>
            </div>
            <div class="phone-input">Type a message...</div>
          </div>
        </div>
        <div class="s8-aside">
          <h2 id="companion-scene-title">"${copy.quotes.company}"</h2>
          <p class="lead">${stats.loneliness.companionshipUse}% of students use AI for friendship, company, advice, or tackling loneliness. The effect on how lonely they feel is almost evenly split.</p>
          ${renderCompanionAnchor({
            title: "Companionship use",
            tone: "mixed",
            value: stats.loneliness.companionshipUse,
            label: "use AI for friendship, company, advice or tackling loneliness",
          })}
          ${renderDivergingBar(
            {
              lessLabel: "less lonely",
              lessValue: stats.loneliness.lessLonely,
              neutralLabel: "no impact",
              neutralValue: stats.loneliness.noImpact,
              moreLabel: "more lonely",
              moreValue: stats.loneliness.moreLonely,
            },
            {
              title: "Effect of AI use on loneliness",
              tone: "mixed",
            },
          )}
          <div class="small-data"><span>${stats.loneliness.companionshipUse}% use AI for friendship / company / advice</span><span>n = 1,054</span></div>
        </div>
      </div>
    </div>
  `,
});
