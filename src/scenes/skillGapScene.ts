import { animateSkillGapScene } from "../animation/sceneTransitions";
import { renderGapChart } from "../charts/gapChart";
import { evidence } from "../data/evidence";
import { stats } from "../data/surveyStats";
import { createVisualScene } from "./createScene";

export const skillGapScene = createVisualScene({
  id: "skill-gap-scene",
  title: "Skill Gap",
  mode: "institutional",
  sceneClass: "s6",
  mood: "paper",
  screenLabel: "06 Skill Gap",
  animate: animateSkillGapScene,
  body: `
    <div class="chyron"><span class="num">06</span><span class="sep">/</span><span>The Skill Everyone Needs</span></div>
    <div class="scene-inner scene-inner--wide">
      <div class="vle">
        <div class="vle-bar">
          <div class="mark"><span class="mark-ring"></span>portal - university VLE</div>
          <div class="crumbs">Home / Academic Support / <span class="cur">Using AI Responsibly</span></div>
          <div class="mono">Last updated - Jan 2026</div>
        </div>
        <div class="vle-body">
          <div class="vle-content">
            <h2 id="skill-gap-scene-title">Using AI responsibly in your studies</h2>
            <p class="lead">This guidance applies to all undergraduate modules. Check your module handbook for assessment-specific rules. If unsure, contact your lecturer.</p>
            <div class="vle-cards">
              <div class="vle-card"><div class="num">01</div>Use AI responsibly in line with module rules.</div>
              <div class="vle-card"><div class="num">02</div>Check your course-specific guidance before each submission.</div>
              <div class="vle-card"><div class="num">03</div>Do not submit AI-generated work as your own.</div>
              <div class="vle-card"><div class="num">04</div>AI skills matter for your future career.</div>
              <div class="vle-card"><div class="num">05</div>Contact your lecturer if you are unsure.</div>
              <div class="vle-card"><div class="num">06</div>Read assessment-specific guidance for each piece of work.</div>
            </div>
            <p class="vle-note">Generic guidance appears across institutional portals. Students still describe being expected to use AI critically without being shown what "critically" means in their specific subject.</p>
          </div>
          <aside class="vle-side">
            ${renderGapChart(
              [
                {
                  label: "AI skills for future career",
                  expected: stats.supportGap.essentialSkills,
                  actual: stats.supportGap.staffCareerSupport,
                  expectedLabel: "Say essential",
                  actualLabel: "Staff help",
                },
                {
                  label: "Institution-provided AI tools",
                  expected: stats.supportGap.shouldProvideTools,
                  actual: stats.supportGap.doesProvideTools,
                  expectedLabel: "Should provide",
                  actualLabel: "Does provide",
                },
              ],
              {
                title: "The support gap",
                tone: "mixed",
                description:
                  "What students need compared with what they say they are getting.",
                evidence: evidence.supportGap,
              },
            )}
          </aside>
        </div>
      </div>
    </div>
  `,
});
