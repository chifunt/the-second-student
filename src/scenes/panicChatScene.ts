import { animatePanicChatScene } from "../animation/sceneTransitions";
import { renderRankedBarChart } from "../charts/rankedBarChart";
import { stats } from "../data/surveyStats";
import { renderWindowChrome } from "../ui/windowChrome";
import { createStaticScene } from "./createScene";

export const panicChatScene = createStaticScene(
  "panic-chat-scene",
  "reactive",
  {
    eyebrow: "student_047",
    title: "First, Breathe",
    dek: "The assistant becomes a reassurance machine, useful and risky in the same breath.",
    action: "Student action: sends an anxious pasted prompt.",
    primary: renderWindowChrome({
      title: "AI chat",
      meta: "02 messages / unsaved",
      body: `
      <div class="chat-shell chat-shell--reactive">
        <header class="chat-header">
          <span class="profile-dot profile-dot--reactive">47</span>
          <div>
            <strong>student_047</strong>
            <span>Temporary chat / no notes attached</span>
          </div>
        </header>
        <div class="pasted-card">
          <strong>Pasted email</strong>
          <p>Possible academic misconduct... digital tools used...</p>
        </div>
        <div class="chat-stack">
          <p class="bubble bubble--user">I got this email. Am I going to fail? Please tell me what to do.</p>
          <p class="bubble bubble--assistant">First, breathe. We can separate what the message says from what you fear it means.</p>
        </div>
        <div class="chat-composer">
          <span>ask again before replying...</span>
          <span class="button-like">Send</span>
        </div>
      </div>
    `,
    }),
    aside: renderRankedBarChart(stats.motivations, {
      title: "Why students use AI",
      tone: "support",
    }),
  },
  animatePanicChatScene,
);
