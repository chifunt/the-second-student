import { animateBoundaryScene } from "../animation/sceneTransitions";
import { renderLadderChart } from "../charts/ladderChart";
import { createStaticScene } from "./createScene";

export const boundaryScene = createStaticScene(
  "boundary-scene",
  "ambiguous",
  {
    eyebrow: "Document editor",
    title: "Boundary",
    dek: "Suggestions sit beside the paragraph. The dangerous button is not the tool. It is the unexamined acceptance.",
    action: "Student action: reviews suggestions but pauses over Accept all.",
    primary: `
    <article class="document-surface">
      <header class="document-toolbar">
        <span>essay-draft-v5.doc</span>
        <span>Suggestions: 4</span>
      </header>
      <div class="document-page">
        <p><mark>AI can help me clarify the claim</mark>, but the claim still needs to be mine.</p>
        <p>The evidence should show how support changes student behaviour, not only whether the tool is present.</p>
        <div class="margin-note">
          <strong>Assistant suggestion</strong>
          <span>Split this into claim, evidence, and limitation.</span>
        </div>
        <div class="margin-note margin-note--warning">
          <strong>Authorship risk</strong>
          <span>Accept all would replace the paragraph voice.</span>
        </div>
      </div>
      <div class="button-row">
        <span class="button-like">Accept</span>
        <span class="button-like">Reject</span>
        <span class="button-like button-danger">Accept all</span>
      </div>
    </article>
  `,
    aside: renderLadderChart(
      [
        "Explain concept",
        "Summarise source",
        "Structure thoughts",
        "Edit writing",
        "Generate text, then edit",
        "Include AI text directly",
      ],
      {
        title: "Support to substitution ladder",
        tone: "mixed",
        description:
          "A staged model for discussing when help starts becoming authorship.",
      },
    ),
  },
  animateBoundaryScene,
);
