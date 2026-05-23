import { stats, surveySource } from "../data/surveyStats";
import { copy } from "../data/copy";
import { animateTitleScene } from "../animation/sceneTransitions";
import { renderProgressBars } from "../charts/progressBars";
import { renderWindowChrome } from "../ui/windowChrome";
import { createStaticScene } from "./createScene";

export const titleScene = createStaticScene("title-scene", "ambiguous", {
  eyebrow: copy.title.eyebrow,
  title: copy.title.headline,
  dek: copy.title.body,
  action: copy.title.action,
  primary: renderWindowChrome({
    title: "Inbox / 08:41",
    meta: surveySource.reportNumber,
    body: `
      <div class="desktop-surface desktop-surface--title">
        <div class="desktop-sidebar">
          <span class="profile-dot profile-dot--ambiguous">?</span>
          <span>Inbox</span>
          <span>Drafts</span>
          <span>Files</span>
        </div>
        <div class="inbox-preview">
          <div class="email-row email-row--unread">
            <span class="email-row__from">Academic Integrity Office</span>
            <span class="email-row__subject">Subject: Possible academic misconduct</span>
            <span class="email-row__time">08:41</span>
          </div>
          <div class="email-row">
            <span class="email-row__from">Library Services</span>
            <span class="email-row__subject">Overdue item reminder</span>
            <span class="email-row__time">08:12</span>
          </div>
          <p class="muted">Unread. Deadline week. Cursor hovering.</p>
        </div>
      </div>
      ${renderProgressBars(
        [
          { label: "Use AI in at least one way", value: stats.adoption.aiUse },
          {
            label: "Use GenAI for assessed work",
            value: stats.adoption.genAiAssessment,
          },
        ],
        { title: "Near universal adoption", tone: "mixed" },
      )}
    `,
  }),
}, animateTitleScene);
