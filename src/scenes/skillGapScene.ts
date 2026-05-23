import { animateSkillGapScene } from "../animation/sceneTransitions";
import { renderGapChart } from "../charts/gapChart";
import { stats } from "../data/surveyStats";
import { renderWindowChrome } from "../ui/windowChrome";
import { createStaticScene } from "./createScene";

export const skillGapScene = createStaticScene(
  "skill-gap-scene",
  "institutional",
  {
    eyebrow: "Institutional layer",
    title: "Skill Gap",
    dek: "The guidance page is official, careful, and too vague for the moment students actually need it.",
    action: "Student action: searches the VLE for permission, examples, and tools.",
    primary: renderWindowChrome({
      title: "University learning environment",
      meta: "Guidance / Generative AI",
      body: `
      <div class="vle-shell">
        <div class="vle-search">Search: can I use AI in this assessment?</div>
        <div class="vle-cards">
          <article><span>Policy</span><h3>Use responsibly</h3><p>Check your module handbook.</p></article>
          <article><span>Assessment</span><h3>Declare where required</h3><p>Policy varies by assessment.</p></article>
          <article><span>Training</span><h3>Develop AI literacy</h3><p>Workshop dates to be confirmed.</p></article>
        </div>
        <div class="guidance-alert">
          <strong>No single answer found.</strong>
          <span>Three pages point back to each other.</span>
        </div>
      </div>
    `,
    }),
    aside: renderGapChart(
      [
        {
          label: "Skills students think they need",
          expected: stats.supportGap.essentialSkills,
          actual: stats.supportGap.staffCareerSupport,
          expectedLabel: "AI skills essential",
          actualLabel: "Staff support",
        },
        {
          label: "Tools students expect",
          expected: stats.supportGap.shouldProvideTools,
          actual: stats.supportGap.doesProvideTools,
          expectedLabel: "Should provide tools",
          actualLabel: "Does provide tools",
        },
      ],
      { title: "Institutional support gap", tone: "mixed" },
    ),
  },
  animateSkillGapScene,
);
