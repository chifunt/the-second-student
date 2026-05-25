import { animatePanicButtonScene } from "../animation/sceneTransitions";
import { renderPictogram } from "../charts/pictogram";
import { copy } from "../data/copy";
import { evidence } from "../data/evidence";
import { stats } from "../data/surveyStats";
import { createVisualScene } from "./createScene";

export const panicButtonScene = createVisualScene({
  id: "panic-button-scene",
  title: "The Panic Button",
  mode: "reactive",
  sceneClass: "s2",
  mood: "dark",
  screenLabel: "02 The Panic Button",
  animate: animatePanicButtonScene,
  body: `
    <div class="chyron"><span class="num">02</span><span class="sep">/</span><span>The Panic Button</span></div>
    <div class="scene-inner scene-inner--wide">
      <div class="s2-bottom">
        <div class="window mail-window">
          <div class="window-titlebar">
            <div class="dots"><span></span><span></span><span></span></div>
            <div class="mark"><span class="mark-dot"></span>Mail</div>
            <div class="window-title">Inbox - ${copy.students.reactive.displayName}</div>
            <div class="window-meta">23:47</div>
          </div>
          <div class="s2-account">
            <span>${copy.students.reactive.initials}</span>
            <div><strong>${copy.students.reactive.displayName}</strong><small>${copy.students.reactive.email}</small></div>
          </div>
          <div class="email-reader s2-reader">
            <div class="reader-toolbar">
              <div class="actions"><span>Reply</span><span>Reply all</span><span>Forward</span></div>
              <div class="actions"><span>...</span></div>
            </div>
            <h2 id="panic-button-scene-title">Possible unauthorised use of generative AI</h2>
            <div class="sender-row">
              <div class="ava">AI</div>
              <div class="who"><div class="name">Academic Integrity Office</div><div class="addr">integrity@uni.ac.uk - to: ${copy.students.reactive.fullName}</div></div>
              <div class="time-stamp"><div class="when">23:47</div><div>Tue 14 May</div></div>
            </div>
            <div class="email-body">
              <div class="uni-banner">
                <div class="crest">U</div>
                <div><div class="uni-name">University of Westmore</div><div class="uni-sub">Office of Academic Standards - OAS-2026-04812</div></div>
              </div>
              <p>Dear ${copy.students.reactive.firstName},</p>
              <p>Your <span class="highlight">recent submission for <em>SOC 240 - Sociological Theory (Coursework 2)</em> has been flagged for review</span> by the Office of Academic Standards under Section 4.2 of the Academic Misconduct Policy.</p>
              <p>You are required to provide a <span class="highlight">written explanation of your process</span>, including any reading notes, drafts, sources, and digital tools used during preparation.</p>
              <p>This communication is not a final determination. Failure to respond within <strong>seven working days</strong> may affect the assessment process.</p>
              <div class="signature">
                <p>Kind regards,</p>
                <p class="name">Dr. Helen Marwick</p>
                <p class="role">Academic Integrity Officer - Office of Academic Standards</p>
              </div>
            </div>
            <div class="context-menu">
              <div class="item"><span>Reply</span><span class="sk">Cmd R</span></div>
              <div class="item"><span>Forward</span><span class="sk">Cmd Shift F</span></div>
              <div class="item copy"><span>Copy</span><span class="sk">Cmd C</span></div>
              <div class="item"><span>Search selection</span></div>
            </div>
            <div class="cursor" aria-hidden="true">
              <svg viewBox="0 0 16 20"><path d="M1.5 1.5 L1.5 15.5 L5.5 12 L8 18 L10.5 17 L8 11 L13 11 Z" /></svg>
            </div>
          </div>
        </div>
        <aside class="s2-data">
          <h2>Assessment work is already AI-mediated.</h2>
          ${renderPictogram({
            title: "Assessment prevalence",
            tone: "mixed",
            value: stats.adoption.genAiAssessment,
            label: "use GenAI to help with assessed work",
            description:
              "A near-full room of students makes the panic feel less exceptional.",
            evidence: evidence.assessmentPrevalence,
          })}
        </aside>
      </div>
      <div class="s2-overlay" aria-hidden="true">
        <div class="callout">
          <h3>Copy first. Understand later.</h3>
          <p>The email becomes raw material for reassurance before the student has decided what it means.</p>
        </div>
      </div>
    </div>
  `,
});
