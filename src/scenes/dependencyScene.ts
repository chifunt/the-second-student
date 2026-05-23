import { animateDependencyScene } from "../animation/sceneTransitions";
import { renderStackedBar } from "../charts/stackedBar";
import { stats } from "../data/surveyStats";
import { renderWindowChrome } from "../ui/windowChrome";
import { createStaticScene } from "./createScene";

export const dependencyScene = createStaticScene(
  "dependency-scene",
  "reactive",
  {
    eyebrow: "student_047",
    title: "When Help Starts Thinking for You",
    dek: "The prompt sequence tightens. Support becomes outsourcing when the student stops checking the answer.",
    action: "Student action: asks for decisions instead of feedback.",
    primary: renderWindowChrome({
      title: "AI chat",
      meta: "Crowded thread / deadline mode",
      body: `
        <div class="chat-shell chat-shell--crowded">
          <header class="chat-header">
            <span class="profile-dot profile-dot--reactive">47</span>
            <div>
              <strong>student_047</strong>
              <span>14 prompts in 11 minutes</span>
            </div>
          </header>
          <div class="chat-stack">
            <p class="bubble bubble--user">Can you decide the argument for me?</p>
            <p class="bubble bubble--user">Make it sound like I wrote it.</p>
            <p class="bubble bubble--user">Make it undetectable.</p>
            <p class="bubble bubble--assistant">I cannot help hide authorship or evade detection. I can help you make your own argument clearer.</p>
            <p class="quote-card">"I'm not using my brain at all."</p>
          </div>
          <div class="thread-tags">
            <span>reassurance</span>
            <span>outsourcing</span>
            <span>authorship boundary</span>
          </div>
        </div>
      `,
    }),
    aside: renderStackedBar(
      [
        {
          label: "Better student experience",
          value: stats.experience.better,
          tone: "support",
        },
        { label: "No impact", value: stats.experience.noImpact, tone: "neutral" },
        {
          label: "Worse student experience",
          value: stats.experience.worse,
          tone: "risk",
        },
      ],
      { title: "Reported impact on student experience", tone: "mixed" },
    ),
  },
  animateDependencyScene,
);
