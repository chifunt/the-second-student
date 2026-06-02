import { animateTitleScene } from "../animation/sceneTransitions";
import { escapeHtml, renderEvidenceAttributes } from "../charts/chartUtils";
import { copy } from "../data/copy";
import { evidence } from "../data/evidence";
import { stats, surveySource } from "../data/surveyStats";
import { renderAppLogo } from "../ui/windowChrome";
import { getTitleQuoteLayout } from "../ui/titleQuoteLayout";
import { createVisualScene } from "./createScene";

const ghostRows = [
  ["library@uni", "Reminder - overdue items", "14:02"],
  ["timetable", "Week 5 seminar room change", "11:38"],
  ["Academic Integrity Office", "Possible unauthorised use of generative AI", "23:47"],
  ["course-announce", "Coursework deadline extended by 48h", "09:12"],
  ["finance@uni", "Maintenance loan instalment", "08:55"],
  ["society@filmclub", "Tonight: 1990s screening, free pizza", "Yesterday"],
  ["vle-digest", "Weekly summary - 3 new resources", "Mon"],
  ["supervisor", "RE: extension request", "Mon"],
  ["careers", "Spring placement applications now open", "Sun"],
  ["peer-mentoring", "Drop-in this week", "Sun"],
] as const;

function renderFloatingQuotes(): string {
  return getTitleQuoteLayout(copy.floatingQuotes)
    .map((quote) => {
      const speaker = quote.voice === "ai" ? "tq-ai" : "tq-student";
      const responsiveClass = [
        quote.lane >= 9 ? "tq-mobile-hidden" : "",
        quote.lane >= 12 ? "tq-tablet-hidden" : "",
      ]
        .filter(Boolean)
        .join(" ");

      return `<span class="tq ${speaker} tq-${quote.depth} ${responsiveClass}" data-lane="${quote.lane}" style="--y:${quote.y}%;--d:${quote.delay}s;--dur:${quote.duration}s;">${escapeHtml(quote.text)}</span>`;
    })
    .join("");
}

export const titleScene = createVisualScene({
  id: "title-scene",
  title: copy.title.headline,
  mode: "ambiguous",
  sceneClass: "s0",
  mood: "dark",
  screenLabel: "00 Title",
  animate: animateTitleScene,
  body: `
    <div class="chyron"><span class="num">00</span><span class="sep">/</span><span>Title</span></div>
    <div class="s0-bg" aria-hidden="true">
      <div class="ghost-window">
        ${ghostRows
          .map(
            ([sender, subject, time], index) => `
              <div class="ghost-row${index === 2 ? " unread" : ""}">
                <span class="dot"></span>
                <span class="sender">${sender}</span>
                <span class="subj">${subject}</span>
                <span class="time">${time}</span>
              </div>
            `,
          )
          .join("")}
      </div>
    </div>
    <div class="title-quotes" aria-hidden="true">${renderFloatingQuotes()}</div>
    <div class="s0-content scene-inner">
      <div class="eyebrow">An interactive story - 2026</div>
      <h1 id="title-scene-title">The <span class="second">Second</span> Student</h1>
      <p class="sub">An interactive story about studying with AI in higher education.<br />Two students. One dataset. Different screens.</p>
      <button class="open-btn s0-open" type="button" aria-label="Open the email">
        <span class="open-btn-inner">
          ${renderAppLogo("mail", {
            className: "open-btn-icon",
            hidden: true,
          })}
          Open the email
          <span class="open-btn-arrow" aria-hidden="true">-&gt;</span>
        </span>
      </button>
      <div class="s0-stats s0-stats--single" aria-label="Headline survey statistics">
        <div class="s0-stat" data-target="${stats.adoption.aiUse}" ${renderEvidenceAttributes(
          "AI use in at least one way",
          stats.adoption.aiUse,
          evidence.adoption,
        )}>
          <div class="s0-stat-num"><span class="big" data-countup data-target="${stats.adoption.aiUse}" data-delay="300" data-duration="1400">${stats.adoption.aiUse}</span><span class="pct">%</span></div>
          <div class="s0-stat-label">use AI in at least one way</div>
          <div class="s0-density" data-fill="${stats.adoption.aiUse}"></div>
          <div class="s0-stat-marker"><span class="lit-label">${stats.adoption.aiUse} of 100</span><span class="of">n=1,054</span></div>
        </div>
      </div>
      <p class="dataset-note">Based on the HEPI / Kortext <span class="mono">${surveySource.title}</span><br />${surveySource.sample} - Savanta, ${surveySource.fieldwork}</p>
    </div>
  `,
});
