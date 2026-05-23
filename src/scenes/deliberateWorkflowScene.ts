import { animateDeliberateWorkflowScene } from "../animation/sceneTransitions";
import { renderRankedBarChart } from "../charts/rankedBarChart";
import { copy } from "../data/copy";
import { stats } from "../data/surveyStats";
import { createVisualScene } from "./createScene";

export const deliberateWorkflowScene = createVisualScene({
  id: "deliberate-workflow-scene",
  title: "Same Tool, Used Differently",
  mode: "deliberate",
  sceneClass: "s4",
  mood: "bright",
  screenLabel: "04 Same Tool Differently",
  animate: animateDeliberateWorkflowScene,
  body: `
    <div class="chyron"><span class="num">04</span><span class="sep">/</span><span>The Same Tool, Used Differently</span></div>
    <div class="scene-inner scene-inner--wide">
      <div class="window">
        <div class="window-titlebar">
          <div class="dots"><span></span><span></span><span></span></div>
          <div class="mark"><span class="mark-dot"></span>study</div>
          <div class="window-title">Module: SOC 240 - Coursework 2</div>
          <div class="window-meta">Wed 15 May - 14:22</div>
        </div>
        <div class="studio">
          <aside class="studio-files">
            <h5>Working folder</h5>
            <div class="file active"><span class="ext">PDF</span>assignment_brief</div>
            <div class="file"><span class="ext">PDF</span>lecture_notes_week_5</div>
            <div class="file"><span class="ext">XLS</span>source_matrix</div>
            <div class="file"><span class="ext">DOC</span>outline_v1</div>
            <div class="file"><span class="ext">MD</span>questions_for_lecturer</div>
            <h5>Sources</h5>
            <div class="file"><span class="ext">PDF</span>peer-reviewed x 6</div>
            <div class="file"><span class="ext">URL</span>open-web x 3</div>
          </aside>
          <div class="studio-main">
            <div class="studio-header">
              <div class="studio-profile">
                <div class="ava">DS</div>
                <div><div class="name">d.sim</div><div class="status">signed in - institution profile</div></div>
              </div>
              <div class="mono small muted">draft autosaved - 14:21</div>
            </div>
            <div class="studio-stream">
              <div class="msg user">Here are my lecture notes and assignment brief. Help me identify what I understand, what I am missing, and what I should ask my lecturer. <strong>Do not write the assignment.</strong></div>
              <div class="msg bot">
                <div class="ai-tag">study - structured response</div>
                <div class="col-2">
                  <div>
                    <h6>You seem to understand</h6>
                    <ol><li>The main definition.</li><li>The first case example.</li><li>Basic argument structure.</li></ol>
                  </div>
                  <div>
                    <h6 class="miss">Still to clarify</h6>
                    <ol><li>How the second source supports your claim.</li><li>Whether your conclusion answers the question.</li><li>Which concept to explain in your own words.</li></ol>
                  </div>
                </div>
                <p class="soft">I can summarise the source you flagged, but won't draft the paragraph for you. Want me to map the brief to your outline?</p>
              </div>
            </div>
            <div class="chat-input chat-input--light"><span>Reply to study...</span><span>enter</span></div>
            <div class="quote-note">"${copy.quotes.studyBuddy}"</div>
          </div>
          <aside class="studio-data">
            ${renderRankedBarChart(stats.assessmentUses, {
              title: "What students use AI for in assessed work",
              tone: "support",
            })}
          </aside>
        </div>
      </div>
    </div>
  `,
});
