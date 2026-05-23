import { animateEmailScene } from "../animation/sceneTransitions";
import { renderRankedBarChart } from "../charts/rankedBarChart";
import { stats } from "../data/surveyStats";
import { renderWindowChrome } from "../ui/windowChrome";
import { createStaticScene } from "./createScene";

export const emailScene = createStaticScene(
  "email-scene",
  "reactive",
  {
    eyebrow: "Reactive screen-world",
    title: "Subject: Possible Academic Misconduct",
    dek: "The first student opens the message and starts reading it as a threat before reading it as information.",
    action: "Student action: opens the unread integrity email.",
    primary: renderWindowChrome({
      title: "Mail",
      meta: "student_047 / Inbox",
      body: `
      <div class="mail-app">
        <nav class="mail-folders" aria-label="Mail folders">
          <strong>student_047</strong>
          <span>Inbox <b>7</b></span>
          <span>Flagged <b>3</b></span>
          <span>Drafts</span>
        </nav>
        <div class="mail-list">
          <article class="mail-list__item">
            <span>Library notice</span>
            <small>Renewal request failed</small>
          </article>
          <article class="mail-list__item mail-list__item--active">
            <span>Academic Integrity Office</span>
            <small>Possible academic misconduct</small>
          </article>
          <article class="mail-list__item">
            <span>Seminar coordinator</span>
            <small>Room changed again</small>
          </article>
          <article class="mail-list__item">
            <span>Module forum</span>
            <small>Assessment discussion locked</small>
          </article>
        </div>
        <div class="mail-pane">
          <div class="message-header">
            <span class="profile-dot profile-dot--reactive">47</span>
            <div>
              <h3>Possible academic misconduct</h3>
              <p class="muted">From Academic Integrity Office / Due 17:00</p>
            </div>
          </div>
          <p>Please review the attached guidance and respond by 17:00. You may wish to provide notes about your process, sources consulted, and any digital tools used.</p>
          <p class="message-warning">The line about "digital tools used" is reread three times.</p>
          <div class="attachment-strip">
            <span>process-notes-request.pdf</span>
            <span>academic-integrity-guidance.html</span>
          </div>
        </div>
      </div>
    `,
    }),
    aside: renderRankedBarChart(stats.barriers, {
      title: "Barriers and worries",
      tone: "risk",
    }),
  },
  animateEmailScene,
);
