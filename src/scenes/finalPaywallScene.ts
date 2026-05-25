import { animateFinalPaywallScene } from "../animation/sceneTransitions";
import { renderEvidenceAttributes } from "../charts/chartUtils";
import { copy } from "../data/copy";
import { evidence } from "../data/evidence";
import { createVisualScene } from "./createScene";

const recapCards = [
  ["adoption", "95", "use AI in at least one way"],
  ["assessment", "94", "use GenAI for assessed work"],
  ["better", "49", "say AI made experience better"],
  ["worse", "16", "say AI made experience worse"],
  ["skills", "68", "say AI skills are essential"],
  ["support", "48", "feel supported by teaching staff"],
] as const;

export const finalPaywallScene = createVisualScene({
  id: "final-paywall-scene",
  title: copy.finalQuestion,
  mode: "ambiguous",
  sceneClass: "s10",
  mood: "paper",
  screenLabel: "10 Critical Thinking",
  animate: animateFinalPaywallScene,
  body: `
    <div class="chyron"><span class="num">10</span><span class="sep">/</span><span>Is my critical thinking gone?</span></div>
    <div class="scene-inner">
      <div class="reflect">
        <div class="reflect-bar">
          <div class="brand">reflect</div>
          <div class="center">thread #14 - <span class="free-counter"><span data-msg-counter>0</span> free messages remaining</span></div>
          <div class="right">02:46</div>
        </div>
        <div class="reflect-body">
          <div class="msg user">is my critical thinking gone?</div>
          <div class="msg bot">
            <div class="first-line">${copy.finalResponse[0]}</div>
            <p>${copy.finalResponse[1]}</p>
            <p>${copy.finalResponse[2]} The clearer the trace of your own thought - your reading, your hesitation, your edits, your push-back - the more the work is still yours.</p>
          </div>
          <div class="continue-slot">
            <button class="continue-btn" type="button">Continue this thought <span class="arrow">-&gt;</span></button>
          </div>
        </div>
        <div class="paywall" role="dialog" aria-label="Upgrade required">
          <div class="paywall-card">
            <div class="badge">Free limit reached</div>
            <h3>You have reached your free message limit.</h3>
            <p>Upgrade to continue this reflection - and the next one, and the one after that.</p>
            <div class="price"><strong>Pro - &euro;20 / month</strong></div>
            <button class="upgrade" type="button">Upgrade to Pro</button>
            <button class="later" type="button">Maybe later</button>
          </div>
        </div>
      </div>
      <div class="ghost-stats" aria-label="Recap statistics">
        ${recapCards
          .map(
            ([icon, value, label], index) => `
              <div class="ghost-card" ${renderEvidenceAttributes(
                label,
                `${value}%`,
                evidence.finalRecap[icon],
              )}>
                <div class="ghost-icon ghost-icon--${icon}" aria-hidden="true"></div>
                <div class="v"><span data-countup data-target="${value}" data-suffix="%" data-delay="${200 + index * 100}">${value}%</span></div>
                <div class="l">${label}</div>
              </div>
            `,
          )
          .join("")}
      </div>
      <div class="s10-outro">
        <h1 id="final-paywall-scene-title">What's in your <span class="em">last chat window?</span></h1>
        <p>The <em>second</em> student is already here.</p>
      </div>
    </div>
  `,
});
