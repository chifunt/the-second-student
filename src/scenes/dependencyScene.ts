import { animateDependencyScene } from "../animation/sceneTransitions";
import { renderStackedBar } from "../charts/stackedBar";
import { copy } from "../data/copy";
import { stats } from "../data/surveyStats";
import { createVisualScene } from "./createScene";

export const dependencyScene = createVisualScene({
  id: "dependency-scene",
  title: "When Help Starts Thinking for You",
  mode: "reactive",
  sceneClass: "s7",
  mood: "dark",
  screenLabel: "07 When Help Starts Thinking",
  animate: animateDependencyScene,
  body: `
    <div class="chyron"><span class="num">07</span><span class="sep">/</span><span>When help starts thinking for you</span></div>
    <div class="scene-inner scene-inner--wide">
      <div class="window ai-chat">
        <div class="window-titlebar">
          <div class="dots"><span></span><span></span><span></span></div>
          <div class="mark"><span class="mark-ring"></span>assist</div>
          <div class="window-title">untitled chat - 14 of 14 today</div>
          <div class="window-meta">01:08 - battery 4%</div>
        </div>
        <div class="dep-chat">
          <div class="dep-main">
            <div class="chat-header">
              <div class="chat-model"><span class="glow"></span>assist - fast</div>
              <div class="chat-profile">
                <div class="ava">04</div>
                <div><div class="name">student_047</div><div class="status">14 chats today - tabs: 11 open</div></div>
              </div>
            </div>
            <div class="dep-stream">
              <div class="msg user">make this sound smarter</div>
              <div class="msg user">what am i trying to say</div>
              <div class="msg user">decide my argument</div>
              <div class="msg user">rewrite all of it</div>
              <div class="msg user refused">make it undetectable</div>
              <div class="msg bot refuse">I can't help hide AI use or bypass academic rules. I can help you explain your process honestly.</div>
              <div class="msg user">wait does this still sound like me</div>
              <div class="msg bot">
                <div class="ai-tag"><span class="dot-anim"></span>assist - response</div>
                <p class="first-line">Let me stop you here.</p>
                <p>You are not crazy. You spotted a pattern.</p>
                <p>But let's keep this grounded: I can help you clarify your thinking, <em>not replace it</em>.</p>
              </div>
            </div>
          </div>
          <aside class="dep-side">
            ${renderStackedBar(
              [
                {
                  label: "Better",
                  value: stats.experience.better,
                  tone: "support",
                },
                {
                  label: "No impact",
                  value: stats.experience.noImpact,
                  tone: "neutral",
                },
                {
                  label: "Worse",
                  value: stats.experience.worse,
                  tone: "risk",
                },
              ],
              {
                title: "How students rate the experience",
                tone: "mixed",
                description:
                  "Has AI made the student experience better, the same, or worse?",
              },
            )}
            <div class="dep-themes">
              <div class="col better"><h5>Better, because</h5><div class="chip">understanding concepts</div><div class="chip">structuring coursework</div><div class="chip">saving time</div><div class="chip">instant support</div></div>
              <div class="col worse"><h5>Worse, because</h5><div class="chip">over-reliance</div><div class="chip">less confidence</div><div class="chip">authorship doubts</div><div class="chip">harder to know rules</div></div>
            </div>
            <div class="quote-card sharp">"${copy.quotes.noBrain}"</div>
          </aside>
        </div>
      </div>
    </div>
  `,
});
