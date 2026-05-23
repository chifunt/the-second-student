import { animateEmailScene } from "../animation/sceneTransitions";
import { renderDialGrid } from "../charts/dialGrid";
import { stats } from "../data/surveyStats";
import { createVisualScene } from "./createScene";

const inboxRows = [
  ["library@uni", "Reminder - overdue items", "14:02", ""],
  ["timetable", "Week 5 seminar room change", "11:38", ""],
  [
    "Academic Integrity Office",
    "Possible unauthorised use of generative AI",
    "23:47",
    "Dear student, Your recent submission has been flagged for review...",
  ],
  ["course-announce", "Coursework deadline extended", "09:12", ""],
  ["finance@uni", "Maintenance loan instalment", "08:55", ""],
  ["society@filmclub", "Tonight: 1990s screening, free pizza", "Yesterday", ""],
  ["vle-digest", "Weekly summary - 3 new resources", "Mon", ""],
] as const;

export const emailScene = createVisualScene({
  id: "email-scene",
  title: "Subject: Possible Academic Misconduct",
  mode: "reactive",
  sceneClass: "s1",
  mood: "paper-cold",
  screenLabel: "01 The Email",
  animate: animateEmailScene,
  body: `
    <div class="chyron"><span class="num">01</span><span class="sep">/</span><span>Subject: Possible Academic Misconduct</span></div>
    <div class="scene-inner scene-inner--wide">
      <div class="window mail-window">
        <div class="window-titlebar">
          <div class="dots"><span></span><span></span><span></span></div>
          <div class="mark"><span class="mark-dot"></span>Mail</div>
          <div class="window-title">Inbox - student_047@uni.ac.uk</div>
          <div class="window-meta">Tue 14 May - 23:47</div>
        </div>
        <div class="mail-ribbon">
          <div class="tab active">Home</div>
          <div class="tab">View</div>
          <div class="tab">Help</div>
          <div class="sep"></div>
          <div class="act reply"><div class="ic"></div>Reply</div>
          <div class="act fwd"><div class="ic"></div>Forward</div>
          <div class="sep"></div>
          <div class="act flag"><div class="ic"></div>Flag</div>
          <div class="act del"><div class="ic"></div>Delete</div>
          <div class="spacer"></div>
          <div class="search">Search...</div>
        </div>
        <div class="email-window">
          <aside class="email-sidebar">
            <h6>Favourites</h6>
            <div class="folder active">Inbox <span class="ct">12</span></div>
            <div class="folder">Flagged <span class="ct">3</span></div>
            <div class="folder">Sent</div>
            <hr />
            <h6>student_047@uni.ac.uk</h6>
            <div class="folder">Drafts <span class="ct">4</span></div>
            <div class="folder">Archive</div>
            <div class="folder">Junk <span class="ct">31</span></div>
            <hr />
            <h6>Groups</h6>
            <div class="folder">SOC 240</div>
            <div class="folder">Course reps</div>
          </aside>
          <div class="email-list">
            <div class="list-head"><span>Inbox - by date</span><span class="filter">Filter</span></div>
            ${inboxRows
              .map(
                ([sender, subject, time, preview], index) => `
                  <div class="row${index === 2 ? " unread target" : ""}">
                    <span class="marker"></span>
                    <div>
                      <div class="sender">${sender}</div>
                      <div class="subj">${subject}</div>
                      ${preview ? `<span class="preview">${preview}</span>` : ""}
                    </div>
                    <div class="time">${time}</div>
                  </div>
                `,
              )
              .join("")}
          </div>
          <div class="email-reader">
            <div class="reader-toolbar">
              <div class="actions"><span>Reply</span><span>Reply all</span><span>Forward</span></div>
              <div class="actions"><span>...</span></div>
            </div>
            <h2 id="email-scene-title">Possible unauthorised use of generative AI</h2>
            <div class="sender-row">
              <div class="ava">AI</div>
              <div class="who">
                <div class="name">Academic Integrity Office</div>
                <div class="addr">integrity@uni.ac.uk - to: student_047@uni.ac.uk</div>
              </div>
              <div class="time-stamp"><div class="when">23:47</div><div>Tue 14 May 2026</div></div>
            </div>
            <div class="email-body">
              <div class="uni-banner">
                <div class="crest">U</div>
                <div><div class="uni-name">University of Westmore</div><div class="uni-sub">Office of Academic Standards - OAS-2026-04812</div></div>
              </div>
              <p>Dear student_047,</p>
              <p>Your recent submission for <em>SOC 240 - Sociological Theory (Coursework 2)</em> has been flagged for review by the Office of Academic Standards.</p>
              <p>You are required to provide a written explanation of your process, including reading notes, drafts, sources, and any digital tools used during preparation.</p>
              <p>This communication is not a final determination. Failure to respond within <strong>seven working days</strong> may affect the assessment process.</p>
              <div class="signature">
                <p>Kind regards,</p>
                <p class="name">Dr. Helen Marwick</p>
                <p class="role">Academic Integrity Officer - Office of Academic Standards</p>
              </div>
            </div>
          </div>
          <aside class="email-data-panel">
            ${renderDialGrid(stats.barriers, {
              title: "What stops students?",
              tone: "risk",
              description:
                "Top concerns students report around using AI for assessed work.",
            })}
          </aside>
        </div>
      </div>
    </div>
  `,
});
