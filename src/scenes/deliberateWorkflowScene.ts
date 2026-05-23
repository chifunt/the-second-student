import { animateDeliberateWorkflowScene } from "../animation/sceneTransitions";
import { renderRankedBarChart } from "../charts/rankedBarChart";
import { stats } from "../data/surveyStats";
import { renderWindowChrome } from "../ui/windowChrome";
import { createStaticScene } from "./createScene";

export const deliberateWorkflowScene = createStaticScene(
  "deliberate-workflow-scene",
  "deliberate",
  {
    eyebrow: "d.sim",
    title: "Same Tool, Used Differently",
    dek: "The second screen is organized: sources on the left, notes in the middle, judgement still visible in the draft.",
    action:
      "Student action: asks for structure, source navigation, and revision prompts.",
    primary: renderWindowChrome({
      title: "Study workspace",
      meta: "essay-plan-v4.md / sources tagged",
      body: `
        <div class="study-shell">
          <header class="study-header">
            <span class="profile-dot profile-dot--deliberate">DS</span>
            <div>
              <strong>d.sim</strong>
              <span>Workspace: policy-essay / sources verified</span>
            </div>
          </header>
          <div class="workspace-grid">
            <section>
              <h3>Notes</h3>
              <ul>
                <li>Claim: AI changes feedback timing.</li>
                <li>Evidence: source B, p.14.</li>
                <li>Uncertainty: define authorship.</li>
              </ul>
            </section>
            <section>
              <h3>Sources</h3>
              <p class="file-chip">hepi-report-199.pdf</p>
              <p class="file-chip">module-policy.md</p>
              <p class="file-chip">seminar-notes-week-7.md</p>
            </section>
            <section>
              <h3>Draft</h3>
              <p>Use this outline to test the argument, not write the paragraph for me.</p>
              <p class="margin-tag">judgement required</p>
            </section>
          </div>
          <div class="structured-prompt">
            <strong>Prompt</strong>
            <p>Help me compare these sources. Flag weak evidence and ask me questions before suggesting wording.</p>
          </div>
          <p class="quote-card quote-card--support">"Makes me feel like I have a study buddy."</p>
        </div>
      `,
    }),
    aside: renderRankedBarChart(stats.assessmentUses, {
      title: "Assessment support uses",
      tone: "support",
    }),
  },
  animateDeliberateWorkflowScene,
);
