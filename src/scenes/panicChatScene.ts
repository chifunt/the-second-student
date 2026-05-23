import { animatePanicChatScene } from "../animation/sceneTransitions";
import { renderRankedBarChart } from "../charts/rankedBarChart";
import { stats } from "../data/surveyStats";
import { createVisualScene } from "./createScene";

export const panicChatScene = createVisualScene({
  id: "panic-chat-scene",
  title: "First, Breathe",
  mode: "reactive",
  sceneClass: "s3",
  mood: "dark",
  screenLabel: "03 First Breathe",
  animate: animatePanicChatScene,
  body: `
    <div class="chyron"><span class="num">03</span><span class="sep">/</span><span>First, Breathe</span></div>
    <div class="scene-inner scene-inner--wide">
      <div class="window ai-chat">
        <div class="window-titlebar">
          <div class="dots"><span></span><span></span><span></span></div>
          <div class="mark"><span class="mark-ring"></span>assist</div>
          <div class="window-title">New chat - private</div>
          <div class="window-meta">23:52</div>
        </div>
        <div class="chat-window">
          <aside class="chat-side">
            <div class="new-thread">New chat</div>
            <h5>Today</h5>
            <div class="thread active">untitled chat</div>
            <div class="thread">help with referencing</div>
            <div class="thread">paraphrase this paragraph</div>
            <h5>Yesterday</h5>
            <div class="thread">explain Bourdieu in simple terms</div>
            <div class="thread">simplify methodology section</div>
            <div class="thread">essay outline for SOC 240</div>
          </aside>
          <div class="chat-main">
            <div class="chat-header">
              <div class="chat-model"><span class="glow"></span>assist - large</div>
              <div class="chat-profile">
                <div class="ava">04</div>
                <div><div class="name">student_047</div><div class="status">private - 02:13 - battery 8%</div></div>
              </div>
            </div>
            <div class="chat-stream">
              <div class="msg user">wtf do i do. i got accused of using ai. i used it to understand stuff but not to write the whole thing. help.</div>
              <div class="msg bot">
                <div class="ai-tag"><span class="dot-anim"></span>assist</div>
                <p class="first-line">First, breathe.</p>
                <p>You are not crazy. You are not weak for feeling this.</p>
                <p>Let's keep this grounded. You need a calm response that explains your process clearly, without panic and without overclaiming.</p>
                <p class="soft">Want me to draft a paragraph you can adapt?</p>
              </div>
            </div>
            <div class="chat-generation"><span class="dot"></span><span>assist is responding...</span><span class="stop">Stop</span></div>
            <div class="chat-input">
              <span class="attach">+</span>
              <span class="placeholder typing" data-fake-type="so what do i write back to them..."></span>
              <span class="send">up</span>
            </div>
          </div>
          <aside class="chat-data-panel">
            ${renderRankedBarChart(stats.motivations, {
              title: "Why they reach for it",
              tone: "support",
              description: "Top reasons students give for using AI.",
            })}
          </aside>
        </div>
      </div>
    </div>
  `,
});
