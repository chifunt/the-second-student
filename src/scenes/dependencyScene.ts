import { animateDependencyScene } from "../animation/sceneTransitions";
import { renderStackedBar } from "../charts/stackedBar";
import { copy } from "../data/copy";
import { evidence } from "../data/evidence";
import { getSourceBalanceGroup } from "../data/statLookups";
import { stats } from "../data/surveyStats";
import { renderSurveyQuote } from "../ui/surveyQuote";
import {
  renderAppLogo,
  renderProfileSummary,
  renderWindowTitlebar,
} from "../ui/windowChrome";
import { createVisualScene } from "./createScene";

const aiFirst = getSourceBalanceGroup("AI-first");
const balanced = getSourceBalanceGroup("Balanced");
const traditionalFirst = getSourceBalanceGroup("Traditional-first");

const sourceBalanceSegments = [
  {
    label: aiFirst.label,
    value: aiFirst.value,
    tone: "risk" as const,
  },
  {
    label: balanced.label,
    value: balanced.value,
    tone: "neutral" as const,
  },
  {
    label: traditionalFirst.label,
    value: traditionalFirst.value,
    tone: "support" as const,
  },
];

export const dependencyScene = createVisualScene({
  id: "dependency-scene",
  title: "When Help Starts Thinking for You",
  mode: "reactive",
  sceneClass: "s8",
  mood: "dark",
  screenLabel: "08 When Help Starts Thinking",
  dataFocus: true,
  entryOverlay: {
    title: "Back to the window that never closed.",
    subject: copy.students.reactive.displayName,
    meta: "chat restored - 01:08",
    avatars: [
      {
        src: copy.students.reactive.avatar,
        alt: copy.students.reactive.fullName,
      },
    ],
  },
  animate: animateDependencyScene,
  body: `
    <div class="chyron"><span class="num">08</span><span class="sep">/</span><span>When help starts thinking for you</span></div>
    <div class="scene-inner scene-inner--wide">
      <div class="window ai-chat">
        ${renderWindowTitlebar({
          app: "assist",
          mark: "assist",
          title: "untitled chat - 14 of 14 today",
          meta: "01:08 - battery 4%",
        })}
        <div class="dep-chat">
          <div class="dep-main">
            <div class="chat-header">
              <div class="chat-model">${renderAppLogo("assist", {
                className: "app-logo--inline",
                hidden: true,
              })}<span>assist - fast</span></div>
              ${renderProfileSummary({
                initials: copy.students.reactive.initials,
                avatarSrc: copy.students.reactive.avatar,
                avatarAlt: copy.students.reactive.fullName,
                name: copy.students.reactive.displayName,
                status: `${copy.students.reactive.username} - 14 chats today - tabs: 11 open`,
              })}
            </div>
            <div class="dep-stream">
              <div class="msg user">give me a thesis i can defend</div>
              <div class="msg user">turn these notes into an argument</div>
              <div class="msg user">which source should this sound like</div>
              <div class="msg user">write the first paragraph from this</div>
              <div class="msg user">make it sound like my previous essay</div>
              <div class="msg user refused">make it undetectable</div>
              <div class="msg bot refuse">I can't help hide AI use or bypass academic rules. I can help you explain your process honestly.</div>
              <div class="msg user">then what part do i actually write</div>
              <div class="msg bot">
                <div class="ai-tag">${renderAppLogo("assist", {
                  className: "app-logo--tiny",
                  hidden: true,
                })}<span>assist - response</span></div>
                <p class="first-line">Let me stop you here.</p>
                <p>You are not crazy. You spotted a pattern.</p>
                <p>But let's keep this grounded: I can help you clarify your thinking, <em>not replace it</em>.</p>
              </div>
            </div>
          </div>
          <aside class="dep-side">
            <div class="dep-warning">
              <span class="eyebrow">after the mirror</span>
              <h3>Where the work starts</h3>
              <p>Dependency starts when AI stops being one source among many and becomes the first place judgement goes.</p>
            </div>
            <div class="dep-balance" data-focus-target>
              ${renderStackedBar(sourceBalanceSegments, {
                title: "How students combine AI and traditional sources",
                tone: "mixed",
                description: `${stats.sourceBalance.aiFirst}% are AI-first; ${stats.sourceBalance.traditionalFirst}% are traditional-source-first.`,
                evidence: evidence.sourceBalance,
              })}
            </div>
            <div class="dep-themes">
              <div class="col worse"><h5>Risk signals</h5><div class="chip">AI-first workflow</div><div class="chip">source voice drifting</div><div class="chip">authorship doubts</div></div>
              <div class="col worse"><h5>Prompt drift</h5><div class="chip">give me a thesis</div><div class="chip">turn notes into argument</div><div class="chip">what part do I write?</div></div>
            </div>
            ${renderSurveyQuote(copy.quotes.thinkLess, {
              className: "quote-card sharp dep-private-note",
            })}
          </aside>
        </div>
      </div>
    </div>
  `,
});
