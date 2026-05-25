import { animateBoundaryScene } from "../animation/sceneTransitions";
import { renderEvidenceAttributes } from "../charts/chartUtils";
import { copy } from "../data/copy";
import { evidence } from "../data/evidence";
import { getAssessmentUse } from "../data/statLookups";
import { createVisualScene } from "./createScene";

const explainConcepts = getAssessmentUse("Explain concepts");
const summariseArticle = getAssessmentUse("Summarise a relevant article");
const structureThoughts = getAssessmentUse("Structure thoughts");
const generateThenEdit = getAssessmentUse("Generate text, then edit");
const includeDirectly = getAssessmentUse("Include AI text directly");

const ladderRows = [
  {
    zone: explainConcepts.zone,
    label: explainConcepts.label,
    value: explainConcepts.value,
    desc: "AI clarifies a definition, but the student still writes the claim.",
  },
  {
    zone: summariseArticle.zone,
    label: summariseArticle.label,
    value: summariseArticle.value,
    desc: "AI compresses a paper; the student decides what matters.",
  },
  {
    zone: structureThoughts.zone,
    label: structureThoughts.label,
    value: structureThoughts.value,
    desc: "AI helps order ideas; the argument remains visible.",
  },
  {
    zone: "boundary",
    label: "Edit my writing",
    value: null,
    desc: "Boundary marker: there is no survey value for this exact step.",
  },
  {
    zone: generateThenEdit.zone,
    label: generateThenEdit.label,
    value: generateThenEdit.value,
    desc: "A draft arrives before judgement has fully formed.",
  },
  {
    zone: includeDirectly.zone,
    label: includeDirectly.label,
    value: includeDirectly.value,
    desc: "The submitted words may no longer show the student's thinking.",
  },
] as const;

export const boundaryScene = createVisualScene({
  id: "boundary-scene",
  title: "Boundary",
  mode: "ambiguous",
  sceneClass: "s5",
  mood: "bright",
  screenLabel: "05 The Boundary",
  animate: animateBoundaryScene,
  body: `
    <div class="chyron"><span class="num">05</span><span class="sep">/</span><span>Help, Edit, Hand-In</span></div>
    <div class="scene-inner scene-inner--wide">
      <div class="window">
        <div class="window-titlebar">
          <div class="dots"><span></span><span></span><span></span></div>
          <div class="mark"><span class="mark-dot"></span>write</div>
          <div class="window-title">essay_draft_v3.docx - ${copy.students.deliberate.displayName} - Suggestions mode</div>
          <div class="window-meta">14:48</div>
        </div>
        <div class="writer-toolbar">
          <span>${copy.students.deliberate.username} - 3 suggestions in this paragraph - 12 in the document</span>
          <button class="accept-all pulse" type="button">Accept all suggestions</button>
        </div>
        <div class="writer">
          <div class="writer-doc">
            <h3 id="boundary-scene-title">Drafting the second paragraph</h3>
            <p><span class="strike">In this essay, I am going to talk about</span> <span class="sug">This paper examines</span> how universities are responding to the spread of generative AI in assessed work. Recent surveys <span class="sug-amber">suggest a rapid shift in student practice</span>, but the gap between policy and lived experience remains uneven.</p>
            <p>Where teaching staff have offered explicit guidance, students report <span class="sug">clearer expectations and</span> higher confidence. Where guidance is absent, students <span class="sug-amber">improvise - sometimes responsibly, sometimes not.</span></p>
            <p><span class="sug">The question is no longer whether students use AI in their work, but where their own judgement remains visible inside it.</span></p>
            <p class="revision-note">revision history - 14 saved versions - last opened 14:21</p>
          </div>
          <aside class="writer-panel">
            <h4>The Authorship Threshold</h4>
            <p class="sub">The same sequence changes meaning when generated words enter the draft.</p>
            <div class="threshold-summary" aria-label="Boundary markers">
              <div><strong>${generateThenEdit.value}%</strong><span>generate text, then edit</span></div>
              <div><strong>${includeDirectly.value}%</strong><span>include AI text directly</span></div>
            </div>
            <div class="threshold-note">Boundary: when generated words enter the submitted draft.</div>
            <div class="ladder threshold-ladder">
              ${ladderRows
                .map(
                  ({ zone, label, value, desc }, index) => `
                    <button class="rung" data-zone="${zone}" style="--w:${value ?? 0}%;" type="button" ${renderEvidenceAttributes(
                      label,
                      value === null ? "boundary marker" : value,
                      value === null ? undefined : evidence.assessmentUses,
                    )}>
                      <span>${index + 1}</span>
                      <span class="rung-label">${label}</span>
                      <span class="pct">${value === null ? "boundary" : `${value}%`}<span class="toggle-ic">></span></span>
                      <span class="rung-meter" aria-hidden="true"><i></i></span>
                      <span class="desc">${desc}</span>
                    </button>
                  `,
                )
                .join("")}
            </div>
          </aside>
        </div>
      </div>
      <div class="boundary-question">At what point does help become authorship?</div>
    </div>
  `,
});
