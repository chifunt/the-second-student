import { animateFinalPaywallScene } from "../animation/sceneTransitions";
import { renderRankedBarChart } from "../charts/rankedBarChart";
import { copy } from "../data/copy";
import { stats } from "../data/surveyStats";
import { renderSourcePanel } from "../ui/sourcePanel";
import { renderWindowChrome } from "../ui/windowChrome";
import { createStaticScene } from "./createScene";

export const finalPaywallScene = createStaticScene(
  "final-paywall-scene",
  "ambiguous",
  {
    eyebrow: "Last chat window",
    title: copy.finalQuestion,
    dek: "The answer begins, then the interface interrupts before the student can decide what kind of help this was.",
    action: "Student action: asks whether critical thinking is still present.",
    primary: renderWindowChrome({
      title: "Reflective assistant",
      meta: "Free plan",
      body: `
        <div class="final-chat">
          <div class="chat-stack chat-stack--ghosted">
            <p class="bubble bubble--user">is my critical thinking gone?</p>
            <p class="bubble bubble--assistant">I cannot answer it for your course, your assessment, or your future.</p>
            <p class="bubble bubble--assistant">But I can help you ask the better question: is this tool helping you practise thinking, or helping you avoid it?</p>
          </div>
          <div class="paywall-modal" role="presentation">
            <strong>You have reached your free message limit.</strong>
            <span>Upgrade to Pro for EUR 20/month to continue.</span>
            <div class="button-row">
              <span class="button-like">Upgrade to Pro</span>
              <span class="button-like">Maybe later</span>
            </div>
          </div>
          <p class="final-line">The second student is already here.</p>
        </div>
      `,
    }),
    aside:
      renderRankedBarChart(stats.finalRecap, {
        title: "What the survey leaves on screen",
        tone: "mixed",
      }) + renderSourcePanel(),
  },
  animateFinalPaywallScene,
);
