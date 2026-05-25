import { animateSplitExperienceScene } from "../animation/sceneTransitions";
import { renderStackedBar } from "../charts/stackedBar";
import { copy } from "../data/copy";
import { evidence } from "../data/evidence";
import { getExperienceGroup } from "../data/statLookups";
import { renderInlineSurveyQuote } from "../ui/surveyQuote";
import { createVisualScene } from "./createScene";

const betterExperience = getExperienceGroup("Better");
const noImpactExperience = getExperienceGroup("No significant impact");
const worseExperience = getExperienceGroup("Worse");

const experienceSegments = [
  {
    label: betterExperience.label,
    value: betterExperience.value,
    tone: "support" as const,
  },
  {
    label: noImpactExperience.label,
    value: noImpactExperience.value,
    tone: "neutral" as const,
  },
  {
    label: worseExperience.label,
    value: worseExperience.value,
    tone: "risk" as const,
  },
];

export const splitExperienceScene = createVisualScene({
  id: "split-experience-scene",
  title: "Where the Student Stands",
  mode: "ambiguous",
  sceneClass: "s7",
  mood: "paper-cold",
  screenLabel: "07 Same Chart Two Lives",
  animate: animateSplitExperienceScene,
  body: `
    <div class="chyron"><span class="num">07</span><span class="sep">/</span><span>Where the Student Stands</span></div>
    <div class="scene-inner scene-inner--wide split-experience">
      <section class="split-side split-side--deliberate" aria-label="Deliberate student perspective">
        <div class="split-profile">
          <div class="ava">${copy.students.deliberate.initials}</div>
          <div><div class="name">${copy.students.deliberate.displayName}</div><div class="status">${copy.students.deliberate.username} - workspace clean - sources checked</div></div>
        </div>
        <div class="split-workspace">
          <div class="split-doc">
            <div class="doc-label">assignment brief</div>
            <h3>AI and academic judgement</h3>
            <p>Define the claim in my own words before drafting.</p>
          </div>
          <div class="split-note">
            <div class="doc-label">prompt</div>
            <p>Do not write the assignment. Help me identify what I understand. Show what I still need to check.</p>
          </div>
          <div class="split-matrix">
            <span>source</span><span>claim</span><span>checked</span>
            <strong>HEPI 199</strong><strong>student AI use</strong><strong>yes</strong>
            <strong>module guide</strong><strong>allowed support</strong><strong>pending</strong>
          </div>
        </div>
        <div class="split-reading split-reading--better">
          <strong>${betterExperience.value}% say AI made their student experience better.</strong>
          <span>Faster understanding. Better structure. More confidence.</span>
          <em>Support, when judgement remains visible.</em>
        </div>
      </section>

      <div class="split-chart-stage" aria-label="Shared student experience impact chart">
        <p class="split-kicker">Same data. Different conditions.</p>
        <h2 id="split-experience-scene-title">Where the Student Stands</h2>
        <div class="split-chart">
          ${renderStackedBar(experienceSegments, {
            title: "Impact of AI on student experience",
            tone: "mixed",
            description:
              "Grouped responses to whether generative AI made the student experience better, the same, or worse.",
            evidence: evidence.experience,
          })}
        </div>
        <p class="split-final-caption">The same chart does not tell one student story. It depends where the student stands.</p>
      </div>

      <section class="split-side split-side--reactive" aria-label="Reactive student perspective">
        <div class="split-profile">
          <div class="ava">${copy.students.reactive.initials}</div>
          <div><div class="name">${copy.students.reactive.displayName}</div><div class="status">${copy.students.reactive.username} - 01:08 - battery 4% - tabs: 11</div></div>
        </div>
        <div class="split-chat">
          <div class="msg user">what am i trying to say</div>
          <div class="msg user">rewrite all of it</div>
          <div class="msg user">wait does this still sound like me</div>
          <div class="msg bot">I can help you slow down and separate the idea from the wording.</div>
        </div>
        <div class="split-reading split-reading--worse">
          <strong>${worseExperience.value}% say AI made their student experience worse.</strong>
          <span>More anxiety. More dependence. Less confidence.</span>
          ${renderInlineSurveyQuote(copy.quotes.noBrain)}
        </div>
      </section>
    </div>
  `,
});
