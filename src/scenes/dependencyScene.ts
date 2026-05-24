import { animateDependencyScene } from "../animation/sceneTransitions";
import { copy } from "../data/copy";
import { createVisualScene } from "./createScene";

export const dependencyScene = createVisualScene({
  id: "dependency-scene",
  title: "When Help Starts Thinking for You",
  mode: "reactive",
  sceneClass: "s8",
  mood: "dark",
  screenLabel: "08 When Help Starts Thinking",
  animate: animateDependencyScene,
  body: `
    <div class="chyron"><span class="num">08</span><span class="sep">/</span><span>When help starts thinking for you</span></div>
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
                <div class="ava">${copy.students.reactive.initials}</div>
                <div><div class="name">${copy.students.reactive.displayName}</div><div class="status">${copy.students.reactive.username} - 14 chats today - tabs: 11 open</div></div>
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
            <div class="dep-warning">
              <span class="eyebrow">after the mirror</span>
              <h3>The darker reading starts here.</h3>
              <p>The issue is no longer whether the tool can help. It is how quickly help becomes the place where judgement goes missing.</p>
            </div>
            <div class="dep-themes">
              <div class="col worse"><h5>Risk signals</h5><div class="chip">over-reliance</div><div class="chip">less confidence</div><div class="chip">authorship doubts</div><div class="chip">harder to know rules</div></div>
              <div class="col worse"><h5>Prompt drift</h5><div class="chip">make it smarter</div><div class="chip">decide my argument</div><div class="chip">rewrite all of it</div><div class="chip">does this sound like me?</div></div>
            </div>
            <div class="quote-card sharp">"${copy.quotes.noBrain}"</div>
          </aside>
        </div>
      </div>
    </div>
  `,
});
